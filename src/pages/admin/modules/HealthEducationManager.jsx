import React from "react";// src/pages/admin/modules/HealthEducationManager.jsx
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

const POST_TYPES = [
  { value: "article", label: "📝 Article", desc: "General health articles" },
  { value: "awareness", label: "🎗️ Monthly Awareness", desc: "Disease awareness campaigns" },
  { value: "patientStory", label: "💬 Patient Story", desc: "Success and recovery stories" },
  { value: "seasonal", label: "🌦️ Seasonal Guide", desc: "Seasonal health tips" },
  { value: "video", label: "🎬 Video", desc: "Video content library" },
];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const EMPTY = {
  type: "article", title: "", slug: "", category: "", content: "", excerpt: "",
  authorId: "", authorName: "", thumbnailUrl: "", videoUrl: "", tags: [],
  month: "", isPublished: false, order: 0
};

function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-"); }

export default function HealthEducationManager() {
  const { docs: posts, loading } = useCollection("healthEducation", "createdAt");
  const { docs: doctors } = useCollection("doctors", "order");
  const [activeType, setActiveType] = useState("article");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filtered = posts.filter(p => p.type === activeType);
  const openAdd = () => { setEditing(null); setForm({ ...EMPTY, type: activeType }); setShowModal(true); };
  const openEdit = (p) => { setEditing(p); setForm({ ...p }); setShowModal(true); };
  const set = (k, v) => setForm(f => ({
    ...f, [k]: v,
    ...(k === "title" && !editing ? { slug: slugify(v) } : {}),
    ...(k === "authorId" ? { authorName: doctors.find(d => d.id === v)?.name || "" } : {})
  }));

  const handleSave = async () => {
    if (!form.title.trim()) return setError("Title is required.");
    setSaving(true); setError("");
    try {
      const data = {
        ...form,
        updatedAt: serverTimestamp(),
        ...(form.isPublished && !editing?.publishedAt ? { publishedAt: serverTimestamp() } : {})
      };
      if (editing) await updateDoc(doc(db, "healthEducation", editing.id), data);
      else await addDoc(collection(db, "healthEducation"), { ...data, createdAt: serverTimestamp() });
      setShowModal(false);
    } catch (e) { setError(e.message); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    await deleteDoc(doc(db, "healthEducation", id));
  };

  const currentType = POST_TYPES.find(t => t.value === activeType);

  return (
    <div>
      <SectionHeader
        title="Health Education"
        desc="Manage articles, awareness campaigns, patient stories, and video content."
        action={<AddButton label={`New ${currentType?.label.split(" ").slice(1).join(" ")}`} onClick={openAdd} />}
      />

      {/* Type tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {POST_TYPES.map((t) => {
          const count = posts.filter(p => p.type === t.value).length;
          return (
            <button key={t.value} onClick={() => setActiveType(t.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition border ${activeType === t.value
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
            desc={currentType?.desc}
            action={<AddButton label="Create One" onClick={openAdd} />}
          />
        ) : (
          <Table cols={["Title", "Author", "Tags", "Status", "Actions"]}>
            {filtered.map((p) => (
              <Tr key={p.id}>
                <Td>
                  <div className="font-medium text-white">{p.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{p.category} {p.month && `· ${p.month}`}</div>
                </Td>
                <Td muted>{p.authorName || "—"}</Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    {(p.tags || []).slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                    {(p.tags || []).length > 3 && <span className="text-xs text-gray-500">+{p.tags.length - 3}</span>}
                  </div>
                </Td>
                <Td><Badge status={p.isPublished ? "published" : "draft"} /></Td>
                <Td>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="text-gray-400 hover:text-teal-400 p-1 transition"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(p.id)} className="text-gray-400 hover:text-red-400 p-1 transition"><Trash2 size={14} /></button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Table>
        )}

      {showModal && (
        <Modal title={editing ? "Edit Post" : `New ${currentType?.label.split(" ").slice(1).join(" ")}`} onClose={() => setShowModal(false)} size="xl">
          <ErrorMsg msg={error} />
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2">
              <Field label="Title" required>
                <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Article title..." />
              </Field>
            </div>

            <Field label="URL Slug">
              <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} />
            </Field>
            <Field label="Category">
              <Input value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="e.g. Preventive Medicine" />
            </Field>

            {activeType === "awareness" && (
              <Field label="Awareness Month">
                <Select value={form.month} onChange={(e) => set("month", e.target.value)}>
                  <option value="">Select Month</option>
                  {MONTHS.map(m => <option key={m}>{m} 2025</option>)}
                </Select>
              </Field>
            )}

            {activeType === "video" && (
              <div className="col-span-2">
                <Field label="Video URL" hint="YouTube, Vimeo, or direct MP4 link">
                  <Input value={form.videoUrl} onChange={(e) => set("videoUrl", e.target.value)} placeholder="https://youtube.com/..." />
                </Field>
              </div>
            )}

            <div className="col-span-2">
              <Field label="Excerpt" hint="Short summary shown in listings (1-2 sentences)">
                <Textarea rows={2} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
              </Field>
            </div>

            <div className="col-span-2">
              <Field label="Full Content">
                <Textarea rows={10} value={form.content} onChange={(e) => set("content", e.target.value)} placeholder="Write the full article content here..." />
              </Field>
            </div>

            <Field label="Author (Doctor)">
              <Select value={form.authorId} onChange={(e) => set("authorId", e.target.value)}>
                <option value="">No author / Editorial Team</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>)}
              </Select>
            </Field>

            <Field label="Thumbnail URL">
              <Input value={form.thumbnailUrl} onChange={(e) => set("thumbnailUrl", e.target.value)} placeholder="https://..." />
            </Field>

            <div className="col-span-2">
              <Field label="Tags" hint="Press Enter or comma after each tag">
                <TagInput tags={form.tags || []} onChange={(v) => set("tags", v)} placeholder="diabetes, heart, prevention..." />
              </Field>
            </div>

            <div className="col-span-2">
              <Toggle label="Published (visible on website)" checked={form.isPublished} onChange={(v) => set("isPublished", v)} />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-white/10">
            <button onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm text-gray-400 hover:text-white transition">Cancel</button>
            <SaveButton loading={saving} onClick={handleSave} label={editing ? "Update Post" : "Create Post"} />
          </div>
        </Modal>
      )}
    </div>
  );
}
