import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiCheck, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../api/axios.js";

export default function BookingRequests() {
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["owner-booking-requests"],
    queryFn: () => api.get("/bookings/owner-requests").then((r) => r.data),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/bookings/${id}/status`, { status }),
    onSuccess: (_, vars) => {
      toast.success(`Booking ${vars.status}!`);
      queryClient.invalidateQueries(["owner-booking-requests"]);
    },
    onError: () => toast.error("Action failed"),
  });

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-dark-900 mb-6">Booking Requests</h1>
      {isLoading ? (
        <div className="flex justify-center py-20"><div className="loader" /></div>
      ) : bookings.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-gray-500">No booking requests yet.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Tenant", "Property", "Move-in Date", "Amount", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-4 font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-dark-900">{b.tenantName}</p>
                      <p className="text-xs text-gray-400">{b.tenantEmail}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-700 max-w-xs truncate">{b.propertyTitle}</td>
                    <td className="px-5 py-4 text-gray-500">{b.moveInDate ? new Date(b.moveInDate).toLocaleDateString() : "—"}</td>
                    <td className="px-5 py-4 font-semibold text-primary-600">৳{b.amount?.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`badge-${b.bookingStatus} capitalize`}>{b.bookingStatus}</span>
                    </td>
                    <td className="px-5 py-4">
                      {b.bookingStatus === "pending" ? (
                        <div className="flex gap-2">
                          <button onClick={() => statusMutation.mutate({ id: b._id, status: "approved" })}
                            className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Approve">
                            <FiCheck size={15} />
                          </button>
                          <button onClick={() => statusMutation.mutate({ id: b._id, status: "rejected" })}
                            className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Reject">
                            <FiX size={15} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic">No actions</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
