import React from "react";// src/pages/admin/AdminLoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, userRole } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      // Role check happens in AdminRoute guard
      navigate("/admin");
    } catch (err) {
      setError("Invalid credentials. Admin accounts must be set up in Firebase Console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-teal-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">🔐</div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
          <p className="text-gray-400 text-sm mt-1">Mafaza tul Hayat Hospital CMS</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-teal-700 text-white py-3 rounded-lg font-semibold hover:bg-teal-800 transition disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In as Admin"}
          </button>
        </form>

        <div className="mt-6 bg-gray-50 rounded-lg p-3 text-xs text-gray-500">
          💡 To create an admin account: register a user in Firebase Auth, then manually set their role to <code className="bg-gray-200 px-1 rounded">admin</code> in Firestore → users collection.
        </div>
      </div>
    </div>
  );
}
