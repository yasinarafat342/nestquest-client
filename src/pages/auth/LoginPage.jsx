import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { FiMail, FiLock, FiHome } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success("Welcome back!");
      if (data.user.role === "admin") navigate("/admin");
      else if (data.user.role === "owner") navigate("/owner");
      else navigate(from);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      const data = await googleLogin();
      toast.success("Welcome!");
      navigate(from);
    } catch (err) {
      toast.error("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 to-dark-900 flex-col justify-center items-center p-16 text-white">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-3xl mb-12">
          <FiHome className="text-primary-400" /> Nest<span className="text-primary-400">Quest</span>
        </Link>
        <h2 className="text-4xl font-display font-bold mb-4 leading-tight">Find Your Perfect Rental Home</h2>
        <p className="text-primary-200 text-lg text-center max-w-sm">
          Join thousands of tenants and property owners on Bangladesh's most trusted rental platform.
        </p>
        <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600" alt="home" className="mt-12 rounded-2xl shadow-2xl w-full max-w-sm object-cover h-52" />
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="card p-8">
            <h1 className="text-2xl font-display font-bold text-dark-900 mb-1">Welcome back</h1>
            <p className="text-gray-500 mb-8">Sign in to your NestQuest account</p>

            <button onClick={handleGoogle} className="w-full border border-gray-200 rounded-lg py-3 flex items-center justify-center gap-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors mb-6">
              <FcGoogle size={20} /> Continue with Google
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center"><span className="bg-white px-4 text-sm text-gray-400">or sign in with email</span></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                  <input type="email" required placeholder="you@example.com"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field pl-9" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                  <input type="password" required placeholder="••••••••"
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input-field pl-9" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary-600 font-semibold hover:underline">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
