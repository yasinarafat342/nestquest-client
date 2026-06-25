import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FiBookOpen, FiHeart, FiUser, FiHome, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";

const links = [
  { to: "/dashboard/my-bookings", icon: FiBookOpen, label: "My Bookings" },
  { to: "/dashboard/favorites", icon: FiHeart, label: "Favorites" },
  { to: "/dashboard/profile", icon: FiUser, label: "Profile" },
];

export default function TenantDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out!");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-900 text-white flex flex-col shrink-0 hidden md:flex">
        <div className="p-6 border-b border-white/10">
          <NavLink to="/" className="flex items-center gap-2 font-display font-bold text-lg">
            <FiHome className="text-primary-400" /> Nest<span className="text-primary-400">Quest</span>
          </NavLink>
          <p className="text-gray-400 text-xs mt-1">Tenant Dashboard</p>
        </div>
        {/* User Info */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src={user?.photo || `https://ui-avatars.com/api/?name=${user?.name}`}
              alt={user?.name} className="w-10 h-10 rounded-full object-cover border-2 border-primary-500" />
            <div>
              <p className="font-semibold text-sm">{user?.name}</p>
              <p className="text-gray-400 text-xs capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? "bg-primary-600 text-white" : "text-gray-400 hover:bg-white/10 hover:text-white"
                }`}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors w-full">
            <FiLogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden bg-dark-900 text-white px-4 py-3 flex items-center justify-between">
          <NavLink to="/" className="font-display font-bold text-lg flex items-center gap-2">
            <FiHome className="text-primary-400" /> NestQuest
          </NavLink>
          <div className="flex gap-2">
            {links.map(({ to, icon: Icon }) => (
              <NavLink key={to} to={to} className={({ isActive }) =>
                `p-2 rounded-lg ${isActive ? "bg-primary-600" : "text-gray-400"}`}>
                <Icon size={18} />
              </NavLink>
            ))}
          </div>
        </div>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
