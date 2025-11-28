import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {getAllNotes, getNotesById, createANote, updateNote, deleteNote, searchNotes} from '../controllers/notesControllers.js'

const router = express.Router();

router.get("/search", authMiddleware, searchNotes);
router.get("/", authMiddleware, getAllNotes);
router.get("/:id", getNotesById);
router.post("/", authMiddleware, createANote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);


export default router;