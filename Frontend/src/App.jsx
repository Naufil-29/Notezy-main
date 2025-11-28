import { Route, Routes, Router,  Navigate} from "react-router";
import AuthPage from "./Pages/authPage"
import HomePage from "./Pages/HomePage";
import CreatePage from "./Pages/CreatePage";
import NoteDetailPage from "./Pages/NoteDetailPage";
import { toast } from "react-hot-toast";

const App = () => {
  const isAuthenticated = !!localStorage.getItem("token");


  return (
    <div data-themes="light"> 
    
      <Routes> 
        {/* Default route → if logged in go to notes, else go to auth */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/notes" /> : <Navigate to="/auth" />} />
         {/* Auth Page (Login/Register combined) */}
        <Route path="/auth" element={<AuthPage />} />

        <Route path = "/notes" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/note/:id" element={<NoteDetailPage />} /> 

      </Routes>

    </div>
  )
}

export default App
