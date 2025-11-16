import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Portfolio from './models/Portfolio.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

// Default admin credentials (change these!)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Initialize portfolio data if it doesn't exist
const initializePortfolio = async () => {
  try {
    const count = await Portfolio.countDocuments();
    if (count === 0) {
      const initialData = {
        hero: {
          name: "Aashutosh Dahal",
          title: "Front-End Developer & MERN Stack Expert",
          description: "Crafting exceptional digital experiences with modern web technologies. Specialized in building scalable, performant applications that users love. Let's create something extraordinary together.",
          welcomeText: "Welcome to my portfolio",
          socialLinks: {
            github: "#",
            linkedin: "#",
            email: "#"
          }
        },
        about: {
          paragraphs: [
            "I'm a dedicated developer who blends creativity with technical precision to craft meaningful digital experiences. Skilled in the MERN stack and modern front-end technologies, I turn complex ideas into clean and user-focused solutions.",
            "My journey in web development began with a simple curiosity about how the web works, and it has grown into a passion for building products that truly make an impact. I'm committed to continuous learning and staying aligned with evolving technologies to deliver innovative results.",
            "Outside of coding, I enjoy going to gym, experimenting with new tools, contributing to open-source projects, and sharing insights with the developer community."
          ],
          highlights: [
            {
              title: "Clean Code",
              description: "Writing maintainable, scalable code with best practices"
            },
            {
              title: "Design Excellence",
              description: "Crafting beautiful, intuitive user interfaces"
            },
            {
              title: "Performance",
              description: "Optimized solutions for lightning-fast experiences"
            },
            {
              title: "Collaboration",
              description: "Working seamlessly with teams and stakeholders"
            }
          ]
        },
        skills: {
          categories: [
            {
              title: "Frontend",
              skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Redux", "Vue.js"]
            },
            {
              title: "Backend",
              skills: ["Node.js", "Express", "MongoDB", "PostgreSQL", "REST APIs", "GraphQL"]
            },
            {
              title: "Tools & Others",
              skills: ["Git", "Docker", "AWS", "Firebase", "Jest", "CI/CD"]
            }
          ]
        },
        projects: [
          {
            title: "E-Commerce Platform",
            description: "A full-stack e-commerce solution with real-time inventory, payment integration, and admin dashboard.",
            tech: ["React", "Node.js", "MongoDB", "Stripe"],
            image: "from-blue-500 to-purple-600",
            demoLink: "#",
            codeLink: "#"
          },
          {
            title: "Task Management App",
            description: "Collaborative task management tool with real-time updates, team workspaces, and analytics.",
            tech: ["Next.js", "TypeScript", "PostgreSQL", "WebSockets"],
            image: "from-purple-500 to-pink-600",
            demoLink: "#",
            codeLink: "#"
          },
          {
            title: "Social Media Dashboard",
            description: "Analytics dashboard aggregating data from multiple social media platforms with beautiful visualizations.",
            tech: ["React", "D3.js", "Express", "Redis"],
            image: "from-cyan-500 to-blue-600",
            demoLink: "#",
            codeLink: "#"
          }
        ],
        experience: [
          {
            year: "2023 - Present",
            role: "Senior Front-End Developer",
            company: "Tech Innovations Inc.",
            description: "Leading front-end development for enterprise applications, mentoring junior developers, and implementing best practices."
          },
          {
            year: "2021 - 2023",
            role: "Full-Stack Developer",
            company: "Digital Solutions Ltd.",
            description: "Built and maintained multiple client projects using MERN stack, improved application performance by 40%."
          },
          {
            year: "2019 - 2021",
            role: "Junior Developer",
            company: "StartUp Ventures",
            description: "Developed responsive web applications, collaborated with designers to implement pixel-perfect UIs."
          }
        ],
        contact: {
          email: "your.email@example.com",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA",
          description: "I'm always interested in hearing about new projects and opportunities. Whether you have a question or just want to say hi, feel free to reach out!"
        }
      };
      
      await Portfolio.create(initialData);
      console.log('📝 Initial portfolio data created');
    }
  } catch (error) {
    console.error('Error initializing portfolio:', error);
  }
};

// Initialize data on startup
initializePortfolio();

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USERNAME) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, username });
});

// Public routes - Get portfolio data
app.get('/api/portfolio', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne().sort({ createdAt: -1 });
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    res.json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio data' });
  }
});

app.get('/api/portfolio/:section', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne().sort({ createdAt: -1 });
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    const section = req.params.section;
    if (!portfolio[section]) {
      return res.status(404).json({ error: 'Section not found' });
    }
    
    res.json(portfolio[section]);
  } catch (error) {
    console.error('Error fetching section:', error);
    res.status(500).json({ error: 'Failed to fetch section data' });
  }
});

// Protected routes - Update portfolio data
app.put('/api/admin/portfolio/:section', authenticateToken, async (req, res) => {
  try {
    const section = req.params.section;
    const updatedData = req.body;
    
    const portfolio = await Portfolio.findOne().sort({ createdAt: -1 });
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    if (!portfolio.hasOwnProperty(section)) {
      return res.status(404).json({ error: 'Section not found' });
    }
    
    portfolio[section] = updatedData;
    await portfolio.save();
    
    res.json({ message: 'Section updated successfully', data: portfolio[section] });
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(500).json({ error: 'Failed to update section' });
  }
});

app.put('/api/admin/portfolio', authenticateToken, async (req, res) => {
  try {
    const updatedData = req.body;
    
    let portfolio = await Portfolio.findOne().sort({ createdAt: -1 });
    if (!portfolio) {
      portfolio = new Portfolio(updatedData);
    } else {
      Object.assign(portfolio, updatedData);
    }
    
    await portfolio.save();
    res.json({ message: 'Portfolio updated successfully', data: portfolio });
  } catch (error) {
    console.error('Error updating portfolio:', error);
    res.status(500).json({ error: 'Failed to update portfolio' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📝 Admin credentials: username=${ADMIN_USERNAME}, password=${process.env.ADMIN_PASSWORD || 'admin123'}`);
  console.log(`⚠️  Change default credentials in production!`);
});
