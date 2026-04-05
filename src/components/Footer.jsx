import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle, Heart } from "lucide-react";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Departments", to: "/departments" },
  { label: "Doctors & Consultants", to: "/doctors" },
  { label: "Our Services", to: "/services" },
  { label: "Book Appointment", to: "/book-appointment" },
  { label: "Patient Portal", to: "/portal" },
  { label: "Health Blog", to: "/blog" },
];



export default function Footer() {
  return (
    <footer className="bg-teal-900 text-white">

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-black text-lg">
                M
              </div>
              <div>
                <div className="font-black text-white text-sm">Mafaza tul Hayat</div>
                <div className="text-xs text-teal-400">Hospital & Medical Center</div>
              </div>
            </div>
            <p className="text-teal-300 text-sm leading-relaxed mb-5">
              A non-profit multi-specialty hospital providing ethical, evidence-based, and affordable healthcare — for every family.
            </p>
            {/* Mission tag */}
            <div className="bg-teal-800 border border-teal-700 rounded-xl px-4 py-3 text-xs text-teal-300 leading-relaxed italic">
              "Ethical and Modest Patient Care with Minimal Cost"
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-teal-300 uppercase tracking-widest mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-gray-300 hover:text-white hover:translate-x-0.5 transition-all inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

         
          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-teal-300 uppercase tracking-widest mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a href="tel:+92XXXXXXXXXX"
                  className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors group">
                  <div className="w-8 h-8 bg-teal-800 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-teal-700 transition-colors">
                    <Phone size={14} className="text-teal-400" />
                  </div>
                  <div>
                    <div className="text-xs text-teal-400 mb-0.5">Emergency / OPD</div>
                    <div className="text-sm">+92-XXX-XXXXXXX</div>
                  </div>
                </a>
              </li>
              <li>
                <a href="https://wa.me/92XXXXXXXXXX" target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors group">
                  <div className="w-8 h-8 bg-teal-800 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-teal-700 transition-colors">
                    <MessageCircle size={14} className="text-teal-400" />
                  </div>
                  <div>
                    <div className="text-xs text-teal-400 mb-0.5">WhatsApp</div>
                    <div className="text-sm">+92-XXX-XXXXXXX</div>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:info@mafazahospital.com"
                  className="flex items-start gap-3 text-gray-300 hover:text-white transition-colors group">
                  <div className="w-8 h-8 bg-teal-800 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-teal-700 transition-colors">
                    <Mail size={14} className="text-teal-400" />
                  </div>
                  <div>
                    <div className="text-xs text-teal-400 mb-0.5">Email</div>
                    <div className="text-sm">info@mafazahospital.com</div>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-gray-300">
                  <div className="w-8 h-8 bg-teal-800 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin size={14} className="text-teal-400" />
                  </div>
                  <div>
                    <div className="text-xs text-teal-400 mb-0.5">Address</div>
                    <div className="text-sm">[Hospital Address], Lahore, Pakistan</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-teal-800" />

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-teal-400">
          <div className="flex items-center gap-1">
            © {new Date().getFullYear()} Mafaza tul Hayat Hospital. All rights reserved.
            <span className="mx-2">·</span>
            Non-Profit Healthcare Institution
          </div>
          <div className="flex gap-5">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/92XXXXXXXXXX"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-3.5 rounded-full shadow-xl hover:bg-green-600 transition-all hover:scale-110 z-50"
        title="Chat on WhatsApp"
      >
        <MessageCircle size={22} />
      </a>
    </footer>
  );
}