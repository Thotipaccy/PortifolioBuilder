import prisma from '../db.js';
import { sendContactEmail } from '../services/email.service.js';

// @desc    Get users portfolio
// @route   GET /api/portfolios/me
// @access  Private
export const getMyPortfolio = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.error('GetMyPortfolio: No user ID in request');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.user.id },
      include: {
        projects: true,
        experience: true,
        education: true,
        skills: true
      }
    });

    if (portfolio) {
      res.json(portfolio);
    } else {
      res.status(404).json({ message: 'Portfolio not found' });
    }
  } catch (error) {
    console.error('Get My Portfolio Error:', error);
    res.status(500).json({ message: 'Server error fetching portfolio', details: error.message });
  }
};

// @desc    Get public portfolio by username
// @route   GET /api/portfolios/:username
// @access  Public
export const getPortfolioByUsername = async (req, res) => {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { username: req.params.username },
      include: {
        projects: true,
        experience: true,
        education: true,
        skills: true,
        user: { select: { 
          name: true, 
          email: true, 
          bio: true, 
          title: true, 
          contactDescription: true, 
          profileImg: true, 
          phone: true, 
          location: true,
          githubUrl: true,
          linkedInUrl: true,
          twitterUrl: true,
          instagramUrl: true
        } }
      }
    });

    if (portfolio) {
      // Increment views
      await prisma.portfolio.update({
        where: { id: portfolio.id },
        data: { views: { increment: 1 } }
      });
      res.json(portfolio);
    } else {
      res.status(404).json({ message: 'Portfolio not found' });
    }
  } catch (error) {
    console.error('Public Portfolio Error:', error);
    res.status(500).json({ message: 'Server error fetching public portfolio', details: error.message });
  }
};

// @desc    Create new portfolio
// @route   POST /api/portfolios
// @access  Private
export const createPortfolio = async (req, res) => {
  try {
    const { username, templateId } = req.body;

    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { username }
    });

    if (existingPortfolio) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    // Must have a template
    if (!templateId) {
      return res.status(400).json({ message: 'Please select a template' });
    }

    const portfolio = await prisma.portfolio.create({
      data: {
        userId: req.user.id,
        username,
        templateId,
      }
    });

    // Link to user
    await prisma.user.update({
      where: { id: req.user.id },
      data: { portfolioId: portfolio.id }
    });

    res.status(201).json(portfolio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating portfolio' });
  }
};

// @desc    Update portfolio
// @route   PUT /api/portfolios/me
// @access  Private
export const updatePortfolio = async (req, res) => {
  try {
    const { 
      username,
      theme, 
      sections, 
      seoTitle, 
      seoDescription, 
      seoKeywords, 
      googleAnalyticsId,
      customDomain
    } = req.body;

    // Check if portfolio exists
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.user.id }
    });

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // If username is changing, check if new one is already taken
    if (username && username !== portfolio.username) {
      const existing = await prisma.portfolio.findUnique({ where: { username } });
      if (existing) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
    }

    const updatedPortfolio = await prisma.portfolio.update({
      where: { id: portfolio.id },
      data: {
        username: username || undefined,
        primaryColor: theme?.primaryColor,
        secondaryColor: theme?.secondaryColor,
        font: theme?.font,
        darkMode: theme?.darkMode,
        sections: sections ? sections : undefined,
        seoTitle,
        seoDescription,
        seoKeywords,
        googleAnalyticsId,
        customDomain
      }
    });

    res.json(updatedPortfolio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating portfolio' });
  }
};

// @desc    Check username availability and provide suggestions
// @route   GET /api/portfolios/check-username/:username
// @access  Public
export const checkUsernameAvailability = async (req, res) => {
  try {
    const { username } = req.params;
    
    const existing = await prisma.portfolio.findUnique({
      where: { username }
    });

    if (!existing) {
      return res.json({ available: true });
    }

    // Generate suggestions
    const suggestions = [];
    const bases = [
      `${username}${Math.floor(Math.random() * 100)}`,
      `${username}_dev`,
      `${username}portfolio`,
      `${username}_official`
    ];

    for (const base of bases) {
      const isTaken = await prisma.portfolio.findUnique({ where: { username: base } });
      if (!isTaken) suggestions.push(base);
      if (suggestions.length >= 3) break;
    }

    res.json({ 
      available: false, 
      message: 'Username is already taken',
      suggestions 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error checking username' });
  }
};

// @desc    Send contact message
// @route   POST /api/portfolios/:username/contact
// @access  Public
export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const { username } = req.params;

    const portfolio = await prisma.portfolio.findUnique({
      where: { username },
      include: { user: true }
    });

    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    // Send the email
    await sendContactEmail(portfolio.user.email, email, name, message);

    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};
