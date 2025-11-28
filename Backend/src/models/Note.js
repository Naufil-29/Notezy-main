import mongoose from "mongoose";


const noteSchema = mongoose.Schema({ 
    title:{ 
        type: String,
        required: true
    },
    content:{ 
        type: String,
        required: true
    },
    tag:{ 
        name:{type: String, default: ""},
        color:{type: String, default: "#000000"} //default black

    },
    userId: { type:mongoose.Schema.Types.ObjectId, ref:"user", required: true }, //store the note owner
},
{ timestamps: true } //createdAt and updatedAt
)

const Note = mongoose.model("Note", noteSchema);

export default Note;