import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useCollection } from "../../hooks/useCollection";
import { ArrowLeft, Clock, CheckCircle, ChevronRight } from "lucide-react";

export default function DepartmentDetailPage() {
  const { slug } = useParams();
  const { docs: departments, loading: deptLoading } = useCollection("departments", "order");
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);

  const dept = departments.find(d => d.slug === slug && d.isActive);

  useEffect(() => {
    if (!dept) return;
    setDoctorsLoading(true);
    getDocs(query(
      collection(db, "doctors"),
      where("departmentId", "==", dept.id),
      where("isActive", "==", true),
      orderBy("order", "asc")
    )).then(snap => {
      setDoctors(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setDoctorsLoading(false);
    }).catch(() => setDoctorsLoading(false));
  }, [dept?.id]);

  if (deptLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!dept) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="text-5xl">🏥</div>
        <h1 className="text-2xl font-bold text-gray-700">Department not found</h1>
        <Link to="/departments" className="text-teal-600 hover:underline flex items-center gap-1">
          <ArrowLeft size={16} /> Back to Departments
        </Link>
      </div>
    );
  }

  const services = dept.servicesOffered || [];
  const symptoms = dept.whenToVisit ? dept.whenToVisit.split(",").map(s => s.trim()).filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 to-teal-900 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <Link to="/departments" className="flex items-center gap-1 text-teal-300 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={15} /> All Departments
          </Link>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-4xl shrink-0">
              {dept.icon || "🏥"}
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{dept.name}</h1>
              <p className="text-teal-100 text-lg max-w-2xl">{dept.shortDesc}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">

            {/* About */}
            {dept.fullDesc && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-4">About {dept.name}</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{dept.fullDesc}</p>
              </div>
            )}

            {/* Services Offered */}
            {services.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Services Offered</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-600">
                      <CheckCircle size={16} className="text-teal-500 shrink-0" />
                      <span className="text-sm">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Doctors */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-5">
                Our {dept.name} Specialists
              </h2>
              {doctorsLoading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 animate-pulse">
                      <div className="w-14 h-14 bg-gray-200 rounded-full shrink-0" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                        <div className="h-3 bg-gray-100 rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : doctors.length === 0 ? (
                <p className="text-gray-400 text-sm">No specialists listed yet.</p>
              ) : (
                <div className="space-y-4">
                  {doctors.map(doc => (
                    <Link key={doc.id} to={`/doctors/${doc.slug}`}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-teal-50 transition-colors group">
                      {doc.imageUrl ? (
                        <img src={doc.imageUrl} alt={doc.name} className="w-14 h-14 rounded-full object-cover shrink-0 border-2 border-teal-100" />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xl shrink-0">
                          {doc.name?.[0]}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 group-hover:text-teal-700 transition-colors">{doc.name}</div>
                        <div className="text-sm text-gray-500">{doc.specialty}</div>
                        {doc.title && <div className="text-xs text-gray-400 mt-0.5">{doc.title}</div>}
                      </div>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-teal-500 transition-colors shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">

            {/* When to Visit */}
            {symptoms.length > 0 && (
              <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5">
                <h3 className="font-bold text-teal-800 mb-3 flex items-center gap-2">
                  <Clock size={16} /> When to Visit
                </h3>
                <ul className="space-y-2">
                  {symptoms.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-teal-700">
                      <span className="text-teal-400 mt-0.5">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Book Appointment */}
            <div className="bg-teal-600 text-white rounded-2xl p-5">
              <h3 className="font-bold text-lg mb-2">Book a Consultation</h3>
              <p className="text-teal-100 text-sm mb-4">Get expert care from our {dept.name} specialists.</p>
              <Link
                to="/book-appointment"
                className="block text-center bg-white text-teal-700 font-bold py-2.5 rounded-xl hover:bg-teal-50 transition"
              >
                Book Appointment
              </Link>
            </div>

            {/* Emergency */}
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
              <h3 className="font-bold text-red-700 mb-1">Emergency?</h3>
              <p className="text-red-600 text-sm mb-3">24/7 emergency services available.</p>
              <a href="tel:+92XXXXXXXXXX" className="block text-center bg-red-600 text-white font-bold py-2.5 rounded-xl hover:bg-red-700 transition text-sm">
                📞 Call Emergency
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}