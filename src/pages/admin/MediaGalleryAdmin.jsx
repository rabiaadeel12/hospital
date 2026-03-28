import React from "react";// src/pages/admin/media/MediaGalleryAdmin.jsx
import { useState } from "react";
import { useCollection } from "../../hooks/useCollection";
import {
  Modal, Field, Input, Textarea, Select, Toggle,
  PageHeader, SaveButton, Badge, SectionCard, useConfirmDelete
} from "../../components/AdminUI";
import { Plus, Pencil, Trash2, Image, Video, Newspaper, Eye, EyeOff } from "lucide-react";

const MEDIA_TYPES = [
  { value: "photo", label: "📷 Photo", icon: Image },
  { value: "video", label: "🎥 Video", icon: Video },
  { value: "press-release", label: "📰 Press Release", icon: Newspaper },
];

const CATEGORIES = ["Events","Facility","Staff","News","Achievements","Community","Awareness"];

const emptyForm = {
  type: "photo", title: "", description: "", url: "",
  thumbnailUrl: "", category: "Events", isPublished: true, order: 0,
};

export default function MediaGalleryAdmin() {
  const { items: media, loading, add, update, remove } = useCollection("mediaGallery");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("all");
  const [viewItem, setViewItem] = useState(null);

  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const openAdd = () => { setForm(emptyForm); setEditId(null); setModal(true); };
  const openEdit = (m) => { setForm({ ...emptyForm, ...m }); setEditId(m.id); setModal(true); };

  const handleSave = async () => {
    if (!form.title.trim() || !form.url.trim()) return alert("Title and URL are required.");
    setSaving(true);
    try {
      if (editId) await update(editId, form);
      else await add(form);
      setModal(false);
    } catch (e) { alert("Error: " + e.message); }
    setSaving(false);
  };

  const confirmDelete = useConfirmDelete(remove);
  const filtered = filter === "all" ? media : media.filter(m => m.type === filter);

  const typeColor = { photo:"blue", video:"purple", "press-release":"teal" };

  return (
    <div>
      <PageHeader
        title="Media Gallery"
        subtitle={`${media.filter(m => m.type === "photo").length} photos · ${media.filter(m => m.type === "video").length} videos · ${media.filter(m => m.type === "press-release").length} press releases`}
        action={
          <button onClick={openAdd} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition">
            <Plus size={16} /> Add Media
          </button>
        }
      />

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {[["all","All"], ...MEDIA_TYPES.map(t => [t.value, t.label])].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${filter === val ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Grid view for photos/videos */}
      {loading && <div className="text-center py-12 text-gray-400">Loading...</div>}

      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 py-16 text-center text-gray-400">No media found.</div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(item => (
          <div key={item.id} className={`group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition ${!item.isPublished ? "opacity-60" : ""}`}>
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gray-100 overflow-hidden cursor-pointer" onClick={() => setViewItem(item)}>
              {item.thumbnailUrl || item.url ? (
                item.type === "photo" ? (
                  <img src={item.thumbnailUrl || item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : item.type === "video" ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                    <Video size={32} className="opacity-60" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <Newspaper size={32} className="text-gray-300" />
                  </div>
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <Image size={32} />
                </div>
              )}
              {!item.isPublished && (
                <div className="absolute top-2 left-2"><Badge label="Hidden" color="gray" /></div>
              )}
              <div className="absolute top-2 right-2"><Badge label={item.type} color={typeColor[item.type] || "gray"} /></div>
            </div>

            {/* Info */}
            <div className="p-3">
              <div className="font-medium text-gray-800 text-sm line-clamp-1">{item.title}</div>
              <div className="text-xs text-gray-400 mt-0.5">{item.category}</div>
              <div className="flex gap-1 mt-2">
                <button onClick={() => update(item.id, { isPublished: !item.isPublished })} className="text-gray-400 hover:text-teal-600 p-1 transition" title="Toggle visibility">
                  {item.isPublished ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
                <button onClick={() => openEdit(item)} className="text-blue-500 hover:text-blue-700 p-1 transition"><Pencil size={13} /></button>
                <button onClick={() => confirmDelete(item.id, item.title)} className="text-red-400 hover:text-red-600 p-1 transition"><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox viewer */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setViewItem(null)}>
          <div className="max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            {viewItem.type === "photo" && <img src={viewItem.url} alt={viewItem.title} className="w-full rounded-xl" />}
            {viewItem.type === "video" && (
              <div className="bg-black rounded-xl aspect-video flex items-center justify-center">
                <a href={viewItem.url} target="_blank" rel="noopener noreferrer" className="text-white text-lg hover:underline">Open Video →</a>
              </div>
            )}
            {viewItem.type === "press-release" && (
              <div className="bg-white rounded-xl p-8">
                <h2 className="text-xl font-bold mb-3">{viewItem.title}</h2>
                <p className="text-gray-600">{viewItem.description}</p>
                {viewItem.url && <a href={viewItem.url} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline mt-3 inline-block">Read Full Release →</a>}
              </div>
            )}
            <div className="text-center mt-3">
              <button onClick={() => setViewItem(null)} className="text-white/70 hover:text-white text-sm transition">✕ Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {modal && (
        <Modal title={editId ? "Edit Media" : "Add Media"} onClose={() => setModal(false)} size="lg">
          <div className="grid md:grid-cols-2 gap-5">
            <SectionCard title="Media Details">
              <div className="space-y-4">
                <Field label="Media Type" required>
                  <div className="flex gap-2">
                    {MEDIA_TYPES.map(t => (
                      <button key={t.value} type="button" onClick={() => set("type", t.value)}
                        className={`flex-1 py-2 rounded-lg border text-xs font-medium transition ${form.type === t.value ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Title" required><Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Event name, photo title..." /></Field>
                <Field label="Category" required>
                  <Select value={form.category} onChange={e => set("category", e.target.value)} options={CATEGORIES} />
                </Field>
                <Field label="Description"><Textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} /></Field>
                <Field label="Display Order"><Input type="number" value={form.order} onChange={e => set("order", Number(e.target.value))} min={0} /></Field>
                <Toggle label="Published (visible on website)" checked={form.isPublished} onChange={v => set("isPublished", v)} />
              </div>
            </SectionCard>
            <SectionCard title="Media Files">
              <div className="space-y-4">
                <Field label={form.type === "photo" ? "Image URL" : form.type === "video" ? "Video URL" : "Press Release URL"} required hint="Upload to Firebase Storage then paste URL">
                  <Input value={form.url} onChange={e => set("url", e.target.value)} placeholder="https://..." />
                </Field>
                {form.type !== "press-release" && (
                  <Field label="Thumbnail URL" hint="Optional — uses main URL if blank">
                    <Input value={form.thumbnailUrl} onChange={e => set("thumbnailUrl", e.target.value)} placeholder="https://..." />
                  </Field>
                )}
                {/* Preview */}
                {(form.url || form.thumbnailUrl) && form.type === "photo" && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Preview</p>
                    <img src={form.thumbnailUrl || form.url} alt="Preview" className="w-full h-40 object-cover rounded-lg border border-gray-100" />
                  </div>
                )}
              </div>
            </SectionCard>
          </div>
          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
            <SaveButton saving={saving} onClick={handleSave} label={editId ? "Update Media" : "Add Media"} />
            <button onClick={() => setModal(false)} className="border border-gray-200 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition">Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
