#!/bin/bash

echo "🚀 Starting Portfolio Backend Setup..."
echo ""

# Check if MongoDB is configured
if ! grep -q "mongodb" backend/.env; then
    echo "⚠️  Warning: MongoDB URI not found in backend/.env"
    echo "Please configure your MongoDB connection string"
    exit 1
fi

# Navigate to backend
cd backend

echo "📦 Installing backend dependencies..."
npm install

echo ""
echo "👤 Creating admin user..."
npm run setup

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "To start the backend server:"
echo "  cd backend && npm run dev"
echo ""
echo "To start the frontend:"
echo "  npm run dev"
echo ""
echo "Then visit:"
echo "  Portfolio: http://localhost:5173"
echo "  Admin: http://localhost:5173/admin/login"
echo ""
echo "Default credentials:"
echo "  Username: admin"
echo "  Password: admin123"
