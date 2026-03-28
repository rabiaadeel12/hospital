import React from "react";// src/pages/admin/modules/CareersManager.jsx
import { useState } from "react";
import { db } from "../../../firebase/config";
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  serverTimestamp, getDocs, query, orderBy
} from "firebase/firestore";
import { useCollection } from "../../../hooks/useCollection";
import {
  Modal, Field, Input, Textarea, Select, Toggle, Badge,
  SaveButton, EmptyState, SectionHeader, AddButton,
  Table, Tr, Td, ErrorMsg, TagInput
} from "../../../components/AdminUI";
import { Pencil, Trash2, Users, ChevronRight } from "lucide-react";

const JOB_TYPES = ["full-time","part-time","contract","internship"];

const EMPTY = {
  title: "", department: "", type: "full-time", location: "Lahore",
  description: "", requirements: [], deadline: "", isActive: true
};

export default function CareersManager() {
  const { docs: jobs, loading } = useCollection("careers", "createdAt");
  const [showModal, setShowModal] = useState(false);
  const [showApplications, setShowApplications] = useState(null);
  const [applications, setApplications] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (j) => { setEditing(j); setForm({ ...j }); setShowModal(true); };
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const loadApplications = async (job) => {
    const snap = await getDocs(query(collection(db, `careers/${job.id}/applications`), orderBy("createdAt", "desc")));
    setApplications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setShowApplications(job);
  };

  const updateAppStatus = async (jobId, appId, status) => {
    await updateDoc(doc(db, `careers/${jobId}/applications`, appId), { status });
    setApplications(a => a.map(x => x.id === appId ? { ...x, status } : x));
  };

  const handleSave = async () => {
    if (!form.title.trim()) return setError("Job title is required.");
    setSaving(true); setError("");
    try {
      const data = { ...form, updatedAt: serverTimestamp() };
      if (editing) await updateDoc(doc(db, "careers", editing.id), data);
      else await addDoc(collection(db, "careers"), { ...data, applicationCount: 0, createdAt: serverTimestamp() });
      setShowModal(false);
    } catch (e) { setError(e.message); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job posting?")) return;
    await deleteDoc(doc(db, "careers", id));
  };

  return (
    <div>
      <SectionHeader
        title="Careers"
        desc="Manage job openings and review applications."
        action={<AddButton label="Post Job" onClick={openAdd} />}
      />

      {loading ? <div className="text-gray-400 text-sm">Loading...</div>
        : jobs.length === 0 ? (
          <EmptyState icon="💼" title="No job postings yet" desc="Post your first opening to attract talent." action={<AddButton label="Post Job" onClick={openAdd} />} />
        ) : (
          <Table cols={["Job Title", "Department", "Type", "Deadline", "Applications", "Status", "Actions"]}>
            {jobs.map((job) => (
              <Tr key={job.id}>
                <Td>
                  <div className="font-medium text-white">{job.title}</div>
                  <div className="text-xs text-gray-500">{job.location}</div>
                </Td>
                <Td muted>{job.department}</Td>
                <Td>
                  <span className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded-full capitalize">{job.type}</span>
                </Td>
                <Td muted>{job.deadline || "—"}</Td>
                <Td>
                  <button onClick={() => loadApplications(job)}
                    className="flex items-center gap-1.5 text-teal-400 hover:text-teal-300 transition text-sm">
                    <Users size={13} />
                    {job.applicationCount || 0}
                    <ChevronRight size={12} />
                  </button>
                </Td>
                <Td><Badge status={job.isActive ? "active" : "inactive"} /></Td>
                <Td>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(job)} className="text-gray-400 hover:text-teal-400 p-1 transition"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(job.id)} className="text-gray-400 hover:text-red-400 p-1 transition"><Trash2 size={14} /></button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Table>
        )}

      {/* Add/Edit Job Modal */}
      {showModal && (
        <Modal title={editing ? "Edit Job Posting" : "New Job Posting"} onClose={() => setShowModal(false)} size="lg">
          <ErrorMsg msg={error} />
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2">
              <Field label="Job Title" required>
                <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Senior Cardiologist" />
              </Field>
            </div>
            <Field label="Department">
              <Input value={form.department} onChange={(e) => set("department", e.target.value)} placeholder="Cardiology" />
            </Field>
            <Field label="Employment Type">
              <Select value={form.type} onChange={(e) => set("type", e.target.value)}>
                {JOB_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
              </Select>
            </Field>
            <Field label="Location">
              <Input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Lahore" />
            </Field>
            <Field label="Application Deadline">
              <Input type="date" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} />
            </Field>
            <div className="col-span-2">
              <Field label="Job Description">
                <Textarea rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe the role, responsibilities..." />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Requirements" hint="Press Enter after each requirement">
                <TagInput
                  tags={form.requirements || []}
                  onChange={(v) => set("requirements", v)}
                  placeholder="e.g. MBBS, 5+ years experience..."
                />
              </Field>
            </div>
            <div className="col-span-2">
              <Toggle label="Active (visible to applicants)" checked={form.isActive} onChange={(v) => set("isActive", v)} />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-white/10">
            <button onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm text-gray-400 hover:text-white transition">Cancel</button>
            <SaveButton loading={saving} onClick={handleSave} label={editing ? "Update Posting" : "Post Job"} />
          </div>
        </Modal>
      )}

      {/* Applications Modal */}
      {showApplications && (
        <Modal title={`Applications — ${showApplications.title}`} onClose={() => setShowApplications(null)} size="xl">
          {applications.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No applications received yet.</div>
          ) : (
            <Table cols={["Applicant", "Contact", "Status", "Applied On", "CV", "Actions"]}>
              {applications.map((app) => (
                <Tr key={app.id}>
                  <Td>
                    <div className="font-medium text-white">{app.applicantName}</div>
                    {app.coverLetter && <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{app.coverLetter.substring(0, 60)}...</div>}
                  </Td>
                  <Td>
                    <div className="text-xs">{app.email}</div>
                    <div className="text-xs text-gray-500">{app.phone}</div>
                  </Td>
                  <Td><Badge status={app.status || "new"} /></Td>
                  <Td muted>{app.createdAt?.toDate?.()?.toLocaleDateString() || "—"}</Td>
                  <Td>
                    {app.cvUrl
                      ? <a href={app.cvUrl} target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline text-xs">View CV</a>
                      : <span className="text-gray-600 text-xs">—</span>}
                  </Td>
                  <Td>
                    <Select value={app.status || "new"} onChange={(e) => updateAppStatus(showApplications.id, app.id, e.target.value)}
                      className="text-xs py-1">
                      {["new","reviewing","shortlisted","rejected"].map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                    </Select>
                  </Td>
                </Tr>
              ))}
            </Table>
          )}
        </Modal>
      )}
    </div>
  );
}
