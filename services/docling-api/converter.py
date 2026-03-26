"""
CrescitechMD - Docling Conversion Logic
Extracted from lib/docling/convert.py for use by the FastAPI microservice.
"""

import logging
import os
import time
import traceback
from pathlib import Path

os.environ["DOCLING_ARTIFACTS_PATH"] = "/tmp/docling-models"
os.makedirs("/tmp/docling-models", exist_ok=True)

logger = logging.getLogger(__name__)


def convert(file_path: str, options: dict) -> dict:
    """Convert a document to Markdown using Docling."""
    try:
        logger.info(f"[converter] Iniciando conversão: {file_path}")
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
        logger.info("[converter] Importando Docling...")
        from docling.document_converter import DocumentConverter, PdfFormatOption
        from docling.datamodel.base_models import InputFormat
        from docling.datamodel.pipeline_options import PdfPipelineOptions
        from docling_core.types.doc.labels import DocItemLabel
        from docling_core.types.doc.base import ImageRefMode
        logger.info("[converter] Docling importado com sucesso")

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

        # Create converter — OCR disabled to avoid missing model files on HF Spaces
        logger.info(f"[converter] Criando DocumentConverter para formato: {ext}")
        pipeline_options = PdfPipelineOptions()
        pipeline_options.do_ocr = False
        pipeline_options.do_table_structure = False
        pipeline_options.artifacts_path = None

        converter = DocumentConverter(
            format_options={
                InputFormat.PDF: PdfFormatOption(
                    pipeline_options=pipeline_options
                )
            }
        )

        # Convert document
        logger.info(f"[converter] Convertendo documento: {path.name}")
        result = converter.convert(source=path, raises_on_error=True)
        logger.info(f"[converter] Conversão concluída, status: {result.status}")

        # Check conversion status
        from docling.datamodel.base_models import ConversionStatus

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

        # Build label filter
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

        included_labels = (set(DocItemLabel) - excluded_labels) if excluded_labels else None

        # Configure image mode
        image_mode = ImageRefMode.PLACEHOLDER

        # Export to Markdown
        logger.info("[converter] Exportando para Markdown...")
        markdown = result.document.export_to_markdown(
            labels=included_labels,
            image_mode=image_mode,
            image_placeholder="<!-- image -->",
        )

        processing_time = round(time.time() - start_time, 2)
        logger.info(f"[converter] Conversão bem-sucedida em {processing_time}s")

        return {
            "success": True,
            "markdown": markdown,
            "processingTime": processing_time,
        }

    except Exception as e:
        logger.error(f"[converter] Erro: {type(e).__name__}: {str(e)}")
        logger.error(f"[converter] Traceback: {traceback.format_exc()}")
        return {
            "success": False,
            "error": f"{type(e).__name__}: {str(e)}",
            "errorType": "UNKNOWN",
        }
