import Note from '../models/Note.js';

export async function getAllNotes(req, res) { 
    try { 
        const userId = req.user.id;  // JWT se mila
        const notes = await Note.find({ userId }).sort({ createdAt: -1 }); 
        res.status(200).json(notes);
    }
    catch(error) { 
        res.status(500).json({ message: "Internal server error" });
    }
};

export async function getNotesById(req, res){ 
    try{ 
        const note = await Note.findById(req.params.id);
        if(!note){res.status(404).json({  message:"Note not found"})};
        res.status(200).json(note);

    }catch(error){ 
        res.status(500).json({ message: "Internal server error" });
    }
}
export async function createANote(req, res) { 
    try { 
        const { title, content, tag } = req.body;
        const userId = req.user.id; // JWT se aaya

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        // ✅ userId include karna hoga
        const note = new Note({ 
            title, 
            content,
            tag:{ 
              name: tag?.name || "",
              color: tag?.color || "#000000",
            }, 
            userId 
        });

        const savedNote = await note.save();
        res.status(201).json(savedNote);

    } catch (error) { 
        res.status(500).json({ message: "Internal server error" });
    }
};

export async function updateNote(req, res) { 
  try { 
    const { id } = req.params; // ✅ get id from params
    const { title, content, tag } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, userId: req.user.id }, // ✅ ensure user owns the note
      {
        $set: {
          title,
          content,
          ...(tag ? { tag: { name: tag.name, color: tag.color || 'defaultColor' } } : {}) 
        }
      },
      { new: true } // ✅ return updated doc
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(updatedNote);
  } catch (error) { 
    console.error("Error in updateNote:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export async function deleteNote(req, res) { 
    try{ 

        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) {
            return res.status(404).json({ message: "Note not found" });
        };
        res.status(200).json({ message: "Note deleted sucessfully" });

    }catch(error){ 
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function searchNotes(req, res) {
  try {
    const search = req.query.search || "";

    //Auth middleware se Id aa rahi he
    const userId = req.user.id;

    if (!search) {
      return res.status(400).json({ message: "Search query required" });
    }

    // MongoDB query
    const query = {
        userId,
      $or: [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { "tag.name": { $regex: search, $options: "i" } },
      ],
    };

        // ✅ Check agar input ek valid date hai (yyyy-mm-dd)
    const parsedDate = new Date(search);
    if (!isNaN(parsedDate)) {
      const startOfDay = new Date(parsedDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(parsedDate);
      endOfDay.setHours(23, 59, 59, 999);

      query.$or.push({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });
    }

    const notes = await Note.find(query);
    res.json(notes);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}