import React from "react";// src/pages/admin/departments/DepartmentsAdmin.jsx
import { useState } from "react";
import { useCollection, toSlug } from "../../hooks/useCollection";
import {
  Modal, Field, Input, Textarea, Select, Toggle, TagInput,
  DataTable, PageHeader, SaveButton, Badge, SectionCard, useConfirmDelete
} from "../../components/AdminUI";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

const ICONS = ["🫀","🦴","🧒","🌸","🧠","👁","👂","🔬","💊","🩺","🚨","🩻","🧬","🦷","🫁"];

const emptyForm = {
  name: "", slug: "", icon: "🩺", shortDesc: "", fullDesc: "",
  services: [], symptomsWeTreat: [], isActive: true, order: 0,
};

export default function DepartmentsAdmin() {
  const { items: departments, loading, add, update, remove } = useCollection("departments");
  const [modal, setModal] = useState(null); // null | "add" | "edit"
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const set = (field, value) => setForm(f => ({
    ...f, [field]: value,
    ...(field === "name" && modal === "add" ? { slug: toSlug(value) } : {})
  }));

  const openAdd = () => { setForm(emptyForm); setEditId(null); setModal("add"); };
  const openEdit = (dept) => {
    setForm({ ...emptyForm, ...dept });
    setEditId(dept.id);
    setModal("edit");
  };

  const handleSave = async () => {
    if (!form.name.trim()) return alert("Department name is required.");
    setSaving(true);
    try {
      const data = { ...form, slug: form.slug || toSlug(form.name) };
      if (editId) await update(editId, data);
      else await add(data);
      setModal(null);
    } catch (e) { alert("Error: " + e.message); }
    setSaving(false);
  };

  const confirmDelete = useConfirmDelete(remove);

  const toggleActive = async (dept) => {
    await update(dept.id, { isActive: !dept.isActive });
  };

  const columns = [
    { key: "icon", label: "Icon", render: r => <span className="text-2xl">{r.icon}</span> },
    { key: "name", label: "Department", render: r => (
      <div>
        <div className="font-medium text-gray-800">{r.name}</div>
        <div className="text-xs text-gray-400">/{r.slug}</div>
      </div>
    )},
    { key: "shortDesc", label: "Description", render: r => (
      <span className="text-gray-500 text-sm line-clamp-1 max-w-xs block">{r.shortDesc || "—"}</span>
    )},
    { key: "services", label: "Services", render: r => (
      <span className="text-xs text-gray-500">{(r.services || []).length} listed</span>
    )},
    { key: "order", label: "Order", render: r => <span className="text-gray-500">{r.order ?? 0}</span> },
    { key: "isActive", label: "Status", render: r => (
      <Badge label={r.isActive ? "Active" : "Hidden"} color={r.isActive ? "green" : "gray"} />
    )},
    { key: "actions", label: "Actions", render: r => (
      <div className="flex gap-2">
        <button onClick={() => toggleActive(r)} className="text-gray-400 hover:text-teal-600 transition p-1" title={r.isActive ? "Hide" : "Show"}>
          {r.isActive ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
        <button onClick={() => openEdit(r)} className="text-blue-500 hover:text-blue-700 transition p-1"><Pencil size={15} /></button>
        <button onClick={() => confirmDelete(r.id, r.name)} className="text-red-400 hover:text-red-600 transition p-1"><Trash2 size={15} /></button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Departments"
        subtitle={`${departments.filter(d => d.isActive).length} active departments`}
        action={
          <button onClick={openAdd} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition">
            <Plus size={16} /> Add Department
          </button>
        }
      />

      <DataTable columns={columns} rows={departments} loading={loading} emptyMessage="No departments yet. Add your first one." />

      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "Add Department" : "Edit Department"} onClose={() => setModal(null)} size="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left column */}
            <div className="space-y-4">
              <SectionCard title="Basic Info">
                <div className="space-y-4">
                  <Field label="Department Name" required>
                    <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Cardiology" />
                  </Field>
                  <Field label="URL Slug" hint="Auto-generated from name">
                    <Input value={form.slug} onChange={e => set("slug", e.target.value)} placeholder="cardiology" />
                  </Field>
                  <Field label="Icon (Emoji)">
                    <div className="flex flex-wrap gap-2">
                      {ICONS.map(icon => (
                        <button key={icon} type="button" onClick={() => set("icon", icon)}
                          className={`text-2xl p-2 rounded-lg border-2 transition ${form.icon === icon ? "border-teal-500 bg-teal-50" : "border-gray-100 hover:border-gray-300"}`}>
                          {icon}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Short Description" hint="Shown on cards (1-2 lines)">
                    <Textarea value={form.shortDesc} onChange={e => set("shortDesc", e.target.value)} rows={2} placeholder="Brief description for department cards" />
                  </Field>
                  <Field label="Display Order" hint="Lower number = shown first">
                    <Input type="number" value={form.order} onChange={e => set("order", Number(e.target.value))} min={0} />
                  </Field>
                  <Toggle label="Active (visible on website)" checked={form.isActive} onChange={v => set("isActive", v)} />
                </div>
              </SectionCard>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <SectionCard title="Content">
                <Field label="Full Description" hint="Shown on department detail page">
                  <Textarea value={form.fullDesc} onChange={e => set("fullDesc", e.target.value)} rows={5} placeholder="Detailed description of the department, its specialization, and approach..." />
                </Field>
              </SectionCard>
              <SectionCard title="Services Offered">
                <TagInput tags={form.services || []} onChange={v => set("services", v)} placeholder="Type service and press Enter (e.g. ECG)" />
              </SectionCard>
              <SectionCard title="Symptoms / Conditions We Treat">
                <TagInput tags={form.symptomsWeTreat || []} onChange={v => set("symptomsWeTreat", v)} placeholder="e.g. Chest pain, Hypertension..." />
              </SectionCard>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
            <SaveButton saving={saving} onClick={handleSave} label={editId ? "Update Department" : "Add Department"} />
            <button onClick={() => setModal(null)} className="border border-gray-200 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition">Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
