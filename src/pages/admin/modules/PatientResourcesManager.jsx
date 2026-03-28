import React from "react";// src/pages/admin/modules/PatientResourcesManager.jsx
import { useState } from "react";
import { db } from "../../../firebase/config";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { useCollection } from "../../../hooks/useCollection";
import {
  Modal, Field, Input, Textarea, Select, Toggle, Badge,
  SaveButton, EmptyState, SectionHeader, AddButton,
  Table, Tr, Td, ErrorMsg
} from "../../../components/AdminUI";
import { Pencil, Trash2 } from "lucide-react";

const TYPES = [
  { value: "form", label: "📋 Patient Forms", desc: "Downloadable/fillable forms" },
  { value: "insurance", label: "🛡️ Insurance & Billing", desc: "Insurance info and billing guides" },
  { value: "pricing", label: "💰 Pricing & Fee Structure", desc: "Service costs and packages" },
  { value: "policy", label: "📜 Appointment Policies", desc: "Rules, cancellation, no-show" },
  { value: "faq", label: "❓ FAQs", desc: "Frequently asked questions" },
  { value: "payment", label: "💳 Payment Options", desc: "Accepted payment methods" },
];

const EMPTY = { type: "faq", title: "", content: "", fileUrl: "", category: "", isActive: true, order: 0 };

export default function PatientResourcesManager() {
  const { docs: resources, loading } = useCollection("patientResources", "order");
  const [activeType, setActiveType] = useState("faq");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filtered = resources.filter(r => r.type === activeType);
  const openAdd = () => { setEditing(null); setForm({ ...EMPTY, type: activeType }); setShowModal(true); };
  const openEdit = (r) => { setEditing(r); setForm({ ...r }); setShowModal(true); };
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.title.trim()) return setError("Title is required.");
    setSaving(true); setError("");
    try {
      const data = { ...form, updatedAt: serverTimestamp() };
      if (editing) await updateDoc(doc(db, "patientResources", editing.id), data);
      else await addDoc(collection(db, "patientResources"), { ...data, createdAt: serverTimestamp() });
      setShowModal(false);
    } catch (e) { setError(e.message); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resource?")) return;
    await deleteDoc(doc(db, "patientResources", id));
  };

  const currentType = TYPES.find(t => t.value === activeType);

  return (
    <div>
      <SectionHeader
        title="Patient Resources"
        desc="Manage forms, insurance info, pricing, FAQs, and payment options for patients."
        action={<AddButton label={`Add ${currentType?.label.split(" ").slice(1).join(" ")}`} onClick={openAdd} />}
      />

      {/* Type tabs */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
        {TYPES.map((t) => (
          <button key={t.value} onClick={() => setActiveType(t.value)}
            className={`p-3 rounded-xl border text-left transition ${activeType === t.value
              ? "bg-teal-600/20 border-teal-500 text-white"
              : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"}`}>
            <div className="text-lg mb-1">{t.label.split(" ")[0]}</div>
            <div className="text-xs font-medium">{t.label.split(" ").slice(1).join(" ")}</div>
            <div className="text-xs text-gray-500 mt-0.5 hidden md:block">{filtered.length > 0 && activeType === t.value ? `${filtered.length} items` : ""}</div>
          </button>
        ))}
      </div>

      {loading ? <div className="text-gray-400 text-sm">Loading...</div>
        : filtered.length === 0 ? (
          <EmptyState
            icon={currentType?.label.split(" ")[0]}
            title={`No ${currentType?.label.split(" ").slice(1).join(" ")} yet`}
            desc={currentType?.desc}
            action={<AddButton label="Add Item" onClick={openAdd} />}
          />
        ) : (
          <Table cols={["Title", "Category", "Has File", "Status", "Actions"]}>
            {filtered.map((r) => (
              <Tr key={r.id}>
                <Td>
                  <div className="font-medium text-white">{r.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{r.content?.substring(0, 80)}...</div>
                </Td>
                <Td muted>{r.category || "—"}</Td>
                <Td>
                  {r.fileUrl
                    ? <span className="text-xs text-teal-400">📎 Attached</span>
                    : <span className="text-gray-600 text-xs">None</span>}
                </Td>
                <Td><Badge status={r.isActive ? "active" : "inactive"} /></Td>
                <Td>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(r)} className="text-gray-400 hover:text-teal-400 p-1 transition"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(r.id)} className="text-gray-400 hover:text-red-400 p-1 transition"><Trash2 size={14} /></button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Table>
        )}

      {showModal && (
        <Modal title={editing ? "Edit Resource" : `Add ${currentType?.label.split(" ").slice(1).join(" ")}`} onClose={() => setShowModal(false)} size="lg">
          <ErrorMsg msg={error} />
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Field label="Title" required>
                  <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Patient Registration Form" />
                </Field>
              </div>
              <Field label="Category" hint="Sub-group for organization">
                <Input value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="e.g. OPD Forms, Billing..." />
              </Field>
              <Field label="Type">
                <Select value={form.type} onChange={(e) => set("type", e.target.value)}>
                  {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </Select>
              </Field>
            </div>
            <Field label="Content / Description" hint={form.type === "faq" ? "Write the answer to this FAQ question" : "Detailed information for patients"}>
              <Textarea rows={6} value={form.content} onChange={(e) => set("content", e.target.value)}
                placeholder={form.type === "faq" ? "Answer to the question..." : "Detailed information..."} />
            </Field>
            <Field label="File / Download URL" hint="Link to PDF or downloadable document (optional)">
              <Input value={form.fileUrl} onChange={(e) => set("fileUrl", e.target.value)} placeholder="https://storage.googleapis.com/..." />
            </Field>
            <div className="flex gap-8">
              <Toggle label="Active (visible to patients)" checked={form.isActive} onChange={(v) => set("isActive", v)} />
            </div>
            <Field label="Display Order">
              <Input type="number" value={form.order} onChange={(e) => set("order", parseInt(e.target.value) || 0)} />
            </Field>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-white/10">
            <button onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm text-gray-400 hover:text-white transition">Cancel</button>
            <SaveButton loading={saving} onClick={handleSave} label={editing ? "Update" : "Create"} />
          </div>
        </Modal>
      )}
    </div>
  );
}
