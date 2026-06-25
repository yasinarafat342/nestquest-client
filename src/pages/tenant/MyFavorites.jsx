import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiMapPin } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../api/axios.js";

export default function MyFavorites() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => api.get("/users/favorites").then((r) => r.data),
  });

  const removeMutation = useMutation({
    mutationFn: (propertyId) => api.delete(`/users/favorites/${propertyId}`),
    onSuccess: () => {
      toast.success("Removed from favorites");
      queryClient.invalidateQueries(["favorites"]);
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-dark-900 mb-6">My Favorites</h1>
      {isLoading ? (
        <div className="flex justify-center py-20"><div className="loader" /></div>
      ) : favorites.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-4xl mb-3">❤️</p>
          <p className="text-gray-500">No favorites yet. Browse properties and save the ones you like!</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Image", "Property Name", "Location", "Rent", "Type", "Action"].map((h) => (
                    <th key={h} className="text-left px-5 py-4 font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {favorites.map((fav) => {
                  const p = fav.property;
                  if (!p) return null;
                  return (
                    <tr key={fav._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <img src={p.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100"}
                          alt={p.title} className="w-14 h-10 object-cover rounded-lg" />
                      </td>
                      <td className="px-5 py-4">
                        <button onClick={() => navigate(`/properties/${p._id}`)}
                          className="font-medium text-dark-900 hover:text-primary-600 transition-colors text-left">
                          {p.title}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-gray-500 flex items-center gap-1">
                        <FiMapPin size={12} /> {p.location}
                      </td>
                      <td className="px-5 py-4 font-semibold text-primary-600">৳{p.rent?.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <span className="bg-primary-50 text-primary-700 text-xs px-2.5 py-1 rounded-full">{p.propertyType}</span>
                      </td>
                      <td className="px-5 py-4">
                        <button onClick={() => removeMutation.mutate(p._id)}
                          className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
