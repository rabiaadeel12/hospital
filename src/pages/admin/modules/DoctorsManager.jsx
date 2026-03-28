import React from "react";// src/pages/admin/modules/DoctorsManager.jsx
import { useState } from "react";
import { db } from "../../../firebase/config";
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  serverTimestamp, getDocs, query, where
} from "firebase/firestore";
import { useCollection } from "../../../hooks/useCollection";
import {
  Modal, Field, Input, Textarea, Select, Toggle, Badge,
  SaveButton, EmptyState, SectionHeader, AddButton,
  Table, Tr, Td, ErrorMsg, TagInput
} from "../../../components/AdminUI";
import { Pencil, Trash2, Plus, X, Star, ChevronDown, ChevronUp } from "lucide-react";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const TIMES = ["08:00 AM","09:00 AM","10:00 AM","11:00 AM","12:00 PM","01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM","06:00 PM","07:00 PM","08:00 PM"];

const EMPTY_DOCTOR = {
  name: "", slug: "", title: "", specialty: "", departmentId: "", departmentName: "",
  bio: "", qualifications: [], experience: [], clinicTimings: [], consultationFee: "",
  imageUrl: "", phone: "", email: "", isAvailableForBooking: true, isActive: true, order: 0
};

const EMPTY_QUAL = { degree: "", institution: "", year: "" };
const EMPTY_EXP = { role: "", hospital: "", from: "", to: "" };
const EMPTY_TIMING = { day: "Monday", startTime: "09:00 AM", endTime: "05:00 PM", isAvailable: true };

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, "-"); }

export default function DoctorsManager() {
  const { docs: doctors, loading } = useCollection("doctors", "order");
  const { docs: departments } = useCollection("departments", "order");
  const [showModal, setShowModal] = useState(false);
  const [showReviews, setShowReviews] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_DOCTOR);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const openAdd = () => { setEditing(null); setForm(EMPTY_DOCTOR); setActiveTab("basic"); setShowModal(true); };
  const openEdit = (doc) => { setEditing(doc); setForm({ ...doc }); setActiveTab("basic"); setShowModal(true); };
  const set = (k, v) => setForm((f) => ({
    ...f, [k]: v,
    ...(k === "name" && !editing ? { slug: slugify(v) } : {}),
    ...(k === "departmentId" ? { departmentName: departments.find(d => d.id === v)?.name || "" } : {})
  }));

  // Qualifications
  const addQual = () => set("qualifications", [...(form.qualifications || []), { ...EMPTY_QUAL }]);
  const updateQual = (i, k, v) => set("qualifications", form.qualifications.map((q, idx) => idx === i ? { ...q, [k]: v } : q));
  const removeQual = (i) => set("qualifications", form.qualifications.filter((_, idx) => idx !== i));

  // Experience
  const addExp = () => set("experience", [...(form.experience || []), { ...EMPTY_EXP }]);
  const updateExp = (i, k, v) => set("experience", form.experience.map((e, idx) => idx === i ? { ...e, [k]: v } : e));
  const removeExp = (i) => set("experience", form.experience.filter((_, idx) => idx !== i));

  // Timings
  const addTiming = () => set("clinicTimings", [...(form.clinicTimings || []), { ...EMPTY_TIMING }]);
  const updateTiming = (i, k, v) => set("clinicTimings", form.clinicTimings.map((t, idx) => idx === i ? { ...t, [k]: v } : t));
  const removeTiming = (i) => set("clinicTimings", form.clinicTimings.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (!form.name.trim()) return setError("Doctor name is required.");
    if (!form.departmentId) return setError("Please select a department.");
    setSaving(true); setError("");
    try {
      const data = { ...form, consultationFee: Number(form.consultationFee) || 0, updatedAt: serverTimestamp() };
      if (editing) {
        await updateDoc(doc(db, "doctors", editing.id), data);
      } else {
        await addDoc(collection(db, "doctors"), { ...data, createdAt: serverTimestamp() });
      }
      setShowModal(false);
    } catch (e) { setError(e.message); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this doctor?")) return;
    await deleteDoc(doc(db, "doctors", id));
  };

  const TABS = ["basic","qualifications","experience","timings","settings"];

  return (
    <div>
      <SectionHeader
        title="Doctors & Consultants"
        desc="Manage specialist profiles, schedules, qualifications, and reviews."
        action={<AddButton label="Add Doctor" onClick={openAdd} />}
      />

      {loading ? <div className="text-gray-400 text-sm">Loading...</div>
        : doctors.length === 0 ? (
          <EmptyState icon="👨‍⚕️" title="No doctors yet" desc="Add your medical staff to the directory." action={<AddButton label="Add Doctor" onClick={openAdd} />} />
        ) : (
          <Table cols={["Doctor", "Specialty / Dept", "Timings", "Fee", "Booking", "Active", "Actions"]}>
            {doctors.map((doc) => (
              <Tr key={doc.id}>
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 font-bold text-sm shrink-0">
                      {doc.name?.[0]}
                    </div>
                    <div>
                      <div className="font-medium text-white">{doc.name}</div>
                      <div className="text-xs text-gray-500">{doc.title}</div>
                    </div>
                  </div>
                </Td>
                <Td>
                  <div className="text-sm">{doc.specialty}</div>
                  <div className="text-xs text-gray-500">{doc.departmentName}</div>
                </Td>
                <Td muted>{(doc.clinicTimings || []).filter(t => t.isAvailable).length} days/week</Td>
                <Td muted>Rs. {doc.consultationFee || "—"}</Td>
                <Td><Badge status={doc.isAvailableForBooking ? "active" : "inactive"} customLabel={doc.isAvailableForBooking ? "Open" : "Closed"} /></Td>
                <Td><Badge status={doc.isActive ? "active" : "inactive"} /></Td>
                <Td>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(doc)} className="text-gray-400 hover:text-teal-400 p-1 transition"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(doc.id)} className="text-gray-400 hover:text-red-400 p-1 transition"><Trash2 size={14} /></button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Table>
        )}

      {showModal && (
        <Modal title={editing ? `Edit — ${form.name}` : "Add Doctor"} onClose={() => setShowModal(false)} size="xl">
          <ErrorMsg msg={error} />

          {/* Tab Bar */}
          <div className="flex gap-1 bg-white/5 p-1 rounded-lg mb-6">
            {TABS.map((t) => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium capitalize transition ${activeTab === t ? "bg-teal-600 text-white" : "text-gray-400 hover:text-white"}`}>
                {t}
              </button>
            ))}
          </div>

          {/* ── Basic Info ── */}
          {activeTab === "basic" && (
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Field label="Full Name" required>
                    <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Dr. Ahmed Khan" />
                  </Field>
                </div>
                <Field label="URL Slug">
                  <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="dr-ahmed-khan" />
                </Field>
              </div>
              <Field label="Qualifications Title" hint="e.g. MBBS, FCPS (Cardiology)">
                <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="MBBS, FCPS" />
              </Field>
              <Field label="Specialty" required>
                <Input value={form.specialty} onChange={(e) => set("specialty", e.target.value)} placeholder="Cardiologist" />
              </Field>
              <Field label="Department" required>
                <Select value={form.departmentId} onChange={(e) => set("departmentId", e.target.value)}>
                  <option value="">Select Department</option>
                  {departments.map((d) => <option key={d.id} value={d.id}>{d.icon} {d.name}</option>)}
                </Select>
              </Field>
              <Field label="Consultation Fee (Rs.)">
                <Input type="number" value={form.consultationFee} onChange={(e) => set("consultationFee", e.target.value)} placeholder="1500" />
              </Field>
              <Field label="Phone">
                <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+92-XXX-XXXXXXX" />
              </Field>
              <Field label="Email">
                <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="doctor@hospital.com" />
              </Field>
              <div className="col-span-2">
                <Field label="Photo URL" hint="Paste Firebase Storage URL or external image link">
                  <Input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} placeholder="https://..." />
                </Field>
              </div>
              <div className="col-span-2">
                <Field label="Biography">
                  <Textarea rows={5} value={form.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Dr. Ahmed Khan is a senior consultant cardiologist with 15+ years of experience..." />
                </Field>
              </div>
            </div>
          )}

          {/* ── Qualifications ── */}
          {activeTab === "qualifications" && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500 mb-4">Add academic degrees and certifications in reverse chronological order.</p>
              {(form.qualifications || []).map((q, i) => (
                <div key={i} className="grid grid-cols-7 gap-3 items-start bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="col-span-3">
                    <Field label="Degree / Certification">
                      <Input value={q.degree} onChange={(e) => updateQual(i, "degree", e.target.value)} placeholder="FCPS (Cardiology)" />
                    </Field>
                  </div>
                  <div className="col-span-3">
                    <Field label="Institution">
                      <Input value={q.institution} onChange={(e) => updateQual(i, "institution", e.target.value)} placeholder="CPSP Lahore" />
                    </Field>
                  </div>
                  <div>
                    <Field label="Year">
                      <Input value={q.year} onChange={(e) => updateQual(i, "year", e.target.value)} placeholder="2010" />
                    </Field>
                  </div>
                  <button onClick={() => removeQual(i)} className="mt-6 text-red-400 hover:text-red-300 p-1 col-span-full text-right text-xs">Remove</button>
                </div>
              ))}
              <button onClick={addQual} className="flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm transition mt-2">
                <Plus size={14} /> Add Qualification
              </button>
            </div>
          )}

          {/* ── Experience ── */}
          {activeTab === "experience" && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500 mb-4">Add previous and current positions in reverse chronological order.</p>
              {(form.experience || []).map((e, i) => (
                <div key={i} className="grid grid-cols-2 gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                  <Field label="Role / Position">
                    <Input value={e.role} onChange={(ev) => updateExp(i, "role", ev.target.value)} placeholder="Senior Consultant" />
                  </Field>
                  <Field label="Hospital / Organization">
                    <Input value={e.hospital} onChange={(ev) => updateExp(i, "hospital", ev.target.value)} placeholder="Services Hospital, Lahore" />
                  </Field>
                  <Field label="From (Year)">
                    <Input value={e.from} onChange={(ev) => updateExp(i, "from", ev.target.value)} placeholder="2015" />
                  </Field>
                  <Field label="To (Year or 'Present')">
                    <Input value={e.to} onChange={(ev) => updateExp(i, "to", ev.target.value)} placeholder="Present" />
                  </Field>
                  <button onClick={() => removeExp(i)} className="col-span-full text-right text-xs text-red-400 hover:text-red-300">Remove</button>
                </div>
              ))}
              <button onClick={addExp} className="flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm transition mt-2">
                <Plus size={14} /> Add Experience
              </button>
            </div>
          )}

          {/* ── Clinic Timings ── */}
          {activeTab === "timings" && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500 mb-4">Set the doctor's weekly clinic schedule. Toggle off days when not available.</p>
              {(form.clinicTimings || []).map((t, i) => (
                <div key={i} className="grid grid-cols-7 gap-3 items-center bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="col-span-2">
                    <Field label="Day">
                      <Select value={t.day} onChange={(e) => updateTiming(i, "day", e.target.value)}>
                        {DAYS.map((d) => <option key={d}>{d}</option>)}
                      </Select>
                    </Field>
                  </div>
                  <div className="col-span-2">
                    <Field label="Start Time">
                      <Select value={t.startTime} onChange={(e) => updateTiming(i, "startTime", e.target.value)}>
                        {TIMES.map((tm) => <option key={tm}>{tm}</option>)}
                      </Select>
                    </Field>
                  </div>
                  <div className="col-span-2">
                    <Field label="End Time">
                      <Select value={t.endTime} onChange={(e) => updateTiming(i, "endTime", e.target.value)}>
                        {TIMES.map((tm) => <option key={tm}>{tm}</option>)}
                      </Select>
                    </Field>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-gray-500">Available</span>
                    <Toggle checked={t.isAvailable} onChange={(v) => updateTiming(i, "isAvailable", v)} label="" />
                    <button onClick={() => removeTiming(i)} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
                  </div>
                </div>
              ))}
              <button onClick={addTiming} className="flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm transition mt-2">
                <Plus size={14} /> Add Time Slot
              </button>
            </div>
          )}

          {/* ── Settings ── */}
          {activeTab === "settings" && (
            <div className="space-y-5">
              <Toggle label="Available for Online Booking" checked={form.isAvailableForBooking} onChange={(v) => set("isAvailableForBooking", v)} />
              <Toggle label="Active (visible on website)" checked={form.isActive} onChange={(v) => set("isActive", v)} />
              <Field label="Display Order" hint="Lower number = appears first in listings">
                <Input type="number" value={form.order} onChange={(e) => set("order", parseInt(e.target.value) || 0)} className="w-32" />
              </Field>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-white/10">
            <button onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm text-gray-400 hover:text-white transition">Cancel</button>
            <SaveButton loading={saving} onClick={handleSave} label={editing ? "Update Doctor" : "Add Doctor"} />
          </div>
        </Modal>
      )}
    </div>
  );
}
