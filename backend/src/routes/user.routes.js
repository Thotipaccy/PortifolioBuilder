import express from 'express';
import { getUserProfile, updateUserProfile, getUsers } from '../controllers/user.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/', protect, adminOnly, getUsers);

export default router;
