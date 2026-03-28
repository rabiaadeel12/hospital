import React from "react";// src/pages/admin/AdminDashboard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCollection } from "../../hooks/useCollection";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";

// Modules
import DepartmentsManager from "./modules/DepartmentsManager";
import DoctorsManager from "./modules/DoctorsManager";
import ServicesManager from "./modules/ServicesManager";
import PatientResourcesManager from "./modules/PatientResourcesManager";
import HealthEducationManager from "./modules/HealthEducationManager";
import CareersManager from "./modules/CareersManager";
import MediaGalleryManager from "./modules/MediaGalleryManager";

import {
  LayoutDashboard, Building2, Stethoscope, HeartPulse,
  FolderHeart, BookOpen, Briefcase, ImageIcon,
  Calendar, LogOut, ChevronRight, Menu, X
} from "lucide-react";

const NAV = [
  {
    section: "Content",
    items: [
      { id: "overview",         label: "Overview",          icon: LayoutDashboard },
      { id: "departments",      label: "Departments",       icon: Building2 },
      { id: "doctors",          label: "Doctors",           icon: Stethoscope },
      { id: "services",         label: "Services",          icon: HeartPulse },
    ]
  },
  {
    section: "Patient",
    items: [
      { id: "appointments",     label: "Appointments",      icon: Calendar },
      { id: "patientResources", label: "Patient Resources", icon: FolderHeart },
    ]
  },
  {
    section: "Publishing",
    items: [
      { id: "healthEducation",  label: "Health Education",  icon: BookOpen },
      { id: "careers",          label: "Careers",           icon: Briefcase },
      { id: "media",            label: "Media Gallery",     icon: ImageIcon },
    ]
  }
];

// ── Appointments Module (inline) ───────────────────────────────
function AppointmentsManager() {
  const { docs: appointments, loading } = useCollection("appointments", "createdAt");
  const statusCls = {
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    confirmed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  const update = async (id, status) => {
    await updateDoc(doc(db, "appointments", id), { status });
  };
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Appointments</h1>
        <p className="text-gray-400 text-sm mt-0.5">{appointments.filter(a => a.status === "pending").length} pending review</p>
      </div>
      {loading ? <div className="text-gray-400 text-sm">Loading...</div> : (
        <div className="bg-[#1a1d23] border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {["Patient","Department","Date & Time","Notes","Status","Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-gray-500">No appointments yet.</td></tr>
              )}
              {appointments.map(apt => (
                <tr key={apt.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition">
                  <td className="px-4 py-3">
                    <div className="text-white font-medium">{apt.name}</div>
                    <div className="text-xs text-gray-500">{apt.phone} · {apt.email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{apt.department}</td>
                  <td className="px-4 py-3 text-gray-300">{apt.date}<br/><span className="text-gray-500 text-xs">{apt.time}</span></td>
                  <td className="px-4 py-3 text-gray-400 text-xs max-w-xs truncate">{apt.notes || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${statusCls[apt.status] || statusCls.pending}`}>
                      {apt.status || "pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {apt.status !== "confirmed" && (
                        <button onClick={() => update(apt.id, "confirmed")} className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-lg hover:bg-emerald-500/30 transition">Confirm</button>
                      )}
                      {apt.status !== "cancelled" && (
                        <button onClick={() => update(apt.id, "cancelled")} className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-1 rounded-lg hover:bg-red-500/30 transition">Cancel</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Overview (inline) ──────────────────────────────────────────
function Overview({ onNavigate }) {
  const { docs: appointments } = useCollection("appointments", "createdAt");
  const { docs: doctors } = useCollection("doctors", "order");
  const { docs: departments } = useCollection("departments", "order");
  const { docs: posts } = useCollection("healthEducation", "createdAt");
  const { docs: jobs } = useCollection("careers", "createdAt");
  const { docs: media } = useCollection("mediaGallery", "order");

  const pending = appointments.filter(a => a.status === "pending").length;
  const stats = [
    { id:"appointments", label:"Appointments", value: appointments.length, sub:`${pending} pending`, grad:"from-blue-600/20 to-blue-500/5 border-blue-500/20", accent:"text-blue-400" },
    { id:"doctors",      label:"Doctors",      value: doctors.length,      sub:`${doctors.filter(d=>d.isActive).length} active`, grad:"from-teal-600/20 to-teal-500/5 border-teal-500/20", accent:"text-teal-400" },
    { id:"departments",  label:"Departments",  value: departments.length,  sub:`${departments.filter(d=>d.isActive).length} active`, grad:"from-violet-600/20 to-violet-500/5 border-violet-500/20", accent:"text-violet-400" },
    { id:"healthEducation", label:"Blog Posts", value: posts.length,       sub:`${posts.filter(p=>p.isPublished).length} published`, grad:"from-amber-600/20 to-amber-500/5 border-amber-500/20", accent:"text-amber-400" },
    { id:"careers",      label:"Job Openings", value: jobs.filter(j=>j.isActive).length, sub:`${jobs.length} total`, grad:"from-rose-600/20 to-rose-500/5 border-rose-500/20", accent:"text-rose-400" },
    { id:"media",        label:"Media Items",  value: media.length,        sub:`${media.filter(m=>m.isPublished).length} published`, grad:"from-emerald-600/20 to-emerald-500/5 border-emerald-500/20", accent:"text-emerald-400" },
  ];
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome to the Mafaza tul Hayat Hospital CMS.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {stats.map(({ id, label, value, sub, grad, accent }) => (
          <button key={id} onClick={() => onNavigate(id)}
            className={`bg-gradient-to-br ${grad} border rounded-2xl p-5 text-left hover:scale-[1.02] transition`}>
            <div className={`text-3xl font-bold ${accent}`}>{value}</div>
            <div className="text-white font-medium mt-1">{label}</div>
            <div className="text-gray-400 text-xs mt-0.5">{sub}</div>
          </button>
        ))}
      </div>
      <div>
        <h2 className="text-base font-semibold text-white mb-3">Recent Appointments</h2>
        <div className="bg-[#1a1d23] border border-white/10 rounded-xl overflow-hidden">
          {appointments.slice(0, 5).map((apt) => (
            <div key={apt.id} className="flex items-center justify-between px-4 py-3 border-b border-white/5 last:border-0">
              <div>
                <div className="text-white text-sm font-medium">{apt.name}</div>
                <div className="text-gray-500 text-xs">{apt.department} · {apt.date}</div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize
                ${apt.status === "confirmed" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  : apt.status === "cancelled" ? "bg-red-500/20 text-red-400 border-red-500/30"
                  : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"}`}>
                {apt.status || "pending"}
              </span>
            </div>
          ))}
          {appointments.length === 0 && <div className="text-center py-8 text-gray-500 text-sm">No appointments yet.</div>}
        </div>
      </div>
    </div>
  );
}

// ── Shell ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [active, setActive] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const { docs: appointments } = useCollection("appointments", "createdAt");
  const pendingCount = appointments.filter(a => a.status === "pending").length;

  const handleLogout = async () => { await logout(); navigate("/"); };

  const VIEWS = {
    overview: <Overview onNavigate={setActive} />,
    departments: <DepartmentsManager />,
    doctors: <DoctorsManager />,
    services: <ServicesManager />,
    appointments: <AppointmentsManager />,
    patientResources: <PatientResourcesManager />,
    healthEducation: <HealthEducationManager />,
    careers: <CareersManager />,
    media: <MediaGalleryManager />,
  };

  const activeLabel = NAV.flatMap(n => n.items).find(i => i.id === active)?.label || "Overview";

  return (
    <div className="flex h-screen bg-[#13151a] overflow-hidden" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Sidebar */}
      <aside className={`${collapsed ? "w-[60px]" : "w-[220px]"} bg-[#0d0f12] border-r border-white/[0.07] flex flex-col transition-all duration-200 shrink-0`}>
        {/* Logo row */}
        <div className="h-14 flex items-center justify-between px-3.5 border-b border-white/[0.07] shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-teal-600 rounded-md flex items-center justify-center text-white font-bold text-xs">M</div>
              <span className="text-white font-semibold text-sm">Hospital CMS</span>
            </div>
          )}
          <button onClick={() => setCollapsed(c => !c)} className="text-gray-600 hover:text-gray-300 p-1 rounded transition ml-auto">
            <Menu size={15} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3 overflow-y-auto space-y-4">
          {NAV.map(({ section, items }) => (
            <div key={section}>
              {!collapsed && (
                <div className="px-4 mb-1 text-[9px] font-bold uppercase tracking-[0.12em] text-gray-700">{section}</div>
              )}
              {items.map(({ id, label, icon: Icon }) => {
                const isActive = active === id;
                const badge = id === "appointments" && pendingCount > 0 ? pendingCount : null;
                return (
                  <button key={id} onClick={() => setActive(id)} title={collapsed ? label : undefined}
                    className={`w-full flex items-center gap-2.5 py-2 px-3.5 text-sm transition group relative
                      ${isActive ? "text-teal-300 bg-teal-500/10" : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]"}`}>
                    <Icon size={15} className="shrink-0" />
                    {!collapsed && <span className="flex-1 text-left font-medium">{label}</span>}
                    {!collapsed && badge && (
                      <span className="bg-red-500 text-white text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1">
                        {badge}
                      </span>
                    )}
                    {isActive && <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-teal-500 rounded-l" />}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom user row */}
        <div className="border-t border-white/[0.07] p-3 flex items-center gap-2">
          <div className="w-6 h-6 bg-teal-600/20 rounded-full flex items-center justify-center text-teal-400 text-[10px] font-bold shrink-0">
            {currentUser?.email?.[0]?.toUpperCase()}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs truncate">{currentUser?.email}</div>
              <div className="text-gray-600 text-[10px]">Admin</div>
            </div>
          )}
          <button onClick={handleLogout} title="Logout" className="text-gray-600 hover:text-red-400 transition p-1 shrink-0">
            <LogOut size={13} />
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Topbar */}
        <div className="h-14 border-b border-white/[0.07] flex items-center justify-between px-6 shrink-0 bg-[#13151a] sticky top-0 z-10">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <span>Admin</span>
            <ChevronRight size={13} />
            <span className="text-gray-200 font-medium">{activeLabel}</span>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="text-xs text-gray-600 hover:text-teal-400 transition">
            View Site ↗
          </a>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 max-w-7xl w-full">
          {VIEWS[active] || <div className="text-gray-400">Coming soon.</div>}
        </div>
      </main>
    </div>
  );
}
