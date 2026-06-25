import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios.js";

export default function AdminTransactions() {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["admin-transactions"],
    queryFn: () => api.get("/admin/transactions").then((r) => r.data),
  });

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-dark-900 mb-6">Transactions</h1>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="loader" /></div>
      ) : transactions.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-4xl mb-3">💳</p>
          <p className="text-gray-500">No transactions yet.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Transaction ID", "Property", "Tenant", "Owner", "Amount", "Date"].map((h) => (
                    <th key={h} className="text-left px-5 py-4 font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {t.transactionId ? t.transactionId.slice(0, 20) + "..." : "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-dark-900 max-w-xs truncate">{t.propertyTitle}</td>
                    <td className="px-5 py-4 text-gray-600">{t.tenantName}</td>
                    <td className="px-5 py-4 text-gray-600">{t.ownerName}</td>
                    <td className="px-5 py-4 font-bold text-green-600">৳{t.amount?.toLocaleString()}</td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{new Date(t.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Total */}
          <div className="bg-gray-50 border-t border-gray-100 px-5 py-4 flex justify-end">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Transactions</p>
              <p className="text-xl font-display font-bold text-green-600">
                ৳{transactions.reduce((s, t) => s + (t.amount || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
