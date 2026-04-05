import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import { Search, ChevronRight, Clock } from "lucide-react";

export default function DoctorsPage() {
  const { docs: doctors, loading } = useCollection("doctors", "order");
  const { docs: departments } = useCollection("departments", "order");
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");

  const activeDepts = departments.filter(d => d.isActive);
  const activeDoctors = doctors.filter(d => d.isActive);

  const filtered = activeDoctors.filter(doc => {
    const matchSearch =
      doc.name?.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialty?.toLowerCase().includes(search.toLowerCase());
    const matchDept = selectedDept === "all" || doc.departmentId === selectedDept;
    return matchSearch && matchDept;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 to-teal-900 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-teal-300 text-sm font-semibold uppercase tracking-widest mb-3">Meet Our Team</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Doctors & Consultants</h1>
          <p className="text-teal-100 text-lg max-w-xl mx-auto mb-8">
            Experienced specialists dedicated to your health and wellbeing.
          </p>
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or specialty..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-300 shadow-lg"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Department filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button
            onClick={() => setSelectedDept("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedDept === "all" ? "bg-teal-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-teal-300"}`}>
            All Departments
          </button>
          {activeDepts.map(d => (
            <button key={d.id} onClick={() => setSelectedDept(d.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedDept === d.id ? "bg-teal-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-teal-300"}`}>
              {d.icon} {d.name}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-gray-500 text-sm mb-6">{filtered.length} doctor{filtered.length !== 1 ? "s" : ""} found</p>
        )}

        {/* Doctors grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">👨‍⚕️</div>
            <p className="text-gray-500 text-lg">No doctors found</p>
            <button onClick={() => { setSearch(""); setSelectedDept("all"); }} className="mt-4 text-teal-600 hover:underline text-sm">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(doc => {
              const availableDays = (doc.clinicTimings || []).filter(t => t.isAvailable);
              return (
                <Link key={doc.id} to={`/doctors/${doc.slug}`}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-transparent hover:border-teal-100 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  {/* Photo */}
                  <div className="bg-gradient-to-br from-teal-50 to-teal-100 h-44 flex items-center justify-center">
                    {doc.imageUrl ? (
                      <img src={doc.imageUrl} alt={doc.name} className="w-full h-full object-cover object-top" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-teal-200 flex items-center justify-center text-teal-700 font-bold text-3xl">
                        {doc.name?.[0]}
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-gray-800 group-hover:text-teal-700 transition-colors mb-1">{doc.name}</h3>
                    <p className="text-teal-600 text-sm font-medium mb-1">{doc.specialty}</p>
                    {doc.title && <p className="text-gray-400 text-xs mb-3">{doc.title}</p>}

                    {/* Availability */}
                    {availableDays.length > 0 && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                        <Clock size={12} className="text-teal-500" />
                        {availableDays.slice(0, 2).map(t => t.day.slice(0, 3)).join(", ")}
                        {availableDays.length > 2 && ` +${availableDays.length - 2} more`}
                      </div>
                    )}

                    {/* Fee */}
                    {doc.consultationFee > 0 && (
                      <p className="text-xs text-gray-400">Rs. {doc.consultationFee} consultation</p>
                    )}

                    <div className="flex items-center gap-1 text-teal-600 text-sm font-semibold mt-3 group-hover:gap-2 transition-all">
                      View Profile <ChevronRight size={14} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}