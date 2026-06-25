import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios.js";

export default function AdminBookings() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-bookings", page],
    queryFn: () => api.get(`/admin/bookings?page=${page}&limit=10`).then((r) => r.data),
  });

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-dark-900 mb-6">All Bookings</h1>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="loader" /></div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Property", "Tenant", "Owner", "Amount", "Booking Status", "Payment", "Date"].map((h) => (
                      <th key={h} className="text-left px-5 py-4 font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data?.bookings?.map((b) => (
                    <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 font-medium text-dark-900 max-w-xs truncate">{b.propertyTitle}</td>
                      <td className="px-5 py-4">
                        <p className="text-gray-700">{b.tenantName}</p>
                        <p className="text-xs text-gray-400">{b.tenantEmail}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-600">{b.ownerName}</td>
                      <td className="px-5 py-4 font-semibold text-primary-600">৳{b.amount?.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <span className={`badge-${b.bookingStatus} capitalize`}>{b.bookingStatus}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          b.paymentStatus === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}>{b.paymentStatus}</span>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-xs">{new Date(b.createdAt).toLocaleDateString()}</td>
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
