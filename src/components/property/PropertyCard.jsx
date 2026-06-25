import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMapPin, FiMaximize } from "react-icons/fi";
import { MdBed, MdBathtub } from "react-icons/md";
import { useAuth } from "../../context/AuthContext.jsx";

export default function PropertyCard({ property, index = 0 }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleViewDetails = () => {
    if (!user) navigate("/login");
    else navigate(`/properties/${property._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="card overflow-hidden group flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={property.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600"}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {property.propertyType}
        </span>
        <span className="absolute top-3 right-3 bg-white/90 text-dark-900 text-xs font-bold px-3 py-1 rounded-full">
          ৳{property.rent?.toLocaleString()}/{property.rentType}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-bold text-dark-900 text-lg mb-1 line-clamp-1">
          {property.title}
        </h3>
        <p className="flex items-center gap-1 text-gray-500 text-sm mb-4">
          <FiMapPin className="text-primary-500 shrink-0" />
          {property.location}
        </p>

        <div className="flex items-center gap-4 text-gray-500 text-sm mb-5">
          <span className="flex items-center gap-1"><MdBed /> {property.bedrooms} Beds</span>
          <span className="flex items-center gap-1"><MdBathtub /> {property.bathrooms} Baths</span>
          {property.propertySize && (
            <span className="flex items-center gap-1"><FiMaximize /> {property.propertySize}</span>
          )}
        </div>

        <div className="mt-auto">
          <button onClick={handleViewDetails} className="btn-primary w-full text-sm">
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}