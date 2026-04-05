import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import { Search, Star } from "lucide-react";

export default function ServicesPage() {
  const { docs: services, loading } = useCollection("services", "order");
  const [search, setSearch] = useState("");

  const active = services.filter(s => s.isActive);
  const featured = active.filter(s => s.isHighlighted);

  const filtered = active.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    (s.shortDesc || "").toLowerCase().includes(search.toLowerCase())
  );

  // Group by category (using departmentIds length as fallback grouping)
  const grouped = filtered.reduce((acc, s) => {
    const cat = s.pricing === "Free" ? "Free Services" : "Available Services";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 to-teal-900 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-teal-300 text-sm font-semibold uppercase tracking-widest mb-3">What We Offer</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-teal-100 text-lg max-w-xl mx-auto mb-8">
            Comprehensive healthcare services designed around your needs.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search services..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300 shadow-lg"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-14">

        {/* Featured Services */}
        {!search && featured.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Star size={18} className="text-amber-500 fill-amber-500" />
              <h2 className="text-2xl font-bold text-gray-800">Featured Services</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map(s => (
                <div key={s.id} className="bg-white rounded-2xl p-6 shadow-sm border-2 border-teal-100 hover:border-teal-300 transition-all hover:-translate-y-1 hover:shadow-lg duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-2xl">
                      {s.icon || "🏥"}
                    </div>
                    <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <Star size={10} fill="currentColor" /> Featured
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">{s.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{s.shortDesc}</p>
                  {s.pricing && (
                    <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
                      {s.pricing}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4" />
                <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-full mb-1" />
                <div className="h-4 bg-gray-100 rounded w-4/5" />
              </div>
            ))}
          </div>
        )}

        {/* All Services */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">No services found for "{search}"</p>
            <button onClick={() => setSearch("")} className="mt-4 text-teal-600 hover:underline text-sm">Clear search</button>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div>
            {search && <p className="text-gray-500 text-sm mb-6">{filtered.length} service{filtered.length !== 1 ? "s" : ""} found</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map(s => (
                <div key={s.id}
                  className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-transparent hover:border-teal-100 transition-all duration-300 hover:-translate-y-0.5">
                  <div className="w-11 h-11 bg-teal-50 rounded-xl flex items-center justify-center text-2xl mb-4">
                    {s.icon || "🏥"}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">{s.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-3">{s.shortDesc}</p>
                  {s.pricing && (
                    <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
                      {s.pricing}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <section className="bg-teal-600 text-white py-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-3">Need a specific service?</h2>
        <p className="text-teal-100 mb-6">Our team will help you find the right care. Contact us or book an appointment.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/book-appointment" className="bg-white text-teal-700 px-7 py-3 rounded-xl font-bold hover:bg-teal-50 transition">
            Book Appointment
          </Link>
          <Link to="/contact" className="border border-white text-white px-7 py-3 rounded-xl font-bold hover:bg-white/10 transition">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}