import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../api/axios.js";

const ROLES = ["tenant", "owner", "admin"];

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", page],
    queryFn: () => api.get(`/admin/users?page=${page}&limit=10`).then((r) => r.data),
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => api.patch(`/admin/users/${id}/role`, { role }),
    onSuccess: () => { toast.success("Role updated!"); queryClient.invalidateQueries(["admin-users"]); },
    onError: () => toast.error("Failed to update role"),
  });

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-dark-900 mb-6">All Users</h1>
      {isLoading ? (
        <div className="flex justify-center py-20"><div className="loader" /></div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Photo", "Name", "Email", "Role", "Change Role"].map((h) => (
                      <th key={h} className="text-left px-5 py-4 font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data?.users?.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <img src={u.photo || `https://ui-avatars.com/api/?name=${u.name}&size=40`}
                          alt={u.name} className="w-9 h-9 rounded-full object-cover" />
                      </td>
                      <td className="px-5 py-4 font-medium text-dark-900">{u.name}</td>
                      <td className="px-5 py-4 text-gray-500">{u.email}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                          u.role === "admin" ? "bg-yellow-100 text-yellow-800" :
                          u.role === "owner" ? "bg-blue-100 text-blue-800" :
                          "bg-green-100 text-green-800"
                        }`}>{u.role}</span>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={u.role}
                          onChange={(e) => roleMutation.mutate({ id: u._id, role: e.target.value })}
                          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500">
                          {ROLES.map((r) => <option key={r} value={r} className="capitalize">{r}</option>)}
                        </select>
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
    </div>
  );
}
