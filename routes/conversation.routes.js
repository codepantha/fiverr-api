import express from 'express';
import { verifyToken } from '../middleware/jwt.js';
import { create, index, markAsRead, show } from '../controllers/conversation.controller.js';

const router = express.Router();

router.use(verifyToken);

router.route('/').get(index).post(create);
router.route('/:id').get(show).put(markAsRead);

export default router;
