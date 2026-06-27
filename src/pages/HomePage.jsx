import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { FiSearch, FiMapPin, FiShield, FiStar, FiTrendingUp, FiHome, FiCheckCircle } from "react-icons/fi";
import { FaQuoteLeft } from "react-icons/fa";
import api from "../api/axios.js";
import PropertyCard from "../components/property/PropertyCard.jsx";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ location: "", propertyType: "", minPrice: "", maxPrice: "" });

  const { data: featured = [] } = useQuery({
    queryKey: ["featured-properties"],
    queryFn: () => api.get("/properties/featured").then((r) => r.data),
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["home-reviews"],
    queryFn: () => api.get("/reviews/home").then((r) => r.data),
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.location) params.set("location", search.location);
    if (search.propertyType) params.set("propertyType", search.propertyType);
    if (search.minPrice) params.set("minPrice", search.minPrice);
    if (search.maxPrice) params.set("maxPrice", search.maxPrice);
    navigate(`/properties?${params.toString()}`);
  };

  const stats = [
    { label: "Properties Listed", value: "2,400+" },
    { label: "Happy Tenants", value: "8,900+" },
    { label: "Cities Covered", value: "35+" },
    { label: "Verified Owners", value: "1,200+" },
  ];

  const features = [
    { icon: FiShield, title: "Verified Listings", desc: "Every property is verified by our admin team before going live." },
    { icon: FiCheckCircle, title: "Secure Payments", desc: "Pay safely with Stripe. Your money is protected at all times." },
    { icon: FiStar, title: "Tenant Reviews", desc: "Read real reviews from tenants who have lived in the property." },
    { icon: FiTrendingUp, title: "Best Prices", desc: "Compare prices across hundreds of listings to find the best deal." },
  ];

  const topLocations = [
    { name: "Gulshan, Dhaka", count: "320 Properties", img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400" },
    { name: "Banani, Dhaka", count: "250 Properties", img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400" },
    { name: "Dhanmondi, Dhaka", count: "180 Properties", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400" },
    { name: "Chittagong", count: "140 Properties", img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400" },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ─────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-dark-900 via-primary-900 to-dark-800 overflow-hidden">
        {/* Background image overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 to-primary-900/40" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="max-w-3xl">
            <span className="inline-block bg-primary-500/30 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-primary-400/50">
  🏠 Bangladesh's #1 Rental Platform
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight mb-6">
              Find Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                Perfect
              </span>{" "}
              Home
            </h1>
            <p className="text-gray-300 text-xl mb-10 leading-relaxed">
              Discover thousands of verified rental properties. Connect directly with owners and book your dream home in minutes.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            onSubmit={handleSearch}
            className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 max-w-4xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="relative">
                <FiMapPin className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location"
                  value={search.location}
                  onChange={(e) => setSearch({ ...search, location: e.target.value })}
                  className="input-field pl-9"
                />
              </div>
              <select
                value={search.propertyType}
                onChange={(e) => setSearch({ ...search, propertyType: e.target.value })}
                className="input-field"
              >
                <option value="">Property Type</option>
                {["Apartment", "House", "Villa", "Studio", "Office", "Shop"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Min Price (৳)"
                value={search.minPrice}
                onChange={(e) => setSearch({ ...search, minPrice: e.target.value })}
                className="input-field"
              />
              <input
                type="number"
                placeholder="Max Price (৳)"
                value={search.maxPrice}
                onChange={(e) => setSearch({ ...search, maxPrice: e.target.value })}
                className="input-field"
              />
            </div>
            <button type="submit" className="btn-primary w-full mt-4 flex items-center justify-center gap-2 py-3">
              <FiSearch /> Search Properties
            </button>
          </motion.form>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────── */}
      <section className="bg-primary-600 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
              className="text-center text-white">
              <p className="text-3xl md:text-4xl font-display font-bold">{s.value}</p>
              <p className="text-primary-100 text-sm mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PROPERTIES ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="section-title">
            Featured Properties
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} className="section-subtitle">
            Handpicked top properties from verified owners across Bangladesh
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {featured.map((p, i) => <PropertyCard key={p._id} property={p} index={i} />)}
        </div>
        <div className="text-center mt-10">
          <button onClick={() => navigate("/properties")} className="btn-outline">
            View All Properties
          </button>
        </div>
      </section>

      {/* ── WHY CHOOSE US ─────────────────────────────── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="section-title">
              Why Choose NestQuest?
            </motion.h2>
            <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} className="section-subtitle">
              We make renting safe, simple, and transparent
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="card p-6 text-center group hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-600 transition-colors">
                  <f.icon className="text-primary-600 group-hover:text-white text-2xl transition-colors" />
                </div>
                <h3 className="font-display font-bold text-dark-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP LOCATIONS ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="section-title">
            Top Locations
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} className="section-subtitle">
            Explore popular rental areas across Bangladesh
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {topLocations.map((loc, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
              onClick={() => navigate(`/properties?location=${loc.name.split(",")[0]}`)}
              className="relative rounded-2xl overflow-hidden h-52 cursor-pointer group">
              <img src={loc.img} alt={loc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-display font-bold text-lg">{loc.name}</p>
                <p className="text-primary-300 text-sm">{loc.count}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── REVIEWS ─────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary-900 to-dark-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="section-title text-white">
              What Tenants Say
            </motion.h2>
            <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} className="text-primary-200 text-lg mb-10">
              Real experiences from our verified tenants
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.length > 0 ? reviews.map((r, i) => (
              <motion.div key={r._id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
                <FaQuoteLeft className="text-primary-400 text-2xl mb-4" />
                <p className="text-gray-200 text-sm leading-relaxed mb-5">"{r.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {r.tenantName?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{r.tenantName}</p>
                    <div className="flex text-yellow-400 text-xs">{"★".repeat(r.rating)}</div>
                  </div>
                </div>
              </motion.div>
            )) : (
              // Placeholder reviews if DB is empty
              [{name:"Rahim Ahmed", text:"Found my dream apartment in Gulshan within 2 days!", rating:5},
               {name:"Fatima Khan", text:"The booking process was super smooth and secure.", rating:5},
               {name:"Karim Uddin", text:"Verified listings gave me full confidence. Highly recommend!", rating:5},
               {name:"Nadia Islam", text:"Best rental platform in Bangladesh. Love the UI!", rating:5}].map((r, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                  className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
                  <FaQuoteLeft className="text-primary-400 text-2xl mb-4" />
                  <p className="text-gray-200 text-sm leading-relaxed mb-5">"{r.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{r.name}</p>
                      <div className="flex text-yellow-400 text-xs">{"★".repeat(r.rating)}</div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── RENTAL STATISTICS ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-widest">By the Numbers</span>
            <h2 className="section-title mt-2">Rental Statistics</h2>
            <p className="text-gray-500 mb-8">Join thousands of happy tenants and property owners on NestQuest.</p>
            <div className="grid grid-cols-2 gap-5">
              {[
                { label: "Avg Rent in Dhaka", value: "৳18,500/mo" },
                { label: "Properties Added Monthly", value: "240+" },
                { label: "Booking Success Rate", value: "94%" },
                { label: "Owner Response Time", value: "< 2 hrs" },
              ].map((s, i) => (
                <div key={i} className="card p-5">
                  <p className="text-2xl font-display font-bold text-primary-600">{s.value}</p>
                  <p className="text-gray-500 text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600"
              alt="Stats"
              className="rounded-2xl shadow-xl w-full object-cover h-80"
            />
          </motion.div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────── */}
      <section className="bg-accent-500 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Ready to Find Your New Home?
          </motion.h2>
          <p className="text-orange-100 text-lg mb-8">Join 8,900+ happy tenants who found their home on NestQuest</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/register")} className="bg-white text-accent-600 font-bold px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              Get Started Free
            </button>
            <button onClick={() => navigate("/properties")} className="border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors">
              Browse Properties
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
