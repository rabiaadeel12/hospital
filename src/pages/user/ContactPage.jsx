// src/pages/user/ContactPage.jsx
import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Phone, Mail, MapPin, Clock, MessageCircle, CheckCircle } from "lucide-react";

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus("loading");
    try {
      await addDoc(collection(db, "contactInquiries"), {
        ...form,
        createdAt: serverTimestamp(),
        isRead: false,
      });
      setStatus("success");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const contactItems = [
    { icon: <Phone size={20} className="text-teal-600" />, label: "Emergency / OPD", value: "+923364404140", href: "tel:+923364404140" },
    { icon: <MessageCircle size={20} className="text-teal-600" />, label: "WhatsApp", value: "+923364404140", href: "https://wa.me/923364404140" },
    { icon: <Mail size={20} className="text-teal-600" />, label: "Email", value: "info@mafazahospital.com", href: "mailto:info@mafazahospital.com" },
    { icon: <MapPin size={20} className="text-teal-600" />, label: "Address", value: "[Hospital Address], Lahore, Pakistan", href: null },
    { icon: <Clock size={20} className="text-teal-600" />, label: "Hours", value: "Open 24 hours, 7 days a week", href: null },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 to-teal-900 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-teal-300 text-sm font-semibold uppercase tracking-widest mb-3">Get In Touch</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-teal-100 text-lg max-w-xl mx-auto">
            We're here to help. Reach out for appointments, inquiries, or any assistance you need.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">How to Reach Us</h2>
            <div className="space-y-4 mb-10">
              {contactItems.map((item, i) => (
                <div key={i} className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
                  <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                        className="text-gray-800 font-medium hover:text-teal-600 transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-gray-800 font-medium">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="bg-teal-50 border-2 border-dashed border-teal-200 rounded-2xl h-52 flex flex-col items-center justify-center text-teal-400 gap-2">
              <MapPin size={32} />
              <p className="text-sm font-medium">Map coming soon</p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send a Message</h2>

            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle size={56} className="text-teal-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                <p className="text-gray-500 mb-6">We'll get back to you within 24 hours.</p>
                <button onClick={() => setStatus(null)} className="text-teal-600 hover:underline text-sm">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-2xl p-6 shadow-sm">
                {status === "error" && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3">
                    Something went wrong. Please try again or call us directly.
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input name="subject" value={form.subject} onChange={handleChange}
                    placeholder="e.g. Appointment inquiry, Lab report, Feedback..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition resize-none" />
                </div>

                <button type="submit" disabled={status === "loading"}
                  className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition disabled:opacity-50">
                  {status === "loading" ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

