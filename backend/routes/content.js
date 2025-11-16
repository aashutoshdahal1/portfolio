const express = require('express');
const router = express.Router();
const PortfolioContent = require('../models/PortfolioContent');
const authMiddleware = require('../middleware/auth');

// @route   GET /api/content
// @desc    Get active portfolio content
// @access  Public
router.get('/', async (req, res) => {
  try {
    let content = await PortfolioContent.findOne({ isActive: true });

    // If no content exists, create default content
    if (!content) {
      content = await PortfolioContent.create({
        hero: {
          name: "Aashutosh Dahal",
          title: "Front-End Developer & MERN Stack Expert",
          subtitle: "Welcome to my portfolio",
          description: "Crafting exceptional digital experiences with modern web technologies. Specialized in building scalable, performant applications that users love. Let's create something extraordinary together.",
          githubUrl: "#",
          linkedinUrl: "#",
          emailUrl: "#",
          imageUrl: "/bg.jpeg"
        },
        about: {
          paragraphs: [
            "I'm a dedicated developer who blends creativity with technical precision to craft meaningful digital experiences. Skilled in the MERN stack and modern front-end technologies, I turn complex ideas into clean and user-focused solutions.",
            "My journey in web development began with a simple curiosity about how the web works, and it has grown into a passion for building products that truly make an impact. I'm committed to continuous learning and staying aligned with evolving technologies to deliver innovative results.",
            "Outside of coding, I enjoy going to gym, experimenting with new tools, contributing to open-source projects, and sharing insights with the developer community."
          ]
        },
        skills: [
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
        ],
        projects: [
          {
            title: "E-Commerce Platform",
            description: "A full-stack e-commerce solution with real-time inventory, payment integration, and admin dashboard.",
            tech: ["React", "Node.js", "MongoDB", "Stripe"],
            demoUrl: "#",
            codeUrl: "#",
            bgType: 'gradient',
            bgValue: "from-blue-500 to-purple-600"
          },
          {
            title: "Task Management App",
            description: "Collaborative task management tool with real-time updates, team workspaces, and analytics.",
            tech: ["Next.js", "TypeScript", "PostgreSQL", "WebSockets"],
            demoUrl: "#",
            codeUrl: "#",
            bgType: 'gradient',
            bgValue: "from-purple-500 to-pink-600"
          },
          {
            title: "Social Media Dashboard",
            description: "Analytics dashboard aggregating data from multiple social media platforms with beautiful visualizations.",
            tech: ["React", "D3.js", "Express", "Redis"],
            demoUrl: "#",
            codeUrl: "#",
            bgType: 'gradient',
            bgValue: "from-cyan-500 to-blue-600"
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
          location: "San Francisco, CA"
        },
        isActive: true
      });
    }

    res.json(content);
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/content
// @desc    Update portfolio content
// @access  Private (Admin only)
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { hero, about, skills, projects, experience, contact } = req.body;

    let content = await PortfolioContent.findOne({ isActive: true });

    if (content) {
      // Update existing content
      content.hero = hero;
      content.about = about;
      content.skills = skills;
      content.projects = projects;
      content.experience = experience;
      content.contact = contact;
      await content.save();
    } else {
      // Create new content
      content = await PortfolioContent.create({
        hero,
        about,
        skills,
        projects,
        experience,
        contact,
        isActive: true
      });
    }

    res.json({
      success: true,
      message: 'Content updated successfully',
      content
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
