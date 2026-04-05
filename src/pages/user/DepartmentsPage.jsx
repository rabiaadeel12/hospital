import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import { ArrowRight, Search } from "lucide-react";

export default function DepartmentsPage() {
  const { docs: departments, loading } = useCollection("departments", "order");
  const [search, setSearch] = useState("");

  const active = departments.filter(d => d.isActive);
  const filtered = active.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    (d.shortDesc || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 to-teal-900 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-teal-300 text-sm font-semibold uppercase tracking-widest mb-3">Our Specialties</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Medical Departments</h1>
          <p className="text-teal-100 text-lg max-w-xl mx-auto mb-8">
            World-class care across {active.length} specialties, delivered by experienced consultants.
          </p>
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search departments..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300 shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
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
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">No departments found for "{search}"</p>
            <button onClick={() => setSearch("")} className="mt-4 text-teal-600 hover:underline text-sm">Clear search</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((dept, i) => (
              <Link
                key={dept.id}
                to={`/departments/${dept.slug}`}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-transparent hover:border-teal-100 transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Icon */}
                <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:bg-teal-100 transition-colors">
                  {dept.icon || "🏥"}
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-teal-700 transition-colors">
                  {dept.name}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                  {dept.shortDesc || "Specialized medical care by expert consultants."}
                </p>

                {/* Services count */}
                {(dept.servicesOffered || []).length > 0 && (
                  <p className="text-xs text-teal-600 font-medium mb-4">
                    {dept.servicesOffered.length} services offered
                  </p>
                )}

                <div className="flex items-center gap-1 text-teal-600 text-sm font-semibold group-hover:gap-2 transition-all">
                  Learn more <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-teal-600 text-white py-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-3">Not sure which department?</h2>
        <p className="text-teal-100 mb-6">Book a general OPD appointment and let our doctors guide you.</p>
        <Link to="/book-appointment" className="bg-white text-teal-700 px-8 py-3 rounded-xl font-bold hover:bg-teal-50 transition inline-block">
          Book Appointment
        </Link>
      </section>
    </div>
  );
}