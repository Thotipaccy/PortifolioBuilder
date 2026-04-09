import express from 'express';
import { getAllUsers, deleteUser, createTemplate, getSystemStats } from '../controllers/admin.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply admin protection to all routes
router.use(protect);
router.use(adminOnly);

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.post('/templates', createTemplate);
router.get('/stats', getSystemStats);

export default router;
