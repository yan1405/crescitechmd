FROM python:3.11-slim-bookworm

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 \
    poppler-utils \
    libgl1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt \
    && find /usr/local/lib/python3.11 -name "*.pyc" -delete \
    && find /usr/local/lib/python3.11 -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true

# Baixar modelos do Docling durante o build
RUN python -c "\
from docling.datamodel.pipeline_options import PdfPipelineOptions; \
from docling.document_converter import DocumentConverter, PdfFormatOption; \
from docling.datamodel.base_models import InputFormat; \
import os; \
os.makedirs('/tmp/docling-models', exist_ok=True); \
os.environ['DOCLING_ARTIFACTS_PATH'] = '/tmp/docling-models'; \
pipeline_options = PdfPipelineOptions(); \
pipeline_options.do_ocr = False; \
pipeline_options.do_table_structure = False; \
converter = DocumentConverter(format_options={InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options)}); \
print('Modelos baixados com sucesso')"

# HF Spaces runs containers as uid 1000
RUN useradd -m -u 1000 appuser \
    && chown -R appuser:appuser /app \
    && mkdir -p /tmp/docling-models /tmp/huggingface \
    && chown -R appuser:appuser /tmp/docling-models /tmp/huggingface

COPY --chown=appuser:appuser converter.py .
COPY --chown=appuser:appuser main.py .

USER appuser

ENV DOCLING_ARTIFACTS_PATH=/tmp/docling-models
ENV HF_HOME=/tmp/huggingface

EXPOSE 7860

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
