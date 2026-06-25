import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../api/axios.js";

const PROPERTY_TYPES = ["Apartment", "House", "Villa", "Studio", "Office", "Shop"];
const RENT_TYPES = ["Monthly", "Weekly", "Daily"];

export default function EditPropertyModal({ property, onClose }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: property.title || "",
    description: property.description || "",
    location: property.location || "",
    propertyType: property.propertyType || "Apartment",
    rent: property.rent || "",
    rentType: property.rentType || "Monthly",
    bedrooms: property.bedrooms || "",
    bathrooms: property.bathrooms || "",
    propertySize: property.propertySize || "",
    extraFeatures: property.extraFeatures || "",
  });

  const mutation = useMutation({
    mutationFn: (data) => api.put(`/properties/${property._id}`, data),
    onSuccess: () => {
      toast.success("Property updated!");
      queryClient.invalidateQueries(["owner-properties"]);
      onClose();
    },
    onError: () => toast.error("Update failed"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ ...form, rent: Number(form.rent), bedrooms: Number(form.bedrooms), bathrooms: Number(form.bathrooms) });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-display font-bold text-dark-900">Edit Property</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FiX size={22} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
              <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
              <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Property Type</label>
              <select value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })} className="input-field">
                {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Rent (৳)</label>
              <input type="number" value={form.rent} onChange={(e) => setForm({ ...form, rent: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Rent Type</label>
              <select value={form.rentType} onChange={(e) => setForm({ ...form, rentType: e.target.value })} className="input-field">
                {RENT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bedrooms</label>
              <input type="number" min="0" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bathrooms</label>
              <input type="number" min="0" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} className="input-field" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="btn-primary flex-1 disabled:opacity-60">
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
