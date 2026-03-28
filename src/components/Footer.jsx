import React from "react";
// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-teal-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="font-bold text-xl mb-2">Mafaza tul Hayat</div>
          <div className="text-teal-300 text-sm mb-4">Hospital & Medical Center, Lahore</div>
          <p className="text-gray-400 text-sm">Providing quality healthcare with compassion. Available 24/7 for all your medical needs.</p>
        </div>

        {/* Quick Links */}
        <div>
          <div className="font-semibold text-teal-300 mb-3">Quick Links</div>
          <ul className="space-y-2 text-sm text-gray-300">
            {[["Home","/"],["Departments","/departments"],["Doctors","/doctors"],["Services","/services"],["Book Appointment","/book-appointment"],["Patient Portal","/portal"]].map(([label, path]) => (
              <li key={path}><Link to={path} className="hover:text-white transition">{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Departments */}
        <div>
          <div className="font-semibold text-teal-300 mb-3">Departments</div>
          <ul className="space-y-2 text-sm text-gray-300">
            {["Cardiology","Pediatrics","Orthopedics","Gynecology","Emergency & ICU","Radiology"].map(d => (
              <li key={d}><Link to="/departments" className="hover:text-white transition">{d}</Link></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <div className="font-semibold text-teal-300 mb-3">Contact Us</div>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start gap-2"><Phone size={14} className="mt-1 shrink-0" /> +92-XXX-XXXXXXX (Emergency)</li>
            <li className="flex items-start gap-2"><MessageCircle size={14} className="mt-1 shrink-0" /> WhatsApp: +92-XXX-XXXXXXX</li>
            <li className="flex items-start gap-2"><Mail size={14} className="mt-1 shrink-0" /> info@mafazahospital.com</li>
            <li className="flex items-start gap-2"><MapPin size={14} className="mt-1 shrink-0" /> [Hospital Address], Lahore, Pakistan</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-teal-800 px-4 py-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
        <span>© 2025 Mafaza tul Hayat Hospital. All rights reserved.</span>
        <div className="flex gap-4 mt-2 md:mt-0">
          <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white">Terms & Conditions</Link>
        </div>
      </div>

      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/92XXXXXXXXXX"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition z-50"
        title="Chat on WhatsApp"
      >
        <MessageCircle size={24} />
      </a>
    </footer>
  );
}
