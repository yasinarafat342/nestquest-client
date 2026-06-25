import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext.jsx";

export default function BookingModal({ property, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ moveInDate: "", contactNumber: "", additionalNotes: "" });

  const handleConfirm = (e) => {
    e.preventDefault();
    const bookingData = encodeURIComponent(JSON.stringify({
      propertyId: property._id,
      propertyTitle: property.title,
      amount: property.rent,
      ...form,
    }));
    onClose();
    navigate(`/payment/${bookingData}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-display font-bold text-dark-900">Book Property</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FiX size={22} />
          </button>
        </div>

        <form onSubmit={handleConfirm} className="p-6 space-y-4">
          {/* User Info (read-only) */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <p className="text-sm font-medium text-gray-700">Your Information</p>
            <p className="text-sm text-gray-600">Name: <span className="font-semibold">{user?.name}</span></p>
            <p className="text-sm text-gray-600">Email: <span className="font-semibold">{user?.email}</span></p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Move-in Date *</label>
            <input type="date" required
              min={new Date().toISOString().split("T")[0]}
              value={form.moveInDate}
              onChange={(e) => setForm({ ...form, moveInDate: e.target.value })}
              className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Number *</label>
            <input type="tel" required placeholder="+880 1XXXXXXXXX"
              value={form.contactNumber}
              onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
              className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Notes</label>
            <textarea rows={3} placeholder="Any special requirements..."
              value={form.additionalNotes}
              onChange={(e) => setForm({ ...form, additionalNotes: e.target.value })}
              className="input-field resize-none" />
          </div>

          <div className="bg-primary-50 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Amount to Pay</span>
              <span className="text-2xl font-display font-bold text-primary-600">৳{property.rent?.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">per {property.rentType} • Secure payment via Stripe</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Proceed to Payment</button>
          </div>
        </form>
      </div>
    </div>
  );
}
