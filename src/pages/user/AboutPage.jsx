import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight, Heart, Shield, Users, Award,
  CheckCircle, Quote
} from "lucide-react";

const departments = [
  "Internal Medicine",
  "Diabetes & Metabolic Health Clinic",
  "General & Specialized Surgery",
  "Gynecology & Obstetrics",
  "Pediatrics & Preventive Child Care",
  "Eye Clinic",
  "ENT Clinic",
  "Emergency & Critical Care",
  "Pain & Regenerative Medicine",
  "Cardiology",
  "Gastroenterology",
  "Dental Care Services",
  "Plastic & Reconstructive Surgery",
  "Pharmacy Services",
  "Diagnostic Laboratory Services",
  "Preventive & Community Health",
];

const pillars = [
  {
    number: "01",
    title: "Ethical Integrity",
    desc: "No unnecessary investigations. No commercial bias. Separate treatment facilities for male and female patients. Transparent pricing and honest consultation.",
    color: "teal",
  },
  {
    number: "02",
    title: "Evidence-Based Medicine",
    desc: "Treatment plans aligned with internationally recognized clinical guidelines and current best practices.",
    color: "blue",
  },
  {
    number: "03",
    title: "Cost-Effective Accessibility",
    desc: "Designed to serve both underserved populations and families seeking reliable, specialized care at minimal cost.",
    color: "emerald",
  },
];

const values = [
  { icon: <Heart size={22} className="text-teal-600" />, title: "Compassionate Care", desc: "We treat every patient with dignity, empathy, and respect — because healthcare is deeply personal." },
  { icon: <Shield size={22} className="text-teal-600" />, title: "Patient Safety", desc: "Every protocol is designed to protect you. Safety is never compromised." },
  { icon: <Users size={22} className="text-teal-600" />, title: "Specialist Team", desc: "National and internationally trained consultants working in coordinated, multi-specialty teams." },
  { icon: <Award size={22} className="text-teal-600" />, title: "Non-Profit Mission", desc: "A non-profit institution committed to financial transparency and community health above profit." },
];

const whyChoose = [
  "Dedicated specialist consultants",
  "Structured multi-department coordination",
  "Transparent and affordable pricing",
  "Ethical treatment approach",
  "Emergency and routine care services",
  "Community trust and patient satisfaction",
];

const stats = [
  { value: "16+", label: "Clinical Departments" },
  { value: "Non-Profit", label: "Institution" },
  { value: "24/7", label: "Emergency Care" },
  { value: "Ethical", label: "Care First" },
];

export default function AboutPage() {
  const [expandedLeader, setExpandedLeader] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-teal-800 via-teal-700 to-teal-900 text-white py-20 px-4 relative overflow-hidden">
        {/* subtle background pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="max-w-5xl mx-auto text-center relative">
          <p className="text-teal-300 text-sm font-semibold uppercase tracking-widest mb-4">Our Story & Mission</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
            About Mafaza tul Hayat
          </h1>
          <p className="text-teal-100 text-xl max-w-3xl mx-auto leading-relaxed mb-6">
            Compassionate, Ethical & Evidence-Based Care — For Every Family
          </p>
          <div className="inline-block bg-white/10 border border-white/20 rounded-2xl px-6 py-3 text-teal-100 text-sm max-w-xl">
            "Our Responsibility is to Provide Ethical and Modest Patient Care with Minimal Cost."
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="max-w-5xl mx-auto px-4 -mt-10 mb-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="bg-white rounded-2xl p-5 text-center shadow-md border border-teal-50">
              <div className="text-2xl font-bold text-teal-600 mb-1">{value}</div>
              <div className="text-sm text-gray-500 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="max-w-5xl mx-auto px-4 mb-16">
        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-5">Who We Are</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Mafaza tul Hayat Hospital is a <strong>non-profit, specialized healthcare institution</strong> committed to delivering multi-specialty medical, surgical, maternity, and pediatric services under one roof.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                With 16 structured clinical departments and a dedicated team of national and internationally trained consultants, the hospital provides cost-effective, ethical, and evidence-based treatment options aligned with modern medical standards and patient dignity.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our institutional philosophy emphasizes clinical excellence rooted in scientific evidence, ethical decision-making, affordability without compromise on quality, and respectful patient-centered care.
              </p>
              <Link to="/departments" className="flex items-center gap-2 text-teal-600 font-semibold hover:gap-3 transition-all w-fit">
                Explore Our Departments <ChevronRight size={16} />
              </Link>
            </div>
            <div className="space-y-3">
              {[
                "Clinical excellence rooted in scientific evidence",
                "Ethical decision-making in diagnostics and treatment",
                "Affordability without compromise on quality",
                "Respectful, patient-centered care",
                "Community outreach and preventive health education",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-teal-50 rounded-xl p-3.5">
                  <CheckCircle size={18} className="text-teal-500 mt-0.5 shrink-0" />
                  <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Three Pillars ── */}
      <section className="bg-teal-800 text-white py-16 px-4 mb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">Our Healthcare Model</h2>
          <p className="text-teal-300 text-center mb-10 max-w-xl mx-auto">
            Treatment decisions at Mafaza tul Hayat are guided by three foundational pillars.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map(({ number, title, desc }) => (
              <div key={number} className="bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors">
                <div className="text-4xl font-black text-teal-400 mb-4 opacity-80">{number}</div>
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-teal-100 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Departments ── */}
      <section className="max-w-5xl mx-auto px-4 mb-16">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Clinical Departments</h2>
          <p className="text-gray-500 mb-8">
            Our multidisciplinary system ensures coordinated care across {departments.length} specialties, each following structured clinical protocols and peer-reviewed guidelines.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {departments.map((dept, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 hover:bg-teal-50 hover:border-teal-100 border border-transparent transition-colors">
                <div className="w-2 h-2 bg-teal-500 rounded-full shrink-0" />
                <span className="text-gray-700 text-sm font-medium">{dept}</span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link to="/departments" className="flex items-center gap-2 text-teal-600 font-semibold hover:gap-3 transition-all w-fit text-sm">
              View All Departments <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-white py-16 px-4 mb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-3">Our Values</h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            The principles that guide every decision, every consultation, and every interaction at our hospital.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon, title, desc }) => (
              <div key={title} className="text-center p-6 rounded-2xl hover:bg-teal-50 transition-colors">
                <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leadership ── */}
      <section className="max-w-5xl mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-3">Leadership & Governance</h2>
        <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
          Guided by visionary leadership committed to ethical, evidence-based, and accessible healthcare.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Medical In-Charge */}
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-teal-50">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-700 font-black text-2xl shrink-0">
                M
              </div>
              <div>
                <p className="text-xs text-teal-600 font-semibold uppercase tracking-wider mb-1">Medical In-Charge</p>
                <h3 className="text-xl font-bold text-gray-800">Dr. Muhammad Asad Raza</h3>
                <p className="text-sm text-gray-500">Consultant Physician & Clinical Strategist</p>
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Dr. Muhammad Asad Raza oversees clinical governance, protocol development, quality assurance, and multidisciplinary coordination — ensuring standardized treatment pathways, rational prescription practices, and ethical compliance across all departments.
            </p>

            <div className="space-y-2 mb-5">
              {["Standardized treatment pathways", "Rational prescription practices", "Ethical compliance across departments", "Continuous professional training for staff", "Quality improvement audits"].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                  <CheckCircle size={13} className="text-teal-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            {/* Quote */}
            <div className="bg-teal-50 rounded-xl p-4 relative">
              <Quote size={16} className="text-teal-300 mb-2" />
              <p className="text-sm text-teal-800 italic leading-relaxed">
                "Our mission is to restore trust in healthcare by ensuring that every clinical decision is guided by ethics, evidence, and empathy. Medicine is not merely about disease management — it is about preserving human dignity."
              </p>
            </div>
          </div>

          {/* Chairman */}
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-teal-50">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-700 font-black text-2xl shrink-0">
                A
              </div>
              <div>
                <p className="text-xs text-teal-600 font-semibold uppercase tracking-wider mb-1">Chairman</p>
                <h3 className="text-xl font-bold text-gray-800">Agha Syed Jawad Naqvi</h3>
                <p className="text-sm text-gray-500">Chairman – Mafaza tul Hayat Healthcare</p>
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Under the visionary leadership of Agha Syed Jawad Naqvi, Mafaza tul Hayat Hospital was established as a non-profit healthcare initiative addressing the growing need for structured, ethical, and accessible medical services.
            </p>

            <div className="space-y-2 mb-5">
              {["Ethical and evidence-based patient care with modesty", "Sustainable non-profit healthcare models", "Expansion of specialty services", "Community-oriented healthcare programs", "Financial transparency and institutional accountability"].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                  <CheckCircle size={13} className="text-teal-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            {/* Quote */}
            <div className="bg-teal-50 rounded-xl p-4 relative">
              <Quote size={16} className="text-teal-300 mb-2" />
              <p className="text-sm text-teal-800 italic leading-relaxed">
                "Healthcare must serve humanity with Modesty and Respect. Our institution stands for integrity, affordability, and compassionate service with 'Haya and Hayat' — ensuring that quality medical care remains accessible to every segment of society."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="bg-teal-50 py-16 px-4 mb-0">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-3">Why Patients Choose Us</h2>
          <p className="text-gray-500 text-center mb-10">
            Thousands of families across Lahore trust Mafaza tul Hayat for their healthcare needs.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {whyChoose.map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white rounded-xl px-5 py-4 shadow-sm">
                <CheckCircle size={20} className="text-teal-500 shrink-0" />
                <span className="text-gray-700 font-medium text-sm">{item}</span>
              </div>
            ))}
          </div>

          {/* Community commitment */}
          <div className="bg-teal-700 text-white rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-3">Community Commitment</h3>
            <p className="text-teal-100 mb-5 max-w-2xl mx-auto">
              As a non-profit institution, we actively promote preventive health education, free or subsidized care programs, public awareness initiatives, responsible prescription culture, and community health outreach services.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/book-appointment" className="bg-white text-teal-700 px-7 py-3 rounded-xl font-bold hover:bg-teal-50 transition">
                Book Appointment
              </Link>
              <Link to="/contact" className="border border-white/60 text-white px-7 py-3 rounded-xl font-bold hover:bg-white/10 transition">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}