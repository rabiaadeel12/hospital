import React from "react";// src/pages/admin/resources/PatientResourcesAdmin.jsx
import { useState } from "react";
import { useCollection } from "../../hooks/useCollection";
import {
  Modal, Field, Input, Textarea, Select, Toggle,
  DataTable, PageHeader, SaveButton, Badge, SectionCard, useConfirmDelete
} from "../../components/AdminUI";
import { Plus, Pencil, Trash2, FileText, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

const RESOURCE_TYPES = [
  { value: "form", label: "📋 Patient Form" },
  { value: "insurance", label: "🛡 Insurance Info" },
  { value: "pricing", label: "💰 Pricing & Fees" },
  { value: "policy", label: "📜 Appointment Policy" },
  { value: "payment", label: "💳 Payment Options" },
];

const FAQ_CATEGORIES = ["General", "Billing", "Appointments", "Insurance", "Lab Tests", "Emergency"];

const emptyResource = { type: "form", title: "", description: "", content: "", fileUrl: "", isActive: true, order: 0 };
const emptyFaq = { question: "", answer: "", category: "General", order: 0, isActive: true };

export default function PatientResourcesAdmin() {
  const { items: resources, loading: rLoading, add: addResource, update: updateResource, remove: removeResource } = useCollection("patientResources");
  const { items: faqs, loading: fLoading, add: addFaq, update: updateFaq, remove: removeFaq } = useCollection("faqs");

  const [activeTab, setActiveTab] = useState("resources"); // "resources" | "faqs"
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyResource);
  const [faqForm, setFaqForm] = useState(emptyFaq);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));
  const setFaq = (f, v) => setFaqForm(p => ({ ...p, [f]: v }));

  // Resources
  const openAddResource = () => { setForm(emptyResource); setEditId(null); setModal("resource"); };
  const openEditResource = (r) => { setForm({ ...emptyResource, ...r }); setEditId(r.id); setModal("resource"); };

  const handleSaveResource = async () => {
    if (!form.title.trim()) return alert("Title is required.");
    setSaving(true);
    try {
      if (editId) await updateResource(editId, form);
      else await addResource(form);
      setModal(null);
    } catch (e) { alert("Error: " + e.message); }
    setSaving(false);
  };

  // FAQs
  const openAddFaq = () => { setFaqForm(emptyFaq); setEditId(null); setModal("faq"); };
  const openEditFaq = (f) => { setFaqForm({ ...emptyFaq, ...f }); setEditId(f.id); setModal("faq"); };

  const handleSaveFaq = async () => {
    if (!faqForm.question.trim() || !faqForm.answer.trim()) return alert("Question and Answer are required.");
    setSaving(true);
    try {
      if (editId) await updateFaq(editId, faqForm);
      else await addFaq(faqForm);
      setModal(null);
    } catch (e) { alert("Error: " + e.message); }
    setSaving(false);
  };

  const confirmDeleteResource = useConfirmDelete(removeResource);
  const confirmDeleteFaq = useConfirmDelete(removeFaq);

  const typeLabel = (type) => RESOURCE_TYPES.find(t => t.value === type)?.label || type;
  const typeBadgeColor = { form: "blue", insurance: "teal", pricing: "green", policy: "purple", payment: "yellow" };

  const resourceColumns = [
    { key: "type", label: "Type", render: r => <Badge label={typeLabel(r.type)} color={typeBadgeColor[r.type] || "gray"} /> },
    { key: "title", label: "Title", render: r => <span className="font-medium text-gray-800">{r.title}</span> },
    { key: "description", label: "Description", render: r => <span className="text-gray-500 text-sm line-clamp-1 max-w-xs block">{r.description}</span> },
    { key: "fileUrl", label: "PDF", render: r => r.fileUrl ? (
      <a href={r.fileUrl} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline text-xs">View File</a>
    ) : <span className="text-gray-300 text-xs">None</span> },
    { key: "isActive", label: "Status", render: r => <Badge label={r.isActive ? "Active" : "Hidden"} color={r.isActive ? "green" : "gray"} /> },
    { key: "actions", label: "Actions", render: r => (
      <div className="flex gap-2">
        <button onClick={() => openEditResource(r)} className="text-blue-500 hover:text-blue-700 p-1 transition"><Pencil size={15} /></button>
        <button onClick={() => confirmDeleteResource(r.id, r.title)} className="text-red-400 hover:text-red-600 p-1 transition"><Trash2 size={15} /></button>
      </div>
    )},
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patient Resources</h1>
          <p className="text-gray-500 text-sm mt-1">{resources.length} resources · {faqs.length} FAQs</p>
        </div>
        <button
          onClick={activeTab === "resources" ? openAddResource : openAddFaq}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition">
          <Plus size={16} /> {activeTab === "resources" ? "Add Resource" : "Add FAQ"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-5">
        {[["resources","📋 Resources"],["faqs","❓ FAQs"]].map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`px-5 py-2 text-sm font-medium border-b-2 -mb-px transition ${activeTab === key ? "border-teal-600 text-teal-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Resources List */}
      {activeTab === "resources" && (
        <DataTable columns={resourceColumns} rows={resources} loading={rLoading} emptyMessage="No patient resources yet." />
      )}

      {/* FAQs — accordion style for better UX */}
      {activeTab === "faqs" && (
        <div>
          {fLoading && <div className="text-center py-10 text-gray-400">Loading...</div>}
          {!fLoading && faqs.length === 0 && (
            <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-100">No FAQs added yet.</div>
          )}
          <div className="space-y-3">
            {faqs.map(faq => (
              <div key={faq.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition" onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}>
                  <Badge label={faq.category} color="blue" />
                  <span className="flex-1 font-medium text-gray-800 text-sm">{faq.question}</span>
                  <div className="flex items-center gap-2">
                    <Badge label={faq.isActive ? "Active" : "Hidden"} color={faq.isActive ? "green" : "gray"} />
                    <button onClick={e => { e.stopPropagation(); openEditFaq(faq); }} className="text-blue-500 hover:text-blue-700 p-1 transition"><Pencil size={14} /></button>
                    <button onClick={e => { e.stopPropagation(); confirmDeleteFaq(faq.id, faq.question); }} className="text-red-400 hover:text-red-600 p-1 transition"><Trash2 size={14} /></button>
                    {expandedFaq === faq.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </div>
                {expandedFaq === faq.id && (
                  <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-50 pt-3">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resource Form Modal */}
      {modal === "resource" && (
        <Modal title={editId ? "Edit Resource" : "Add Patient Resource"} onClose={() => setModal(null)} size="lg">
          <div className="grid md:grid-cols-2 gap-5">
            <SectionCard title="Resource Info">
              <div className="space-y-4">
                <Field label="Type" required>
                  <Select value={form.type} onChange={e => set("type", e.target.value)} options={RESOURCE_TYPES} />
                </Field>
                <Field label="Title" required><Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Patient Intake Form" /></Field>
                <Field label="Short Description"><Textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} /></Field>
                <Field label="PDF / File URL" hint="Upload to Firebase Storage, paste URL here">
                  <Input value={form.fileUrl} onChange={e => set("fileUrl", e.target.value)} placeholder="https://..." />
                </Field>
                <Field label="Order"><Input type="number" value={form.order} onChange={e => set("order", Number(e.target.value))} min={0} /></Field>
                <Toggle label="Active" checked={form.isActive} onChange={v => set("isActive", v)} />
              </div>
            </SectionCard>
            <SectionCard title="Content">
              <Field label="Full Content / Details" hint="HTML or plain text shown on the page">
                <Textarea value={form.content} onChange={e => set("content", e.target.value)} rows={14} placeholder="Detailed content, instructions, or terms..." />
              </Field>
            </SectionCard>
          </div>
          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
            <SaveButton saving={saving} onClick={handleSaveResource} label={editId ? "Update Resource" : "Add Resource"} />
            <button onClick={() => setModal(null)} className="border border-gray-200 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition">Cancel</button>
          </div>
        </Modal>
      )}

      {/* FAQ Form Modal */}
      {modal === "faq" && (
        <Modal title={editId ? "Edit FAQ" : "Add FAQ"} onClose={() => setModal(null)} size="md">
          <div className="space-y-4">
            <Field label="Category" required>
              <Select value={faqForm.category} onChange={e => setFaq("category", e.target.value)} options={FAQ_CATEGORIES} />
            </Field>
            <Field label="Question" required><Input value={faqForm.question} onChange={e => setFaq("question", e.target.value)} placeholder="e.g. How do I book an appointment?" /></Field>
            <Field label="Answer" required><Textarea value={faqForm.answer} onChange={e => setFaq("answer", e.target.value)} rows={6} placeholder="Detailed answer..." /></Field>
            <Field label="Order"><Input type="number" value={faqForm.order} onChange={e => setFaq("order", Number(e.target.value))} min={0} /></Field>
            <Toggle label="Active" checked={faqForm.isActive} onChange={v => setFaq("isActive", v)} />
          </div>
          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
            <SaveButton saving={saving} onClick={handleSaveFaq} label={editId ? "Update FAQ" : "Add FAQ"} />
            <button onClick={() => setModal(null)} className="border border-gray-200 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition">Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
