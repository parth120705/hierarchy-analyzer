import express from 'express';
import { handlePostBfhl } from '../controllers/bfhlController.js';

const router = express.Router();

// Match POST /bfhl
router.post('/', handlePostBfhl);

export default router;
