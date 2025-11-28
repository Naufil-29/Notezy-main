import React, { useState } from 'react'
import { ArrowLeftIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'react-hot-toast'
import api from "../lib/api.js"
import { Button } from "../components/ui/button.tsx";
import { Input } from "../components/ui/input.tsx";
import { Textarea } from "../components/ui/textarea.tsx";
import { Card } from "../components/ui/card.tsx"
const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const[tagName, setTagName] = useState("");  //for tag name
  const[tagColor, setTagColor] = useState("#000000")  // for tag color 
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

    // 🟢 Define your palette here
  const colors = [
    "#FF5733", // Red-Orange
    "#FFBD33", // Yellow
    "#75FF33", // Green
    "#33FFBD", // Aqua
    "#3380FF", // Blue
    "#9D33FF", // Purple
    "#FF33A8", // Pink
    "#808080"  // Gray
  ];

  const handleSubmit = async (e) => { 
    e.preventDefault();
    if (!title.trim() || !content.trim()) { 
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/api/notes", { 
        title, 
        content,
        tag:{ 
          name: tagName,
          color: tagColor,
        } 
      });  // ✅ save response

      navigate("/notes");
      toast.success("Note created successfully");
    } catch (error) {
      console.log("Error creating notes:", error.response?.data || error.message);

      if (error.response?.status === 429) {  // ✅ safe check with ?
        toast.error("Slow down, you are making notes too fast!", { 
          duration: 4000,
          icon: "💀",
        });
      } else if (error.response?.status === 401) {
        toast.error("Unauthorized! Please login again.");
        navigate("/login"); // optional redirect
      } else {
        toast.error("Failed to create note");
      }
    } finally { 
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen w-full bg-base-200">  
      <div className="container mx-auto px-4 py-8"> 
        <div className="max-w-2xl mx-auto"> 
          <Button className='mb-5'>
          <Link to={"/notes"} className="flex items-center"> 
            <ArrowLeftIcon className="size-5"/>
            Back To Notes
          </Link>
          </Button>
          <Card className="card bg-base-100"> 
            <div className="card-body"> 
              <h2 className="card-title text-2xl mb-4"> </h2>
              <form onSubmit={handleSubmit}> 
                <div className="p-4 w-full mb-4"> 
                 <h2 className="ml-5 font-bold">Title</h2>
                 <Input type="text" placeholder='Title' className='' value={title} onChange={(e) => setTitle(e.target.value)}/>
                </div>

                <div className='p-4 w-full mb-4'> 
                  <h2 className="ml-5 font-bold">Content</h2>
                  <Textarea placeholder='Write your note here' className='textarea textarea-bordered h-32' value={content} onChange={(e) => setContent(e.target.value)} />
                </div>

                <div className='p-4 w-full mb-4'> 
                  <h2 className="ml-5 font-bold">Tag Name</h2>
                  <Textarea placeholder='e.g : Work, Personal' className='textarea textarea-bordered h-32' value={tagName} onChange={(e) => setTagName(e.target.value)} />
                </div>

                 <div className="p-4 w-full mb-4"> 
                  <h2 className="ml-5 font-bold">Tag color</h2>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 transition ${
                          tagColor === c ? "border-black scale-110" : "border-transparent"
                        }`}
                        style={{ backgroundColor: c }}
                        onClick={() => setTagColor(c)}
                      />
                    ))}
                  </div>
                </div>


            <div className='card-actions justify-end'> 
                  <Button type='submit' className='ml-5 mb-5' disabled={loading}> 
                    {loading ? "creating..." : "Create Note"}
                  </Button>
                </div>

              </form>
            </div>
          </Card>
        </div>
      </div>
    </div> 
   )
}

export default CreatePage
