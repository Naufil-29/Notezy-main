import express from 'express';
import { chatbot } from '../controllers/chatControllers.js';
import { authMiddleware } from '../middleware/auth.js';



const router = express.Router();

router.post("/", authMiddleware, chatbot);


export default router;