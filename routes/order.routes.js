import express from 'express';
import { verifyToken } from '../middleware/jwt.js';
import { index, intent, confirmOrder } from '../controllers/order.controller.js';

const router = express.Router();

router.route('/').get(verifyToken, index).put(verifyToken, confirmOrder)
router.post('/create-payment-intent/:id', verifyToken, intent)

export default router;
