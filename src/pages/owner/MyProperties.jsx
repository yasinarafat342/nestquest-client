import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../api/axios.js";
import EditPropertyModal from "../../components/property/EditPropertyModal.jsx";

export default function MyProperties() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [editProperty, setEditProperty] = useState(null);
  const [viewFeedback, setViewFeedback] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["owner-properties", page],
    queryFn: () => api.get(`/properties/owner/my-properties?page=${page}&limit=10`).then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/properties/${id}`),
    onSuccess: () => { toast.success("Property deleted"); queryClient.invalidateQueries(["owner-properties"]); },
    onError: () => toast.error("Delete failed"),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-dark-900">My Properties</h1>
        <button onClick={() => window.location.href = "/owner/add-property"} className="btn-primary py-2 px-4 text-sm">
          + Add Property
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="loader" /></div>
      ) : data?.properties?.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-4xl mb-3">🏠</p>
          <p className="text-gray-500">No properties yet. Add your first property!</p>
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Title", "Location", "Rent", "Type", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left px-5 py-4 font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data?.properties?.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 font-medium text-dark-900 max-w-xs truncate">{p.title}</td>
                      <td className="px-5 py-4 text-gray-500">{p.location}</td>
                      <td className="px-5 py-4 font-semibold text-primary-600">৳{p.rent?.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <span className="bg-primary-50 text-primary-700 text-xs px-2.5 py-1 rounded-full">{p.propertyType}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`badge-${p.status} capitalize`}>{p.status}</span>
                          {p.status === "rejected" && (
                            <button onClick={() => setViewFeedback(p)}
                              title="View rejection feedback"
                              className="p-1 rounded text-gray-400 hover:text-primary-600 transition-colors">
                              <FiEye size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setEditProperty(p)}
                            className="p-2 rounded-lg text-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            <FiEdit2 size={15} />
                          </button>
                          <button onClick={() => { if (window.confirm("Delete this property?")) deleteMutation.mutate(p._id); }}
                            className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                            <FiTrash2 size={15} />
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

      {editProperty && <EditPropertyModal property={editProperty} onClose={() => setEditProperty(null)} />}

      {/* Rejection Feedback Modal */}
      {viewFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-display font-bold text-dark-900 mb-3">Rejection Feedback</h2>
            <p className="text-sm font-medium text-gray-700 mb-2">{viewFeedback.title}</p>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <p className="text-red-700 text-sm">{viewFeedback.rejectionFeedback || "No feedback provided."}</p>
            </div>
            <button onClick={() => setViewFeedback(null)} className="btn-primary w-full mt-5">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
