#!/bin/bash

echo "=============================================="
echo "   ResumeMatch AI - Complete Startup"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Kill any existing processes
echo -e "${BLUE}Stopping any existing processes...${NC}"
pkill -f "uvicorn app.main:app" 2>/dev/null
pkill -f "next dev" 2>/dev/null
sleep 2
echo -e "${GREEN}✓ Cleaned up${NC}"
echo ""

# Start PostgreSQL if not running
echo -e "${BLUE}Checking PostgreSQL...${NC}"
if ! systemctl is-active --quiet postgresql; then
    echo -e "${YELLOW}Starting PostgreSQL...${NC}"
    sudo systemctl start postgresql
fi
echo -e "${GREEN}✓ PostgreSQL is running${NC}"
echo ""

# Start Backend
echo -e "${BLUE}Starting Backend Server...${NC}"
cd /home/haseeb-raza/Desktop/resume-screening/backend
source ../venv/bin/activate

# Check if demo data exists
RESUME_COUNT=$(sudo -u postgres psql -d resumematch -tAc "SELECT COUNT(*) FROM resumes;" 2>/dev/null || echo "0")
if [ "$RESUME_COUNT" -eq "0" ]; then
    echo -e "${YELLOW}Creating demo data...${NC}"
    python create_demo_data.py
    echo -e "${GREEN}✓ Demo data created${NC}"
fi

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
echo ""

# Wait for backend to be ready
echo -e "${BLUE}Waiting for backend to initialize...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend is ready${NC}"
        break
    fi
    sleep 1
    echo -n "."
done
echo ""

# Start Frontend
echo -e "${BLUE}Starting Frontend...${NC}"
cd /home/haseeb-raza/Desktop/resume-screening/frontend

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
    echo -e "${GREEN}✓ Created .env.local${NC}"
fi

npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend starting (PID: $FRONTEND_PID)${NC}"
echo ""

# Wait for frontend to be ready
echo -e "${BLUE}Waiting for frontend to initialize...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Frontend is ready${NC}"
        break
    fi
    sleep 1
    echo -n "."
done
echo ""

echo "=============================================="
echo -e "${GREEN}✅ All Services Started Successfully!${NC}"
echo "=============================================="
echo ""
echo "📡 Services:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:8000"
echo "   API Docs:  http://localhost:8000/api/docs"
echo ""
echo "👤 Demo Login:"
echo "   Email:     demo@example.com"
echo "   Password:  demo123"
echo ""
echo "📊 Quick Links:"
echo "   Upload:    http://localhost:3000/upload"
echo "   Analytics: http://localhost:3000/analytics"
echo "   Dashboard: http://localhost:3000/dashboard"
echo ""
echo "📝 Logs:"
echo "   Backend:   tail -f /tmp/backend.log"
echo "   Frontend:  tail -f /tmp/frontend.log"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Cleanup function
cleanup() {
    echo ""
    echo -e "${YELLOW}Stopping services...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    pkill -f "uvicorn app.main:app" 2>/dev/null
    pkill -f "next dev" 2>/dev/null
    echo -e "${GREEN}✓ All services stopped${NC}"
    exit 0
}

trap cleanup INT TERM

# Keep script running
wait
