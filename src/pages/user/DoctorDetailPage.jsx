import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useCollection } from "../../hooks/useCollection";
import { ArrowLeft, Clock, Phone, Mail, GraduationCap, CheckCircle, Calendar } from "lucide-react";

const DAY_ORDER = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

export default function DoctorDetailPage() {
  const { slug } = useParams();
  const { docs: doctors, loading } = useCollection("doctors", "order");
  const doc = doctors.find(d => d.slug === slug && d.isActive);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="text-5xl">👨‍⚕️</div>
        <h1 className="text-2xl font-bold text-gray-700">Doctor not found</h1>
        <Link to="/doctors" className="text-teal-600 hover:underline flex items-center gap-1">
          <ArrowLeft size={16} /> Back to Doctors
        </Link>
      </div>
    );
  }

  const sortedTimings = [...(doc.clinicTimings || [])].sort(
    (a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day)
  );
  const availableTimings = sortedTimings.filter(t => t.isAvailable);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 to-teal-900 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Link to="/doctors" className="flex items-center gap-1 text-teal-300 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={15} /> All Doctors
          </Link>
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Photo */}
            <div className="shrink-0">
              {doc.imageUrl ? (
                <img src={doc.imageUrl} alt={doc.name}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-white/20 shadow-xl" />
              ) : (
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-white/10 flex items-center justify-center text-white font-bold text-5xl border-4 border-white/20">
                  {doc.name?.[0]}
                </div>
              )}
            </div>
            {/* Info */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-1">{doc.name}</h1>
              <p className="text-teal-200 text-lg mb-1">{doc.specialty}</p>
              {doc.title && <p className="text-teal-300 text-sm mb-3">{doc.title}</p>}
              {doc.departmentName && (
                <Link to={`/departments/${doc.departmentId}`}
                  className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 transition text-white text-sm px-3 py-1.5 rounded-full">
                  🏥 {doc.departmentName}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Main */}
          <div className="lg:col-span-2 space-y-6">

            {/* Bio */}
            {doc.bio && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-4">About Dr. {doc.name?.split(" ").pop()}</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{doc.bio}</p>
              </div>
            )}

            {/* Qualifications */}
            {(doc.qualifications || []).length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <GraduationCap size={20} className="text-teal-600" /> Qualifications
                </h2>
                <div className="space-y-3">
                  {doc.qualifications.map((q, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 shrink-0" />
                      <div>
                        <div className="font-medium text-gray-800">{q.degree}</div>
                        {(q.institution || q.year) && (
                          <div className="text-sm text-gray-500">{q.institution}{q.institution && q.year ? " · " : ""}{q.year}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clinic Timings */}
            {availableTimings.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock size={20} className="text-teal-600" /> Clinic Schedule
                </h2>
                <div className="divide-y divide-gray-50">
                  {availableTimings.map((t, i) => (
                    <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={15} className="text-teal-500" />
                        <span className="font-medium text-gray-700">{t.day}</span>
                      </div>
                      <span className="text-gray-500 text-sm bg-teal-50 px-3 py-1 rounded-full">
                        {t.startTime} – {t.endTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">

            {/* Book */}
            {doc.isAvailableForBooking && (
              <div className="bg-teal-600 text-white rounded-2xl p-5">
                <Calendar size={24} className="mb-2" />
                <h3 className="font-bold text-lg mb-1">Book Appointment</h3>
                <p className="text-teal-100 text-sm mb-4">
                  {doc.consultationFee > 0 ? `Rs. ${doc.consultationFee} consultation fee` : "Free consultation"}
                </p>
                <Link to="/book-appointment"
                  className="block text-center bg-white text-teal-700 font-bold py-2.5 rounded-xl hover:bg-teal-50 transition">
                  Book Now
                </Link>
              </div>
            )}

            {/* Contact */}
            {(doc.phone || doc.email) && (
              <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
                <h3 className="font-bold text-gray-800">Contact</h3>
                {doc.phone && (
                  <a href={`tel:${doc.phone}`} className="flex items-center gap-3 text-gray-600 hover:text-teal-600 transition text-sm">
                    <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center"><Phone size={14} className="text-teal-600" /></div>
                    {doc.phone}
                  </a>
                )}
                {doc.email && (
                  <a href={`mailto:${doc.email}`} className="flex items-center gap-3 text-gray-600 hover:text-teal-600 transition text-sm">
                    <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center"><Mail size={14} className="text-teal-600" /></div>
                    {doc.email}
                  </a>
                )}
              </div>
            )}

            {/* Quick info */}
            <div className="bg-gray-100 rounded-2xl p-5 space-y-3">
              {doc.consultationFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Consultation Fee</span>
                  <span className="font-semibold text-gray-800">Rs. {doc.consultationFee}</span>
                </div>
              )}
              {availableTimings.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Available</span>
                  <span className="font-semibold text-gray-800">{availableTimings.length} days/week</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Booking</span>
                <span className={`font-semibold ${doc.isAvailableForBooking ? "text-green-600" : "text-red-500"}`}>
                  {doc.isAvailableForBooking ? "Open" : "Closed"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
