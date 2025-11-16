const mongoose = require('mongoose');

const portfolioContentSchema = new mongoose.Schema({
  hero: {
    name: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    githubUrl: { type: String, required: true },
    linkedinUrl: { type: String, required: true },
    emailUrl: { type: String, required: true },
    imageUrl: { type: String, required: true }
  },
  about: {
    paragraphs: [{ type: String }]
  },
  skills: [{
    title: { type: String, required: true },
    skills: [{ type: String }]
  }],
  projects: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    tech: [{ type: String }],
    demoUrl: { type: String },
    codeUrl: { type: String },
    gradient: { type: String }
  }],
  experience: [{
    year: { type: String, required: true },
    role: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true }
  }],
  contact: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true }
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('PortfolioContent', portfolioContentSchema);
