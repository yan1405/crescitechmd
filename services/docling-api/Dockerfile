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

COPY converter.py .
COPY main.py .

ENV DOCLING_ARTIFACTS_PATH=/tmp/docling-models
ENV HF_HOME=/tmp/huggingface

EXPOSE 7860

CMD uvicorn main:app --host 0.0.0.0 --port 7860
