import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface HeroData {
  name: string;
  title: string;
  description: string;
  welcomeText: string;
  socialLinks: {
    github: string;
    linkedin: string;
    email: string;
  };
}

export interface AboutData {
  paragraphs: string[];
  highlights: Array<{
    title: string;
    description: string;
  }>;
}

export interface SkillsData {
  categories: Array<{
    title: string;
    skills: string[];
  }>;
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
  image: string;
  demoLink: string;
  codeLink: string;
}

export interface Experience {
  year: string;
  role: string;
  company: string;
  description: string;
}

export interface ContactData {
  email: string;
  phone: string;
  location: string;
  description: string;
}

export interface PortfolioData {
  hero: HeroData;
  about: AboutData;
  skills: SkillsData;
  projects: Project[];
  experience: Experience[];
  contact: ContactData;
}

export const usePortfolioData = () => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/portfolio`);
        if (!response.ok) {
          throw new Error('Failed to fetch portfolio data');
        }
        const portfolioData = await response.json();
        setData(portfolioData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching portfolio data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export const usePortfolioSection = <T,>(section: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/portfolio/${section}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${section} data`);
        }
        const sectionData = await response.json();
        setData(sectionData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error(`Error fetching ${section} data:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [section]);

  return { data, loading, error };
};
