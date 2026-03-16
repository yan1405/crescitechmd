"""
CrescitechMD - Docling Conversion Microservice
FastAPI service that converts documents to Markdown using Docling.
"""

import os
import json
import tempfile
import shutil
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, UploadFile, File, Form, Header, HTTPException
from fastapi.responses import JSONResponse

from converter import convert


# ============================================================
# Startup: pre-load Docling modules to avoid cold start
# ============================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[startup] CrescitechMD Docling API ready")
    yield


# ============================================================
# App
# ============================================================

app = FastAPI(
    title="CrescitechMD Docling API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if os.getenv("ENVIRONMENT") != "production" else None,
)

API_KEY = os.environ.get("DOCLING_API_KEY", "")


# ============================================================
# Auth
# ============================================================

def verify_api_key(x_api_key: Optional[str]):
    """Simple shared-secret API key verification."""
    if not API_KEY:
        raise HTTPException(status_code=500, detail="API key not configured on server")
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")


# ============================================================
# Endpoints
# ============================================================

@app.get("/health")
async def health():
    """Health check endpoint (no auth required)."""
    return {"status": "ok", "service": "docling-api"}


@app.post("/convert")
async def convert_document(
    file: UploadFile = File(...),
    options: str = Form("{}"),
    x_api_key: Optional[str] = Header(None),
):
    """
    Convert a document to Markdown.

    Accepts multipart/form-data with:
    - file: The document file
    - options: JSON string with conversion options
      {"preserveImages": true, "preserveTables": true, "preserveHeaders": true}
    """
    verify_api_key(x_api_key)

    # Parse options
    try:
        parsed_options = json.loads(options)
    except json.JSONDecodeError:
        return JSONResponse(
            content={
                "success": False,
                "error": "JSON de opções inválido.",
                "errorType": "UNKNOWN",
            },
            status_code=400,
        )

    # Save uploaded file to temp
    suffix = Path(file.filename or "document").suffix
    tmp_fd, tmp_path = tempfile.mkstemp(suffix=suffix)
    try:
        os.close(tmp_fd)
        with open(tmp_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        # Run conversion
        result = convert(tmp_path, parsed_options)

        status_code = 200 if result.get("success") else 422
        return JSONResponse(content=result, status_code=status_code)

    except FileNotFoundError:
        return JSONResponse(
            content={
                "success": False,
                "error": "Arquivo não encontrado ou corrompido. Tente exportar novamente.",
                "errorType": "CORRUPTED",
            },
            status_code=422,
        )
    except (ValueError, TypeError) as e:
        return JSONResponse(
            content={
                "success": False,
                "error": f"Arquivo corrompido ou inválido: {str(e)}",
                "errorType": "CORRUPTED",
            },
            status_code=422,
        )
    except Exception as e:
        return JSONResponse(
            content={
                "success": False,
                "error": f"Erro ao processar arquivo: {type(e).__name__} - {str(e)}",
                "errorType": "UNKNOWN",
            },
            status_code=500,
        )
    finally:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass
