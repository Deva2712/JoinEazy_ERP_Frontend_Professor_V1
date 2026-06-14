// src/pages/Registrar/components/DocChecklistTab.jsx
import React from "react";
import { AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";
import { REQUIRED_DOCS, StatusBadge, ContactCard } from "./shared";

const DocRow = ({ doc, record }) => {
  const isSubmitted = !!record;
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
      isSubmitted
        ? "bg-gray-50 dark:bg-gray-800/40 border-gray-100 dark:border-gray-700"
        : "bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30"
    }`}>
      <div className="mt-0.5 shrink-0">
        {isSubmitted
          ? record.status === "Verified"
            ? <CheckCircle className="size-4 text-emerald-500" />
            : record.status === "Rejected"
              ? <XCircle className="size-4 text-red-500" />
              : <Clock className="size-4 text-amber-500" />
          : <XCircle className="size-4 text-red-400" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-snug font-medium ${isSubmitted ? "text-gray-800 dark:text-gray-200" : "text-red-700 dark:text-red-400"}`}>
          {doc.label}
        </p>
        {isSubmitted && record.description && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">{record.description}</p>
        )}
        {isSubmitted && record.remarks && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5 italic">📌 {record.remarks}</p>
        )}
        {!isSubmitted && (
          <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">Not yet received by office</p>
        )}
      </div>
      <StatusBadge status={isSubmitted ? (record.status || "Pending") : "Not Submitted"} />
    </div>
  );
};

const DocChecklistTab = ({ adminSubmittedDocs = [] }) => {
  const categories = ["Academic", "Identity", "Other"];
  const submittedMap = Object.fromEntries(adminSubmittedDocs.map((d) => [d.docId, d]));
  const submittedCount = REQUIRED_DOCS.filter((d) => !!submittedMap[d.id]).length;
  const missingCount   = REQUIRED_DOCS.length - submittedCount;
  const total          = REQUIRED_DOCS.length;

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="flex items-start gap-3 px-4 py-3.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
        <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Documents submitted in person at the Registrar's Office</p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
            This view is updated by the Registrar after verifying your hard copies. Missing documents must be submitted at Room 101 during office hours.
          </p>
        </div>
      </div>

      {/* Summary pills */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
          <CheckCircle className="size-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
            {submittedCount} <span className="font-normal">of</span> {total} Received
          </span>
        </div>
        {missingCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <XCircle className="size-4 text-red-600 dark:text-red-400" />
            <span className="text-sm font-bold text-red-700 dark:text-red-300">
              {missingCount} <span className="font-normal">of</span> {total} Not Submitted
            </span>
          </div>
        )}
      </div>

      {/* Category columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">{cat}</h3>
            <div className="space-y-2">
              {REQUIRED_DOCS.filter((d) => d.category === cat).map((doc) => (
                <DocRow key={doc.id} doc={doc} record={submittedMap[doc.id] || null} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <ContactCard />
    </div>
  );
};

export default DocChecklistTab;