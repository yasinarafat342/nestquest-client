import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext.jsx";
import { FiUser, FiMail, FiImage, FiEdit2 } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../api/axios.js";

export default function TenantProfile() {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", photo: user?.photo || "" });

  const mutation = useMutation({
    mutationFn: (data) => api.put("/users/profile", data).then((r) => r.data),
    onSuccess: (updated) => {
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      toast.success("Profile updated!");
      setEditing(false);
    },
    onError: () => toast.error("Update failed"),
  });

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-display font-bold text-dark-900 mb-6">My Profile</h1>
      <div className="card p-8">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <img src={form.photo || `https://ui-avatars.com/api/?name=${user?.name}&size=100`}
            alt={user?.name} className="w-24 h-24 rounded-full object-cover border-4 border-primary-100 mb-3" />
          <p className="font-display font-bold text-xl text-dark-900">{user?.name}</p>
          <span className="badge-approved capitalize mt-1">{user?.role}</span>
        </div>

        {!editing ? (
          <>
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <FiUser className="text-primary-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Full Name</p>
                  <p className="font-medium text-dark-900">{user?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <FiMail className="text-primary-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Email Address</p>
                  <p className="font-medium text-dark-900">{user?.email}</p>
                </div>
              </div>
            </div>
            <button onClick={() => setEditing(true)} className="btn-primary w-full flex items-center justify-center gap-2">
              <FiEdit2 /> Edit Profile
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                <input type="text" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field pl-9" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Photo URL</label>
              <div className="relative">
                <FiImage className="absolute left-3 top-3.5 text-gray-400" />
                <input type="url" value={form.photo}
                  onChange={(e) => setForm({ ...form, photo: e.target.value })}
                  className="input-field pl-9" placeholder="https://..." />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditing(false)} className="btn-outline flex-1">Cancel</button>
              <button onClick={() => mutation.mutate(form)} disabled={mutation.isPending} className="btn-primary flex-1 disabled:opacity-60">
                {mutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
