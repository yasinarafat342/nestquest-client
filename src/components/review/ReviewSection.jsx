import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiStar } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../api/axios.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ReviewSection({ propertyId }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ rating: 5, comment: "" });

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", propertyId],
    queryFn: () => api.get(`/reviews/${propertyId}`).then((r) => r.data),
  });

  const mutation = useMutation({
    mutationFn: (data) => api.post("/reviews", { propertyId, ...data }),
    onSuccess: () => {
      toast.success("Review submitted!");
      setForm({ rating: 5, comment: "" });
      queryClient.invalidateQueries(["reviews", propertyId]);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed"),
  });

  return (
    <div className="mt-10">
      <h2 className="text-xl font-display font-bold text-dark-900 mb-6">Reviews ({reviews.length})</h2>

      {/* Submit Review */}
      {user?.role === "tenant" && (
        <div className="card p-5 mb-7">
          <h3 className="font-semibold text-dark-900 mb-4">Leave a Review</h3>
          {/* Star Rating */}
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} type="button" onClick={() => setForm({ ...form, rating: s })}>
                <FiStar className={`text-2xl ${s <= form.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
              </button>
            ))}
          </div>
          <textarea rows={3} placeholder="Share your experience..."
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            className="input-field resize-none mb-3" />
          <button onClick={() => mutation.mutate(form)} disabled={!form.comment || mutation.isPending} className="btn-primary py-2 px-5 disabled:opacity-60">
            {mutation.isPending ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="card p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                  {r.tenantName?.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-dark-900">{r.tenantName}</p>
                    <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{r.tenantEmail}</p>
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar key={i} className={`text-sm ${i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">{r.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
