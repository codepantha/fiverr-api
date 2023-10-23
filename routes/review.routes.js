import express from 'express';
import { verifyToken } from '../middleware/jwt.js';
import { create } from '../controllers/review.controller.js';

const router = express.Router();

router.get('/', (req, res) => res.send('test'))
router.post('/', verifyToken, create)

export default router;
