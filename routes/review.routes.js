import express from 'express';
import { verifyToken } from '../middleware/jwt.js';
import { create, getReviews } from '../controllers/review.controller.js';

const router = express.Router();

router.get('/:gigId', getReviews);
router.post('/', verifyToken, create)

export default router;
