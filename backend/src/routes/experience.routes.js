import express from 'express';
import { getExperiences, createExperience, updateExperience, deleteExperience } from '../controllers/experience.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getExperiences)
  .post(protect, createExperience);

router.route('/:id')
  .put(protect, updateExperience)
  .delete(protect, deleteExperience);

export default router;
