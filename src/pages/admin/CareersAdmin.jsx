import React from "react";// src/pages/admin/careers/CareersAdmin.jsx
import { useState } from "react";
import { useCollection } from "../../hooks/useCollection";
import {
  Modal, Field, Input, Textarea, Select, Toggle, TagInput,
  DataTable, PageHeader, SaveButton, Badge, SectionCard, useConfirmDelete
} from "../../components/AdminUI";
import { Plus, Pencil, Trash2, Users, Eye } from "lucide-react";

const JOB_TYPES = ["full-time","part-time","contract","internship"];
const DEPARTMENTS_LIST = ["Cardiology","Pediatrics","Orthopedics","Gynecology","Internal Medicine","Radiology","Emergency","Administration","Nursing","Pharmacy","Laboratory","IT"];
const APP_STATUSES = ["new","reviewing","shortlisted","rejected"];
const APP_COLORS = { new:"blue", reviewing:"yellow", shortlisted:"green", rejected:"red" };

const emptyJob = {
  title: "", department: "", type: "full-time", location: "Lahore",
  description: "", requirements: [], responsibilities: [], salary: "",
  deadline: "", isActive: true,
};

export default function CareersAdmin() {
  const { items: jobs, loading, add, update, remove } = useCollection("careers");
  const { items: applications, update: updateApp, remove: removeApp } = useCollection("careerApplications");

  const [modal, setModal] = useState(null); // null | "job" | "applications"
  const [form, setForm] = useState(emptyJob);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [viewJobApps, setViewJobApps] = useState(null);

  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const openAdd = () => { setForm(emptyJob); setEditId(null); setModal("job"); };
  const openEdit = (j) => { setForm({ ...emptyJob, ...j }); setEditId(j.id); setModal("job"); };
  const openApps = (job) => { setViewJobApps(job); setModal("applications"); };

  const handleSave = async () => {
    if (!form.title.trim()) return alert("Job title is required.");
    setSaving(true);
    try {
      if (editId) await update(editId, form);
      else await add(form);
      setModal(null);
    } catch (e) { alert("Error: " + e.message); }
    setSaving(false);
  };

  const confirmDelete = useConfirmDelete(remove);
  const jobApplications = (jobId) => applications.filter(a => a.careerId === jobId);

  const typeColor = { "full-time":"green", "part-time":"blue", "contract":"yellow", "internship":"purple" };

  const columns = [
    { key: "title", label: "Position", render: r => (
      <div>
        <div className="font-medium text-gray-800">{r.title}</div>
        <div className="text-xs text-gray-400">{r.location}</div>
      </div>
    )},
    { key: "department", label: "Department", render: r => <Badge label={r.department} color="teal" /> },
    { key: "type", label: "Type", render: r => <Badge label={r.type} color={typeColor[r.type] || "gray"} /> },
    { key: "salary", label: "Salary", render: r => <span className="text-gray-500 text-sm">{r.salary || "Competitive"}</span> },
    { key: "deadline", label: "Deadline", render: r => <span className="text-sm text-gray-500">{r.deadline || "—"}</span> },
    { key: "apps", label: "Applications", render: r => (
      <button onClick={() => openApps(r)} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition text-sm font-medium">
        <Users size={14} />
        <span>{jobApplications(r.id).length}</span>
      </button>
    )},
    { key: "isActive", label: "Status", render: r => <Badge label={r.isActive ? "Open" : "Closed"} color={r.isActive ? "green" : "gray"} /> },
    { key: "actions", label: "Actions", render: r => (
      <div className="flex gap-2">
        <button onClick={() => update(r.id, { isActive: !r.isActive })} className="text-gray-400 hover:text-teal-600 p-1 transition" title="Toggle open/closed">
          <Eye size={15} />
        </button>
        <button onClick={() => openEdit(r)} className="text-blue-500 hover:text-blue-700 p-1 transition"><Pencil size={15} /></button>
        <button onClick={() => confirmDelete(r.id, r.title)} className="text-red-400 hover:text-red-600 p-1 transition"><Trash2 size={15} /></button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Careers"
        subtitle={`${jobs.filter(j => j.isActive).length} open positions · ${applications.length} total applications`}
        action={
          <button onClick={openAdd} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition">
            <Plus size={16} /> Post Job
          </button>
        }
      />

      <DataTable columns={columns} rows={jobs} loading={loading} emptyMessage="No job postings yet." />

      {/* Job Form */}
      {modal === "job" && (
        <Modal title={editId ? "Edit Job Posting" : "Post New Job"} onClose={() => setModal(null)} size="lg">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <SectionCard title="Job Details">
                <div className="space-y-4">
                  <Field label="Job Title" required><Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Senior Cardiologist" /></Field>
                  <Field label="Department" required>
                    <Select value={form.department} onChange={e => set("department", e.target.value)} options={DEPARTMENTS_LIST} placeholder="Select department" />
                  </Field>
                  <Field label="Job Type" required>
                    <Select value={form.type} onChange={e => set("type", e.target.value)} options={JOB_TYPES.map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1).replace("-"," ") }))} />
                  </Field>
                  <Field label="Location"><Input value={form.location} onChange={e => set("location", e.target.value)} placeholder="Lahore" /></Field>
                  <Field label="Salary" hint="e.g. 'Rs. 150,000 - 250,000' or 'Competitive'">
                    <Input value={form.salary} onChange={e => set("salary", e.target.value)} placeholder="Competitive" />
                  </Field>
                  <Field label="Application Deadline"><Input type="date" value={form.deadline} onChange={e => set("deadline", e.target.value)} /></Field>
                  <Toggle label="Accepting Applications" checked={form.isActive} onChange={v => set("isActive", v)} />
                </div>
              </SectionCard>
            </div>
            <div className="space-y-4">
              <SectionCard title="Description">
                <Field label="Job Description" required>
                  <Textarea value={form.description} onChange={e => set("description", e.target.value)} rows={6} placeholder="Role overview, responsibilities, what we're looking for..." />
                </Field>
              </SectionCard>
              <SectionCard title="Requirements & Responsibilities">
                <div className="space-y-4">
                  <TagInput label="Requirements" tags={form.requirements || []} onChange={v => set("requirements", v)} placeholder="MBBS required, 5+ years experience..." />
                  <TagInput label="Key Responsibilities" tags={form.responsibilities || []} onChange={v => set("responsibilities", v)} placeholder="Patient consultations, ward rounds..." />
                </div>
              </SectionCard>
            </div>
          </div>
          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
            <SaveButton saving={saving} onClick={handleSave} label={editId ? "Update Job" : "Post Job"} />
            <button onClick={() => setModal(null)} className="border border-gray-200 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition">Cancel</button>
          </div>
        </Modal>
      )}

      {/* Applications Modal */}
      {modal === "applications" && viewJobApps && (
        <Modal title={`Applications — ${viewJobApps.title}`} onClose={() => setModal(null)} size="lg">
          <div className="space-y-4">
            {jobApplications(viewJobApps.id).length === 0 && (
              <div className="text-center py-10 text-gray-400">No applications received yet for this position.</div>
            )}
            {jobApplications(viewJobApps.id).map(app => (
              <div key={app.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-gray-800">{app.applicantName}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{app.email} · {app.phone}</div>
                    {app.coverLetter && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{app.coverLetter}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge label={app.status} color={APP_COLORS[app.status] || "gray"} />
                    <Select
                      value={app.status}
                      onChange={e => updateApp(app.id, { status: e.target.value })}
                      options={APP_STATUSES.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
                      className="text-xs py-1 px-2 w-36"
                    />
                    {app.cvUrl && (
                      <a href={app.cvUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 hover:underline">View CV →</a>
                    )}
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
