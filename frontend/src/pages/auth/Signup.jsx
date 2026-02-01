import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup = () => {
  const navigate = useNavigate();
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  console.log("API_BASE_URL:", API_BASE_URL);

  const [formData, setFormData] = useState({
    username: '', 
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const loadingToast = toast.loading("Creating your account...");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token){
          localStorage.setItem("token", data.token);
        }
        toast.success("Registration successful! Redirecting to login...", {
          id: loadingToast,
        });
        setTimeout(() => navigate('/login'), 1000);
      } else {
        toast.error("Registration failed. Please try again.", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Unable to connect to server. Please check your connection.", {
        id: loadingToast,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-neutral-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-800">Create Account</h2>
          <p className="text-neutral-500 text-sm mt-2">Join us today!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
            <input
              type="text"
              name="username" 
              required
              placeholder="Full Name"
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              onChange={handleChange}
            />
          </div>

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

          <button
            type="submit"
            className="w-full flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.02]"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-neutral-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;