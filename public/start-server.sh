#!/bin/bash
# Campus Food - Quick Start Server Script

echo "==========================================="
echo "Campus Food Project - Local Server"
echo "==========================================="
echo ""
echo "Starting HTTP server on port 8000..."
echo ""
echo "🌐 Access the landing page at:"
echo "   http://localhost:8000"
echo ""
echo "📱 Role Portals:"
echo "   - Day Scholar:  http://localhost:8000/day-scholar"
echo "   - Hosteller:    http://localhost:8000/hosteller"
echo "   - Manager:      http://localhost:8000/manager"
echo ""
echo "Press Ctrl+C to stop the server"
echo "==========================================="
echo ""

cd "$(dirname "$0")"
python -m http.server 8000
