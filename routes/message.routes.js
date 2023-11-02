import express from 'express';
import { verifyToken } from '../middleware/jwt.js';
import { create, index } from '../controllers/message.controller.js';

const router = express.Router();

router.use(verifyToken)

router.get('/:conversationId', index);
router.post('/', create);

export default router;
