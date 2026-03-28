import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, Phone, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-teal-700 text-white text-sm py-1 px-4 flex justify-between items-center">
        <span className="flex items-center gap-2">
          <Phone size={14} /> Emergency: <strong>+92-XXX-XXXXXXX</strong>
        </span>
        <span>Open 24/7 | All Days</span>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">M</div>
          <div>
            <div className="font-bold text-teal-800 leading-tight">Mafaza tul Hayat</div>
            <div className="text-xs text-gray-500">Hospital & Medical Center</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link to="/" className="hover:text-teal-600 transition">Home</Link>
          <Link to="/departments" className="hover:text-teal-600 transition">Departments</Link>
          <Link to="/doctors" className="hover:text-teal-600 transition">Doctors</Link>
          <Link to="/services" className="hover:text-teal-600 transition">Services</Link>
          <Link to="/blog" className="hover:text-teal-600 transition">Health Blog</Link>
          <Link to="/contact" className="hover:text-teal-600 transition">Contact</Link>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <>
              {userRole === "admin" && (
                <>
                  <Link to="/admin" className="text-sm text-teal-700 font-semibold hover:underline">Admin Panel</Link>
                  <Link to="/portal" className="text-sm text-teal-700 font-semibold hover:underline">Patient Portal</Link>
                </>
              )}
              {userRole === "patient" && (
                <Link to="/portal" className="text-sm text-teal-700 font-semibold hover:underline">My Portal</Link>
              )}
              <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500 transition">Logout</button>
            </>
          ) : (
            <Link to="/login" className="text-sm text-gray-600 hover:text-teal-600 transition">Login</Link>
          )}
          <Link
            to="/book-appointment"
            className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition"
          >
            Book Appointment
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-3 text-sm text-gray-700">
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/departments" onClick={() => setOpen(false)}>Departments</Link>
          <Link to="/doctors" onClick={() => setOpen(false)}>Doctors</Link>
          <Link to="/services" onClick={() => setOpen(false)}>Services</Link>
          <Link to="/blog" onClick={() => setOpen(false)}>Health Blog</Link>
          <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
          <Link to="/book-appointment" className="bg-teal-600 text-white px-4 py-2 rounded-lg text-center font-semibold" onClick={() => setOpen(false)}>
            Book Appointment
          </Link>
          {currentUser ? (
            <button onClick={handleLogout} className="text-red-500 text-left">Logout</button>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)}>Login / Register</Link>
          )}
        </div>
      )}
    </nav>
  );
}