import React from "react";
import { useState } from "react";
import { db } from "../../../firebase/config";
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  serverTimestamp,
} from "firebase/firestore";
import { useCollection } from "../../../hooks/useCollection";
import { deleteFile } from "../../../lib/s3";
import {
  Modal, Field, Input, Textarea, Select, Toggle, Badge,
  SaveButton, EmptyState, SectionHeader, AddButton,
  Table, Tr, Td, ErrorMsg, TagInput
} from "../../../components/AdminUI";
import FileUpload from "../../../components/FileUpload";
import { Pencil, Trash2, Plus } from "lucide-react";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const TIMES = ["08:00 AM","09:00 AM","10:00 AM","11:00 AM","12:00 PM","01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM","06:00 PM","07:00 PM","08:00 PM"];

const EMPTY_DOCTOR = {
  name: "", slug: "", title: "", specialty: "", departmentId: "",
  departmentName: "", departmentSlug: "",
  bio: "", qualifications: [], clinicTimings: [], consultationFee: "",
  imageUrl: "", phone: "", email: "", isAvailableForBooking: true, isActive: true, order: 0
};

const EMPTY_TIMING = { day: "Monday", startTime: "09:00 AM", endTime: "05:00 PM", isAvailable: true };

function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, "-"); }

export default function DoctorsManager() {
  const { docs: doctors, loading } = useCollection("doctors", "order");
  const { docs: departments } = useCollection("departments", "order");
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_DOCTOR);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const openAdd = () => { setEditing(null); setForm(EMPTY_DOCTOR); setActiveTab("basic"); setShowModal(true); };
  const openEdit = (d) => { setEditing(d); setForm({ ...d }); setActiveTab("basic"); setShowModal(true); };

  const set = (k, v) => setForm((f) => {
    const updated = { ...f, [k]: v };
    if (k === "name" && !editing) updated.slug = slugify(v);
    if (k === "departmentId") {
      const dept = departments.find(d => d.id === v);
      updated.departmentName = dept?.name || "";
      updated.departmentSlug = dept?.slug || ""; // ← save slug too
    }
    return updated;
  });

  const addQual = () => set("qualifications", [...(form.qualifications || []), { degree: "", institution: "", year: "" }]);
  const updateQual = (i, k, v) => set("qualifications", form.qualifications.map((q, idx) => idx === i ? { ...q, [k]: v } : q));
  const removeQual = (i) => set("qualifications", form.qualifications.filter((_, idx) => idx !== i));

  const addTiming = () => set("clinicTimings", [...(form.clinicTimings || []), { ...EMPTY_TIMING }]);
  const updateTiming = (i, k, v) => set("clinicTimings", form.clinicTimings.map((t, idx) => idx === i ? { ...t, [k]: v } : t));
  const removeTiming = (i) => set("clinicTimings", form.clinicTimings.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (!form.name.trim()) return setError("Doctor name is required.");
    if (!form.departmentId) return setError("Please select a department.");
    setSaving(true); setError("");
    try {
      const data = { ...form, consultationFee: Number(form.consultationFee) || 0, updatedAt: serverTimestamp() };
      if (editing) await updateDoc(doc(db, "doctors", editing.id), data);
      else await addDoc(collection(db, "doctors"), { ...data, createdAt: serverTimestamp() });
      setShowModal(false);
    } catch (e) { setError(e.message); }
    setSaving(false);
  };

  const handleDelete = async (d) => {
    if (!window.confirm("Delete this doctor?")) return;
    if (d.imageUrl) await deleteFile(d.imageUrl).catch(() => {});
    await deleteDoc(doc(db, "doctors", d.id));
  };

  const TABS = ["basic", "qualifications", "timings", "settings"];

  return (
    <div>
      <SectionHeader
        title="Doctors & Consultants"
        desc="Manage specialist profiles, schedules, and qualifications."
        action={<AddButton label="Add Doctor" onClick={openAdd} />}
      />

      {loading ? <div className="text-gray-400 text-sm">Loading...</div>
        : doctors.length === 0 ? (
          <EmptyState icon="👨‍⚕️" title="No doctors yet" desc="Add your medical staff to the directory." action={<AddButton label="Add Doctor" onClick={openAdd} />} />
        ) : (
          <Table cols={["Doctor", "Specialty / Dept", "Timings", "Fee", "Booking", "Active", "Actions"]}>
            {doctors.map((d) => (
              <Tr key={d.id}>
                <Td>
                  <div className="flex items-center gap-3">
                    {d.imageUrl ? (
                      <img src={d.imageUrl} alt={d.name} className="w-9 h-9 rounded-full object-cover shrink-0 border border-white/10" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 font-bold text-sm shrink-0">
                        {d.name?.[0]}
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-white">{d.name}</div>
                      <div className="text-xs text-gray-500">{d.title}</div>
                    </div>
                  </div>
                </Td>
                <Td>
                  <div className="text-sm text-gray-200">{d.specialty}</div>
                  <div className="text-xs text-gray-500">{d.departmentName}</div>
                </Td>
                <Td muted>{(d.clinicTimings || []).filter(t => t.isAvailable).length} days/week</Td>
                <Td muted>Rs. {d.consultationFee || "—"}</Td>
                <Td><Badge status={d.isAvailableForBooking ? "active" : "inactive"} customLabel={d.isAvailableForBooking ? "Open" : "Closed"} /></Td>
                <Td><Badge status={d.isActive ? "active" : "inactive"} /></Td>
                <Td>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(d)} className="text-gray-400 hover:text-teal-400 p-1 transition"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(d)} className="text-gray-400 hover:text-red-400 p-1 transition"><Trash2 size={14} /></button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Table>
        )}

      {showModal && (
        <Modal title={editing ? `Edit — ${form.name}` : "Add Doctor"} onClose={() => setShowModal(false)} size="xl">
          <ErrorMsg msg={error} />
          <div className="flex gap-1 bg-white/5 p-1 rounded-lg mb-6">
            {TABS.map((t) => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium capitalize transition ${activeTab === t ? "bg-teal-600 text-white" : "text-gray-400 hover:text-white"}`}>
                {t}
              </button>
            ))}
          </div>

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
              <div className="col-span-2">
                <Field label="Profile Photo">
                  <FileUpload value={form.imageUrl} onChange={(url) => set("imageUrl", url)} folder="doctors" accept="image/*" label="Upload doctor photo" maxMB={5} />
                </Field>
              </div>
              <div className="col-span-2">
                <Field label="Biography">
                  <Textarea rows={5} value={form.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Dr. Ahmed Khan is a senior consultant..." />
                </Field>
              </div>
            </div>
          )}

          {activeTab === "qualifications" && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500 mb-4">Add academic degrees and certifications.</p>
              {(form.qualifications || []).map((q, i) => (
                <div key={i} className="grid grid-cols-7 gap-3 items-start bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="col-span-3"><Field label="Degree"><Input value={q.degree} onChange={(e) => updateQual(i, "degree", e.target.value)} placeholder="FCPS (Cardiology)" /></Field></div>
                  <div className="col-span-3"><Field label="Institution"><Input value={q.institution} onChange={(e) => updateQual(i, "institution", e.target.value)} placeholder="CPSP Lahore" /></Field></div>
                  <div><Field label="Year"><Input value={q.year} onChange={(e) => updateQual(i, "year", e.target.value)} placeholder="2010" /></Field></div>
                  <button onClick={() => removeQual(i)} className="col-span-full text-right text-xs text-red-400 hover:text-red-300 transition">Remove</button>
                </div>
              ))}
              <button onClick={addQual} className="flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm transition mt-2"><Plus size={14} /> Add Qualification</button>
            </div>
          )}

          {activeTab === "timings" && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500 mb-4">Set the doctor's weekly clinic schedule.</p>
              {(form.clinicTimings || []).map((t, i) => (
                <div key={i} className="grid grid-cols-7 gap-3 items-center bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="col-span-2"><Field label="Day"><Select value={t.day} onChange={(e) => updateTiming(i, "day", e.target.value)}>{DAYS.map((d) => <option key={d}>{d}</option>)}</Select></Field></div>
                  <div className="col-span-2"><Field label="Start"><Select value={t.startTime} onChange={(e) => updateTiming(i, "startTime", e.target.value)}>{TIMES.map((tm) => <option key={tm}>{tm}</option>)}</Select></Field></div>
                  <div className="col-span-2"><Field label="End"><Select value={t.endTime} onChange={(e) => updateTiming(i, "endTime", e.target.value)}>{TIMES.map((tm) => <option key={tm}>{tm}</option>)}</Select></Field></div>
                  <div className="flex flex-col items-center gap-2 pt-4">
                    <Toggle checked={t.isAvailable} onChange={(v) => updateTiming(i, "isAvailable", v)} label="" />
                    <button onClick={() => removeTiming(i)} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
                  </div>
                </div>
              ))}
              <button onClick={addTiming} className="flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm transition mt-2"><Plus size={14} /> Add Time Slot</button>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-5">
              <Field label="Phone"><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+923364404140" /></Field>
              <Field label="Email"><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="doctor@hospital.com" /></Field>
              <Toggle label="Available for Online Booking" checked={form.isAvailableForBooking} onChange={(v) => set("isAvailableForBooking", v)} />
              <Toggle label="Active (visible on website)" checked={form.isActive} onChange={(v) => set("isActive", v)} />
              <Field label="Display Order" hint="Lower number = appears first">
                <Input type="number" value={form.order} onChange={(e) => set("order", parseInt(e.target.value) || 0)} />
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