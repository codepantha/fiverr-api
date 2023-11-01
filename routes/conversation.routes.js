import express from 'express';
import { verifyToken } from '../middleware/jwt.js';
import { create, index, markAsRead, show } from '../controllers/conversation.controller.js';

const router = express.Router();

router.use(verifyToken);

router.route('/').get(index).post(create);
router.get('/single', show);
router.route('/:id').put(markAsRead);

export default router;
