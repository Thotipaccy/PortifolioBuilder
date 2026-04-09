import prisma from '../db.js';

export const getExperiences = async (req, res) => {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.user.id }
    });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    const experiences = await prisma.experience.findMany({
      where: { portfolioId: portfolio.id },
      orderBy: { startDate: 'desc' }
    });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching experiences' });
  }
};

export const createExperience = async (req, res) => {
  try {
    const { company, position, description, startDate, endDate, location } = req.body;
    
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.user.id }
    });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    const experience = await prisma.experience.create({
      data: {
        company,
        position,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        location,
        portfolioId: portfolio.id
      }
    });

    res.status(201).json(experience);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating experience' });
  }
};

export const updateExperience = async (req, res) => {
  try {
    const { company, position, description, startDate, endDate, location } = req.body;
    
    // Check ownership
    const experience = await prisma.experience.findUnique({
      where: { id: req.params.id },
      include: { portfolio: true }
    });

    if (!experience || experience.portfolio.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await prisma.experience.update({
      where: { id: req.params.id },
      data: {
        company,
        position,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : null, // Handle current position
        location
      }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating experience' });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    const experience = await prisma.experience.findUnique({
      where: { id: req.params.id },
      include: { portfolio: true }
    });

    if (!experience || experience.portfolio.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await prisma.experience.delete({ where: { id: req.params.id } });
    res.json({ message: 'Experience removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting experience' });
  }
};
