import React, { useState } from "react";
import { db } from "../../../firebase/config";
import { updateDoc, deleteDoc, doc } from "firebase/firestore";
import { useCollection } from "../../../hooks/useCollection";
import { Badge, EmptyState, SectionHeader, Table, Tr, Td, Modal } from "../../../components/AdminUI";
import { Trash2, Eye, Mail, Phone } from "lucide-react";

export default function ContactInquiriesManager() {
  const { docs: inquiries, loading } = useCollection("contactInquiries", "createdAt");
  const [viewing, setViewing] = useState(null);

  const unread = inquiries.filter(i => !i.isRead).length;

  const handleView = async (item) => {
    setViewing(item);
    if (!item.isRead) {
      await updateDoc(doc(db, "contactInquiries", item.id), { isRead: true }).catch(() => {});
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this inquiry?")) return;
    await deleteDoc(doc(db, "contactInquiries", id));
  };

  return (
    <div>
      <SectionHeader
        title="Contact Inquiries"
        desc={`Messages submitted via the contact form. ${unread > 0 ? `${unread} unread.` : "All read."}`}
      />

      {loading ? <div className="text-gray-400 text-sm">Loading...</div>
        : inquiries.length === 0 ? (
          <EmptyState icon="📬" title="No inquiries yet" desc="Contact form submissions will appear here." />
        ) : (
          <Table cols={["Name", "Subject", "Contact", "Received", "Status", "Actions"]}>
            {inquiries.map((item) => (
              <Tr key={item.id} onClick={() => handleView(item)}>
                <Td>
                  <div className={`font-medium ${item.isRead ? "text-gray-300" : "text-white"}`}>{item.name}</div>
                </Td>
                <Td>
                  <div className={`text-sm ${item.isRead ? "text-gray-500" : "text-gray-200"} line-clamp-1`}>
                    {item.subject || "No subject"}
                  </div>
                </Td>
                <Td>
                  <div className="text-xs text-gray-400">{item.email}</div>
                  {item.phone && <div className="text-xs text-gray-500">{item.phone}</div>}
                </Td>
                <Td muted>
                  {item.createdAt?.toDate?.()?.toLocaleDateString() || "—"}
                </Td>
                <Td>
                  <Badge status={item.isRead ? "inactive" : "new"} customLabel={item.isRead ? "Read" : "New"} />
                </Td>
                <Td>
                  <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                    <button onClick={() => handleView(item)} className="text-gray-400 hover:text-teal-400 p-1 transition"><Eye size={14} /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-400 p-1 transition"><Trash2 size={14} /></button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Table>
        )}

      {/* View Modal */}
      {viewing && (
        <Modal title="Inquiry Details" onClose={() => setViewing(null)} size="md">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">From</p>
                <p className="text-white font-medium">{viewing.name}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Received</p>
                <p className="text-white text-sm">{viewing.createdAt?.toDate?.()?.toLocaleString() || "—"}</p>
              </div>
            </div>

            <div className="flex gap-3">
              {viewing.email && (
                <a href={`mailto:${viewing.email}`}
                  className="flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 bg-white/5 px-3 py-2 rounded-lg transition">
                  <Mail size={14} /> {viewing.email}
                </a>
              )}
              {viewing.phone && (
                <a href={`tel:${viewing.phone}`}
                  className="flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 bg-white/5 px-3 py-2 rounded-lg transition">
                  <Phone size={14} /> {viewing.phone}
                </a>
              )}
            </div>

            {viewing.subject && (
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Subject</p>
                <p className="text-white font-medium">{viewing.subject}</p>
              </div>
            )}

            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-2">Message</p>
              <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">{viewing.message}</p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button onClick={() => handleDelete(viewing.id) || setViewing(null)}
                className="text-red-400 hover:text-red-300 text-sm transition flex items-center gap-1">
                <Trash2 size={14} /> Delete
              </button>
              <button onClick={() => setViewing(null)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition">
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}