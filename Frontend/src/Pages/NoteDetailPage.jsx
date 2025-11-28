import { useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast'
import api from '../lib/api.js';
import { LoaderIcon, Trash2Icon } from 'lucide-react';
import { Link } from 'react-router';
import { ArrowLeftIcon } from 'lucide-react'
import { Input } from "../components/ui/input.tsx";
import { Textarea } from "../components/ui/textarea.tsx";
import { Card } from "../components/ui/card.tsx"
import { Button } from '../components/ui/button.tsx';
import ChatBox from '../components/OpenAI.jsx'

const NoteDetailPage = () => {

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
   const[tagColor, setTagColor] = useState("#000000")

  const navigate = useNavigate();

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

  const { id } = useParams();

  useEffect (() => { 
    const fetchNote = async() => { 
      try{ 
        const res = await api.get(`/api/notes/${id}`)
        setNote(res.data)
        setTagColor(res.data.tag?.color || "#000000")

      }catch(error){ 
        console.log("error in fetching note", error)
        toast.error("Failed to fetch the note")
      }finally{ 
        setLoading(false)
      }
}


       fetchNote()
  }, [id])

  console.log({ note })

  if(loading){ 
    return( 
      <div className='h-screen bg-base-200 flex items-center justify-center'> 
        <LoaderIcon className='animate-spin size-10' />
      </div>
    )
  }

const handleDelete = async () => { 
        if(!window.confirm("Are you sure you want to delete this note")) return;

        try{ 
            await api.delete(`/api/notes/${id}`)
            toast.success("Note deleted sucessfully!")
            navigate("/notes")
        }catch(error){ 
            console.log("Error in handleDelete", error)
            toast.error("Failed to delete note")
        }
    }
  const handleSave = async () => { 
    if(!note.title.trim() || !note.content.trim()){ 
      toast.error("please add title or content")
      return;
    }

    setSaving(true)

    try{ 
        await api.put(`/api/notes/${id}`, note)
        toast.success("Note updated successfully")
        navigate("/notes")
    }catch(error){ 
      console.log("Error saving the note")
      toast.error("Failed to save note")
    }finally{ 
      setSaving(false)
    }
  }

  return (
    <div className='h-screen'> 
        <div className='container- py-8 flex'> 
          <div className='max-w-4xl mx-80'> 
            <div className='flex items-center justify-between mb-10'> 
            <Button>
              <Link to="/notes" className="flex items-center gap-2"> 
              <ArrowLeftIcon className="h-5 w-5" />
              Back to notes
              </Link>
             </Button> 
              <Button onClick={handleDelete} className='btn  bg-red-600 text-white'> 
                <Trash2Icon className='h-5 w-5'/>
                Delete Note
              </Button>
            </div>
          

            <div className='h-screen bg-base-100'> 
             <div className=' bg-base-100'> 
                <div className='mb-4'> 
                  <h2 className="ml-5 font-bold">Title</h2>
                  <Input type="text" placeholder='Note-title' className='input' value={note.title} onChange={(e) => setNote({...note, title:e.target.value })} />
              </div>

                              {/* Tag Editing */}
              <div className="form-control mb-4">
                <h2 className="ml-1 font-bold">Tag</h2>
                <div className="flex gap-4">
                  <Input
                    type="text"
                    placeholder="Tag name"
                    value={note.tag?.name || ""}
                    onChange={(e) =>
                      setNote({
                        ...note,
                        tag: { ...note.tag, name: e.target.value },
                      })
                    }
                  />
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 transition ${
                          tagColor === color ? "border-black scale-110" : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setTagColor(color);
                          setNote({ 
                            ...note,
                            tag:{  ...note.tag, color: color }
                          })
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className='form-control mb-4'> 
                <h2 className="ml-5 font-bold">Content</h2>
                <Textarea placeholder='Write your note here...' className='textarea min-h-[350px] w-full' value={note.content} onChange={(e) => setNote({...note, content: e.target.value})} />
              </div>



              <div className='card-actions justify-end'> 
                <Button className='btn btn-primary' disabled={saving} onClick={handleSave}> 
                  {saving ? "Saving" : "Save Changes"}
                </Button>
              </div>
            </div>

          </div>
        </div>
          <div className='fixed right-4 bottom-4 z-50'>
              <ChatBox />
            </div>
      </div>
    </div>
  )
}

export default NoteDetailPage



