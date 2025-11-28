import mongoose from "mongoose";

const userSchema = new mongoose.Schema({ 
    username:{ 
        type:String,
        required:true,
    },
    email: {
        type:String, 
        required:true,
        unique:true,
    },
    password:{ 
        type:String,
        required:true,
    }, 
    profileImg:{ 
        type:String,
        default:"",
    },
    description:{ 
        type:String,
        default:"",
    }
    
    
},{ 
        timestamps:true,
    },)


    export default mongoose.model("user", userSchema)