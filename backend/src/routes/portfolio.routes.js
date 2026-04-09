import express from 'express';
import { getMyPortfolio, getPortfolioByUsername, createPortfolio, updatePortfolio, sendContactMessage, checkUsernameAvailability } from '../controllers/portfolio.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { upload } from '../services/upload.service.js';

const router = express.Router();

router.get('/check-username/:username', checkUsernameAvailability);
router.get('/me', protect, getMyPortfolio);
router.post('/', protect, createPortfolio);
router.put('/me', protect, updatePortfolio);
router.get('/:username', getPortfolioByUsername);
router.post('/:username/contact', sendContactMessage);

// Image upload route
router.post('/upload', protect, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  // Return the filename prefixed with /uploads/ for the frontend
  const relativePath = `/${req.file.path.replace(/\\/g, '/')}`;
  res.json({ url: relativePath });
});

export default router;
