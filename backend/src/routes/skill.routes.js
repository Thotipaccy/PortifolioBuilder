import express from 'express';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../controllers/skill.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getSkills)
  .post(createSkill);

router.route('/:id')
  .put(updateSkill)
  .delete(deleteSkill);

export default router;
