import jwt from 'jsonwebtoken';

/**
 * Generate a JWT token for the user.
 * @param {string} userId - The user's ID
 * @returns {string} - The generated JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'fallback_secret_key_12345', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export default generateToken;
