import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiX, FiUpload, FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../api/axios.js";

const AMENITIES_LIST = ["WiFi", "Parking", "AC", "Generator", "Lift", "Security", "CCTV", "Gas", "Water Supply", "Rooftop"];
const PROPERTY_TYPES = ["Apartment", "House", "Villa", "Studio", "Office", "Shop"];
const RENT_TYPES = ["Monthly", "Weekly", "Daily"];

async function uploadToImgBB(file) {
  const formData = new FormData();
  formData.append("image", file);
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!data.success) throw new Error("Image upload failed");
  return data.data.url;
}

export default function AddProperty() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", location: "", propertyType: "Apartment",
    rent: "", rentType: "Monthly", bedrooms: "", bathrooms: "",
    propertySize: "", amenities: [], images: [], extraFeatures: "",
  });

  const mutation = useMutation({
    mutationFn: (data) => api.post("/properties", data),
    onSuccess: () => {
      toast.success("Property submitted for review!");
      queryClient.invalidateQueries(["owner-properties"]);
      navigate("/owner/my-properties");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to add property"),
  });

  const toggleAmenity = (a) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a) ? prev.amenities.filter((x) => x !== a) : [...prev.amenities, a],
    }));
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadToImgBB));
      setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
      toast.success(`${urls.length} image(s) uploaded!`);
    } catch (err) {
      toast.error("Image upload failed. Try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (i) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, j) => j !== i) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.images.length === 0) return toast.error("Please upload at least one image");
    const payload = { ...form, rent: Number(form.rent), bedrooms: Number(form.bedrooms), bathrooms: Number(form.bathrooms) };
    mutation.mutate(payload);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-display font-bold text-dark-900 mb-6">Add New Property</h1>
      <form onSubmit={handleSubmit} className="card p-8 space-y-6">

        {/* Basic Info */}
        <div>
          <h2 className="text-lg font-semibold text-dark-900 mb-4 pb-2 border-b border-gray-100">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Property Title *</label>
              <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Modern 3BHK Apartment in Gulshan" className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
              <textarea rows={4} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe your property in detail..." className="input-field resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Location *</label>
              <input type="text" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Gulshan 2, Dhaka" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Property Type *</label>
              <select value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })} className="input-field">
                {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Property Size</label>
              <input type="text" value={form.propertySize} onChange={(e) => setForm({ ...form, propertySize: e.target.value })}
                placeholder="e.g. 1200 sqft" className="input-field" />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div>
          <h2 className="text-lg font-semibold text-dark-900 mb-4 pb-2 border-b border-gray-100">Pricing</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Rent Amount (৳) *</label>
              <input type="number" required min="0" value={form.rent} onChange={(e) => setForm({ ...form, rent: e.target.value })}
                placeholder="25000" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Rent Type *</label>
              <select value={form.rentType} onChange={(e) => setForm({ ...form, rentType: e.target.value })} className="input-field">
                {RENT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Rooms */}
        <div>
          <h2 className="text-lg font-semibold text-dark-900 mb-4 pb-2 border-b border-gray-100">Rooms</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bedrooms</label>
              <input type="number" min="0" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bathrooms</label>
              <input type="number" min="0" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                className="input-field" />
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h2 className="text-lg font-semibold text-dark-900 mb-4 pb-2 border-b border-gray-100">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {AMENITIES_LIST.map((a) => (
              <button key={a} type="button" onClick={() => toggleAmenity(a)}
                className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors ${
                  form.amenities.includes(a) ? "border-primary-600 bg-primary-600 text-white" : "border-gray-200 text-gray-600 hover:border-primary-300"
                }`}>{a}</button>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <h2 className="text-lg font-semibold text-dark-900 mb-4 pb-2 border-b border-gray-100">Property Images</h2>

          {/* Uploaded image previews */}
          {form.images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
              {form.images.map((img, i) => (
                <div key={i} className="relative group h-24 rounded-lg overflow-hidden border border-gray-200">
                  <img src={img} alt={`upload-${i}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiX size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload button */}
          <label className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-xl py-6 cursor-pointer transition-colors ${
            uploading ? "border-gray-200 bg-gray-50 cursor-not-allowed" : "border-primary-300 hover:border-primary-500 hover:bg-primary-50"
          }`}>
            {uploading ? (
              <span className="flex items-center gap-2 text-gray-400 text-sm">
                <FiLoader className="animate-spin" /> Uploading...
              </span>
            ) : (
              <span className="flex items-center gap-2 text-primary-600 text-sm font-medium">
                <FiUpload /> Click to upload images (you can select multiple)
              </span>
            )}
            <input type="file" accept="image/*" multiple onChange={handleFileUpload} disabled={uploading} className="hidden" />
          </label>
          <p className="text-xs text-gray-400 mt-2">Images are hosted via ImgBB. At least 1 image required.</p>
        </div>

        {/* Extra Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Extra Features</label>
          <textarea rows={2} value={form.extraFeatures} onChange={(e) => setForm({ ...form, extraFeatures: e.target.value })}
            placeholder="e.g. Corner unit, city view, newly renovated..." className="input-field resize-none" />
        </div>

        <div className="flex gap-4 pt-2">
          <button type="button" onClick={() => navigate("/owner/my-properties")} className="btn-outline flex-1">Cancel</button>
          <button type="submit" disabled={mutation.isPending || uploading} className="btn-primary flex-1 disabled:opacity-60">
            {mutation.isPending ? "Submitting..." : "Submit for Review"}
          </button>
        </div>
      </form>
    </div>
  );
}