import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import RateLimitedUI from '../components/RateLimitedUI'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import NoteCard from '../components/NoteCard'
import api from "../lib/api.js"
import NotesNotFound from '../components/NotesNotFound.jsx'
import ProfileBar from '../components/ProfileBar.jsx'
import ChatBox from '../components/OpenAI.jsx'
import { Button } from "../components/ui/button.tsx";
import { Input } from "../components/ui/input.tsx";
import { Textarea } from "../components/ui/textarea.tsx";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");                              // 12) Search text
  const [typingTimeout, setTypingTimeout] = useState(null);              // 13) Debounce handle

  // 14) Notes fetch function (all ya filtered)
  const fetchNotes = async (query = "") => { 
    try { 
      setLoading(true);                                                  // 15) spinner on
      const url = query 
        ? `/api/notes/search?search=${encodeURIComponent(query)}`            // 16) search API
        : `/api/notes`;  // 17) all notes

        const token = localStorage.getItem("token")
      
      const res = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });                                    // 18) GET call
      setNotes(res.data);                                                // 19) state update
      setIsRateLimited(false);                                           // 20) RL false
    } catch (error) { 
      console.log("Error fetching notes", error);                        // 21) log
      if (error?.response?.status === 429) {                             // 22) RL?
        setIsRateLimited(true);                                          // 23) RL show
      } else { 
        toast.error(error?.response?.data?.error || "Error fetching notes"); // 24) toast
      }
    } finally { 
      setLoading(false);                                                 // 25) spinner off
    }
  };

  useEffect(() => {                                                      // 26) on mount
    fetchNotes();                                                        // 27) load all
  }, []);

  // 28) Live search (debounced)
  const handleSearch = (e) => {
    const value = e.target.value;                                        // 29) input value
    setSearch(value);                                                    // 30) state update

    if (typingTimeout) clearTimeout(typingTimeout);                      // 31) old timeout clear

    // 32) 500ms ke baad query fire
    const t = setTimeout(() => {                                         // 33) new timeout
      fetchNotes(value)                                                 // 34) call API
    }, 500);
    setTypingTimeout(t);                                                 // 35) store handle
  };
  return (
    <div className="h-screen overflow-hidden bg-base-00 scrollbar-hidden "> 
      <div className='fixed top-0 left-0 w-full z-50'> 
         <Navbar showNewNote = {true}/>
        </div>

      <div className='flex bg-base-300'>

        <ProfileBar />

      {isRateLimited && <RateLimitedUI  />}



      <div className="w-1/2 mx-auto pt-20 h-[calc(100vh-80px)] overflow-y-auto scrollbar-hide"> 
           {/* 🔍 Search Bar */}
        <div className="mb-6">                                           {/* 39) container */}
          <Textarea
            type="text"
            placeholder="Search any note..."
            value={search}                                               // 40) controlled input
            onChange={handleSearch}                                      // 41) live search
            className="input input-lg p- w-full rounded-lg "                      // 42) styling
          />
        </div>

        {loading && <div className="text-center font-bold tracking-tight text-black-900 py-10">loading notes...</div>}

        {notes.length === 0 && !isRateLimited && <NotesNotFound />}

        {notes.length > 0 && !isRateLimited && ( 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> 
            {notes.map(note => ( 
              <NoteCard key={note._id} note={note} setNotes={setNotes}/>
            ))}
          </div>
        )}
        
      </div>
      <ChatBox onNewNote={fetchNotes}/>    {/* ✅ Pass refresher function */}
    </div>

    </div>
  )
}

export default HomePage
