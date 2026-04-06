import React from "react";
import { Link } from "react-router-dom";
import { Ambulance, Stethoscope, FlaskConical, Calendar, ArrowRight } from "lucide-react";
import { useCollection } from "../../hooks/useCollection";

export default function HomePage() {
  const { docs: departments } = useCollection("departments", "order");
  const { docs: services } = useCollection("services", "order");

  const activeDepts = departments.filter(d => d.isActive).slice(0, 6);
  const featuredServices = services.filter(s => s.isActive && s.isHighlighted).slice(0, 4);

  // Fallback icons for services if no highlighted ones exist yet
  const fallbackServices = [
    { icon: <Ambulance size={28} />, title: "24/7 Emergency", desc: "Round-the-clock emergency services" },
    { icon: <Stethoscope size={28} />, title: "General OPD", desc: "Walk-in consultations daily" },
    { icon: <FlaskConical size={28} />, title: "Home Lab Sampling", desc: "Tests at your doorstep" },
    { icon: <Calendar size={28} />, title: "Online Booking", desc: "Schedule appointments easily" },
  ];

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
              <a href="tel:+923364404140" className="border border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white/10 transition flex items-center gap-2">
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

      {/* Services — dynamic from Firestore, fallback to static */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Our Core Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredServices.length > 0
            ? featuredServices.map(s => (
                <div key={s.id} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition text-center">
                  <div className="text-3xl mb-3">{s.icon || "🏥"}</div>
                  <div className="font-semibold text-gray-800 mb-1">{s.name}</div>
                  <div className="text-sm text-gray-500">{s.shortDesc}</div>
                </div>
              ))
            : fallbackServices.map(({ icon, title, desc }) => (
                <div key={title} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition text-center">
                  <div className="text-teal-600 mb-3 flex justify-center">{icon}</div>
                  <div className="font-semibold text-gray-800 mb-1">{title}</div>
                  <div className="text-sm text-gray-500">{desc}</div>
                </div>
              ))
          }
        </div>
      </section>

      {/* Departments — dynamic from Firestore */}
      <section className="bg-gray-50 py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Our Departments</h2>
            <Link to="/departments" className="text-teal-600 hover:underline text-sm flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {activeDepts.length > 0
              ? activeDepts.map(dept => (
                  <Link key={dept.id} to={`/departments/${dept.slug}`}
                    className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md hover:border-teal-200 border border-transparent transition">
                    <div className="text-3xl mb-2">{dept.icon || "🏥"}</div>
                    <div className="font-medium text-gray-800 text-sm">{dept.name}</div>
                    <div className="text-xs text-gray-400 mt-1 hidden md:block line-clamp-1">{dept.shortDesc}</div>
                  </Link>
                ))
              : /* Loading skeletons */
                [...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 text-center shadow-sm animate-pulse">
                    <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto" />
                  </div>
                ))
            }
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

      {/* Blog preview — dynamic from Firestore */}
      <BlogPreview />
    </div>
  );
}

function BlogPreview() {
  const { docs: posts } = useCollection("healthEducation", "createdAt");
  const recent = posts.filter(p => p.isPublished).slice(0, 3);

  if (recent.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-14">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Health Tips & Articles</h2>
        <Link to="/blog" className="text-teal-600 hover:underline text-sm flex items-center gap-1">View All <ArrowRight size={14} /></Link>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {recent.map(post => (
          <Link key={post.id} to={`/blog/${post.slug}`}
            className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
            <div className="bg-teal-100 h-40 flex items-center justify-center text-teal-400 text-4xl overflow-hidden">
              {post.thumbnailUrl
                ? <img src={post.thumbnailUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                : "🏥"
              }
            </div>
            <div className="p-4">
              <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full capitalize">{post.type}</span>
              <h3 className="font-semibold text-gray-800 mt-2 mb-1 group-hover:text-teal-700 transition-colors line-clamp-2">{post.title}</h3>
              {post.authorName && <div className="text-xs text-gray-400">By {post.authorName}</div>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}