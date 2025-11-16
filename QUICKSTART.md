# 🚀 Quick Start Guide

## Start the Application

### Method 1: Automated Setup (Recommended)

```bash
# Run the setup script (first time only)
./setup.sh

# Start backend (Terminal 1)
cd backend
npm run dev

# Start frontend (Terminal 2)
npm run dev
```

### Method 2: Manual Setup

**Backend:**
```bash
cd backend
npm install
npm run setup    # Creates admin user
npm run dev      # Starts server on port 3001
```

**Frontend:**
```bash
npm install
npm run dev      # Starts on port 5173
```

## 🔐 Admin Access

1. Visit: `http://localhost:5173/admin/login`
2. Login with:
   - **Username:** `admin`
   - **Password:** `admin123`
3. Manage all content from the dashboard

## 📦 What's Included

### Backend (Express + MongoDB)
- JWT authentication
- RESTful API
- MongoDB data persistence
- Password encryption
- Protected routes

### Frontend (React + TypeScript + Vite)
- Modern React with TypeScript
- Tailwind CSS + shadcn/ui
- Admin dashboard with full CRUD
- Real-time content updates
- Responsive design

## 📖 Documentation

- **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** - Complete backend setup and API docs
- **[ADMIN_GUIDE.md](./ADMIN_GUIDE.md)** - Admin dashboard usage guide

## 🌐 URLs

- **Portfolio:** http://localhost:5173
- **Admin Login:** http://localhost:5173/admin/login
- **Admin Dashboard:** http://localhost:5173/admin/dashboard
- **API:** http://localhost:3001/api

## 🎯 Features

✅ **Dynamic Content Management**
- Edit hero section
- Manage about paragraphs
- Add/remove skills
- CRUD for projects
- CRUD for experiences
- Update contact info

✅ **Secure Admin System**
- JWT authentication
- Protected routes
- Encrypted passwords
- Session management

✅ **Database Integration**
- MongoDB storage
- Automatic backups to localStorage
- Default content generation
- Real-time sync

## 🔧 Configuration

**Backend (.env):**
```env
PORT=3001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3001/api
```

## 🚀 Deployment

See [BACKEND_SETUP.md](./BACKEND_SETUP.md#production-deployment) for deployment instructions.

## 📝 Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start with nodemon (auto-reload)
- `npm run setup` - Create admin user

### Frontend
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview production build

## 🛟 Need Help?

Check the troubleshooting section in [BACKEND_SETUP.md](./BACKEND_SETUP.md#troubleshooting)
