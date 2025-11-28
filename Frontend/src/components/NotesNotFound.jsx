import React from 'react'
import { NotebookIcon } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from "../components/ui/button.tsx";

const NotesNotFound = () => {
  return (
    <div className='flex flex-col items-center justify-center py-16 space-y-6 max-w-md mx-auto text-center'> 
        <div className='bg-primary/10 rounded-full p-8'> 
            <NotebookIcon />
        </div>
        <h3 className='text 2xl font-bold'>No notes yet</h3>
        <p className='text-base-content/70'> 
        Ready to Orgainze your thoughts? Create your first note to start the journey.
        </p>
        <Link to="/api/create"> 
        <Button className='btn bg-primary'> 
        Create your first note
        </Button>
        </Link>
    </div>
  )
}

export default NotesNotFound
