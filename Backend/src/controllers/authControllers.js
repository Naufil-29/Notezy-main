import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user-model.js'

export async function authUser(req, res){ 
    try{ 

      const {action, username, email, password} = req.body;
      //Register User

      if(action === "register"){ 
        
        const exists = await User.findOne({ email })
        if(exists)return res.status(400).json({ message:"user already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });

        await user.save();
        return res.status(201).json({ 
          success: true,
          message: "user created successfully"
        })
      }

      else if(action === "login"){ 

        const user = await User.findOne({ email });
        if(!user) return res.status(401).json({ message:"user is not registered" });

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch)return res.status(400).json({ message:"password is incorrect" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
       

        return res.json({ 
          success: true,
          message: "login successful",
          token, 
          user:{ id:user._id,
                 username: user.username, 
                 email: user.email,  
                },
        });
      }

      //if action is missing or wrong
      else{ 
          return res.status(400).json({ message:"Invalid action. Use Login or Register" })
      }
      

    }catch(error){ 
        res.status(500).json({ message:error.message })
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


