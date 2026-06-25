import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiCheck, FiX, FiTrash2, FiEdit2 } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../api/axios.js";

const PROPERTY_TYPES = ["Apartment", "House", "Villa", "Studio", "Office", "Shop"];
const RENT_TYPES = ["Monthly", "Weekly", "Daily"];

export default function AdminProperties() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [rejectModal, setRejectModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [editForm, setEditForm] = useState({});

  const { data, isLoading } = useQuery({
    queryKey: ["admin-properties", page],
    queryFn: () => api.get(`/admin/properties?page=${page}&limit=10`).then((r) => r.data),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status, rejectionFeedback }) =>
      api.patch(`/admin/properties/${id}/status`, { status, rejectionFeedback }),
    onSuccess: (_, vars) => {
      toast.success(`Property ${vars.status}!`);
      queryClient.invalidateQueries(["admin-properties"]);
      setRejectModal(null); setFeedback("");
    },
    onError: () => toast.error("Action failed"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin/properties/${id}`, data),
    onSuccess: () => {
      toast.success("Property updated!");
      queryClient.invalidateQueries(["admin-properties"]);
      setEditModal(null);
    },
    onError: () => toast.error("Update failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/properties/${id}`),
    onSuccess: () => { toast.success("Property deleted!"); queryClient.invalidateQueries(["admin-properties"]); },
  });

  const openEdit = (p) => {
    setEditModal(p);
    setEditForm({ title: p.title, description: p.description, location: p.location, propertyType: p.propertyType, rent: p.rent, rentType: p.rentType, bedrooms: p.bedrooms, bathrooms: p.bathrooms });
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-dark-900 mb-6">All Properties</h1>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="loader" /></div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Title", "Owner", "Location", "Rent", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left px-5 py-4 font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data?.properties?.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 font-medium text-dark-900 max-w-xs truncate">{p.title}</td>
                      <td className="px-5 py-4">
                        <p className="text-gray-700">{p.ownerName}</p>
                        <p className="text-xs text-gray-400">{p.ownerEmail}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-500">{p.location}</td>
                      <td className="px-5 py-4 font-semibold text-primary-600">৳{p.rent?.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <span className={`badge-${p.status} capitalize`}>{p.status}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          {p.status !== "approved" && (
                            <button onClick={() => statusMutation.mutate({ id: p._id, status: "approved" })}
                              className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Approve">
                              <FiCheck size={14} />
                            </button>
                          )}
                          {p.status !== "rejected" && (
                            <button onClick={() => setRejectModal(p)}
                              className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Reject">
                              <FiX size={14} />
                            </button>
                          )}
                          <button onClick={() => openEdit(p)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors" title="Update">
                            <FiEdit2 size={14} />
                          </button>
                          <button onClick={() => { if (window.confirm("Delete this property?")) deleteMutation.mutate(p._id); }}
                            className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors" title="Delete">
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {data?.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline py-2 px-4 disabled:opacity-40">Previous</button>
              <span className="flex items-center px-4 text-gray-600 font-medium">Page {page} of {data.totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))} disabled={page === data.totalPages} className="btn-outline py-2 px-4 disabled:opacity-40">Next</button>
            </div>
          )}
        </>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-display font-bold text-dark-900 mb-2">Reject Property</h2>
            <p className="text-gray-500 text-sm mb-4">"{rejectModal.title}"</p>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Rejection Feedback *</label>
            <textarea rows={4} value={feedback} onChange={(e) => setFeedback(e.target.value)}
              placeholder="Explain why this property is being rejected..."
              className="input-field resize-none mb-4" />
            <div className="flex gap-3">
              <button onClick={() => { setRejectModal(null); setFeedback(""); }} className="btn-outline flex-1">Cancel</button>
              <button onClick={() => {
                if (!feedback.trim()) return toast.error("Please provide feedback");
                statusMutation.mutate({ id: rejectModal._id, status: "rejected", rejectionFeedback: feedback });
              }} disabled={statusMutation.isPending} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-all disabled:opacity-60">
                {statusMutation.isPending ? "Rejecting..." : "Reject Property"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl my-4">
            <h2 className="text-xl font-display font-bold text-dark-900 mb-4">Update Property</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                <select value={editForm.propertyType} onChange={(e) => setEditForm({ ...editForm, propertyType: e.target.value })} className="input-field">
                  {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rent (৳)</label>
                <input type="number" value={editForm.rent} onChange={(e) => setEditForm({ ...editForm, rent: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rent Type</label>
                <select value={editForm.rentType} onChange={(e) => setEditForm({ ...editForm, rentType: e.target.value })} className="input-field">
                  {RENT_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input type="text" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <input type="number" value={editForm.bedrooms} onChange={(e) => setEditForm({ ...editForm, bedrooms: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <input type="number" value={editForm.bathrooms} onChange={(e) => setEditForm({ ...editForm, bathrooms: e.target.value })} className="input-field" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditModal(null)} className="btn-outline flex-1">Cancel</button>
              <button onClick={() => updateMutation.mutate({ id: editModal._id, data: { ...editForm, rent: Number(editForm.rent) } })}
                disabled={updateMutation.isPending} className="btn-primary flex-1 disabled:opacity-60">
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
