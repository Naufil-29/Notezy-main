import Note from '../models/Note.js';
import OpenAI from 'openai';

export async function chatbot(req, res) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const { message } = req.body;
  const userId = req.user.id;  // ✅ we rely on authMiddleware for logged-in user

  console.log("User ID from token:", userId);
  try {

    // Ask GPT to always reply in JSON
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an assistant that manages, and help user creating and deleting notes.
If the user wants to create a note, always reply in JSON ONLY like this:
{ "action": "create_note", "title": "TITLE_HERE", "content": "CONTENT_HERE" }
If not creating a note, reply in JSON ONLY like this:
{ "action": "reply", "message": "REPLY_TEXT" }`
        },
        { role: "user", content: message }
      ],
      response_format: { type: "json_object" } // ✅ force GPT to give valid JSON
    });

    const response = JSON.parse(completion.choices[0].message.content);

    if (response.action === "create_note") {
      const newNote = await Note.create({
        title: response.title || "Untitled",
        content: response.content || "",
        userId
      });
    
    
      
      return res.json({
        reply: `✅ Created note "${newNote.title}" successfully.`,
        note: newNote
      });
    }
    
    
    
   else if (response.action === "delete_note") {
    const deleteNote = await Note.findByIdAndDelete({userId})
       return res.json({
        reply: `✅ deleted note "${Note.findByIdAndDelete.title}" successfully.`,
        note: deleteNote
      }); 
  
  };

    // Otherwise, just reply normally
    res.json({ reply: response.message });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ reply: "⚠️ Something went wrong." });
  }
}


