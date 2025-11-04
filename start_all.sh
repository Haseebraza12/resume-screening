#!/bin/bash

echo "========================================="
echo "🚀 Resume Screening Application Startup"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Start Backend
echo -e "${BLUE}Starting Backend Server...${NC}"
cd /home/haseeb-raza/Desktop/resume-screening/backend
/home/haseeb-raza/Desktop/resume-screening/venv/bin/python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
echo "   API Docs: http://localhost:8000/api/docs"
echo "   Health: http://localhost:8000/health"
echo ""

# Wait for backend to start
sleep 5

# Start Frontend
echo -e "${BLUE}Starting Frontend Server...${NC}"
cd /home/haseeb-raza/Desktop/resume-screening/frontend
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
echo "   Application: http://localhost:3000"
echo ""

echo "========================================="
echo -e "${GREEN}✅ Both servers are running!${NC}"
echo "========================================="
echo ""
echo "Backend:  http://localhost:8000/api/docs"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for user to press Ctrl+C
trap "echo ''; echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
