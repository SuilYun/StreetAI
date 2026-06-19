#!/bin/bash

# StreetScan AI LAN Startup Script for macOS
# This script starts both the backend and frontend bound to all network interfaces (0.0.0.0),
# allowing you to test the app on your mobile phone over the same Wi-Fi network.

# Colors for pretty output
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}==================================================${NC}"
echo -e "${CYAN}        StreetScan AI — Mobile & LAN Dev Shell   ${NC}"
echo -e "${CYAN}==================================================${NC}"

# Detect Local IP Address
LOCAL_IP=$(ipconfig getifaddr en0)
if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP=$(ipconfig getifaddr en1)
fi

if [ -z "$LOCAL_IP" ]; then
    echo -e "${RED}Warning: Could not auto-detect local network IP address.${NC}"
    echo -e "Make sure your Mac is connected to Wi-Fi/Ethernet."
    LOCAL_IP="127.0.0.1"
else
    echo -e "${GREEN}✓ Detected Local network IP: ${LOCAL_IP}${NC}"
fi

# Clean up existing processes running on 8000 or 5173
echo -e "\n${YELLOW}Checking for existing servers...${NC}"
BACKEND_PID=$(lsof -t -i :8000)
FRONTEND_PID=$(lsof -t -i :5173)

if [ ! -z "$BACKEND_PID" ]; then
    echo -e "Killing existing backend process (PID: $BACKEND_PID) on port 8000..."
    kill -9 $BACKEND_PID 2>/dev/null
fi

if [ ! -z "$FRONTEND_PID" ]; then
    echo -e "Killing existing frontend process (PID: $FRONTEND_PID) on port 5173..."
    kill -9 $FRONTEND_PID 2>/dev/null
fi

# Start Backend Server
echo -e "\n${GREEN}1. Starting FastAPI Backend on 0.0.0.0:8000...${NC}"
cd backend/Backend/road_damage_aws || exit 1

if [ -d "venv" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
else
    echo -e "${RED}Warning: 'venv' directory not found. Trying global python3...${NC}"
fi

# Run backend in the background and redirect output to log file
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload > backend.log 2>&1 &
BACKEND_DAEMON_PID=$!
echo -e "${GREEN}✓ Backend running in background (PID: $BACKEND_DAEMON_PID, logging to backend/Backend/road_damage_aws/backend.log)${NC}"

# Return to root directory
cd ../../../

# Start Frontend Server
echo -e "\n${GREEN}2. Starting React (Vite) Frontend on 0.0.0.0:5173...${NC}"
cd frontend || exit 1

# Run frontend in the background and redirect output to log file
npm run dev -- --host 0.0.0.0 > frontend.log 2>&1 &
FRONTEND_DAEMON_PID=$!
echo -e "${GREEN}✓ Frontend running in background (PID: $FRONTEND_DAEMON_PID, logging to frontend/frontend.log)${NC}"

# Display Mobile Connection Info
echo -e "\n${CYAN}==================================================${NC}"
echo -e "${GREEN}               SERVERS READY!                     ${NC}"
echo -e "${CYAN}==================================================${NC}"
echo -e "Both servers have been bound to ${YELLOW}0.0.0.0${NC} (all network interfaces)."
echo -e "Please ensure your phone is connected to the ${YELLOW}same Wi-Fi network${NC} as your Mac."
echo -e ""
echo -e "📱 Open this link on your phone's browser:"
echo -e "   ${GREEN}http://${LOCAL_IP}:5173${NC}"
echo -e ""
echo -e "🖥️ Or open locally on your Mac:"
echo -e "   ${GREEN}http://localhost:5173${NC}"
echo -e "=================================================="
echo -e "To stop both servers, run: ${YELLOW}kill $BACKEND_DAEMON_PID $FRONTEND_DAEMON_PID${NC} or press Ctrl+C"

# Wait for Ctrl+C to terminate background processes
trap "echo -e '\nStopping servers...'; kill $BACKEND_DAEMON_PID $FRONTEND_DAEMON_PID 2>/dev/null; exit 0" INT
wait
