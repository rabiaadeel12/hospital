import React, { useState } from "react";
import { db } from "../../../firebase/config";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { useCollection } from "../../../hooks/useCollection";
import { deleteFile } from "../../../lib/s3";
import {
  Modal, Field, Input, Toggle, Badge,
  SaveButton, EmptyState, SectionHeader, AddButton,
  Table, Tr, Td, ErrorMsg
} from "../../../components/AdminUI";
import FileUpload from "../../../components/FileUpload";
import { Pencil, Trash2, ExternalLink } from "lucide-react";

const EMPTY = {
  patientUid: "", patientName: "", patientEmail: "",
  testName: "", date: "", reportUrl: "", notes: "", isVisible: true
};

export default function LabReportsManager() {
  const { docs: reports, loading } = useCollection("labReports", "createdAt");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (r) => { setEditing(r); setForm({ ...r }); setShowModal(true); };
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.patientName.trim()) return setError("Patient name is required.");
    if (!form.testName.trim()) return setError("Test name is required.");
    if (!form.reportUrl) return setError("Please upload the report file.");
    setSaving(true); setError("");
    try {
      const data = { ...form, updatedAt: serverTimestamp() };
      if (editing) await updateDoc(doc(db, "labReports", editing.id), data);
      else await addDoc(collection(db, "labReports"), { ...data, createdAt: serverTimestamp() });
      setShowModal(false);
    } catch (e) { setError(e.message); }
    setSaving(false);
  };

  const handleDelete = async (r) => {
    if (!window.confirm("Delete this lab report?")) return;
    if (r.reportUrl) await deleteFile(r.reportUrl).catch(() => {});
    await deleteDoc(doc(db, "labReports", r.id));
  };

  return (
    <div>
      <SectionHeader
        title="Lab Reports"
        desc="Upload and manage patient lab reports. Patients see their own reports in the portal."
        action={<AddButton label="Upload Report" onClick={openAdd} />}
      />

      {loading ? <div className="text-gray-400 text-sm">Loading...</div>
        : reports.length === 0 ? (
          <EmptyState
            icon="🔬"
            title="No lab reports yet"
            desc="Upload a patient's report — they'll see it in their Patient Portal."
            action={<AddButton label="Upload Report" onClick={openAdd} />}
          />
        ) : (
          <Table cols={["Patient", "Test", "Date", "Report", "Visible", "Actions"]}>
            {reports.map((r) => (
              <Tr key={r.id}>
                <Td>
                  <div className="font-medium text-white">{r.patientName}</div>
                  <div className="text-xs text-gray-500">{r.patientEmail}</div>
                  {r.patientUid && <div className="text-xs text-gray-600 mt-0.5 font-mono truncate max-w-[120px]">UID: {r.patientUid}</div>}
                </Td>
                <Td>
                  <div className="text-gray-200">{r.testName}</div>
                  {r.notes && <div className="text-xs text-gray-500 mt-0.5">{r.notes}</div>}
                </Td>
                <Td muted>{r.date || "—"}</Td>
                <Td>
                  {r.reportUrl ? (
                    <a href={r.reportUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-teal-400 hover:text-teal-300 text-xs transition">
                      View <ExternalLink size={11} />
                    </a>
                  ) : <span className="text-gray-600 text-xs">—</span>}
                </Td>
                <Td><Badge status={r.isVisible ? "active" : "inactive"} customLabel={r.isVisible ? "Visible" : "Hidden"} /></Td>
                <Td>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(r)} className="text-gray-400 hover:text-teal-400 p-1 transition"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(r)} className="text-gray-400 hover:text-red-400 p-1 transition"><Trash2 size={14} /></button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Table>
        )}

      {showModal && (
        <Modal title={editing ? "Edit Lab Report" : "Upload Lab Report"} onClose={() => setShowModal(false)} size="lg">
          <ErrorMsg msg={error} />
          <div className="space-y-5">

            <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4 text-sm text-teal-300">
              💡 To link a report to a patient's portal, enter their Firebase UID (found in Firebase Auth console) or their registered email. If only email is set, the report won't show in portal — UID is required.
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Patient Name" required>
                <Input value={form.patientName} onChange={e => set("patientName", e.target.value)} placeholder="Muhammad Ali" />
              </Field>
              <Field label="Patient Email">
                <Input value={form.patientEmail} onChange={e => set("patientEmail", e.target.value)} placeholder="patient@email.com" />
              </Field>
            </div>

            <Field label="Patient UID" hint="Firebase Auth UID — patient sees report in portal only if this is set">
              <Input value={form.patientUid} onChange={e => set("patientUid", e.target.value)} placeholder="abc123xyz..." />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Test Name" required>
                <Input value={form.testName} onChange={e => set("testName", e.target.value)} placeholder="Complete Blood Count (CBC)" />
              </Field>
              <Field label="Test Date">
                <Input type="date" value={form.date} onChange={e => set("date", e.target.value)} />
              </Field>
            </div>

            <Field label="Report File (PDF)" required>
              <FileUpload
                value={form.reportUrl}
                onChange={url => set("reportUrl", url)}
                folder="lab-reports"
                accept="application/pdf,image/*"
                label="Upload report (PDF or image)"
                preview={false}
                maxMB={20}
              />
            </Field>

            <Field label="Notes" hint="Internal notes — not shown to patient">
              <Input value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Optional internal notes..." />
            </Field>

            <Toggle label="Visible to patient in portal" checked={form.isVisible} onChange={v => set("isVisible", v)} />
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-white/10">
            <button onClick={() => setShowModal(false)} className="px-4 py-2.5 text-sm text-gray-400 hover:text-white transition">Cancel</button>
            <SaveButton loading={saving} onClick={handleSave} label={editing ? "Update Report" : "Upload Report"} />
          </div>
        </Modal>
      )}
    </div>
  );
}