#!/bin/bash

echo "========================================="
echo "🛑 Resume Screening Application Shutdown"
echo "========================================="
echo ""

# Function to kill process by port
kill_by_port() {
    local port=$1
    local name=$2
    
    pid=$(lsof -ti:$port 2>/dev/null)
    if [ -n "$pid" ]; then
        echo "Stopping $name (Port $port, PID: $pid)..."
        kill -15 $pid 2>/dev/null
        sleep 2
        
        # Force kill if still running
        if kill -0 $pid 2>/dev/null; then
            echo "Force stopping $name..."
            kill -9 $pid 2>/dev/null
        fi
        echo "✅ $name stopped"
    else
        echo "ℹ️  $name not running on port $port"
    fi
}

# Function to kill process by name
kill_by_name() {
    local process_name=$1
    local display_name=$2
    
    pids=$(pgrep -f "$process_name" 2>/dev/null)
    if [ -n "$pids" ]; then
        echo "Stopping $display_name processes..."
        echo "$pids" | while read -r pid; do
            kill -15 $pid 2>/dev/null
        done
        sleep 2
        
        # Force kill any remaining
        pids=$(pgrep -f "$process_name" 2>/dev/null)
        if [ -n "$pids" ]; then
            echo "Force stopping remaining $display_name processes..."
            echo "$pids" | while read -r pid; do
                kill -9 $pid 2>/dev/null
            done
        fi
        echo "✅ $display_name stopped"
    else
        echo "ℹ️  No $display_name processes found"
    fi
}

# Stop Backend (Port 8000)
echo "Stopping Backend Server..."
kill_by_port 8000 "Backend"
echo ""

# Stop Frontend (Port 3000)
echo "Stopping Frontend Server..."
kill_by_port 3000 "Frontend"
echo ""

# Stop any remaining uvicorn processes
kill_by_name "uvicorn" "Uvicorn"
echo ""

# Stop any remaining next dev processes
kill_by_name "next dev" "Next.js"
echo ""

echo "========================================="
echo "✅ All services stopped successfully"
echo "========================================="
