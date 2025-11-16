# Admin Panel Setup Guide

This guide will help you set up and use the admin panel for managing your portfolio content with MongoDB.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Your portfolio website running

## MongoDB Setup

### Option 1: Local MongoDB (Development)

1. **Install MongoDB:**
   - **macOS:** `brew install mongodb-community@7.0`
   - **Windows:** Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - **Linux:** Follow [official installation guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. **Start MongoDB:**
   ```bash
   # macOS/Linux
   brew services start mongodb-community@7.0
   # or
   mongod --dbpath /path/to/data/directory
   
   # Windows
   # Run as Windows Service or:
   mongod.exe --dbpath C:\path\to\data\directory
   ```

3. **Verify Connection:**
   ```bash
   mongosh
   # Should connect to mongodb://localhost:27017
   ```

### Option 2: MongoDB Atlas (Production/Cloud)

1. **Create Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create Cluster:**
   - Click "Build a Database"
   - Choose "Free" tier (M0)
   - Select your preferred region
   - Create cluster

3. **Setup Database Access:**
   - Go to "Database Access"
   - Add new database user with username/password
   - Set permissions to "Read and write to any database"

4. **Setup Network Access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add your server's IP address

5. **Get Connection String:**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## Backend Setup

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Edit the `.env` file in the `backend` folder:
   
   ```env
   # MongoDB Connection
   # For local MongoDB:
   MONGODB_URI=mongodb://localhost:27017/portfolio
   
   # For MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/portfolio
   
   PORT=3001
   JWT_SECRET=your-super-secret-jwt-key-change-this
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-password
   ```

   **⚠️ IMPORTANT:** Change the default credentials before deploying to production!

4. **Start the backend server:**
   ```bash
   npm start
   ```

   You should see:
   ```
   ✅ Connected to MongoDB
   📝 Initial portfolio data created
   🚀 Backend server running on http://localhost:3001
   ```

## Frontend Setup

1. **Navigate to project root:**
   ```bash
   cd ..  # If you're in the backend folder
   ```

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

3. **Configure Frontend Environment:**

   Create a `.env` file in the project root (if not already present):
   
   ```env
   VITE_API_URL=http://localhost:3001
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Accessing the Admin Panel

1. **Open your browser** and navigate to:
   ```
   http://localhost:5173/admin
   ```

2. **Login with default credentials:**
   - Username: `admin`
   - Password: `admin123` (or whatever you set in `.env`)

3. **You're in!** You can now edit all sections of your portfolio.

## Using the Admin Panel

The admin dashboard has tabs for each section of your portfolio:

### Hero Section
- Edit your name, title, and description
- Update welcome text
- Modify social media links (GitHub, LinkedIn, Email)

### About Section
- Edit biography paragraphs
- Update highlights (title and description)
- Add or remove highlights

### Skills Section
- Organize skills by categories
- Add or remove skill categories
- Modify individual skills within each category

### Projects Section
- Add new projects
- Edit existing projects (title, description, tech stack)
- Update project links (demo and source code)
- Remove projects

### Experience Section
- Add work experience entries
- Edit year/duration, role, company, and description
- Remove old entries

### Contact Section
- Update contact information (email, phone, location)
- Edit contact page description

## Tips

- **Save regularly:** Click the "Save Changes" button after editing each section
- **Reload page:** After saving, refresh your main portfolio page to see changes
- **Stay logged in:** Your session lasts 24 hours
- **MongoDB data:** All changes are stored in MongoDB and persist across server restarts

## Troubleshooting

### MongoDB Connection Issues

**Problem:** "❌ MongoDB connection error"

**Solutions:**
- **Local MongoDB:** Ensure MongoDB is running (`brew services list` or check Windows Services)
- **MongoDB Atlas:** 
  - Check your connection string in `.env`
  - Verify your database user password
  - Ensure your IP is whitelisted in Network Access
  - Make sure you replaced `<password>` in connection string

### Cannot Login

**Problem:** Invalid credentials error

**Solutions:**
- Check your `.env` file for correct username/password
- Restart the backend server after changing `.env`
- Clear browser cache/cookies

### Changes Not Saving

**Problem:** Saved changes don't appear

**Solutions:**
- Check browser console for errors
- Verify backend server is running
- Check that your JWT token is still valid (re-login if needed)
- Verify MongoDB connection is active

### Backend Not Starting

**Problem:** Server fails to start

**Solutions:**
- Ensure port 3001 is not in use: `lsof -ti:3001` (kill with `kill -9 <PID>`)
- Check all environment variables are set in `.env`
- Run `npm install` again
- Check MongoDB is running and accessible

### CORS Errors

**Problem:** API requests blocked by CORS

**Solutions:**
- Verify backend server is running
- Check `VITE_API_URL` in frontend `.env`
- Restart both frontend and backend servers

## Production Deployment

### MongoDB Atlas (Recommended)

1. Use MongoDB Atlas connection string in production `.env`
2. Whitelist your production server's IP address
3. Use strong, unique credentials

### Backend Deployment (Railway, Render, Heroku)

Set these environment variables in your hosting platform:

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=strong-random-secret-key
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=strong-secure-password
PORT=3001
```

### Frontend Deployment (Vercel, Netlify)

Set environment variable:

```env
VITE_API_URL=https://your-backend-url.com
```

### Security Notes

- **Never** commit `.env` file to git
- Use strong, unique passwords
- Enable MongoDB authentication
- Use HTTPS in production
- Consider adding rate limiting for login attempts
- Regularly update dependencies
- Use environment-specific secrets

## API Endpoints

For reference, here are the available API endpoints:

### Public Endpoints
- `GET /api/portfolio` - Get all portfolio data
- `GET /api/portfolio/:section` - Get specific section data
- `GET /api/health` - Server health check (includes MongoDB status)

### Protected Endpoints (Require JWT Token)
- `POST /api/auth/login` - Admin login
- `PUT /api/admin/portfolio` - Update entire portfolio
- `PUT /api/admin/portfolio/:section` - Update specific section

## Database Structure

The MongoDB collection uses this schema:

```javascript
{
  hero: {
    name: String,
    title: String,
    description: String,
    welcomeText: String,
    socialLinks: { github: String, linkedin: String, email: String }
  },
  about: {
    paragraphs: [String],
    highlights: [{ title: String, description: String }]
  },
  skills: {
    categories: [{ title: String, skills: [String] }]
  },
  projects: [{
    title: String,
    description: String,
    tech: [String],
    image: String,
    demoLink: String,
    codeLink: String
  }],
  experience: [{
    year: String,
    role: String,
    company: String,
    description: String
  }],
  contact: {
    email: String,
    phone: String,
    location: String,
    description: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Need Help?

If you encounter any issues not covered here, check:
- Backend server logs for error messages
- Browser console for frontend errors
- MongoDB logs for database issues
- Network tab in browser DevTools for API errors

---

**Happy editing! 🚀**
