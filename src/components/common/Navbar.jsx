import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { HiMenu, HiX } from "react-icons/hi";
import { FiHome, FiSun, FiMoon } from "react-icons/fi";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out!");
    navigate("/");
  };

  const getDashboardLink = () => {
    if (user?.role === "admin") return "/admin";
    if (user?.role === "owner") return "/owner";
    return "/dashboard";
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-primary-600 dark:text-primary-400 font-semibold"
      : "text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors";

  return (
    <nav className="bg-white/95 dark:bg-dark-900/95 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-gray-100 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl text-dark-900 dark:text-white">
            <FiHome className="text-primary-600 dark:text-primary-400 text-2xl" />
            <span>Nest<span className="text-primary-600 dark:text-primary-400">Quest</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/properties" className={navLinkClass}>All Properties</NavLink>
            {user && (
              <NavLink to={getDashboardLink()} className={navLinkClass}>Dashboard</NavLink>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="p-2.5 rounded-xl text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to={getDashboardLink()} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <img
                    src={user.photo || `https://ui-avatars.com/api/?name=${user.name}`}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-primary-200 dark:border-primary-400/40"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{user.name.split(" ")[0]}</span>
                </Link>
                <button onClick={handleLogout} className="btn-outline text-sm py-2 px-4">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-outline text-sm py-2 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Register</Link>
              </>
            )}
          </div>

          {/* Mobile: Theme Toggle + Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="p-2 rounded-xl text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              {theme === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
            </button>
            <button className="text-gray-600 dark:text-gray-300" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 dark:border-white/10 space-y-3">
            <NavLink to="/" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400" onClick={() => setMenuOpen(false)}>Home</NavLink>
            <NavLink to="/properties" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400" onClick={() => setMenuOpen(false)}>All Properties</NavLink>
            {user && (
              <NavLink to={getDashboardLink()} className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400" onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
            )}
            {user ? (
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-red-600">Logout</button>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2 text-gray-700 dark:text-gray-300" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block px-4 py-2 text-primary-600 dark:text-primary-400 font-semibold" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}