import React, { useState } from "react";
import { useCollection } from "../../hooks/useCollection";
import { FileText, Download, ChevronDown, ChevronUp } from "lucide-react";

const TYPES = [
  { value: "all", label: "All" },
  { value: "faq", label: "❓ FAQs" },
  { value: "form", label: "📋 Patient Forms" },
  { value: "insurance", label: "🛡️ Insurance & Billing" },
  { value: "pricing", label: "💰 Pricing" },
  { value: "policy", label: "📜 Appointment Policy" },
  { value: "payment", label: "💳 Payment Options" },
];

export default function PatientResourcesPage() {
  const { docs: resources, loading } = useCollection("patientResources", "order");
  const [activeType, setActiveType] = useState("all");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const active = resources.filter(r => r.isActive);
  const filtered = activeType === "all" ? active : active.filter(r => r.type === activeType);

  const faqs = filtered.filter(r => r.type === "faq");
  const nonFaqs = filtered.filter(r => r.type !== "faq");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 to-teal-900 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-teal-300 text-sm font-semibold uppercase tracking-widest mb-3">Patient Support</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Patient Resources</h1>
          <p className="text-teal-100 text-lg max-w-xl mx-auto">
            Forms, insurance information, pricing guides, FAQs, and everything you need for your visit.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Type filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {TYPES.map(t => (
            <button key={t.value} onClick={() => setActiveType(t.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeType === t.value ? "bg-teal-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-teal-300"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-xl p-5 shadow-sm animate-pulse h-16" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <FileText size={48} className="mx-auto mb-4 opacity-30" />
            <p>No resources available yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* FAQs — accordion style */}
            {faqs.length > 0 && (activeType === "all" || activeType === "faq") && (
              <div>
                {activeType === "all" && <h2 className="text-xl font-bold text-gray-800 mb-4">❓ Frequently Asked Questions</h2>}
                <div className="space-y-2">
                  {faqs.map(r => (
                    <div key={r.id} className="bg-white rounded-xl shadow-sm border border-transparent hover:border-teal-100 transition">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === r.id ? null : r.id)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left">
                        <span className="font-semibold text-gray-800 pr-4">{r.title}</span>
                        {expandedFaq === r.id
                          ? <ChevronUp size={18} className="text-teal-600 shrink-0" />
                          : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
                      </button>
                      {expandedFaq === r.id && r.content && (
                        <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-3">
                          {r.content}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Non-FAQ resources — card style */}
            {nonFaqs.length > 0 && (
              <div>
                {activeType === "all" && <h2 className="text-xl font-bold text-gray-800 mb-4">📂 Documents & Information</h2>}
                <div className="space-y-3">
                  {nonFaqs.map(r => {
                    const typeLabel = TYPES.find(t => t.value === r.type)?.label || r.type;
                    return (
                      <div key={r.id} className="bg-white rounded-xl p-5 shadow-sm flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full font-medium">{typeLabel}</span>
                            {r.category && <span className="text-xs text-gray-400">{r.category}</span>}
                          </div>
                          <h3 className="font-semibold text-gray-800 mb-1">{r.title}</h3>
                          {r.content && <p className="text-sm text-gray-500 leading-relaxed">{r.content}</p>}
                        </div>
                        {r.fileUrl && (
                          <a href={r.fileUrl} target="_blank" rel="noopener noreferrer"
                            className="shrink-0 flex items-center gap-1.5 bg-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-teal-700 transition">
                            <Download size={14} /> Download
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}