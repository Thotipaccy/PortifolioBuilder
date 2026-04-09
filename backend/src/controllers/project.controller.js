import prisma from '../db.js';

// @desc    Add project to portfolio
// @route   POST /api/projects
// @access  Private
export const addProject = async (req, res) => {
  try {
    const { title, description, techStack, imageUrls, liveUrl, githubUrl, featured } = req.body;

    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.user.id }
    });

    if (!portfolio) {
      return res.status(404).json({ message: 'Please create a portfolio first' });
    }

    const project = await prisma.project.create({
      data: {
        portfolioId: portfolio.id,
        title,
        description,
        techStack: techStack || [],
        imageUrls: imageUrls || [],
        liveUrl,
        githubUrl,
        featured: featured || false,
      }
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error adding project' });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res) => {
  try {
    const { title, description, techStack, imageUrls, liveUrl, githubUrl, featured } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: { portfolio: true }
    });

    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.portfolio.userId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to edit this project' });
    }

    const updatedProject = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        techStack,
        imageUrls,
        liveUrl,
        githubUrl,
        featured
      }
    });

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating project' });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: { portfolio: true }
    });

    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.portfolio.userId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this project' });
    }

    await prisma.project.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting project' });
  }
};
