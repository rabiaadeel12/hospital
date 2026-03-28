import React from "react";// src/pages/user/LoginPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name:"", email:"", phone:"", password:"", confirm:"" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, registerPatient, userRole } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
        // Role is fetched async in AuthContext — wait briefly then redirect
        // We read from Firestore directly here for immediate redirect
        const { getDoc, doc } = await import("firebase/firestore");
        const { db } = await import("../../firebase/config");
        const { auth } = await import("../../firebase/config");
        const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
        const role = snap.exists() ? snap.data().role : "patient";
        // Admin can go anywhere — default to portal, patient goes to portal only
        navigate(role === "admin" ? "/admin" : "/portal");
      } else {
        if (form.password !== form.confirm) throw new Error("Passwords do not match.");
        await registerPatient(form.email, form.password, form.name, form.phone);
        navigate("/portal");
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">M</div>
          <h1 className="text-2xl font-bold text-gray-800">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {mode === "login" ? "Sign in to your patient portal" : "Register as a new patient"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input name="confirm" type="password" value={form.confirm} onChange={handleChange} required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50">
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-500">
          {mode === "login" ? (
            <>Don't have an account?{" "}
              <button onClick={() => setMode("register")} className="text-teal-600 font-semibold hover:underline">Register</button>
            </>
          ) : (
            <>Already have an account?{" "}
              <button onClick={() => setMode("login")} className="text-teal-600 font-semibold hover:underline">Sign In</button>
            </>
          )}
        </div>

        <div className="mt-4 text-center text-xs text-gray-400">
          Admin? <Link to="/admin/login" className="text-teal-500 hover:underline">Admin Login →</Link>
        </div>
      </div>
    </div>
  );
}