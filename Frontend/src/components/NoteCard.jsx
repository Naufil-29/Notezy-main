import { PenSquare, PenSquareIcon, Trash2Icon } from 'lucide-react'
import { Link } from 'react-router'
import { formatDate } from '../lib/utils'
import { toast } from 'react-hot-toast'
import api from '../lib/api.js'
import { Input } from "../components/ui/input.tsx";
import { Textarea } from "../components/ui/textarea.tsx";
import { Card } from "../components/ui/card.tsx"
import { Button } from './ui/button.tsx'

const NoteCard = ({note, setNotes}) => {

    const handleDelete = async (e, id) => { 
        e.preventDefault();//get rid of navigation behaviour

        if(!window.confirm("Are you sure you want to delete this note")) return;

        try{ 
            await api.delete(`/api/notes/${id}`)
            setNotes((prev) => prev.filter((note) => note._id !== id)) //get rid of the deleted notes
            toast.success("Note deleted sucessfully!")
        }catch(error){ 
            toast.error("Failed to delete note")
        }
    }

  return ( 
    <Card className='abosolute'>
    <Link to={`/note/${note._id}`}
        className="hover:shadow-lg transition-all duration-200"> 
        <div className="relative  rounded-lg">
                 <div className=" border p-4 rounded-lg shadow-md bg-base-200">
                        {/* 🆕 Tag Triangle in top-right corner */}
                        {note.tag?.name && (
                    <div className="absolute top-0 right-0">
                         <div className="w-0 h-0 border-t-[80px] border-l-[80px] border-transparent relative"style={{ borderTopColor: note.tag.color }}>
                            {/* Tag text inside triangle */}
                            <span className="absolute -top-14 right-0 text-xs font-bold text-white rotate-45 whitespace-nowrap">
                                 {note.tag.name}
                                </span>
                        </div>
                </div>
                 )}
                <h3 className="card-title text-base-content">{note.title}</h3>
                <p className="text-base-content/60 line-clamp-3">{note.content}</p>
                <div className="card-actions justify-between items-center mt-4"> 
                    <span className="text-sm text-base-content/60"> 
                        {formatDate(new Date(note.createdAt))}
                    </span>
                    <div className="flex items-center gap-8 mt-5">
                         <Button className='hover:bg-blue-600' variant="secondary" size="icon">
                            <PenSquareIcon className="size-4" />
                        </Button> 
                        <Button className='hover:bg-red-600' variant="secondary" size="icon" onClick={(e) => handleDelete(e,note._id)}> 
                            <Trash2Icon/>
                        </Button>
                    </div>
                </div>
          </div> 

          </div> 


        
        
        </Link>
        </Card>
  )
  
}

export default NoteCard
