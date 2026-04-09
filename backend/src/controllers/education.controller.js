import prisma from '../db.js';

export const getEducations = async (req, res) => {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.user.id }
    });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    const educations = await prisma.education.findMany({
      where: { portfolioId: portfolio.id },
      orderBy: { startDate: 'desc' }
    });
    res.json(educations);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching education' });
  }
};

export const createEducation = async (req, res) => {
  try {
    const { institution, degree, fieldOfStudy, startDate, endDate } = req.body;
    
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.user.id }
    });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    const education = await prisma.education.create({
      data: {
        institution,
        degree,
        fieldOfStudy,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        portfolioId: portfolio.id
      }
    });

    res.status(201).json(education);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating education' });
  }
};

export const updateEducation = async (req, res) => {
  try {
    const { institution, degree, fieldOfStudy, startDate, endDate } = req.body;
    
    // Check ownership
    const education = await prisma.education.findUnique({
      where: { id: req.params.id },
      include: { portfolio: true }
    });

    if (!education || education.portfolio.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await prisma.education.update({
      where: { id: req.params.id },
      data: {
        institution,
        degree,
        fieldOfStudy,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : null
      }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating education' });
  }
};

export const deleteEducation = async (req, res) => {
  try {
    const education = await prisma.education.findUnique({
      where: { id: req.params.id },
      include: { portfolio: true }
    });

    if (!education || education.portfolio.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await prisma.education.delete({ where: { id: req.params.id } });
    res.json({ message: 'Education removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting education' });
  }
};
