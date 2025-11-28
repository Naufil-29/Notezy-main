import React from "react"
import { PlusIcon, Sun, Moon } from "lucide-react"
import { Link } from "react-router"
import { Button } from "../components/ui/button"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const Navbar = ({showNewNote = false}) => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/api/auth"
  }

  if (!mounted) return null // avoid hydration mismatch

  return (
    <header className="fixed top-0 bg-white/30 z-50 backdrop-blur-md h-30 w-screen rouded-lg shadow-lg">
      <div className="mx-auto max-w-6xl p-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Notezy</h1>
          <div className="flex items-center gap-5">
          {showNewNote && ( 
            <Button asChild>
              <Link to="/create" className="flex items-center gap-2">
                <PlusIcon className="size-5" />
                <span>New Note</span>
              </Link>
            </Button>
            )}

            <Button
            className=""
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              variant="outline"
              size="icon"
            >
              {theme === "light" ? (
                <Sun className="w-5 h-5 " />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>



      
    </header>
  )
}

export default Navbar
