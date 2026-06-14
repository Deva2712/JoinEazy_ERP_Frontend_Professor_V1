// src/pages/Registrar/components/DocRequestTab.jsx
import React, { useState } from "react";
import { FileBadge, Send, CheckCircle, ChevronDown } from "lucide-react";
import { ALL_DOC_TYPES, FACULTY_LIST, ContactCard } from "./shared";

const IS_LOR = "Letter of Recommendation";

const DocRequestTab = ({ onRequestDocument }) => {
  const [selectedType, setSelectedType] = useState("");
  const [purpose,      setPurpose]      = useState("");
  const [copies,       setCopies]       = useState("1");
  const [urgency,      setUrgency]      = useState("");
  const [teacher,      setTeacher]      = useState("");
  const [lorFile,      setLorFile]      = useState(null);
  const [deadline,     setDeadline]     = useState("");
  const [submitted,    setSubmitted]    = useState(false);

  const isLor  = selectedType === IS_LOR;
  const canSubmit = selectedType && purpose && (!isLor || (teacher && lorFile && deadline));

  const handleSubmit = () => {
    if (!canSubmit) return;
    const selectedFaculty = FACULTY_LIST.find((f) => f.id === teacher);
    onRequestDocument({
      type: selectedType,
      purpose,
      copies,
      urgency: urgency || "Normal (5–7 working days)",
      ...(isLor && {
        teacherId: teacher,
        teacherName: selectedFaculty?.name,
        deadline,
      }),
    }, isLor ? lorFile : null);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedType(""); setPurpose(""); setCopies("1");
      setUrgency(""); setTeacher(""); setDeadline("");
    }, 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* ── Form ─────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30">
            <FileBadge className="size-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Request a Document</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Transcripts, certificates, TC, LoR and more</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
          {submitted ? (
            <div className="flex flex-col items-center py-8 text-center gap-3">
              <CheckCircle className="size-10 text-green-500" />
              <p className="font-bold text-gray-900 dark:text-white">Request submitted!</p>
              <p className="text-xs text-gray-500">
                Track its status in the <span className="font-semibold text-purple-600">Request Status</span> tab.
              </p>
            </div>
          ) : (
            <>
              {/* Document type */}
              <Field label="Document Type" required>
                <SelectBox
                  value={selectedType}
                  onChange={(v) => { setSelectedType(v); setTeacher(""); }}
                  placeholder="Select document type…"
                  options={ALL_DOC_TYPES}
                />
              </Field>

              {/* Teacher selector — only for LoR */}
              {isLor && (
                <Field label="Request from Teacher" required>
                  <SelectBox
                    value={teacher}
                    onChange={setTeacher}
                    placeholder="Select a faculty member…"
                    options={FACULTY_LIST.map((f) => f.id)}
                    labels={Object.fromEntries(FACULTY_LIST.map((f) => [f.id, `${f.name} — ${f.dept}`]))}
                  />
                </Field>
              )}

              {isLor && (
                <Field label="Supporting Document" required>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setLorFile(e.target.files[0] || null)}
                    className="w-full text-sm text-gray-500 dark:text-gray-400
                      file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0
                      file:text-sm file:font-bold file:bg-purple-50 file:text-purple-700
                      dark:file:bg-purple-900/30 dark:file:text-purple-300
                      hover:file:bg-purple-100 cursor-pointer"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Attach your CV, SOP, or offer letter for context (PDF/DOC)
                  </p>
                </Field>
              )}

              {isLor && (
                <Field label="LoR Deadline" required>
                  <input
                    type="date"
                    value={deadline}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-purple-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    When do you need the LoR by? (Give professor adequate time)
                  </p>
                </Field>
              )}

              {/* Purpose */}
              <Field label="Purpose" required>
                <textarea
                  rows={3}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder={isLor ? "Describe the opportunity (e.g. MS application at TU Berlin)…" : "State the purpose for this document…"}
                  className="w-full px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-purple-500 resize-none"
                />
              </Field>

              {/* Copies + Urgency */}
              <div className="grid grid-cols-2 gap-4">
                {!isLor && (
                  <Field label="No. of Copies">
                    <input
                      type="number" min="1" value={copies}
                      onChange={(e) => setCopies(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-purple-500"
                    />
                  </Field>
                )}
                <Field label="Urgency" className={isLor ? "col-span-2" : ""}>
                  <SelectBox
                    value={urgency}
                    onChange={setUrgency}
                    placeholder="Normal (5–7 days)"
                    options={["Normal (5–7 working days)", "Urgent (2–3 working days)"]}
                  />
                </Field>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors"
              >
                <Send className="size-3.5" /> Submit Request
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Contact card ─────────────────────────────────────────── */}
      <div>
        <ContactCard />
      </div>
    </div>
  );
};

/* ─── Small helpers ──────────────────────────────────────────────── */
const Field = ({ label, required, children, className = "" }) => (
  <div className={className}>
    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

// options  = array of values
// labels   = optional { value: displayText } map; falls back to value itself
const SelectBox = ({ value, onChange, placeholder, options, labels = {} }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-purple-500 transition-colors"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{labels[opt] || opt}</option>
      ))}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
  </div>
);

export default DocRequestTab;