import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FiMapPin, FiMaximize, FiHeart, FiStar } from "react-icons/fi";
import { MdBed, MdBathtub } from "react-icons/md";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import BookingModal from "../components/booking/BookingModal.jsx";
import ReviewSection from "../components/review/ReviewSection.jsx";
import Loader from "../components/common/Loader.jsx";

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showBooking, setShowBooking] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: () => api.get(`/properties/${id}`).then((r) => r.data),
  });

  const favMutation = useMutation({
    mutationFn: () => api.post(`/users/favorites/${id}`),
    onSuccess: () => toast.success("Added to favorites!"),
    onError: (err) => toast.error(err.response?.data?.message || "Already in favorites"),
  });

  if (isLoading) return <Loader />;
  if (!property) return <div className="text-center py-20">Property not found</div>;

  const images = property.images?.length ? property.images : ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Images + Details */}
        <div className="lg:col-span-2">
          {/* Main Image */}
          <div className="rounded-2xl overflow-hidden h-80 md:h-96 mb-3">
            <img src={images[activeImg]} alt={property.title} className="w-full h-full object-cover" />
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <img key={i} src={img} alt="" onClick={() => setActiveImg(i)}
                  className={`w-20 h-14 object-cover rounded-lg cursor-pointer shrink-0 border-2 transition-colors ${i === activeImg ? "border-primary-600" : "border-transparent"}`} />
              ))}
            </div>
          )}

          {/* Info */}
          <h1 className="text-3xl font-display font-bold text-dark-900 mb-2">{property.title}</h1>
          <p className="flex items-center gap-1 text-gray-500 mb-4"><FiMapPin className="text-primary-500" /> {property.location}</p>

          <div className="flex flex-wrap gap-5 text-gray-600 mb-6">
            <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg"><MdBed /> {property.bedrooms} Bedrooms</span>
            <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg"><MdBathtub /> {property.bathrooms} Bathrooms</span>
            {property.propertySize && <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg"><FiMaximize /> {property.propertySize}</span>}
            <span className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg font-semibold">{property.propertyType}</span>
          </div>

          <h2 className="text-xl font-display font-bold text-dark-900 mb-3">Description</h2>
          <p className="text-gray-600 leading-relaxed mb-8">{property.description}</p>

          {property.amenities?.length > 0 && (
            <>
              <h2 className="text-xl font-display font-bold text-dark-900 mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2 mb-8">
                {property.amenities.map((a, i) => (
                  <span key={i} className="bg-primary-50 text-primary-700 text-sm px-3 py-1.5 rounded-full">{a}</span>
                ))}
              </div>
            </>
          )}

          {/* Reviews */}
          <ReviewSection propertyId={id} />
        </div>

        {/* Right: Booking Card */}
        <div>
          <div className="card p-6 sticky top-24">
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-3xl font-display font-bold text-dark-900">৳{property.rent?.toLocaleString()}</p>
                <p className="text-gray-500 text-sm">per {property.rentType}</p>
              </div>
              <span className="badge-approved capitalize">{property.status}</span>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-5">
              <p className="text-sm text-gray-600 mb-1"><span className="font-semibold">Owner:</span> {property.ownerName}</p>
              <p className="text-sm text-gray-600"><span className="font-semibold">Email:</span> {property.ownerEmail}</p>
            </div>

            {user?.role === "tenant" && (
              <>
                <button onClick={() => setShowBooking(true)} className="btn-primary w-full mb-3">
                  Book Property
                </button>
                <button onClick={() => favMutation.mutate()} className="btn-outline w-full flex items-center justify-center gap-2">
                  <FiHeart /> Add to Favorites
                </button>
              </>
            )}
            {!user && (
              <button onClick={() => navigate("/login")} className="btn-primary w-full">
                Login to Book
              </button>
            )}
          </div>
        </div>
      </div>

      {showBooking && (
        <BookingModal property={property} onClose={() => setShowBooking(false)} />
      )}
    </div>
  );
}