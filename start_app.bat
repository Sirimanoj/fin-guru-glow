@echo off
echo Starting FinGuru Backend...
start "FinGuru Backend" cmd /k "cd fin_rag_backend && python -m uvicorn server:app --reload --port 8000"

echo Starting FinGuru Frontend...
start "FinGuru Frontend" cmd /k "npm run dev"

echo ===================================================
echo   Servers are running!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8000
echo ===================================================
