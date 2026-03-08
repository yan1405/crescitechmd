"""
CrescitechMD - Docling Document Converter
Converts documents (PDF, DOCX, PPTX, XLSX, PNG, JPEG, HTML) to Markdown.

Usage:
    python convert.py <file_path> <options_json>

Options JSON:
    {
        "preserveImages": true,
        "preserveTables": true,
        "preserveHeaders": true
    }

Output (stdout JSON):
    Success: { "success": true, "markdown": "...", "processingTime": 8.2 }
    Error:   { "success": false, "error": "...", "errorType": "CORRUPTED|UNSUPPORTED|TIMEOUT|UNKNOWN" }
"""

import sys
import json
import time
import os
import io
from pathlib import Path

# Force UTF-8 output on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")


def convert(file_path: str, options: dict) -> dict:
    """Convert a document to Markdown using Docling."""
    start_time = time.time()

    # Validate file exists
    path = Path(file_path)
    if not path.exists():
        return {
            "success": False,
            "error": "Arquivo não encontrado ou corrompido.",
            "errorType": "CORRUPTED",
        }

    # Validate file extension
    ext = path.suffix.lower().lstrip(".")
    supported = {"pdf", "docx", "pptx", "xlsx", "png", "jpeg", "jpg", "html"}
    if ext not in supported:
        return {
            "success": False,
            "error": f"Formato não suportado: .{ext}. Aceitos: PDF, DOCX, PPTX, XLSX, PNG, JPEG, HTML.",
            "errorType": "UNSUPPORTED",
        }

    # Import Docling (lazy import to fail fast on other errors)
    from docling.document_converter import DocumentConverter
    from docling.datamodel.base_models import InputFormat
    from docling_core.types.doc.labels import DocItemLabel
    from docling_core.types.doc.base import ImageRefMode

    # Map extensions to InputFormat
    format_map = {
        "pdf": InputFormat.PDF,
        "docx": InputFormat.DOCX,
        "pptx": InputFormat.PPTX,
        "xlsx": InputFormat.XLSX,
        "png": InputFormat.IMAGE,
        "jpeg": InputFormat.IMAGE,
        "jpg": InputFormat.IMAGE,
        "html": InputFormat.HTML,
    }

    input_format = format_map.get(ext)
    if not input_format:
        return {
            "success": False,
            "error": f"Formato não suportado internamente: .{ext}",
            "errorType": "UNSUPPORTED",
        }

    # Create converter with allowed format
    converter = DocumentConverter(allowed_formats=[input_format])

    # Convert document
    result = converter.convert(source=path, raises_on_error=True)

    # Check conversion status
    from docling.datamodel.document import ConversionStatus

    if result.status != ConversionStatus.SUCCESS:
        errors = "; ".join(str(e) for e in result.errors) if result.errors else "Erro desconhecido"
        return {
            "success": False,
            "error": f"Falha na conversão: {errors}",
            "errorType": "UNKNOWN",
        }

    # Parse options
    preserve_images = options.get("preserveImages", True)
    preserve_tables = options.get("preserveTables", True)
    preserve_headers = options.get("preserveHeaders", True)

    # Build label filter: include all by default, exclude based on options
    # If all options are True, pass labels=None (include everything)
    excluded_labels = set()
    if not preserve_images:
        excluded_labels.add(DocItemLabel.PICTURE)
        excluded_labels.add(DocItemLabel.CHART)
    if not preserve_tables:
        excluded_labels.add(DocItemLabel.TABLE)
    if not preserve_headers:
        excluded_labels.add(DocItemLabel.SECTION_HEADER)
        excluded_labels.add(DocItemLabel.TITLE)
        excluded_labels.add(DocItemLabel.PAGE_HEADER)

    # Determine which labels to include
    if excluded_labels:
        all_labels = set(DocItemLabel)
        included_labels = all_labels - excluded_labels
    else:
        included_labels = None  # None = include all

    # Configure image mode
    image_mode = ImageRefMode.PLACEHOLDER if preserve_images else ImageRefMode.PLACEHOLDER

    # Export to Markdown
    markdown = result.document.export_to_markdown(
        labels=included_labels,
        image_mode=image_mode,
        image_placeholder="<!-- image -->",
    )

    processing_time = round(time.time() - start_time, 2)

    return {
        "success": True,
        "markdown": markdown,
        "processingTime": processing_time,
    }


def main():
    if len(sys.argv) < 2:
        result = {
            "success": False,
            "error": "Uso: python convert.py <file_path> [options_json]",
            "errorType": "UNKNOWN",
        }
        print(json.dumps(result, ensure_ascii=False))
        sys.exit(1)

    file_path = sys.argv[1]
    options = {}
    if len(sys.argv) >= 3:
        try:
            options = json.loads(sys.argv[2])
        except json.JSONDecodeError:
            result = {
                "success": False,
                "error": "JSON de opções inválido.",
                "errorType": "UNKNOWN",
            }
            print(json.dumps(result, ensure_ascii=False))
            sys.exit(1)

    try:
        result = convert(file_path, options)
    except FileNotFoundError:
        result = {
            "success": False,
            "error": "Arquivo não encontrado ou corrompido. Tente exportar novamente.",
            "errorType": "CORRUPTED",
        }
    except (ValueError, TypeError) as e:
        result = {
            "success": False,
            "error": f"Arquivo corrompido ou inválido: {str(e)}",
            "errorType": "CORRUPTED",
        }
    except Exception as e:
        error_type = type(e).__name__
        result = {
            "success": False,
            "error": f"Erro ao processar arquivo: {error_type} - {str(e)}",
            "errorType": "UNKNOWN",
        }

    print(json.dumps(result, ensure_ascii=False))
    sys.exit(0 if result.get("success") else 1)


if __name__ == "__main__":
    main()
