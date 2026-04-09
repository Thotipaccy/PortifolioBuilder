import express from 'express';
import { getTemplates, addTemplate } from '../controllers/template.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', getTemplates);
router.post('/', protect, adminOnly, addTemplate);

export default router;
