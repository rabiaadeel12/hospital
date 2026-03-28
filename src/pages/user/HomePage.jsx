// src/pages/user/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Heart, Stethoscope, FlaskConical, Ambulance, Calendar, Clock, ArrowRight } from "lucide-react";

const departments = [
  { name: "Cardiology", icon: "🫀", desc: "Heart disease diagnosis & treatment" },
  { name: "Pediatrics", icon: "🧒", desc: "Specialized care for children" },
  { name: "Orthopedics", icon: "🦴", desc: "Bones, joints & musculoskeletal" },
  { name: "Gynecology", icon: "🌸", desc: "Women's health & obstetrics" },
  { name: "Emergency & ICU", icon: "🚨", desc: "24/7 critical care" },
  { name: "Radiology", icon: "🔬", desc: "Imaging & diagnostics" },
];

const services = [
  { icon: <Ambulance size={28} />, title: "24/7 Emergency", desc: "Round-the-clock emergency services" },
  { icon: <Stethoscope size={28} />, title: "General OPD", desc: "Walk-in consultations daily" },
  { icon: <FlaskConical size={28} />, title: "Home Lab Sampling", desc: "Tests at your doorstep" },
  { icon: <Calendar size={28} />, title: "Online Booking", desc: "Schedule appointments easily" },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-700 to-teal-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-block bg-teal-500/30 text-teal-200 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              Lahore's Trusted Healthcare Partner
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Your Health, <br />
              <span className="text-teal-300">Our Priority</span>
            </h1>
            <p className="text-teal-100 text-lg mb-8 max-w-md">
              Comprehensive medical care with expert doctors, modern facilities, and 24/7 emergency services in Lahore.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/book-appointment" className="bg-white text-teal-700 px-6 py-3 rounded-lg font-bold hover:bg-teal-50 transition">
                Book Appointment
              </Link>
              <a href="tel:+92XXXXXXXXXX" className="border border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white/10 transition flex items-center gap-2">
                📞 Call Emergency
              </a>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-4">
            {[["50+","Expert Doctors"],["15+","Departments"],["24/7","Emergency Care"],["10k+","Patients Served"]].map(([num, label]) => (
              <div key={label} className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-teal-300">{num}</div>
                <div className="text-sm text-teal-100 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Services */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Our Core Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map(({ icon, title, desc }) => (
            <div key={title} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition text-center">
              <div className="text-teal-600 mb-3 flex justify-center">{icon}</div>
              <div className="font-semibold text-gray-800 mb-1">{title}</div>
              <div className="text-sm text-gray-500">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Departments */}
      <section className="bg-gray-50 py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Our Departments</h2>
            <Link to="/departments" className="text-teal-600 hover:underline text-sm flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {departments.map(({ name, icon, desc }) => (
              <Link key={name} to={`/departments/${name.toLowerCase().replace(/\s+/g,"-")}`}
                className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md hover:border-teal-200 border border-transparent transition">
                <div className="text-3xl mb-2">{icon}</div>
                <div className="font-medium text-gray-800 text-sm">{name}</div>
                <div className="text-xs text-gray-400 mt-1 hidden md:block">{desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-teal-600 text-white py-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-3">Need a Health Checkup?</h2>
        <p className="text-teal-100 mb-6">Book an appointment with our specialists today. Same-day slots available.</p>
        <Link to="/book-appointment" className="bg-white text-teal-700 px-8 py-3 rounded-lg font-bold hover:bg-teal-50 transition inline-block">
          Schedule Now
        </Link>
      </section>

      {/* Blog preview placeholder */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Health Tips & Articles</h2>
          <Link to="/blog" className="text-teal-600 hover:underline text-sm flex items-center gap-1">View All <ArrowRight size={14} /></Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "What to Do in a Medical Emergency", date: "Feb 2025", cat: "Emergency" },
            { title: "Benefits of Home Lab Sampling", date: "Feb 2025", cat: "Lab Services" },
            { title: "Child Health Checkups You Shouldn't Miss", date: "Mar 2025", cat: "Pediatrics" },
          ].map(({ title, date, cat }) => (
            <div key={title} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="bg-teal-100 h-40 flex items-center justify-center text-teal-400 text-4xl">🏥</div>
              <div className="p-4">
                <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">{cat}</span>
                <h3 className="font-semibold text-gray-800 mt-2 mb-1">{title}</h3>
                <div className="text-xs text-gray-400">{date}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
