import prisma from '../db.js';

// @desc    Get all skills for current user portfolio
// @route   GET /api/skills
// @access  Private
export const getSkills = async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      where: { portfolio: { userId: req.user.id } },
      orderBy: { category: 'asc' }
    });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching skills' });
  }
};

// @desc    Create a skill
// @route   POST /api/skills
// @access  Private
export const createSkill = async (req, res) => {
  try {
    const { name, category, proficiency } = req.body;
    
    // Get portfolio id
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.user.id }
    });

    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    const skill = await prisma.skill.create({
      data: {
        name,
        category,
        proficiency: parseInt(proficiency) || 0,
        portfolioId: portfolio.id
      }
    });

    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Error creating skill' });
  }
};

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private
export const updateSkill = async (req, res) => {
  try {
    const { name, category, proficiency } = req.body;
    const skill = await prisma.skill.update({
      where: { id: req.params.id },
      data: { name, category, proficiency: parseInt(proficiency) || 0 }
    });
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Error updating skill' });
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private
export const deleteSkill = async (req, res) => {
  try {
    await prisma.skill.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Skill removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting skill' });
  }
};
