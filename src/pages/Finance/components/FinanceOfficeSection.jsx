// src/pages/Finance/components/FinanceOfficeSection.jsx
import React from "react";
import {
  Building2, MapPin, Clock, Phone, Mail, CheckCircle,
} from "lucide-react";

const QUICK_INFO_TIPS = [
  "Fee receipts are issued within 2 working days of payment.",
  'Demand drafts should be drawn in favour of "The Institution".',
  "Offline payments take 1–2 working days to reflect on the portal.",
  "For refund queries, email with your enrolment number and transaction ID.",
  "Late fee penalty applies after the due date at ₹50/day.",
];

// Each row: icon, primary text, secondary text(s)
const CONTACT_ROWS = [
  {
    icon: MapPin,
    primary: "Admin Block, Room 101",
    secondary: ["Ground Floor, Near Main Entrance, Campus Road"],
  },
  {
    icon: Clock,
    primary: "Monday – Friday: 9:00 AM – 4:00 PM",
    secondary: [
      "Closed on Saturdays, Sundays & public holidays",
      "⚠ Counter closes at 3:30 PM for cash payments",
    ],
    warning: true,   // last secondary line gets amber colour
  },
  {
    icon: Phone,
    primary: "+91-11-2345-6789",
    secondary: ["Ext. 101 – Finance Desk", "Ext. 102 – Scholarship & Refunds"],
  },
];

const EMAILS = [
  { address: "finance@institution.edu.in",     label: "General fee queries & receipts"   },
  { address: "scholarship@institution.edu.in", label: "Scholarship & financial aid queries" },
];

const FinanceOfficeSection = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

    {/* ── Left: contact card ── */}
    <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col">

      {/* Card header */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
          <Building2 className="size-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">Finance Office</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Fee queries, challans &amp; payment issues</p>
        </div>
      </div>

      {/* Location, hours, phone */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800 flex-1">
        {CONTACT_ROWS.map(({ icon: Icon, primary, secondary, warning }) => (
          <div key={primary} className="flex items-start gap-4 px-5 py-4">
            <Icon className="size-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-gray-800 dark:text-white">{primary}</p>
              {secondary.map((line, i) => {
                const isWarning = warning && i === secondary.length - 1;
                return (
                  <p
                    key={line}
                    className={`text-xs ${
                      isWarning
                        ? "text-amber-600 dark:text-amber-400 font-medium"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        ))}

        {/* Email row */}
        <div className="flex items-start gap-4 px-5 py-4">
          <Mail className="size-4 text-emerald-500 shrink-0 mt-0.5" />
          <div className="space-y-3">
            {EMAILS.map(({ address, label }) => (
              <div key={address}>
                <a
                  href={`mailto:${address}`}
                  className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  {address}
                </a>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* ── Right: quick info card ── */}
    <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col">

      {/* Card header — mirrors left card */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20">
          <CheckCircle className="size-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">Quick Info</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Policies, timelines &amp; payment guidelines</p>
        </div>
      </div>

      {/* Tips — one per row, each matching the row height of the left card */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800 flex-1">
        {QUICK_INFO_TIPS.map((tip) => (
          <div key={tip} className="flex items-start gap-4 px-5 py-4">
            <CheckCircle className="size-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{tip}</p>
          </div>
        ))}
      </div>
    </div>

  </div>
);

export default FinanceOfficeSection;