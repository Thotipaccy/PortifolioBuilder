import prisma from '../db.js';

// @desc    Get user profile (by token)
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        title: true,
        contactDescription: true,
        profileImg: true,
        phone: true,
        location: true,
        githubUrl: true,
        linkedInUrl: true,
        twitterUrl: true,
        instagramUrl: true,
        createdAt: true,
        portfolio: true
      }
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const { name, email, bio, title, contactDescription, profileImg, phone, location, githubUrl, linkedInUrl, twitterUrl, instagramUrl } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name || undefined,
        email: email || undefined,
        bio: bio !== undefined ? bio : undefined,
        title: title !== undefined ? title : undefined,
        contactDescription: contactDescription !== undefined ? contactDescription : undefined,
        profileImg: profileImg !== undefined ? profileImg : undefined,
        phone: phone !== undefined ? phone : undefined,
        location: location !== undefined ? location : undefined,
        githubUrl: githubUrl !== undefined ? githubUrl : undefined,
        linkedInUrl: linkedInUrl !== undefined ? linkedInUrl : undefined,
        twitterUrl: twitterUrl !== undefined ? twitterUrl : undefined,
        instagramUrl: instagramUrl !== undefined ? instagramUrl : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
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
      }
    });
    
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};
