@echo off
echo ===================================================
echo   Starting AgroConnect Full-Stack Platform...
echo ===================================================

echo [1/2] Launching Python FastAPI Backend Server on http://127.0.0.1:8000
start cmd /k "cd backend && python run.py"

echo [2/2] Launching React Vite Frontend on http://localhost:5173
start cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo   AgroConnect is running!
echo   Frontend: http://localhost:5173
echo   API Docs: http://127.0.0.1:8000/docs
echo ===================================================
pause
