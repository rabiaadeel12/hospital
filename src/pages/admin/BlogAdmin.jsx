import React from "react";// src/pages/admin/blog/BlogAdmin.jsx
import { useState } from "react";
import { useCollection, toSlug } from "../../hooks/useCollection";
import {
  Modal, Field, Input, Textarea, Select, Toggle, TagInput,
  DataTable, PageHeader, SaveButton, Badge, SectionCard, useConfirmDelete
} from "../../components/AdminUI";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, FileText, Video } from "lucide-react";

const CATEGORIES = [
  { value: "preventive", label: "🛡 Preventive Medicine" },
  { value: "awareness", label: "📅 Monthly Awareness" },
  { value: "patient-story", label: "💬 Patient Story" },
  { value: "seasonal", label: "🌿 Seasonal Guide" },
  { value: "general", label: "📰 General Health" },
];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const emptyForm = {
  title: "", slug: "", category: "general", type: "article",
  content: "", videoUrl: "", excerpt: "", coverImageUrl: "",
  author: "", tags: [], isFeatured: false, isPublished: false,
  month: "", publishedAt: null,
};

export default function BlogAdmin() {
  const { items: posts, loading, add, update, remove } = useCollection("posts");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("all");

  const set = (f, v) => setForm(p => ({ ...p, [f]: v, ...(f === "title" && !editId ? { slug: toSlug(v) } : {}) }));

  const openAdd = () => { setForm(emptyForm); setEditId(null); setModal(true); };
  const openEdit = (p) => { setForm({ ...emptyForm, ...p }); setEditId(p.id); setModal(true); };

  const handleSave = async () => {
    if (!form.title.trim()) return alert("Title is required.");
    setSaving(true);
    try {
      const data = {
        ...form,
        slug: form.slug || toSlug(form.title),
        publishedAt: form.isPublished && !form.publishedAt ? new Date().toISOString() : form.publishedAt,
      };
      if (editId) await update(editId, data);
      else await add(data);
      setModal(false);
    } catch (e) { alert("Error: " + e.message); }
    setSaving(false);
  };

  const confirmDelete = useConfirmDelete(remove);

  const filtered = filter === "all" ? posts : posts.filter(p => p.category === filter);
  const catLabel = (cat) => CATEGORIES.find(c => c.value === cat)?.label || cat;
  const catColor = { preventive:"teal", awareness:"blue", "patient-story":"purple", seasonal:"green", general:"gray" };

  const columns = [
    { key: "type", label: "", render: r => (
      <span className="text-gray-400">{r.type === "video" ? <Video size={16} /> : <FileText size={16} />}</span>
    )},
    { key: "title", label: "Title", render: r => (
      <div>
        <div className="font-medium text-gray-800 flex items-center gap-2">
          {r.title}
          {r.isFeatured && <Star size={12} className="text-amber-400 fill-amber-400" />}
        </div>
        <div className="text-xs text-gray-400 mt-0.5">by {r.author || "—"} · /{r.slug}</div>
      </div>
    )},
    { key: "category", label: "Category", render: r => <Badge label={catLabel(r.category)} color={catColor[r.category] || "gray"} /> },
    { key: "tags", label: "Tags", render: r => (
      <div className="flex gap-1 flex-wrap max-w-xs">
        {(r.tags || []).slice(0,3).map(tag => (
          <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
        ))}
        {(r.tags || []).length > 3 && <span className="text-xs text-gray-400">+{r.tags.length - 3}</span>}
      </div>
    )},
    { key: "isPublished", label: "Status", render: r => <Badge label={r.isPublished ? "Published" : "Draft"} color={r.isPublished ? "green" : "yellow"} /> },
    { key: "actions", label: "Actions", render: r => (
      <div className="flex gap-2">
        <button onClick={() => update(r.id, { isFeatured: !r.isFeatured })} className="text-amber-400 hover:text-amber-600 p-1 transition" title="Toggle featured">
          <Star size={14} fill={r.isFeatured ? "currentColor" : "none"} />
        </button>
        <button onClick={() => update(r.id, { isPublished: !r.isPublished })} className="text-gray-400 hover:text-teal-600 p-1 transition" title="Toggle publish">
          {r.isPublished ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
        <button onClick={() => openEdit(r)} className="text-blue-500 hover:text-blue-700 p-1 transition"><Pencil size={15} /></button>
        <button onClick={() => confirmDelete(r.id, r.title)} className="text-red-400 hover:text-red-600 p-1 transition"><Trash2 size={15} /></button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Health Education & Blog"
        subtitle={`${posts.filter(p => p.isPublished).length} published · ${posts.filter(p => !p.isPublished).length} drafts`}
        action={
          <button onClick={openAdd} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition">
            <Plus size={16} /> New Post
          </button>
        }
      />

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-4">
        {[["all","All Posts"], ...CATEGORIES.map(c => [c.value, c.label])].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${filter === val ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {label}
          </button>
        ))}
      </div>

      <DataTable columns={columns} rows={filtered} loading={loading} emptyMessage="No posts yet. Create your first article." />

      {modal && (
        <Modal title={editId ? "Edit Post" : "New Post"} onClose={() => setModal(false)} size="xl">
          <div className="grid md:grid-cols-5 gap-5">
            {/* Main content - 3 cols */}
            <div className="md:col-span-3 space-y-4">
              <SectionCard title="Content">
                <div className="space-y-4">
                  <Field label="Title" required><Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Article title..." /></Field>
                  <Field label="URL Slug"><Input value={form.slug} onChange={e => set("slug", e.target.value)} /></Field>
                  <Field label="Excerpt / Summary" hint="Shown in article cards and search">
                    <Textarea value={form.excerpt} onChange={e => set("excerpt", e.target.value)} rows={3} placeholder="Brief summary of the article..." />
                  </Field>
                  {form.type === "article" ? (
                    <Field label="Article Content (HTML or plain text)">
                      <Textarea value={form.content} onChange={e => set("content", e.target.value)} rows={12} placeholder="Full article content..." />
                    </Field>
                  ) : (
                    <Field label="YouTube / Video URL" hint="Paste embed or watch URL">
                      <Input value={form.videoUrl} onChange={e => set("videoUrl", e.target.value)} placeholder="https://youtube.com/..." />
                    </Field>
                  )}
                </div>
              </SectionCard>
            </div>

            {/* Sidebar - 2 cols */}
            <div className="md:col-span-2 space-y-4">
              <SectionCard title="Publish Settings">
                <div className="space-y-3">
                  <Toggle label="Published" checked={form.isPublished} onChange={v => set("isPublished", v)} />
                  <Toggle label="Featured on Homepage" checked={form.isFeatured} onChange={v => set("isFeatured", v)} />
                </div>
              </SectionCard>
              <SectionCard title="Post Details">
                <div className="space-y-4">
                  <Field label="Post Type">
                    <div className="flex gap-2">
                      {["article","video"].map(t => (
                        <button key={t} type="button" onClick={() => set("type", t)}
                          className={`flex-1 py-2 rounded-lg border text-sm font-medium capitalize transition ${form.type === t ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                          {t === "article" ? "📄" : "🎥"} {t}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Category" required>
                    <Select value={form.category} onChange={e => set("category", e.target.value)} options={CATEGORIES} />
                  </Field>
                  {form.category === "awareness" && (
                    <Field label="Month (for Awareness Topics)">
                      <Select value={form.month} onChange={e => set("month", e.target.value)} options={MONTHS} placeholder="Select month" />
                    </Field>
                  )}
                  <Field label="Author"><Input value={form.author} onChange={e => set("author", e.target.value)} placeholder="Dr. Ahmed Khan" /></Field>
                  <TagInput label="Tags" tags={form.tags || []} onChange={v => set("tags", v)} placeholder="Health, Cardiology..." />
                  <Field label="Cover Image URL">
                    <Input value={form.coverImageUrl} onChange={e => set("coverImageUrl", e.target.value)} placeholder="https://..." />
                    {form.coverImageUrl && <img src={form.coverImageUrl} alt="Cover" className="mt-2 w-full h-24 object-cover rounded-lg" />}
                  </Field>
                </div>
              </SectionCard>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
            <SaveButton saving={saving} onClick={handleSave} label={editId ? "Update Post" : "Publish Post"} />
            <button onClick={() => setModal(false)} className="border border-gray-200 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition">Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
