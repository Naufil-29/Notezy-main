import { useEffect, useState } from "react";
import defaultImg from "../asset-img/default-img.jpg"
import { toast } from 'react-hot-toast'
import api from "../lib/api.js"
import NoteCard from '../components/NoteCard'
import Notetab from "./Notetab.jsx";
import { Link } from "react-router";
import { PlusIcon } from "lucide-react";
import { Button } from "../components/ui/button.tsx";
import { Input } from "../components/ui/input.tsx";
import { Textarea } from "../components/ui/textarea.tsx";


const ProfileBar = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(""); // input values
  const [description, setDescription] = useState("");
  const [profileImg, setProfileImg] = useState(null); // file object
  const [previewImg, setPreviewImg] = useState(null);// for preview

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");                              // 12) Search text
  const [typingTimeout, setTypingTimeout] = useState(null);


  // 14) Notes fetch function (all ya filtered)
  const fetchNotes = async (query = "") => {
    try {
      setLoading(true);                                                  // 15) spinner on
      const url = query
        ? `/api/notes/search?search=${encodeURIComponent(query)}`            // 16) search API
        : `/api/notes`;                                                      // 17) all notes
        const token = localStorage.getItem("token")
      
      const res = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });                                    // 18) GET call
      setNotes(res.data);                                                // 19) state update
      // 20) RL false
    } catch (error) {
      console.log("Error fetching notes", error);                        // 21) log

    }
  };
  const fetchProfile = async () => {
    try {

      const res = await api.get("/api/user/me");
      setUser(res.data);
      setUsername(res.data.username || "");
      setDescription(res.data.description || "");
    }
    catch (error) {
      console.log("fetchProfile error", error)
    }
  };


  useEffect(() => {
    fetchNotes();
    fetchProfile();
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


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfileImg(file);
    if (file) {
      setPreviewImg(URL.createObjectURL(file)) //preview local file
    }
  }

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("username", username);
    formData.append("description", description);
    if (profileImg) {  // <-- yaha profileImg use karna hai
      formData.append("profileImg", profileImg);
    }

    try {
      const res = await api.put("/api/user/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
      setUser(res.data); // frontend state update karo
      setIsEditing(false);
      setPreviewImg(null); // preview clear
    } catch (error) {
      console.log("handleSave error", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");// removes JWT token
    window.location.href = "/auth"; //redirects to login/register page
  }



  if (!user) return <div>Loading Profile.....</div>;

  return (
    <div className="w-64 p-4 bg-primary-200 border-r h-screen pt-16">

      <div className="flex items-center w-[300px]">
        <img
          src={
            previewImg
              ? previewImg
              : user?.profileImg
                ? `http://localhost:5000${user.profileImg}`
                : defaultImg
          }
          alt="profile"
          className="w-20 h-20 rounded-full  object-cover"
        />




        <div className="flex flex-col justify-between">

          {isEditing ? (
            <>
              <div className="card bg-base-100 p-4 bg-white/30 backdrop-blur-md h-30 rouded-lg shadow-lg">
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border bg-gray-200 p-1 rounded mb-2 w-full"
                />
                <Textarea
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border bg-gray-200 p-1 rounded mb-2 w-full"
                  placeholder="Add description"
                />
                <Input
                  type="file"
                  className="file-input bg-gray-200 file-input-bordered input-sm mb-2"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                <Button
                  onClick={handleSave}
                  className="w-full bg-green-500 text-white px-3 py-1 rounded"
                >
                  Save
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  className="w-full bg-gray-400 text-white px-3 py-1 rounded mt-2"
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-lg">
              <h2 className="text-lg font-bold">{user.username}</h2>
              <p className="text-gray-600 text-sm mt-2">
                {user.description || "No description added."}
              </p>
              </div> 
            </>
          )}


        </div>
      </div>
      <Button
        onClick={() => setIsEditing(true)}
        className="mt-5 bg-blue-500 text-white px-3 py-1 rounded w-[220px]"
      >
        Edit Profile
      </Button>


      <Input
        type="text"
        placeholder="Search..."
        value={search}                                               // 40) controlled input
        onChange={handleSearch}                                      // 41) live search
        className="border-gray-400 w-full mt-10"
      />


      {notes.length > 0 && (
        <div className="flex flex-col mt-4 overflow-x-auto h-[250px] scrollbar-hide">
          {notes.map(note => (
            <Notetab key={note._id} note={note} setNotes={setNotes} />
          ))}
        </div>
      )}


      {/* Bottom section - Buttons */}
      <div className="flex flex-col gap-2 absolute bottom-20">
        <Button className="hover:bg-blue-600">
          <Link to={"/create"} className="flex items-center justify-center gap-2 rounded-lg w-[180px]">
            <PlusIcon className="size-5" />
            <span>
              New Note
            </span>
          </Link>
        </Button>


        <Button
          onClick={handleLogout}
          className="rounded hover:bg-red-600 w-[220px]">
          Logout
        </Button>
      </div>
    </div>
  );


};

export default ProfileBar;
