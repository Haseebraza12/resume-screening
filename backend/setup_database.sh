#!/bin/bash

echo "==================================="
echo "PostgreSQL Database Setup Script"
echo "==================================="
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "📦 PostgreSQL is not installed. Installing..."
    sudo apt update
    sudo apt install -y postgresql postgresql-contrib
    echo "✅ PostgreSQL installed successfully"
else
    echo "✅ PostgreSQL is already installed"
fi

# Start PostgreSQL service
echo ""
echo "🚀 Starting PostgreSQL service..."
sudo systemctl start postgresql
sudo systemctl enable postgresql
echo "✅ PostgreSQL service started"

# Check PostgreSQL status
echo ""
echo "📊 PostgreSQL Status:"
sudo systemctl status postgresql --no-pager | head -n 5

# Create database and user
echo ""
echo "🗄️  Creating database and user..."

# Switch to postgres user and create database
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = 'resumematch'" | grep -q 1 || \
sudo -u postgres psql -c "CREATE DATABASE resumematch;"

echo "✅ Database 'resumematch' created (or already exists)"

# Optional: Create a dedicated user (currently using default postgres user)
# Uncomment below if you want a dedicated user:
# sudo -u postgres psql -c "CREATE USER resumeuser WITH PASSWORD 'your_password';"
# sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE resumematch TO resumeuser;"

# Test connection
echo ""
echo "🔍 Testing database connection..."
if sudo -u postgres psql -d resumematch -c "SELECT 'Connection successful!' as status;" &> /dev/null; then
    echo "✅ Database connection test passed!"
else
    echo "❌ Database connection test failed"
    exit 1
fi

echo ""
echo "==================================="
echo "✅ Database Setup Complete!"
echo "==================================="
echo ""
echo "Database Details:"
echo "  - Database: resumematch"
echo "  - Host: localhost"
echo "  - Port: 5432"
echo "  - User: postgres"
echo ""
echo "Your .env file should have:"
echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/resumematch"
echo ""
echo "Now you can start the backend server:"
echo "  cd /home/haseeb-raza/Desktop/resume-screening/backend"
echo "  source ../venv/bin/activate"
echo "  uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
echo ""
