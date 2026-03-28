import React from "react";
// src/pages/portal/PatientPortal.jsx
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import { Calendar, FlaskConical, User, Clock, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TABS = ["Appointments", "Lab Reports", "Profile"];

export default function PatientPortal() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Appointments");
  const [appointments, setAppointments] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    fetchData();
  }, [currentUser]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch appointments by phone or email match
      // Assumes appointments have patientId field once confirmed by admin
      const aRef = query(
        collection(db, "appointments"),
        where("email", "==", currentUser.email),
        orderBy("createdAt", "desc")
      );
      const aSnap = await getDocs(aRef);
      setAppointments(aSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // Fetch lab reports linked to patient uid
      const lRef = query(
        collection(db, "labReports"),
        where("patientUid", "==", currentUser.uid)
      );
      const lSnap = await getDocs(lRef);
      setLabReports(lSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status) => {
    const colors = { pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700" };
    return <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${colors[status] || "bg-gray-100 text-gray-600"}`}>{status}</span>;
  };

  const handleLogout = async () => { await logout(); navigate("/"); };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patient Portal</h1>
          <p className="text-gray-500 text-sm">Welcome, {currentUser?.displayName || currentUser?.email}</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition">
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 mb-6">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition border-b-2 ${activeTab === tab ? "border-teal-600 text-teal-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {tab}
          </button>
        ))}
      </div>

      {loading && <div className="text-center text-gray-400 py-10">Loading...</div>}

      {/* Appointments Tab */}
      {activeTab === "Appointments" && !loading && (
        <div>
          {appointments.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Calendar size={48} className="mx-auto mb-3 opacity-30" />
              <p>No appointments found.</p>
              <a href="/book-appointment" className="text-teal-600 text-sm hover:underline mt-2 inline-block">Book your first appointment →</a>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map(apt => (
                <div key={apt.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-gray-800">{apt.department}</div>
                    <div className="text-sm text-gray-500 mt-1">📅 {apt.date} at {apt.time}</div>
                    {apt.notes && <div className="text-xs text-gray-400 mt-1">Note: {apt.notes}</div>}
                  </div>
                  {statusBadge(apt.status)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lab Reports Tab */}
      {activeTab === "Lab Reports" && !loading && (
        <div>
          {labReports.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <FlaskConical size={48} className="mx-auto mb-3 opacity-30" />
              <p>No lab reports available yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {labReports.map(r => (
                <div key={r.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-gray-800">{r.testName}</div>
                    <div className="text-sm text-gray-500 mt-1">Date: {r.date}</div>
                  </div>
                  {r.reportUrl && (
                    <a href={r.reportUrl} target="_blank" rel="noopener noreferrer"
                      className="bg-teal-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-teal-700 transition">
                      View Report
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === "Profile" && !loading && (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm max-w-md">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 text-2xl font-bold">
              {currentUser?.displayName?.[0]?.toUpperCase() || "P"}
            </div>
            <div>
              <div className="font-semibold text-gray-800">{currentUser?.displayName}</div>
              <div className="text-sm text-gray-500">{currentUser?.email}</div>
              <div className="text-xs text-teal-600 font-medium mt-1">Patient</div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Profile editing coming soon. For updates, contact the hospital administration.
          </div>
        </div>
      )}
    </div>
  );
}
