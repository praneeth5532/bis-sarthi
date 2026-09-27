# Build the React site, then serve it and the FastAPI API from one container/URL.
FROM node:22-alpine AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html vite.config.js ./
COPY public ./public
COPY src ./src
RUN npm run build

FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY documents ./documents
COPY build_rag.py ./
# Build the tracked-PDF search index into the image. This also downloads the embedding model.
RUN python build_rag.py
COPY api.py ./
COPY --from=frontend /app/dist ./dist
ENV PORT=8000
CMD ["sh", "-c", "uvicorn api:app --host 0.0.0.0 --port ${PORT}"]
