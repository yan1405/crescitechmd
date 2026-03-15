FROM python:3.11-slim-bookworm

WORKDIR /app

# System dependencies minimas
RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 \
    poppler-utils \
    libgl1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Instala dependencias Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia codigo
COPY converter.py .
COPY main.py .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
