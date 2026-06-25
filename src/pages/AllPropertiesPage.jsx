import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FiSearch, FiFilter } from "react-icons/fi";
import api from "../api/axios.js";
import PropertyCard from "../components/property/PropertyCard.jsx";
import Loader from "../components/common/Loader.jsx";

export default function AllPropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    location: searchParams.get("location") || "",
    propertyType: searchParams.get("propertyType") || "",
    minPrice: "",
    maxPrice: "",
    sort: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["properties", filters, page],
    queryFn: () => {
      const params = new URLSearchParams({ ...filters, page, limit: 9 });
      return api.get(`/properties?${params}`).then((r) => r.data);
    },
  });

  const handleFilter = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="section-title">All Properties</h1>
        <p className="text-gray-500">Browse all verified rental properties across Bangladesh</p>
      </div>

      {/* Filter Bar */}
      <form onSubmit={handleFilter} className="bg-white rounded-2xl shadow-md p-5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search location..."
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="input-field pl-9"
            />
          </div>
          <select
            value={filters.propertyType}
            onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
            className="input-field"
          >
            <option value="">All Types</option>
            {["Apartment", "House", "Villa", "Studio", "Office", "Shop"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            className="input-field"
          />
          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            className="input-field"
          >
            <option value="">Sort By</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
        <div className="flex gap-3 mt-3">
          <button type="submit" className="btn-primary flex items-center gap-2">
            <FiFilter /> Apply Filters
          </button>
          <button type="button" onClick={() => { setFilters({ location: "", propertyType: "", minPrice: "", maxPrice: "", sort: "" }); setPage(1); }}
            className="btn-outline">
            Clear
          </button>
        </div>
      </form>

      {/* Results */}
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <p className="text-gray-500 mb-5 text-sm">
            Showing {data?.properties?.length || 0} of {data?.total || 0} properties
          </p>
          {data?.properties?.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🏠</p>
              <p className="text-gray-500 text-lg">No properties found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {data?.properties?.map((p, i) => <PropertyCard key={p._id} property={p} index={i} />)}
            </div>
          )}

          {/* Pagination */}
          {data?.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-outline py-2 px-4 disabled:opacity-40"
              >
                Previous
              </button>
              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                    p === page ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-primary-50"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="btn-outline py-2 px-4 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
