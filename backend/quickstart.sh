#!/bin/bash

# Quick Start Script for ResumeMatch Backend

echo "=============================================="
echo "🚀 ResumeMatch Backend Quick Start"
echo "=============================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9 or higher."
    exit 1
fi

echo "✓ Python found: $(python3 --version)"

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL client not found. Make sure PostgreSQL is installed."
else
    echo "✓ PostgreSQL client found"
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo ""
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    echo "✓ Virtual environment created"
fi

# Activate virtual environment
echo ""
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo ""
echo "📥 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Run setup script
echo ""
echo "⚙️  Running setup script..."
python3 setup.py

# Ask if user wants to start the server
echo ""
read -p "🚀 Start the development server now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Starting server at http://localhost:8000"
    echo "API Documentation: http://localhost:8000/api/docs"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
else
    echo ""
    echo "To start the server manually, run:"
    echo "  source venv/bin/activate"
    echo "  uvicorn app.main:app --reload"
fi
