const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');
const authMiddleware = require('../middleware/auth');
const contactEmailTemplate = require('../templates/contactEmail');

// Create nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields: name, email, subject, and message' 
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide a valid email address' 
      });
    }

    // Create contact in database
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    // Send email notification to admin
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, // Send to admin email
        subject: `New Contact: ${subject}`,
        html: contactEmailTemplate(contact),
        replyTo: email, // Allow admin to reply directly
      };

      await transporter.sendMail(mailOptions);
      console.log('Contact notification email sent to admin');
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Don't fail the request if email fails - contact is still saved
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your message! I will get back to you soon.',
      contact: {
        id: contact._id,
        name: contact.name,
        createdAt: contact.createdAt
      }
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to submit contact form. Please try again later.' 
    });
  }
});

// @route   GET /api/contact
// @desc    Get all contacts (admin only)
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, limit = 50, skip = 0 } = req.query;

    // Build query
    const query = {};
    if (status && ['new', 'read', 'responded'].includes(status)) {
      query.status = status;
    }

    // Get contacts with pagination
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 }) // Newest first
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .lean();

    // Get total count for pagination
    const total = await Contact.countDocuments(query);

    res.json({
      success: true,
      contacts,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: total > parseInt(skip) + contacts.length
      }
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch contacts' 
    });
  }
});

// @route   PATCH /api/contact/:id/status
// @desc    Update contact status (admin only)
// @access  Private
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'read', 'responded'].includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid status. Must be one of: new, read, responded' 
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ 
        success: false,
        message: 'Contact not found' 
      });
    }

    res.json({
      success: true,
      message: 'Contact status updated',
      contact
    });
  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update contact status' 
    });
  }
});

// @route   DELETE /api/contact/:id
// @desc    Delete a contact (admin only)
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({ 
        success: false,
        message: 'Contact not found' 
      });
    }

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete contact' 
    });
  }
});

module.exports = router;
