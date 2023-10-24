import express from 'express';
import { verifyToken } from '../middleware/jwt.js';
import { create, destroy, index, show } from '../controllers/gig.controller.js';

const router = express.Router();

router.route('/').get(index).post(verifyToken, create);
router.route('/:id').get(show).delete(verifyToken, destroy);

export default router;
