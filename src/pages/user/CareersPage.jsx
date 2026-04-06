import React, { useState } from "react";
import { useCollection } from "../../hooks/useCollection";
import { Briefcase, MapPin, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

const TYPE_COLORS = {
  "full-time": "bg-green-50 text-green-700",
  "part-time": "bg-blue-50 text-blue-700",
  "contract": "bg-orange-50 text-orange-700",
  "internship": "bg-purple-50 text-purple-700",
};

export default function CareersPage() {
  const { docs: jobs, loading } = useCollection("careers", "createdAt");
  const [expanded, setExpanded] = useState(null);

  const activeJobs = jobs.filter(j => j.isActive);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-700 to-teal-900 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-teal-300 text-sm font-semibold uppercase tracking-widest mb-3">Join Our Team</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Careers</h1>
          <p className="text-teal-100 text-lg max-w-xl mx-auto">
            Work with dedicated professionals committed to ethical, evidence-based healthcare.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-14">

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : activeJobs.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase size={48} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">No Open Positions</h2>
            <p className="text-gray-400 mb-6">We don't have any openings right now, but we're always looking for great people.</p>
            <Link to="/contact" className="bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition">
              Send Us Your CV
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-500 text-sm mb-6">{activeJobs.length} open position{activeJobs.length !== 1 ? "s" : ""}</p>

            {activeJobs.map(job => (
              <div key={job.id} className="bg-white rounded-2xl shadow-sm border border-transparent hover:border-teal-100 transition-all">
                <button
                  onClick={() => setExpanded(expanded === job.id ? null : job.id)}
                  className="w-full text-left p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-gray-800 mb-2">{job.title}</h2>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                        {job.department && (
                          <span className="flex items-center gap-1">
                            <Briefcase size={13} /> {job.department}
                          </span>
                        )}
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={13} /> {job.location}
                          </span>
                        )}
                        {job.deadline && (
                          <span className="flex items-center gap-1">
                            <Clock size={13} /> Apply by {job.deadline}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${TYPE_COLORS[job.type] || "bg-gray-100 text-gray-600"}`}>
                        {job.type}
                      </span>
                      {expanded === job.id ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                    </div>
                  </div>
                </button>

                {/* Expanded details */}
                {expanded === job.id && (
                  <div className="px-6 pb-6 border-t border-gray-50 pt-4 space-y-4">
                    {job.description && (
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2 text-sm">About the Role</h3>
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
                      </div>
                    )}

                    {(job.requirements || []).length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2 text-sm">Requirements</h3>
                        <ul className="space-y-1.5">
                          {job.requirements.map((req, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="text-teal-500 mt-0.5">•</span> {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-2">
                      <Link to="/contact"
                        className="inline-block bg-teal-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-teal-700 transition text-sm">
                        Apply Now — Send CV via Contact
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}