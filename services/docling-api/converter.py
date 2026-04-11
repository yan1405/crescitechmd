"""
CrescitechMD - Docling Conversion Logic
"""
import logging
import time
import traceback
from pathlib import Path

logger = logging.getLogger(__name__)

def convert(file_path: str, options: dict) -> dict:
    try:
        start_time = time.time()
        path = Path(file_path)

        if not path.exists():
            return {"success": False, "error": "Arquivo nao encontrado ou corrompido.", "errorType": "CORRUPTED"}

        ext = path.suffix.lower().lstrip(".")
        supported = {"pdf", "docx", "pptx", "xlsx", "png", "jpeg", "jpg", "html"}
        if ext not in supported:
            return {"success": False, "error": f"Formato nao suportado: .{ext}. Aceitos: PDF, DOCX, PPTX, XLSX, PNG, JPEG, HTML.", "errorType": "UNSUPPORTED"}

        from docling.document_converter import DocumentConverter, PdfFormatOption
        from docling.datamodel.base_models import InputFormat
        from docling.datamodel.pipeline_options import PdfPipelineOptions
        from docling_core.types.doc.labels import DocItemLabel
        from docling_core.types.doc.base import ImageRefMode

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
            return {"success": False, "error": f"Formato nao suportado: .{ext}", "errorType": "UNSUPPORTED"}

        if input_format == InputFormat.PDF:
            pipeline_options = PdfPipelineOptions()
            pipeline_options.do_ocr = False
            pipeline_options.do_table_structure = True
            converter = DocumentConverter(
                format_options={InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options)}
            )
        else:
            converter = DocumentConverter(allowed_formats=[input_format])

        result = converter.convert(source=path, raises_on_error=True)

        from docling.datamodel.base_models import ConversionStatus
        if result.status != ConversionStatus.SUCCESS:
            errors = "; ".join(str(e) for e in result.errors) if result.errors else "Erro desconhecido"
            return {"success": False, "error": f"Falha na conversao: {errors}", "errorType": "UNKNOWN"}

        preserve_images = options.get("preserveImages", True)
        preserve_tables = options.get("preserveTables", True)
        preserve_headers = options.get("preserveHeaders", True)

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

        markdown = result.document.export_to_markdown(
            labels=included_labels,
            image_mode=ImageRefMode.PLACEHOLDER,
            image_placeholder="<!-- image -->",
        )

        processing_time = round(time.time() - start_time, 2)
        return {"success": True, "markdown": markdown, "processingTime": processing_time}

    except Exception as e:
        return {
            "success": False,
            "error": f"{type(e).__name__}: {str(e)}",
            "errorType": "UNKNOWN",
            "traceback": traceback.format_exc(),
        }
