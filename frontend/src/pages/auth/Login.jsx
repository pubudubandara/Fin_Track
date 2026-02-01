import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [formdata, setFormdata] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loadingToast = toast.loading("Signing in...");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });

      if (response.ok) {
        const data = await response.json();
        
        localStorage.setItem("token", data.token);
        
        toast.success("Login successful! Redirecting...", {
          id: loadingToast,
        });
        
        setTimeout(() => navigate('/dashboard'), 500);
      } else {
        toast.error("Invalid email or password. Please try again.", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Unable to connect to server. Please try again later.", {
        id: loadingToast,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-neutral-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-800">Welcome Back</h2>
          <p className="text-neutral-500 text-sm mt-2">
            Please sign in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
            <input
              type="email"
              name="email"
              required
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              onChange={handleChange}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.02]"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-neutral-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;