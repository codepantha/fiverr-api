import { deleteUser } from '../controllers/user.controller.js'

import express from 'express';

const router = express.Router();

router.delete('/:id', deleteUser);

export default router;
