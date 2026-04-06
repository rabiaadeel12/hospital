import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, Phone, ChevronDown } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Departments", to: "/departments" },
  { label: "Doctors", to: "/doctors" },
  { label: "Services", to: "/services" },
  { label: "Health Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
  { label: "About", to: "/about" },  // ← just add this
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => { await logout(); navigate("/"); };

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + "/");

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-teal-700 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a href="tel:+923364404140" className="flex items-center gap-1.5 hover:text-teal-200 transition">
            <Phone size={12} />
            Emergency: <strong>+923364404140</strong>
          </a>
          <span className="hidden sm:block text-teal-200">Open 24/7 — Ethical & Evidence-Based Care</span>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-black text-lg shadow-sm">
              M
            </div>
            <div className="leading-tight">
              <div className="font-black text-teal-800 text-sm tracking-tight">Mafaza tul Hayat</div>
              <div className="text-xs text-gray-400 font-medium">Hospital & Medical Center</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) =>
              link.children ? (
                // Dropdown
                <div key={link.label} className="relative"
                  onMouseEnter={() => setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}>
                  <Link
                    to={link.to}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition ${isActive(link.to) ? "text-teal-700 bg-teal-50" : "text-gray-600 hover:text-teal-700 hover:bg-gray-50"}`}>
                    {link.label}
                    <ChevronDown size={13} className={`transition-transform ${activeDropdown === link.label ? "rotate-180" : ""}`} />
                  </Link>

                  {/* Dropdown menu */}
                  {activeDropdown === link.label && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">
                      {link.children.map((child) => (
                        <Link key={child.to} to={child.to}
                          onClick={() => setActiveDropdown(null)}
                          className="block px-4 py-2.5 text-sm text-gray-600 hover:text-teal-700 hover:bg-teal-50 transition-colors">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={link.label} to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${isActive(link.to) && link.to !== "/" ? "text-teal-700 bg-teal-50" : link.to === "/" && location.pathname === "/" ? "text-teal-700 bg-teal-50" : "text-gray-600 hover:text-teal-700 hover:bg-gray-50"}`}>
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            {currentUser ? (
              <>
                {userRole === "admin" && (
                  <Link to="/admin" className="text-xs text-teal-700 font-semibold hover:underline">Admin</Link>
                )}
                <Link to="/portal" className="text-xs text-gray-500 hover:text-teal-600 transition">My Portal</Link>
                <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-red-500 transition">Logout</button>
              </>
            ) : (
              <Link to="/login" className="text-sm text-gray-500 hover:text-teal-600 transition font-medium">Login</Link>
            )}
            <Link to="/book-appointment"
              className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-teal-700 transition shadow-sm">
              Book Appointment
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1 shadow-lg">
          {NAV_LINKS.map((link) => (
            <div key={link.label}>
              <Link to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive(link.to) ? "text-teal-700 bg-teal-50" : "text-gray-700 hover:bg-gray-50"}`}>
                {link.label}
              </Link>
              {/* Mobile sub-links for departments */}
              {link.children && (
                <div className="ml-4 mt-1 space-y-1">
                  {link.children.slice(0, -1).map(child => (
                    <Link key={child.to} to={child.to}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2 text-xs text-gray-500 hover:text-teal-600 transition rounded-lg hover:bg-gray-50">
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="pt-3 border-t border-gray-100 space-y-2">
            {currentUser ? (
              <>
                <Link to="/portal" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm text-gray-600 rounded-lg hover:bg-gray-50">My Portal</Link>
                {userRole === "admin" && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm text-teal-600 font-medium rounded-lg hover:bg-teal-50">Admin Panel</Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2.5 text-sm text-red-500 rounded-lg hover:bg-red-50">Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm text-gray-600 rounded-lg hover:bg-gray-50">Login / Register</Link>
            )}
            <Link to="/book-appointment" onClick={() => setMobileOpen(false)}
              className="block bg-teal-600 text-white px-4 py-3 rounded-xl text-center font-bold hover:bg-teal-700 transition">
              Book Appointment
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}