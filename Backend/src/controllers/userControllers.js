import User from "../models/user-model.js";
import { uploadDir } from '../middleware/upload.js'

export const getUserProfile = async (req, res) => { 
  try{ 
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
}
  catch(error){ 
    res.staus(500).json({ message: "server error" });
  }
};


export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update Username
    if (req.body.username) {
      user.username = req.body.username;
    }

    // Update Description
    if (req.body.description) {
      user.description = req.body.description;
    }

    // Update Profile Image
    if (req.file) {
      user.profileImg = "/uploads/" + req.file.filename;
    }

    await user.save();

    const updatedUser = await User.findById(userId).select("-password");

    res.status(200).json(updatedUser);

  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
