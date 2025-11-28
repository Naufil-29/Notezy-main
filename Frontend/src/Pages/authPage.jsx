import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar.jsx";
import { useEffect, useState } from "react";
import { Card } from "../components/ui/card.tsx";
import { Button } from "../components/ui/button.tsx";
import { Input } from "../components/ui/input.tsx";
import api from "../lib/api.js";

const AuthPage = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false); // login/register toggle
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/auth", {
        ...formData,
        action: isRegister ? "register" : "login",
      });

      const data = res.data;

      if (res.status === 200 || res.status === 201) {
        if (isRegister) {
          // After successful registration, switch to login form
          setIsRegister(false);
          setFormData({ username: "", email: "", password: "" }); // reset form
          toast.success("Account created successfully! Please login.");
        } else {
          // Successful login
          localStorage.setItem("token", data.token);
          toast.success("Login successful!");
          navigate("/notes");
        }
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error. Try again later.");
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="bg-base-300 border-b border-base-content/10">
        <Navbar />
      </header>

      {/* Auth Card */}
      <div className="flex items-center justify-center min-h-screen bg-base-100">
        <Card className="w-1/3 bg-base-200 shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
            {isRegister ? "Register" : "Login"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <Input
                type="text"
                name="username"
                placeholder="Username"
                className="input input-bordered w-full bg-base-100"
                value={formData.username}
                onChange={handleChange}
                required
              />
            )}

            <Input
              type="email"
              name="email"
              placeholder="Email"
              className="input input-bordered bg-base-100 w-full "
              value={formData.email}
              onChange={handleChange}
              required
            />

            

            <Input
              type= {showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className=" input input-bordered bg-base-100 w-full "
              value={formData.password}
              onChange={handleChange}
              required
            />

               <Button 
               type="button"
                 className="w-full"
                 onClick={() => {setShowPassword(!showPassword)}}> 
                 {showPassword ? "🙈 Hide Password" : "👁️ Show Password"}
               </Button>

                <Button type="submit" className="w-full">
                  {isRegister ? "Register" : "Login"}
                </Button>

          </form>

          <p className="mt-4 text-center">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <Button
              type="button"
              className="btn btn-xs text-blue-500"
              onClick={() => {
                setIsRegister(!isRegister);
                setFormData({ username: "", email: "", password: "" }); // reset form
              }}
            >
              {isRegister ? "Login here" : "Register here"}
            </Button>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;

