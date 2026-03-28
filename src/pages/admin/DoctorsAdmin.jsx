import React from "react";// src/pages/admin/doctors/DoctorsAdmin.jsx
import { useState } from "react";
import { useCollection, toSlug } from "../../hooks/useCollection";
import {
  Modal, Field, Input, Textarea, Select, Toggle, TagInput,
  DataTable, PageHeader, SaveButton, Badge, SectionCard,
  ClinicTimingEditor, StarRating, useConfirmDelete
} from "../../AdminUI";
import { Plus, Pencil, Trash2, Star, Clock, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

const DESIGNATIONS = ["Senior Consultant","Consultant","Associate Consultant","Resident","Head of Department","Professor","Assistant Professor"];
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

const emptyForm = {
  name: "", slug: "", departmentId: "", departmentName: "", specialty: "",
  designation: "", qualifications: [], experience: "", bio: "",
  imageUrl: "", email: "", phone: "", consultationFee: "",
  clinicTimings: DAYS.map(day => ({ day, startTime: "09:00", endTime: "17:00", isAvailable: false })),
  availableForBooking: true, languages: ["Urdu","English"],
  awards: [], isActive: true, order: 0,
};

export default function DoctorsAdmin() {
  const { items: doctors, loading, add, update, remove } = useCollection("doctors");
  const { items: departments } = useCollection("departments");
  const { items: reviews, update: updateReview, remove: removeReview } = useCollection("doctorReviews");

  const [modal, setModal] = useState(null); // null | "form" | "reviews"
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [reviewsDoctor, setReviewsDoctor] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");

  const set = (field, value) => setForm(f => ({
    ...f, [field]: value,
    ...(field === "name" && !editId ? { slug: toSlug(value) } : {}),
    ...(field === "departmentId" ? {
      departmentName: departments.find(d => d.id === value)?.name || ""
    } : {})
  }));

  const openAdd = () => { setForm(emptyForm); setEditId(null); setActiveTab("basic"); setModal("form"); };
  const openEdit = (doc) => {
    setForm({ ...emptyForm, ...doc });
    setEditId(doc.id);
    setActiveTab("basic");
    setModal("form");
  };
  const openReviews = (doctor) => { setReviewsDoctor(doctor); setModal("reviews"); };

  const handleSave = async () => {
    if (!form.name.trim()) return alert("Doctor name is required.");
    if (!form.departmentId) return alert("Please select a department.");
    setSaving(true);
    try {
      const data = { ...form, slug: form.slug || toSlug(form.name), experience: Number(form.experience) || 0, consultationFee: Number(form.consultationFee) || 0 };
      if (editId) await update(editId, data);
      else await add(data);
      setModal(null);
    } catch (e) { alert("Error: " + e.message); }
    setSaving(false);
  };

  const confirmDelete = useConfirmDelete(remove);
  const confirmDeleteReview = useConfirmDelete(removeReview);

  const doctorReviews = (doctorId) => reviews.filter(r => r.doctorId === doctorId);

  const TABS = [
    { id: "basic", label: "Basic Info" },
    { id: "professional", label: "Professional" },
    { id: "schedule", label: "Clinic Schedule" },
    { id: "contact", label: "Contact & Fees" },
  ];

  const columns = [
    { key: "name", label: "Doctor", render: r => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm shrink-0">
          {r.imageUrl ? <img src={r.imageUrl} alt={r.name} className="w-9 h-9 rounded-full object-cover" /> : r.name?.[0]}
        </div>
        <div>
          <div className="font-medium text-gray-800">{r.name}</div>
          <div className="text-xs text-gray-400">{r.designation}</div>
        </div>
      </div>
    )},
    { key: "specialty", label: "Specialty" },
    { key: "departmentName", label: "Department", render: r => (
      <Badge label={r.departmentName || "—"} color="teal" />
    )},
    { key: "experience", label: "Exp.", render: r => <span>{r.experience || "—"} yrs</span> },
    { key: "consultationFee", label: "Fee", render: r => (
      <span className="text-gray-600">Rs. {r.consultationFee || "—"}</span>
    )},
    { key: "booking", label: "Bookable", render: r => (
      r.availableForBooking
        ? <CheckCircle size={16} className="text-green-500" />
        : <XCircle size={16} className="text-gray-300" />
    )},
    { key: "reviews", label: "Reviews", render: r => (
      <button onClick={() => openReviews(r)} className="flex items-center gap-1 text-amber-500 hover:text-amber-700 transition text-sm">
        <Star size={14} fill="currentColor" />
        <span>{doctorReviews(r.id).length}</span>
      </button>
    )},
    { key: "isActive", label: "Status", render: r => (
      <Badge label={r.isActive ? "Active" : "Hidden"} color={r.isActive ? "green" : "gray"} />
    )},
    { key: "actions", label: "Actions", render: r => (
      <div className="flex gap-2">
        <button onClick={() => update(r.id, { isActive: !r.isActive })} className="text-gray-400 hover:text-teal-600 p-1 transition" title="Toggle visibility">
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
        title="Doctors & Consultants"
        subtitle={`${doctors.filter(d => d.isActive).length} active · ${doctors.filter(d => d.availableForBooking).length} accepting bookings`}
        action={
          <button onClick={openAdd} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition">
            <Plus size={16} /> Add Doctor
          </button>
        }
      />

      <DataTable columns={columns} rows={doctors} loading={loading} emptyMessage="No doctors added yet." />

      {/* Doctor Form Modal */}
      {modal === "form" && (
        <Modal title={editId ? "Edit Doctor Profile" : "Add Doctor"} onClose={() => setModal(null)} size="xl">
          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-100 mb-5 -mt-1">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition border-b-2 -mb-px ${activeTab === tab.id ? "border-teal-600 text-teal-600 bg-teal-50/50" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Basic Info Tab */}
          {activeTab === "basic" && (
            <div className="grid md:grid-cols-2 gap-5">
              <SectionCard title="Identity">
                <div className="space-y-4">
                  <Field label="Full Name" required><Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Dr. Ahmed Khan" /></Field>
                  <Field label="URL Slug"><Input value={form.slug} onChange={e => set("slug", e.target.value)} /></Field>
                  <Field label="Department" required>
                    <Select value={form.departmentId} onChange={e => set("departmentId", e.target.value)}
                      options={departments.map(d => ({ value: d.id, label: d.name }))} placeholder="Select Department" />
                  </Field>
                  <Field label="Specialty" required><Input value={form.specialty} onChange={e => set("specialty", e.target.value)} placeholder="Interventional Cardiologist" /></Field>
                  <Field label="Designation">
                    <Select value={form.designation} onChange={e => set("designation", e.target.value)} options={DESIGNATIONS} placeholder="Select Designation" />
                  </Field>
                </div>
              </SectionCard>
              <SectionCard title="Photo & Status">
                <div className="space-y-4">
                  <Field label="Profile Image URL" hint="Paste Firebase Storage URL after uploading">
                    <Input value={form.imageUrl} onChange={e => set("imageUrl", e.target.value)} placeholder="https://..." />
                    {form.imageUrl && <img src={form.imageUrl} alt="Preview" className="mt-2 w-24 h-24 rounded-full object-cover border-2 border-teal-200" />}
                  </Field>
                  <Field label="Display Order"><Input type="number" value={form.order} onChange={e => set("order", Number(e.target.value))} min={0} /></Field>
                  <Toggle label="Active (visible on website)" checked={form.isActive} onChange={v => set("isActive", v)} />
                  <Toggle label="Available for Online Booking" checked={form.availableForBooking} onChange={v => set("availableForBooking", v)} />
                </div>
              </SectionCard>
            </div>
          )}

          {/* Professional Tab */}
          {activeTab === "professional" && (
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-4">
                <SectionCard title="Qualifications & Experience">
                  <div className="space-y-4">
                    <TagInput label="Qualifications" tags={form.qualifications || []} onChange={v => set("qualifications", v)} placeholder="e.g. MBBS, FCPS (Cardiology)..." />
                    <Field label="Years of Experience"><Input type="number" value={form.experience} onChange={e => set("experience", e.target.value)} min={0} placeholder="15" /></Field>
                    <TagInput label="Languages Spoken" tags={form.languages || []} onChange={v => set("languages", v)} placeholder="Urdu, English, Punjabi..." />
                    <TagInput label="Awards & Recognitions" tags={form.awards || []} onChange={v => set("awards", v)} placeholder="Best Doctor Award 2023..." />
                  </div>
                </SectionCard>
              </div>
              <SectionCard title="Biography">
                <Field label="Bio / About" hint="Displayed on doctor's profile page">
                  <Textarea value={form.bio} onChange={e => set("bio", e.target.value)} rows={12} placeholder="Write a detailed biography about the doctor's experience, approach to patient care, research interests..." />
                </Field>
              </SectionCard>
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === "schedule" && (
            <SectionCard title="Clinic Timings">
              <p className="text-sm text-gray-500 mb-4">Check the days the doctor is available and set their working hours.</p>
              <ClinicTimingEditor
                timings={form.clinicTimings || []}
                onChange={v => set("clinicTimings", v)}
              />
            </SectionCard>
          )}

          {/* Contact Tab */}
          {activeTab === "contact" && (
            <div className="grid md:grid-cols-2 gap-5">
              <SectionCard title="Contact Details">
                <div className="space-y-4">
                  <Field label="Email"><Input type="email" value={form.email} onChange={e => set("email", e.target.value)} /></Field>
                  <Field label="Phone"><Input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+92-XXX-XXXXXXX" /></Field>
                </div>
              </SectionCard>
              <SectionCard title="Consultation Fee">
                <Field label="Fee (PKR)" hint="Set to 0 for free consultations">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rs.</span>
                    <Input className="pl-10" type="number" value={form.consultationFee} onChange={e => set("consultationFee", e.target.value)} min={0} placeholder="1500" />
                  </div>
                </Field>
              </SectionCard>
            </div>
          )}

          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
            <SaveButton saving={saving} onClick={handleSave} label={editId ? "Update Doctor" : "Add Doctor"} />
            <button onClick={() => setModal(null)} className="border border-gray-200 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition">Cancel</button>
          </div>
        </Modal>
      )}

      {/* Reviews Modal */}
      {modal === "reviews" && reviewsDoctor && (
        <Modal title={`Reviews — ${reviewsDoctor.name}`} onClose={() => setModal(null)} size="lg">
          <div className="space-y-4">
            {doctorReviews(reviewsDoctor.id).length === 0 && (
              <div className="text-center py-10 text-gray-400">No reviews yet for this doctor.</div>
            )}
            {doctorReviews(reviewsDoctor.id).map(review => (
              <div key={review.id} className={`border rounded-xl p-4 ${review.isApproved ? "border-green-100 bg-green-50/30" : "border-gray-100"}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-800">{review.patientName}</div>
                    <StarRating rating={review.rating} />
                    <p className="text-sm text-gray-600 mt-2">{review.review}</p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge label={review.isApproved ? "Approved" : "Pending"} color={review.isApproved ? "green" : "yellow"} />
                    <div className="flex gap-2">
                      <button onClick={() => updateReview(review.id, { isApproved: !review.isApproved })}
                        className="text-xs text-teal-600 hover:underline">
                        {review.isApproved ? "Unapprove" : "Approve"}
                      </button>
                      <button onClick={() => confirmDeleteReview(review.id, "this review")}
                        className="text-xs text-red-500 hover:underline">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
