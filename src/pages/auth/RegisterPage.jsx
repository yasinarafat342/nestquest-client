import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { FiUser, FiMail, FiLock, FiImage, FiHome } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", photo: "", role: "tenant" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      const data = await register(form);
      toast.success("Account created!");
      if (data.user.role === "owner") navigate("/owner");
      else navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await googleLogin();
      toast.success("Welcome!");
      navigate("/dashboard");
    } catch {
      toast.error("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-dark-900 to-primary-900 flex-col justify-center items-center p-16 text-white">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-3xl mb-12">
          <FiHome className="text-primary-400" /> Nest<span className="text-primary-400">Quest</span>
        </Link>
        <h2 className="text-4xl font-display font-bold mb-4 leading-tight">Join as Tenant or Owner</h2>
        <p className="text-primary-200 text-lg text-center max-w-sm">
          Create your free account and start your rental journey today.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-sm">
          {[
            { icon: "🏠", title: "As Tenant", desc: "Discover and book properties" },
            { icon: "🔑", title: "As Owner", desc: "List and manage properties" },
          ].map((r) => (
            <div key={r.title} className="bg-white/10 rounded-xl p-4 border border-white/20">
              <p className="text-2xl mb-2">{r.icon}</p>
              <p className="font-semibold">{r.title}</p>
              <p className="text-primary-200 text-xs">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="card p-8">
            <h1 className="text-2xl font-display font-bold text-dark-900 mb-1">Create account</h1>
            <p className="text-gray-500 mb-6">Start your NestQuest journey today</p>

            <button onClick={handleGoogle} className="w-full border border-gray-200 rounded-lg py-3 flex items-center justify-center gap-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors mb-5">
              <FcGoogle size={20} /> Continue with Google
            </button>

            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center"><span className="bg-white px-4 text-sm text-gray-400">or register with email</span></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                  <input type="text" required placeholder="John Doe"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field pl-9" />
                </div>
              </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Photo URL (optional)</label>
                <div className="relative">
                  <FiImage className="absolute left-3 top-3.5 text-gray-400" />
                  <input type="url" placeholder="https://your-photo-url.com"
                    value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })}
                    className="input-field pl-9" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                  <input type="password" required placeholder="Min 6 characters"
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input-field pl-9" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Register as</label>
                <div className="grid grid-cols-2 gap-3">
                  {["tenant", "owner"].map((role) => (
                    <button key={role} type="button"
                      onClick={() => setForm({ ...form, role })}
                      className={`py-2.5 rounded-lg border-2 font-semibold capitalize transition-colors ${
                        form.role === role ? "border-primary-600 bg-primary-50 text-primary-600" : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}>
                      {role}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
