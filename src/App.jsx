import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PrivateRoute, AdminRoute, PatientRoute } from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// User Pages
import HomePage from "./pages/user/HomePage";
import LoginPage from "./pages/user/LoginPage";
import BookAppointmentPage from "./pages/user/BookAppointmentPage";

// Admin Pages
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Patient Portal
import PatientPortal from "./pages/portal/PatientPortal";

// Placeholder for pages to be built
const Placeholder = ({ title }) => (
  <div className="max-w-4xl mx-auto px-4 py-20 text-center">
    <h1 className="text-3xl font-bold text-gray-800 mb-3">{title}</h1>
    <p className="text-gray-400">This page is under construction. Coming soon!</p>
  </div>
);

// Layout wrapper for public pages (with Navbar + Footer)
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="min-h-screen">{children}</main>
    <Footer />
  </>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── PUBLIC ROUTES (with Navbar + Footer) ── */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
          <Route path="/book-appointment" element={<PublicLayout><BookAppointmentPage /></PublicLayout>} />
          <Route path="/departments" element={<PublicLayout><Placeholder title="Departments" /></PublicLayout>} />
          <Route path="/departments/:slug" element={<PublicLayout><Placeholder title="Department Detail" /></PublicLayout>} />
          <Route path="/doctors" element={<PublicLayout><Placeholder title="Doctors & Consultants" /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><Placeholder title="Our Services" /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><Placeholder title="Health Blog" /></PublicLayout>} />
          <Route path="/blog/:slug" element={<PublicLayout><Placeholder title="Blog Post" /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Placeholder title="Contact Us" /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><Placeholder title="About Us" /></PublicLayout>} />
          <Route path="/privacy-policy" element={<PublicLayout><Placeholder title="Privacy Policy" /></PublicLayout>} />
          <Route path="/terms" element={<PublicLayout><Placeholder title="Terms & Conditions" /></PublicLayout>} />
          <Route path="/careers" element={<PublicLayout><Placeholder title="Careers" /></PublicLayout>} />

          {/* ── PATIENT PORTAL ── */}
          <Route path="/portal" element={
            <PatientRoute>
              <PublicLayout><PatientPortal /></PublicLayout>
            </PatientRoute>
          } />

          {/* ── ADMIN ROUTES (no public layout) ── */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/*" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<PublicLayout><Placeholder title="404 — Page Not Found" /></PublicLayout>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
