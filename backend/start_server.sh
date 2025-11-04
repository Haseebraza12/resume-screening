#!/bin/bash

# Navigate to backend directory
cd /home/haseeb-raza/Desktop/resume-screening/backend

# Start the FastAPI server
/home/haseeb-raza/Desktop/resume-screening/venv/bin/python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
