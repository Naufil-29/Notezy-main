import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user-model.js';

export async function authUser(req, res) {
  try {
    const { action, username, email, password } = req.body || {};

    if (action === "register") {
      if (!email || !password || !username) {
        return res.status(400).json({ message: "username, email and password are required" });
      }

      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: "user already registered" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword });

      await user.save();
      return res.status(201).json({
        success: true,
        message: "user created successfully"
      });
    } else if (action === "login") {
      if (!email || !password) {
        return res.status(400).json({ message: "email and password are required" });
      }

      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: "user is not registered" });

      if (!user.password) {
        // defensive check
        return res.status(500).json({ message: "User record missing password hash" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "password is incorrect" });

      // Use a fallback secret in dev so jwt.sign doesn't throw. Remove fallback in production.
      const secret = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET || 'dev_temp_secret';
      if (!process.env.JWT_SECRET_KEY) {
        console.warn("WARNING: JWT_SECRET_KEY is not set. Using dev fallback - set env var in production!");
      }

      const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1h" });

      return res.json({
        success: true,
        message: "login successful",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } else {
      return res.status(400).json({ message: "Invalid action. Use Login or Register" });
    }
  } catch (error) {
    console.error("AUTH ERROR:", error);        // full error + stack in logs
    return res.status(500).json({ message: "Server error during auth", error: error.message });
  }
};




export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; // `authMiddleware` se aayega (decoded JWT)
    
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


