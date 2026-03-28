// src/components/admin/AdminUI.jsx
// Shared UI primitives used across all admin modules
import React from "react";
import { X, Loader2, AlertCircle, ChevronDown } from "lucide-react";

// ── Modal ──────────────────────────────────────────────────────
export function Modal({ title, onClose, children, size = "md" }) {
  const widths = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl", xl: "max-w-6xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`bg-[#1a1d23] border border-white/10 rounded-2xl w-full ${widths[size]} shadow-2xl flex flex-col max-h-[90vh]`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
          <h2 className="text-white font-semibold text-lg">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition p-1 rounded-lg hover:bg-white/10">
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ── Field ──────────────────────────────────────────────────────
export function Field({ label, required, hint, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

// ── Input ──────────────────────────────────────────────────────
const inputCls = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition";

export function Input({ ...props }) {
  return <input {...props} className={inputCls} />;
}

export function Textarea({ rows = 4, ...props }) {
  return <textarea rows={rows} {...props} className={inputCls + " resize-y"} />;
}

export function Select({ children, ...props }) {
  return (
    <div className="relative">
      <select {...props} className={inputCls + " appearance-none pr-8"}>
        {children}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}

// ── Toggle ─────────────────────────────────────────────────────
export function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={`w-10 h-5 rounded-full transition-colors relative ${checked ? "bg-teal-500" : "bg-white/20"}`}
      >
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </div>
      <span className="text-sm text-gray-300">{label}</span>
    </label>
  );
}

// ── Status Badge ───────────────────────────────────────────────
export function Badge({ status, customLabel }) {
  const map = {
    active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    inactive: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    published: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    draft: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    confirmed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
    new: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    reviewing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    shortlisted: "bg-teal-500/20 text-teal-400 border-teal-500/30",
    rejected: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${map[status] || map.inactive}`}>
      {customLabel || status}
    </span>
  );
}

// ── Save Button ────────────────────────────────────────────────
export function SaveButton({ loading, label = "Save", onClick, type = "button" }) {
  return (
    <button type={type} onClick={onClick} disabled={loading}
      className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition disabled:opacity-50">
      {loading && <Loader2 size={14} className="animate-spin" />}
      {loading ? "Saving..." : label}
    </button>
  );
}

// ── Empty State ────────────────────────────────────────────────
export function EmptyState({ icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <div className="text-white font-medium mb-1">{title}</div>
      <div className="text-gray-500 text-sm mb-5">{desc}</div>
      {action}
    </div>
  );
}

// ── Section Header ─────────────────────────────────────────────
export function SectionHeader({ title, desc, action }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        {desc && <p className="text-gray-400 text-sm mt-0.5">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Add Button ─────────────────────────────────────────────────
export function AddButton({ label, onClick }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
      <span className="text-lg leading-none">+</span> {label}
    </button>
  );
}

// ── Table ──────────────────────────────────────────────────────
export function Table({ cols, children }) {
  return (
    <div className="bg-[#1a1d23] border border-white/10 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            {cols.map((c) => (
              <th key={c} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Tr({ children, onClick }) {
  return (
    <tr onClick={onClick} className={`border-b border-white/5 last:border-0 hover:bg-white/5 transition ${onClick ? "cursor-pointer" : ""}`}>
      {children}
    </tr>
  );
}

export function Td({ children, muted }) {
  return (
    <td className={`px-4 py-3 ${muted ? "text-gray-500" : "text-gray-200"}`}>
      {children}
    </td>
  );
}

// ── Error ──────────────────────────────────────────────────────
export function ErrorMsg({ msg }) {
  return msg ? (
    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 mb-4">
      <AlertCircle size={14} /> {msg}
    </div>
  ) : null;
}

// ── Tag input ─────────────────────────────────────────────────
export function TagInput({ tags = [], onChange, placeholder = "Add tag..." }) {
  const [val, setVal] = useState("");
  const add = (e) => {
    if ((e.key === "Enter" || e.key === ",") && val.trim()) {
      e.preventDefault();
      if (!tags.includes(val.trim())) onChange([...tags, val.trim()]);
      setVal("");
    }
  };
  const remove = (t) => onChange(tags.filter((x) => x !== t));
  return (
    <div className="flex flex-wrap gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 min-h-[42px]">
      {tags.map((t) => (
        <span key={t} className="flex items-center gap-1 bg-teal-500/20 text-teal-300 text-xs px-2 py-1 rounded-full">
          {t}
          <button onClick={() => remove(t)} className="hover:text-white"><X size={10} /></button>
        </span>
      ))}
      <input value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={add}
        placeholder={placeholder}
        className="flex-1 min-w-[100px] bg-transparent text-sm text-white placeholder-gray-500 outline-none" />
    </div>
  );
}

import { useState } from "react";
