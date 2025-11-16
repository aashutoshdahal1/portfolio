#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}   Portfolio Website - Development Startup${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Check if MongoDB is running
echo -e "${YELLOW}Checking MongoDB status...${NC}"
if brew services list | grep -q "mongodb-community.*started"; then
    echo -e "${GREEN}✓ MongoDB is running${NC}"
else
    echo -e "${YELLOW}Starting MongoDB...${NC}"
    brew services start mongodb/brew/mongodb-community
    sleep 2
    echo -e "${GREEN}✓ MongoDB started${NC}"
fi
echo ""

# Start backend
echo -e "${YELLOW}Starting backend server...${NC}"
cd backend
npm start &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend server starting on http://localhost:3001${NC}"
echo ""

# Wait for backend to be ready
echo -e "${YELLOW}Waiting for backend to be ready...${NC}"
sleep 3
echo ""

# Start frontend
echo -e "${YELLOW}Starting frontend development server...${NC}"
cd ..
npm run dev &
FRONTEND_PID=$!
echo ""

# Display information
echo -e "${BLUE}================================================${NC}"
echo -e "${GREEN}✓ All services started successfully!${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""
echo -e "Frontend:      ${GREEN}http://localhost:8080${NC}"
echo -e "Backend API:   ${GREEN}http://localhost:3001${NC}"
echo -e "Admin Panel:   ${GREEN}http://localhost:8080/admin/login${NC}"
echo ""
echo -e "${YELLOW}Default Admin Credentials:${NC}"
echo -e "  Username: admin"
echo -e "  Password: admin123"
echo ""
echo -e "${YELLOW}To stop all services:${NC}"
echo -e "  Press Ctrl+C and run: ./stop-dev.sh"
echo ""
echo -e "${BLUE}================================================${NC}"

# Keep script running
wait
