import { PenSquare, PenSquareIcon, Trash2Icon } from 'lucide-react'
import { Link } from 'react-router'
import { formatDate } from '../lib/utils'
import { toast } from 'react-hot-toast'
import api from '../lib/api.js'
import { Input } from "../components/ui/input.tsx";
import { Textarea } from "../components/ui/textarea.tsx";
import { Card } from "../components/ui/card.tsx"
import { Button } from './ui/button.tsx'

const Notetab = ({note, setNotes}) => {

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

    return( 
        <Card className='mt-2'>
        <Link to={`/note/${note._id}`}
            className="w-full h-10 mt-2 rounded-lg"> 
                <div className="flex items-center p-2 justify-between rounded-xl"> 
                    <h3 className="card-title text-base-content text-sm">{note.title}</h3>
                    <div className='flex items-center gap-2'>
                     <Button className='hover:bg-blue-600' variant="secondary" size="icon">  
                     <PenSquareIcon className="size-4" />
                     </Button> 
                    <Button className='hover:bg-red-600' variant="secondary" size="icon" onClick={(e) => handleDelete(e,note._id)}> 
                            <Trash2Icon className="size-4" /> 
                    </Button>
                   </div>

                </div> 
        </Link>
        </Card>

    )

}

export default Notetab
