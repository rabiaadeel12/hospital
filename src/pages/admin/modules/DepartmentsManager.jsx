import React from "react";// src/pages/admin/modules/DepartmentsManager.jsx
import { useState } from "react";
import { db } from "../../../firebase/config";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { useCollection } from "../../../hooks/useCollection";
import {
  Modal, Field, Input, Textarea, Select, Toggle, Badge,
  SaveButton, EmptyState, SectionHeader, AddButton,
  Table, Tr, Td, ErrorMsg, TagInput
} from "../../../components/AdminUI";
import { Pencil, Trash2 } from "lucide-react";

const ICONS = ["🫀","🧒","🦴","🌸","🚨","🔬","🩺","👁️","🦻","💊","🧪","🩻"];

const EMPTY = {
  name: "", slug: "", icon: "🫀", shortDesc: "", fullDesc: "",
  servicesOffered: [], whenToVisit: "", order: 0, isActive: true
};

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function DepartmentsManager() {
  const { docs: departments, loading } = useCollection("departments", "order");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (dep) => { setEditing(dep); setForm({ ...dep }); setShowModal(true); };

  const set = (k, v) => setForm((f) => ({
    ...f, [k]: v,
    ...(k === "name" && !editing ? { slug: slugify(v) } : {})
  }));

  const handleSave = async () => {
    if (!form.name.trim()) return setError("Department name is required.");
    setSaving(true); setError("");
    try {
      const data = { ...form, updatedAt: serverTimestamp() };
      if (editing) {
        await updateDoc(doc(db, "departments", editing.id), data);
      } else {
        await addDoc(collection(db, "departments"), { ...data, createdAt: serverTimestamp() });
      }
      setShowModal(false);
    } catch (e) { setError(e.message); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this department? Doctors linked to it will lose their department reference.")) return;
    await deleteDoc(doc(db, "departments", id));
  };

  return (
    <div>
      <SectionHeader
        title="Departments"
        desc="Manage hospital departments. These are referenced by Doctors and Services."
        action={<AddButton label="Add Department" onClick={openAdd} />}
      />

      {loading ? (
        <div className="text-gray-400 text-sm">Loading...</div>
      ) : departments.length === 0 ? (
        <EmptyState icon="🏥" title="No departments yet" desc="Add your first department to get started." action={<AddButton label="Add Department" onClick={openAdd} />} />
      ) : (
        <Table cols={["", "Department", "Slug", "Services", "Status", "Actions"]}>
          {departments.map((dep) => (
            <Tr key={dep.id}>
              <Td><span className="text-2xl">{dep.icon}</span></Td>
              <Td>
                <div className="font-medium text-white">{dep.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{dep.shortDesc}</div>
              </Td>
              <Td muted>{dep.slug}</Td>
              <Td muted>{(dep.servicesOffered || []).length} services</Td>
              <Td><Badge status={dep.isActive ? "active" : "inactive"} /></Td>
              <Td>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(dep)} className="text-gray-400 hover:text-teal-400 transition p-1"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(dep.id)} className="text-gray-400 hover:text-red-400 transition p-1"><Trash2 size={14} /></button>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      )}

      {showModal && (
        <Modal title={editing ? "Edit Department" : "Add Department"} onClose={() => setShowModal(false)} size="lg">
          <ErrorMsg msg={error} />
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2 grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Field label="Department Name" required>
                  <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Cardiology" />
                </Field>
              </div>
              <Field label="Icon (emoji)">
                <div className="grid grid-cols-6 gap-1.5 bg-white/5 border border-white/10 rounded-lg p-2">
                  {ICONS.map((ic) => (
                    <button key={ic} onClick={() => set("icon", ic)}
                      className={`text-xl p-1.5 rounded transition ${form.icon === ic ? "bg-teal-500/30 ring-1 ring-teal-500" : "hover:bg-white/10"}`}>
                      {ic}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <Field label="URL Slug" hint="Auto-generated from name. Used in URLs.">
              <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="cardiology" />
            </Field>

            <Field label="Display Order" hint="Lower = appears first">
              <Input type="number" value={form.order} onChange={(e) => set("order", parseInt(e.target.value) || 0)} />
            </Field>

            <div className="col-span-2">
              <Field label="Short Description" hint="One-liner shown in cards/listings">
                <Input value={form.shortDesc} onChange={(e) => set("shortDesc", e.target.value)} placeholder="Heart disease diagnosis and treatment" />
              </Field>
            </div>

            <div className="col-span-2">
              <Field label="Full Description" hint="Detailed description shown on department page">
                <Textarea rows={5} value={form.fullDesc} onChange={(e) => set("fullDesc", e.target.value)} placeholder="Comprehensive cardiology services..." />
              </Field>
            </div>

            <div className="col-span-2">
              <Field label="Services Offered" hint="Press Enter or comma to add each service">
                <TagInput tags={form.servicesOffered || []} onChange={(v) => set("servicesOffered", v)} placeholder="e.g. ECG, Echocardiography..." />
              </Field>
            </div>

            <div className="col-span-2">
              <Field label="When to Visit" hint="Symptoms or conditions that should bring patients here">
                <Textarea rows={3} value={form.whenToVisit} onChange={(e) => set("whenToVisit", e.target.value)} placeholder="Chest pain, shortness of breath, palpitations..." />
              </Field>
            </div>

            <div className="col-span-2">
              <Toggle label="Active (visible on website)" checked={form.isActive} onChange={(v) => set("isActive", v)} />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-white/10">
            <button onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm text-gray-400 hover:text-white transition">Cancel</button>
            <SaveButton loading={saving} onClick={handleSave} label={editing ? "Update Department" : "Create Department"} />
          </div>
        </Modal>
      )}
    </div>
  );
}
