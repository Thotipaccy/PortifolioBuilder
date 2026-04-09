import prisma from '../db.js';

// @desc    Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        portfolio: {
          select: { username: true, views: true }
        }
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// @desc    Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === req.user.id) return res.status(400).json({ message: 'Cannot delete yourself' });
    
    await prisma.user.delete({ where: { id } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting user' });
  }
};

// @desc    Create template (Admin only)
export const createTemplate = async (req, res) => {
  try {
    const { name, thumbnail, htmlStructure, cssVariables, isPremium } = req.body;
    const template = await prisma.template.create({
      data: { name, thumbnail, htmlStructure, cssVariables, isPremium }
    });
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating template' });
  }
};

// @desc    Get system stats (Admin only)
export const getSystemStats = async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    const portfolioCount = await prisma.portfolio.count();
    const totalViews = await prisma.portfolio.aggregate({
      _sum: { views: true }
    });

    res.json({
      totalUsers: userCount,
      totalPortfolios: portfolioCount,
      totalViews: totalViews._sum.views || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};
