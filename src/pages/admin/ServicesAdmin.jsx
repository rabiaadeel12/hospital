import React from "react";// src/pages/admin/services/ServicesAdmin.jsx
import { useState } from "react";
import { useCollection, toSlug } from "../../hooks/useCollection";
import {
  Modal, Field, Input, Textarea, Select, Toggle,
  DataTable, PageHeader, SaveButton, Badge, SectionCard, useConfirmDelete
} from "../../components/AdminUI";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from "lucide-react";

const CATEGORIES = ["Emergency","OPD","Diagnostic","Specialist","Telemedicine","Pharmacy","Laboratory","Home Services"];
const ICONS = ["🚨","🩺","🔬","💊","🏥","📋","🩸","🏠","📞","💉","🫀","🦴","🧒","🌸","🧠"];

const emptyForm = {
  name: "", slug: "", category: "", icon: "🩺",
  shortDesc: "", fullDesc: "", departmentId: "",
  price: "", isActive: true, isFeatured: false, order: 0,
};

export default function ServicesAdmin() {
  const { items: services, loading, add, update, remove } = useCollection("services");
  const { items: departments } = useCollection("departments");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("All");

  const set = (f, v) => setForm(p => ({ ...p, [f]: v, ...(f === "name" && !editId ? { slug: toSlug(v) } : {}) }));

  const openAdd = () => { setForm(emptyForm); setEditId(null); setModal(true); };
  const openEdit = (s) => { setForm({ ...emptyForm, ...s, price: s.price ?? "" }); setEditId(s.id); setModal(true); };

  const handleSave = async () => {
    if (!form.name.trim()) return alert("Service name is required.");
    setSaving(true);
    try {
      const data = { ...form, slug: form.slug || toSlug(form.name), price: form.price === "" ? null : Number(form.price) };
      if (editId) await update(editId, data);
      else await add(data);
      setModal(false);
    } catch (e) { alert("Error: " + e.message); }
    setSaving(false);
  };

  const confirmDelete = useConfirmDelete(remove);
  const allCategories = ["All", ...CATEGORIES];
  const filtered = filter === "All" ? services : services.filter(s => s.category === filter);

  const columns = [
    { key: "icon", label: "", render: r => <span className="text-2xl">{r.icon}</span> },
    { key: "name", label: "Service", render: r => (
      <div>
        <div className="font-medium text-gray-800 flex items-center gap-2">
          {r.name}
          {r.isFeatured && <Star size={12} className="text-amber-400 fill-amber-400" />}
        </div>
        <div className="text-xs text-gray-400">/{r.slug}</div>
      </div>
    )},
    { key: "category", label: "Category", render: r => <Badge label={r.category || "—"} color="blue" /> },
    { key: "shortDesc", label: "Description", render: r => <span className="text-gray-500 text-sm line-clamp-1 max-w-xs block">{r.shortDesc}</span> },
    { key: "price", label: "Price", render: r => (
      <span className="text-gray-600 text-sm">{r.price == null ? "Contact for pricing" : `Rs. ${r.price}`}</span>
    )},
    { key: "isActive", label: "Status", render: r => <Badge label={r.isActive ? "Active" : "Hidden"} color={r.isActive ? "green" : "gray"} /> },
    { key: "actions", label: "Actions", render: r => (
      <div className="flex gap-2">
        <button onClick={() => update(r.id, { isFeatured: !r.isFeatured })} title="Toggle featured" className="text-amber-400 hover:text-amber-600 p-1 transition">
          <Star size={14} fill={r.isFeatured ? "currentColor" : "none"} />
        </button>
        <button onClick={() => update(r.id, { isActive: !r.isActive })} className="text-gray-400 hover:text-teal-600 p-1 transition">
          {r.isActive ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
        <button onClick={() => openEdit(r)} className="text-blue-500 hover:text-blue-700 p-1 transition"><Pencil size={15} /></button>
        <button onClick={() => confirmDelete(r.id, r.name)} className="text-red-400 hover:text-red-600 p-1 transition"><Trash2 size={15} /></button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Services"
        subtitle={`${services.filter(s => s.isActive).length} active · ${services.filter(s => s.isFeatured).length} featured`}
        action={
          <button onClick={openAdd} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition">
            <Plus size={16} /> Add Service
          </button>
        }
      />

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-4">
        {allCategories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${filter === cat ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {cat}
          </button>
        ))}
      </div>

      <DataTable columns={columns} rows={filtered} loading={loading} emptyMessage="No services found." />

      {modal && (
        <Modal title={editId ? "Edit Service" : "Add Service"} onClose={() => setModal(false)} size="lg">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <SectionCard title="Basic Info">
                <div className="space-y-4">
                  <Field label="Service Name" required><Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Home Lab Sampling" /></Field>
                  <Field label="URL Slug"><Input value={form.slug} onChange={e => set("slug", e.target.value)} /></Field>
                  <Field label="Category" required>
                    <Select value={form.category} onChange={e => set("category", e.target.value)} options={CATEGORIES} placeholder="Select category" />
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
                  <Field label="Linked Department (optional)">
                    <Select value={form.departmentId} onChange={e => set("departmentId", e.target.value)}
                      options={departments.map(d => ({ value: d.id, label: d.name }))} placeholder="None" />
                  </Field>
                  <Field label="Price (PKR)" hint="Leave blank for 'Contact for pricing'">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rs.</span>
                      <Input className="pl-10" type="number" value={form.price} onChange={e => set("price", e.target.value)} min={0} placeholder="Leave blank if variable" />
                    </div>
                  </Field>
                  <Field label="Display Order"><Input type="number" value={form.order} onChange={e => set("order", Number(e.target.value))} min={0} /></Field>
                  <Toggle label="Active" checked={form.isActive} onChange={v => set("isActive", v)} />
                  <Toggle label="Featured on Homepage" checked={form.isFeatured} onChange={v => set("isFeatured", v)} />
                </div>
              </SectionCard>
            </div>
            <div className="space-y-4">
              <SectionCard title="Content">
                <div className="space-y-4">
                  <Field label="Short Description"><Textarea value={form.shortDesc} onChange={e => set("shortDesc", e.target.value)} rows={3} placeholder="Brief description shown on cards" /></Field>
                  <Field label="Full Description"><Textarea value={form.fullDesc} onChange={e => set("fullDesc", e.target.value)} rows={8} placeholder="Detailed description shown on service page" /></Field>
                </div>
              </SectionCard>
            </div>
          </div>
          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
            <SaveButton saving={saving} onClick={handleSave} label={editId ? "Update Service" : "Add Service"} />
            <button onClick={() => setModal(false)} className="border border-gray-200 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition">Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
