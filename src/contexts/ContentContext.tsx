import React, { createContext, useContext, useState, useEffect } from 'react';
import { contentAPI } from '@/lib/api';

// Define the content structure
interface HeroContent {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  githubUrl: string;
  linkedinUrl: string;
  emailUrl: string;
  imageUrl: string;
}

interface AboutContent {
  paragraphs: string[];
}

interface SkillCategory {
  title: string;
  skills: string[];
}

interface Project {
  title: string;
  description: string;
  tech: string[];
  demoUrl: string;
  codeUrl: string;
  gradient: string;
}

interface Experience {
  year: string;
  role: string;
  company: string;
  description: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  location: string;
}

interface PortfolioContent {
  hero: HeroContent;
  about: AboutContent;
  skills: SkillCategory[];
  projects: Project[];
  experience: Experience[];
  contact: ContactInfo;
}

const defaultContent: PortfolioContent = {
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
      gradient: "from-blue-500 to-purple-600"
    },
    {
      title: "Task Management App",
      description: "Collaborative task management tool with real-time updates, team workspaces, and analytics.",
      tech: ["Next.js", "TypeScript", "PostgreSQL", "WebSockets"],
      demoUrl: "#",
      codeUrl: "#",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      title: "Social Media Dashboard",
      description: "Analytics dashboard aggregating data from multiple social media platforms with beautiful visualizations.",
      tech: ["React", "D3.js", "Express", "Redis"],
      demoUrl: "#",
      codeUrl: "#",
      gradient: "from-cyan-500 to-blue-600"
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
  }
};

interface ContentContextType {
  content: PortfolioContent;
  updateContent: (newContent: PortfolioContent) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<PortfolioContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch content from API on mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const data = await contentAPI.getContent();
        setContent(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching content:', err);
        setError(err.message || 'Failed to load content');
        // Fall back to localStorage or default
        const saved = localStorage.getItem('portfolioContent');
        if (saved) {
          setContent(JSON.parse(saved));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const updateContent = async (newContent: PortfolioContent) => {
    try {
      setLoading(true);
      await contentAPI.updateContent(newContent);
      setContent(newContent);
      // Also save to localStorage as backup
      localStorage.setItem('portfolioContent', JSON.stringify(newContent));
      setError(null);
    } catch (err: any) {
      console.error('Error updating content:', err);
      setError(err.message || 'Failed to update content');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, loading, error }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within ContentProvider');
  }
  return context;
};

export type { PortfolioContent, HeroContent, AboutContent, SkillCategory, Project, Experience, ContactInfo };
