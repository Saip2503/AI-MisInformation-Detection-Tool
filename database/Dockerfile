# ---------- Base image ----------
FROM python:3.10-slim

# ---------- Set workdir ----------
WORKDIR /app

# ---------- Install dependencies ----------
# System deps for psycopg2 & numpy
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# ---------- Install Python packages ----------
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ---------- Copy source ----------
COPY . .

# ---------- Env vars ----------
ENV PYTHONUNBUFFERED=1 \
    PORT=8080 \
    HOST=0.0.0.0

# ---------- Run app ----------
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
