"""
CrescitechMD - Docling Conversion Logic
Extracted from lib/docling/convert.py for use by the FastAPI microservice.
"""

import time
from pathlib import Path


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
