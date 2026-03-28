import React from "react";// src/pages/admin/modules/ServicesManager.jsx
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

const ICONS = ["🚨","🩺","🏥","💊","🔬","🩻","🧪","🚑","🛏️","👶","🫀","🦴","🌸","👁️","🦻","🧬"];
const EMPTY = {
  name: "", slug: "", icon: "🩺", shortDesc: "", fullDesc: "",
  departmentIds: [], pricing: "", isHighlighted: false, isActive: true, order: 0
};

function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-"); }

export default function ServicesManager() {
  const { docs: services, loading } = useCollection("services", "order");
  const { docs: departments } = useCollection("departments", "order");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (s) => { setEditing(s); setForm({ ...s }); setShowModal(true); };
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v, ...(k === "name" && !editing ? { slug: slugify(v) } : {}) }));

  const toggleDept = (id) => {
    const cur = form.departmentIds || [];
    set("departmentIds", cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id]);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return setError("Service name is required.");
    setSaving(true); setError("");
    try {
      const data = { ...form, updatedAt: serverTimestamp() };
      if (editing) await updateDoc(doc(db, "services", editing.id), data);
      else await addDoc(collection(db, "services"), { ...data, createdAt: serverTimestamp() });
      setShowModal(false);
    } catch (e) { setError(e.message); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    await deleteDoc(doc(db, "services", id));
  };

  return (
    <div>
      <SectionHeader
        title="Services"
        desc="Manage hospital services. Highlighted services appear on the homepage."
        action={<AddButton label="Add Service" onClick={openAdd} />}
      />

      {loading ? <div className="text-gray-400 text-sm">Loading...</div>
        : services.length === 0 ? (
          <EmptyState icon="🏥" title="No services yet" desc="Add your hospital's key services." action={<AddButton label="Add Service" onClick={openAdd} />} />
        ) : (
          <Table cols={["", "Service", "Departments", "Pricing", "Homepage", "Status", "Actions"]}>
            {services.map((s) => (
              <Tr key={s.id}>
                <Td><span className="text-2xl">{s.icon}</span></Td>
                <Td>
                  <div className="font-medium text-white">{s.name}</div>
                  <div className="text-xs text-gray-500">{s.shortDesc}</div>
                </Td>
                <Td muted>{(s.departmentIds || []).length} linked</Td>
                <Td muted>{s.pricing || "—"}</Td>
                <Td>
                  {s.isHighlighted && <Badge status="active" customLabel="Featured" />}
                </Td>
                <Td><Badge status={s.isActive ? "active" : "inactive"} /></Td>
                <Td>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(s)} className="text-gray-400 hover:text-teal-400 p-1 transition"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(s.id)} className="text-gray-400 hover:text-red-400 p-1 transition"><Trash2 size={14} /></button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Table>
        )}

      {showModal && (
        <Modal title={editing ? "Edit Service" : "Add Service"} onClose={() => setShowModal(false)} size="lg">
          <ErrorMsg msg={error} />
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2 grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Field label="Service Name" required>
                  <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="24/7 Emergency" />
                </Field>
              </div>
              <Field label="Icon (emoji)">
                <div className="grid grid-cols-8 gap-1 bg-white/5 border border-white/10 rounded-lg p-2">
                  {ICONS.map((ic) => (
                    <button key={ic} onClick={() => set("icon", ic)}
                      className={`text-lg p-1 rounded transition ${form.icon === ic ? "bg-teal-500/30 ring-1 ring-teal-500" : "hover:bg-white/10"}`}>
                      {ic}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <Field label="URL Slug">
              <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="emergency-care" />
            </Field>
            <Field label="Pricing" hint="e.g. Free, Rs. 500, Contact for pricing">
              <Input value={form.pricing} onChange={(e) => set("pricing", e.target.value)} placeholder="Rs. 500" />
            </Field>

            <div className="col-span-2">
              <Field label="Short Description">
                <Input value={form.shortDesc} onChange={(e) => set("shortDesc", e.target.value)} placeholder="Round-the-clock emergency services" />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Full Description">
                <Textarea rows={4} value={form.fullDesc} onChange={(e) => set("fullDesc", e.target.value)} />
              </Field>
            </div>

            <div className="col-span-2">
              <Field label="Linked Departments" hint="Select which departments provide this service">
                <div className="flex flex-wrap gap-2 mt-1">
                  {departments.map((d) => (
                    <button key={d.id} onClick={() => toggleDept(d.id)}
                      className={`text-sm px-3 py-1.5 rounded-lg border transition ${(form.departmentIds || []).includes(d.id)
                        ? "bg-teal-500/20 border-teal-500 text-teal-300"
                        : "border-white/10 text-gray-400 hover:border-white/30"}`}>
                      {d.icon} {d.name}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <div className="col-span-2 flex gap-8">
              <Toggle label="Featured on Homepage" checked={form.isHighlighted} onChange={(v) => set("isHighlighted", v)} />
              <Toggle label="Active (visible on website)" checked={form.isActive} onChange={(v) => set("isActive", v)} />
            </div>
            <Field label="Display Order">
              <Input type="number" value={form.order} onChange={(e) => set("order", parseInt(e.target.value) || 0)} />
            </Field>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-white/10">
            <button onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm text-gray-400 hover:text-white transition">Cancel</button>
            <SaveButton loading={saving} onClick={handleSave} label={editing ? "Update Service" : "Add Service"} />
          </div>
        </Modal>
      )}
    </div>
  );
}
