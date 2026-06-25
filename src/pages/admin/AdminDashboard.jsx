import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FiUsers, FiHome, FiBookOpen, FiCreditCard, FiLogOut, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";

const links = [
  { to: "/admin/users", icon: FiUsers, label: "All Users" },
  { to: "/admin/properties", icon: FiHome, label: "All Properties" },
  { to: "/admin/bookings", icon: FiBookOpen, label: "All Bookings" },
  { to: "/admin/transactions", icon: FiCreditCard, label: "Transactions" },
  { to: "/admin/profile", icon: FiUser, label: "Profile" },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); toast.success("Logged out!"); navigate("/"); };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-dark-900 text-white flex-col shrink-0 hidden md:flex">
        <div className="p-6 border-b border-white/10">
          <NavLink to="/" className="flex items-center gap-2 font-display font-bold text-lg">
            <FiHome className="text-yellow-400" /> Nest<span className="text-yellow-400">Quest</span>
          </NavLink>
          <p className="text-gray-400 text-xs mt-1">Admin Panel</p>
        </div>
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img
              src={user?.photo || `https://ui-avatars.com/api/?name=${user?.name}&background=eab308&color=000`}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400"
            />
            <div>
              <p className="font-semibold text-sm truncate max-w-[120px]">{user?.name}</p>
              <p className="text-yellow-400 text-xs">Administrator</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? "bg-yellow-500 text-dark-900 font-semibold" : "text-gray-400 hover:bg-white/10 hover:text-white"
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

      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden bg-dark-900 text-white px-4 py-3 flex items-center justify-between">
          <span className="font-display font-bold">Admin Panel</span>
          <div className="flex gap-1">
            {links.map(({ to, icon: Icon }) => (
              <NavLink key={to} to={to} className={({ isActive }) =>
                `p-2 rounded-lg ${isActive ? "bg-yellow-500 text-dark-900" : "text-gray-400"}`}>
                <Icon size={16} />
              </NavLink>
            ))}
          </div>
        </div>
        <main className="flex-1 p-6 overflow-auto"><Outlet /></main>
      </div>
    </div>
  );
}
