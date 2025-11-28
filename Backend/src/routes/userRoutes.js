import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getUserProfile, updateUser } from '../controllers/userControllers.js';
import { upload } from '../middleware/upload.js';



const router = express.Router()

router.get("/me", authMiddleware, getUserProfile);
router.put("/update", authMiddleware, upload.single("profileImg"), updateUser);

export default router;