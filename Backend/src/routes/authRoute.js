import express from 'express'

import { authUser,  deleteUser  } from '../controllers/authControllers.js'

const router = express.Router()

router.post("/", authUser)
router.delete("/delete/:id", deleteUser)

export default router;