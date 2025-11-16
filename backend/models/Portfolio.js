import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  hero: {
    name: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    welcomeText: { type: String, required: true },
    socialLinks: {
      github: String,
      linkedin: String,
      email: String
    }
  },
  about: {
    paragraphs: [String],
    highlights: [{
      title: String,
      description: String
    }]
  },
  skills: {
    categories: [{
      title: String,
      skills: [String]
    }]
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
  }
}, {
  timestamps: true
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;
