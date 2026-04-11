import os
from pathlib import Path

os.environ["DOCLING_ARTIFACTS_PATH"] = "/app/models"
os.environ["HF_HOME"] = "/app/huggingface"

output_dir = Path("/app/models")
output_dir.mkdir(parents=True, exist_ok=True)
Path("/app/huggingface").mkdir(parents=True, exist_ok=True)

print("[download_models] Baixando modelos do Docling...")

from docling.utils.model_downloader import download_models
download_models(output_dir=output_dir, force=False, progress=True)

print("[download_models] Concluido.")
