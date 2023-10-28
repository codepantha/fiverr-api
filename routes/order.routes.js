import express from 'express';
import { verifyToken } from '../middleware/jwt.js';
import { create, index } from '../controllers/order.controller.js';

const router = express.Router();

router.route('/').get(verifyToken, index).post(verifyToken, create);

export default router;
