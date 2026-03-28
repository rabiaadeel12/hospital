import React from "react";
// src/pages/user/BookAppointmentPage.jsx
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";

const departments = ["Cardiology","Pediatrics","Orthopedics","Gynecology","Internal Medicine","Dermatology","ENT","Radiology","General OPD","Emergency"];

export default function BookAppointmentPage() {
  const [form, setForm] = useState({ name:"", phone:"", email:"", department:"", date:"", time:"", notes:"" });
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus("loading");
    try {
      await addDoc(collection(db, "appointments"), {
        ...form,
        status: "pending", // pending | confirmed | cancelled
        createdAt: serverTimestamp(),
      });
      setStatus("success");
      setForm({ name:"", phone:"", email:"", department:"", date:"", time:"", notes:"" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Book an Appointment</h1>
      <p className="text-gray-500 mb-8">Fill in your details and we'll confirm your slot.</p>

      {status === "success" && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mb-6">
          ✅ Appointment request submitted! We'll contact you shortly to confirm.
        </div>
      )}
      {status === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
          ❌ Something went wrong. Please try again or call us directly.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input name="phone" value={form.phone} onChange={handleChange} required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
          <select name="department" value={form.department} onChange={handleChange} required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option value="">Select Department</option>
            {departments.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date *</label>
            <input name="date" type="date" value={form.date} onChange={handleChange} required
              min={new Date().toISOString().split("T")[0]}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time *</label>
            <select name="time" value={form.time} onChange={handleChange} required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="">Select Time</option>
              {["09:00 AM","10:00 AM","11:00 AM","12:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </div>

        <button type="submit" disabled={status === "loading"}
          className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50">
          {status === "loading" ? "Submitting..." : "Request Appointment"}
        </button>
      </form>
    </div>
  );
}
