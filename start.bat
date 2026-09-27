@echo off
setlocal
cd /d "%~dp0"

if not exist ".venv\Scripts\python.exe" (
  echo Creating Python environment...
  py -3.11 -m venv .venv || py -3 -m venv .venv
)
call .venv\Scripts\activate.bat
python -m pip install -r requirements.txt || exit /b 1

if not exist "chroma_db\chroma.sqlite3" (
  echo Building the BIS search index from the PDFs. This may take a few minutes the first time.
  python build_rag.py || exit /b 1
)

if "%GEMINI_API_KEY%"=="" (
  echo.
  echo GEMINI_API_KEY is not set. Set it in this terminal before starting, for example:
  echo set GEMINI_API_KEY=your_key_here
  echo.
  exit /b 1
)

start "BIS Sarthi API" cmd /k ".venv\Scripts\python.exe -m uvicorn api:app --host 127.0.0.1 --port 8000"
start "BIS Sarthi Website" cmd /k "npm run dev -- --host 127.0.0.1"
echo Open the URL printed by Vite, usually http://localhost:5173
