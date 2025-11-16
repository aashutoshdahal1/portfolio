#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${RED}Stopping development servers...${NC}"

# Kill processes on ports
echo "Stopping backend (port 3001)..."
lsof -ti:3001 | xargs kill -9 2>/dev/null
echo -e "${GREEN}✓ Backend stopped${NC}"

echo "Stopping frontend (port 8080)..."
lsof -ti:8080 | xargs kill -9 2>/dev/null
echo -e "${GREEN}✓ Frontend stopped${NC}"

# Optionally stop MongoDB
read -p "Do you want to stop MongoDB as well? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    brew services stop mongodb/brew/mongodb-community
    echo -e "${GREEN}✓ MongoDB stopped${NC}"
fi

echo -e "${GREEN}All services stopped!${NC}"
