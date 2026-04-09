import prisma from '../db.js';

// @desc    Get all active templates
// @route   GET /api/templates
// @access  Public
export const getTemplates = async (req, res) => {
  try {
    const templates = await prisma.template.findMany({
      where: { isActive: true }
    });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching templates' });
  }
};

// @desc    Add a template
// @route   POST /api/templates
// @access  Private/Admin
export const addTemplate = async (req, res) => {
  try {
    const { name, thumbnail, htmlStructure, cssVariables, isPremium } = req.body;
    
    const template = await prisma.template.create({
      data: {
        name,
        thumbnail,
        htmlStructure,
        cssVariables: cssVariables || {},
        isPremium: isPremium || false,
      }
    });
    
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ message: 'Server error adding template' });
  }
};
