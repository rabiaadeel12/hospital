import React from "react";
import { useState } from "react";
import { db } from "../../../firebase/config";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { useCollection } from "../../../hooks/useCollection";
import { deleteFile } from "../../../lib/s3";
import {
  Modal, Field, Input, Textarea, Select, Toggle, Badge,
  SaveButton, EmptyState, SectionHeader, AddButton,
  Table, Tr, Td, ErrorMsg, TagInput
} from "../../../components/AdminUI";
import FileUpload from "../../../components/FileUpload";
import { Pencil, Trash2, Image, Video, Newspaper } from "lucide-react";

const MEDIA_TYPES = [
  { value: "photo", label: "📸 Photos", icon: <Image size={14} /> },
  { value: "video", label: "🎬 Videos", icon: <Video size={14} /> },
  { value: "pressRelease", label: "📰 Press Releases", icon: <Newspaper size={14} /> },
];

const CATEGORIES = ["Events","Facilities","Staff","Achievements","Community","General"];

const EMPTY = {
  type: "photo", title: "", description: "", url: "", thumbnailUrl: "",
  category: "", tags: [], isPublished: true, order: 0,
  publishedDate: "", source: ""
};

export default function MediaGalleryManager() {
  const { docs: media, loading } = useCollection("mediaGallery", "order");
  const [activeType, setActiveType] = useState("photo");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filtered = media.filter(m => m.type === activeType);
  const openAdd = () => { setEditing(null); setForm({ ...EMPTY, type: activeType }); setShowModal(true); };
  const openEdit = (m) => { setEditing(m); setForm({ ...m }); setShowModal(true); };
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.title.trim()) return setError("Title is required.");
    // For photos, require an uploaded URL. For videos/press releases, require a URL too.
    if (!form.url.trim()) return setError(form.type === "photo" ? "Please upload a photo." : "Media URL is required.");
    setSaving(true); setError("");
    try {
      const data = { ...form, updatedAt: serverTimestamp() };
      if (editing) await updateDoc(doc(db, "mediaGallery", editing.id), data);
      else await addDoc(collection(db, "mediaGallery"), { ...data, createdAt: serverTimestamp() });
      setShowModal(false);
    } catch (e) { setError(e.message); }
    setSaving(false);
  };

  const handleDelete = async (item) => {
    if (!window.confirm("Delete this media item?")) return;
    // Delete uploaded files from S3
    if (item.url && item.type === "photo") await deleteFile(item.url).catch(() => {});
    if (item.thumbnailUrl) await deleteFile(item.thumbnailUrl).catch(() => {});
    await deleteDoc(doc(db, "mediaGallery", item.id));
  };

  const currentType = MEDIA_TYPES.find(t => t.value === activeType);

  return (
    <div>
      <SectionHeader
        title="Media Gallery"
        desc="Manage photos, videos, and press releases."
        action={<AddButton label={`Add ${activeType === "pressRelease" ? "Press Release" : activeType.charAt(0).toUpperCase() + activeType.slice(1)}`} onClick={openAdd} />}
      />

      {/* Type tabs */}
      <div className="flex gap-2 mb-6">
        {MEDIA_TYPES.map((t) => {
          const count = media.filter(m => m.type === t.value).length;
          return (
            <button key={t.value} onClick={() => setActiveType(t.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition ${activeType === t.value
                ? "bg-teal-600 border-teal-500 text-white"
                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"}`}>
              {t.label}
              {count > 0 && <span className={`text-xs px-1.5 rounded-full ${activeType === t.value ? "bg-white/20" : "bg-white/10"}`}>{count}</span>}
            </button>
          );
        })}
      </div>

      {loading ? <div className="text-gray-400 text-sm">Loading...</div>
        : filtered.length === 0 ? (
          <EmptyState
            icon={currentType?.label.split(" ")[0]}
            title={`No ${currentType?.label.split(" ").slice(1).join(" ")} yet`}
            desc="Upload media to build your gallery."
            action={<AddButton label="Add Item" onClick={openAdd} />}
          />
        ) : activeType === "photo" ? (
          // Photo Grid View
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filtered.map((item) => (
              <div key={item.id} className="group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden aspect-square">
                {item.url ? (
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover" onError={(e) => e.target.style.display = "none"} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">📸</div>
                )}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                  <div className="text-white text-xs font-medium text-center px-2">{item.title}</div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(item)} className="bg-teal-600 text-white p-1.5 rounded-lg hover:bg-teal-500 transition"><Pencil size={12} /></button>
                    <button onClick={() => handleDelete(item)} className="bg-red-500/80 text-white p-1.5 rounded-lg hover:bg-red-500 transition"><Trash2 size={12} /></button>
                  </div>
                </div>
                {!item.isPublished && (
                  <div className="absolute top-2 left-2"><Badge status="draft" /></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Table view for videos and press releases
          <Table cols={activeType === "video"
            ? ["Title", "Category", "Tags", "Status", "Actions"]
            : ["Title", "Source", "Date", "Category", "Status", "Actions"]}>
            {filtered.map((item) => (
              <Tr key={item.id}>
                <Td>
                  <div className="flex items-center gap-3">
                    {item.thumbnailUrl && (
                      <img src={item.thumbnailUrl} alt="" className="w-10 h-10 rounded-lg object-cover" onError={(e) => e.target.style.display = "none"} />
                    )}
                    <div>
                      <div className="font-medium text-white">{item.title}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{item.description?.substring(0, 60)}</div>
                    </div>
                  </div>
                </Td>
                {activeType === "pressRelease" && <Td muted>{item.source || "—"}</Td>}
                {activeType === "pressRelease" && <Td muted>{item.publishedDate || "—"}</Td>}
                <Td muted>{item.category || "—"}</Td>
                {activeType === "video" && (
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {(item.tags || []).slice(0, 2).map(t => (
                        <span key={t} className="text-xs bg-white/10 text-gray-300 px-1.5 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                  </Td>
                )}
                <Td><Badge status={item.isPublished ? "published" : "draft"} /></Td>
                <Td>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(item)} className="text-gray-400 hover:text-teal-400 p-1 transition"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(item)} className="text-gray-400 hover:text-red-400 p-1 transition"><Trash2 size={14} /></button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Table>
        )}

      {showModal && (
        <Modal title={editing ? "Edit Media" : `Add ${activeType === "pressRelease" ? "Press Release" : activeType}`} onClose={() => setShowModal(false)} size="lg">
          <ErrorMsg msg={error} />
          <div className="grid grid-cols-2 gap-5">

            <div className="col-span-2">
              <Field label="Title" required>
                <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Title..." />
              </Field>
            </div>

            {/* Photo: use FileUpload. Video & press release: use URL input */}
            {form.type === "photo" ? (
              <div className="col-span-2">
                <Field label="Photo" required>
                  <FileUpload
                    value={form.url}
                    onChange={(url) => set("url", url)}
                    folder="gallery"
                    accept="image/*"
                    label="Upload photo"
                    maxMB={15}
                  />
                </Field>
              </div>
            ) : (
              <div className="col-span-2">
                <Field label={form.type === "video" ? "Video URL (YouTube / Vimeo / direct)" : "Article / PDF URL"} required>
                  <Input value={form.url} onChange={(e) => set("url", e.target.value)} placeholder="https://..." />
                </Field>
              </div>
            )}

            {/* Thumbnail upload for videos */}
            {form.type === "video" && (
              <div className="col-span-2">
                <Field label="Thumbnail Image" hint="Optional — shown in video listings">
                  <FileUpload
                    value={form.thumbnailUrl}
                    onChange={(url) => set("thumbnailUrl", url)}
                    folder="gallery/thumbnails"
                    accept="image/*"
                    label="Upload thumbnail"
                    maxMB={5}
                  />
                </Field>
              </div>
            )}

            <Field label="Category">
              <Select value={form.category} onChange={(e) => set("category", e.target.value)}>
                <option value="">Select Category</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </Select>
            </Field>

            {form.type === "pressRelease" && (
              <>
                <Field label="Source / Publication">
                  <Input value={form.source} onChange={(e) => set("source", e.target.value)} placeholder="Dawn News, Geo..." />
                </Field>
                <Field label="Published Date">
                  <Input type="date" value={form.publishedDate} onChange={(e) => set("publishedDate", e.target.value)} />
                </Field>
              </>
            )}

            <div className="col-span-2">
              <Field label="Description">
                <Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
              </Field>
            </div>

            {form.type !== "photo" && (
              <div className="col-span-2">
                <Field label="Tags">
                  <TagInput tags={form.tags || []} onChange={(v) => set("tags", v)} />
                </Field>
              </div>
            )}

            <div className="col-span-2">
              <Toggle label="Published" checked={form.isPublished} onChange={(v) => set("isPublished", v)} />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-white/10">
            <button onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm text-gray-400 hover:text-white transition">Cancel</button>
            <SaveButton loading={saving} onClick={handleSave} label={editing ? "Update" : "Add"} />
          </div>
        </Modal>
      )}
    </div>
  );
}