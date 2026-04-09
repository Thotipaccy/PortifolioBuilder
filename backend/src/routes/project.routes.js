import express from 'express';
import { addProject, updateProject, deleteProject, getProjects } from '../controllers/project.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getProjects);
router.post('/', protect, addProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

export default router;
