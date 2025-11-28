import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import path from "path";

import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoute.js'
import notesRoutes from './routes/notesRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import { connectDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import { authMiddleware } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;


// Allow frontend requests from deployed URL
app.use(cors({ origin: "http://localhost:5173", methods: ["GET", "POST", "DELETE", "PUT"], credentials: true }));
// make uploads folder public
app.use(express.json());// this middleware is used to parse JSON bodies
app.use(rateLimiter);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/auth", authRoutes)
app.use("/api/user",userRoutes)
app.use("/api/notes", authMiddleware, notesRoutes)
app.use("/api/chat", authMiddleware, chatRoutes)


connectDB().then(() => { 

        app.listen(PORT, () =>{ 
            console.log('Server is running on port :', PORT);
        });
    });
    
