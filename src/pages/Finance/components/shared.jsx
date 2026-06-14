// src/pages/Finance/components/shared.jsx
// Shared helpers, constants, and tiny reusable atoms.
// Nothing here has state or side-effects.

import React from "react";
import {
  CreditCard, Smartphone, Landmark, Wallet,
  GraduationCap, Home, Award, BookOpen,
  Bus, FlaskConical, Utensils, Wifi,
} from "lucide-react";

// ── Currency formatter ────────────────────────────────────────────────────────
export const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

// ── Status badge ──────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  Paid:       "bg-green-50  text-green-700  border-green-200  dark:bg-green-900/20  dark:text-green-400  dark:border-green-800",
  Pending:    "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
  Overdue:    "bg-red-50    text-red-700    border-red-200    dark:bg-red-900/20    dark:text-red-400    dark:border-red-800",
  Partial:    "bg-blue-50   text-blue-700   border-blue-200   dark:bg-blue-900/20   dark:text-blue-400   dark:border-blue-800",
  Processing: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
  Refunded:   "bg-gray-50   text-gray-600   border-gray-200   dark:bg-gray-800/40   dark:text-gray-400   dark:border-gray-700",
  Failed:     "bg-red-50    text-red-700    border-red-200    dark:bg-red-900/20    dark:text-red-400    dark:border-red-800",
};

export const StatusBadge = ({ status }) => (
  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${STATUS_STYLES[status] ?? STATUS_STYLES.Pending}`}>
    {status}
  </span>
);

// ── Fee type config ───────────────────────────────────────────────────────────
export const FEE_TYPE_CONFIG = {
  academic:    { icon: GraduationCap, bg: "bg-blue-50 dark:bg-blue-900/20",    text: "text-blue-600 dark:text-blue-400"    },
  hostel:      { icon: Home,          bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-600 dark:text-orange-400" },
  scholarship: { icon: Award,         bg: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-600 dark:text-purple-400" },
  books:       { icon: BookOpen,      bg: "bg-teal-50 dark:bg-teal-900/20",     text: "text-teal-600 dark:text-teal-400"    },
  transport:   { icon: Bus,           bg: "bg-yellow-50 dark:bg-yellow-900/20", text: "text-yellow-600 dark:text-yellow-400" },
  lab:         { icon: FlaskConical,  bg: "bg-pink-50 dark:bg-pink-900/20",     text: "text-pink-600 dark:text-pink-400"    },
  mess:        { icon: Utensils,      bg: "bg-lime-50 dark:bg-lime-900/20",     text: "text-lime-600 dark:text-lime-400"    },
  internet:    { icon: Wifi,          bg: "bg-cyan-50 dark:bg-cyan-900/20",     text: "text-cyan-600 dark:text-cyan-400"    },
  other:       { icon: CreditCard,    bg: "bg-gray-50 dark:bg-gray-800",        text: "text-gray-600 dark:text-gray-400"    },
};

export const getFeeColors = (type) => FEE_TYPE_CONFIG[type] ?? FEE_TYPE_CONFIG.other;

// ── Payment mode icon ─────────────────────────────────────────────────────────
const MODE_ICON_MAP = {
  UPI:        Smartphone,
  Card:       CreditCard,
  NetBanking: Landmark,
  Offline:    Wallet,
  Cash:       Wallet,
};

export const ModeIcon = ({ mode, className = "size-4" }) => {
  const Icon = MODE_ICON_MAP[mode] ?? CreditCard;
  return <Icon className={className} />;
};

// ── Expanded border accent keyed to status (used by HistoryCard) ──────────────
export const EXPANDED_BORDER = {
  Paid:       "border-green-300  dark:border-green-700",
  Pending:    "border-yellow-300 dark:border-yellow-700",
  Overdue:    "border-red-300    dark:border-red-700",
  Processing: "border-purple-300 dark:border-purple-700",
  Failed:     "border-red-300    dark:border-red-700",
};

// ── Generic labelled field used inside forms ──────────────────────────────────
export const FieldInput = ({ label, placeholder, value, onChange, type = "text", maxLength }) => (
  <div className="mb-3">
    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
      {label}
    </label>
    <input
      type={type} value={value} placeholder={placeholder}
      maxLength={maxLength}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-emerald-500 text-gray-900 dark:text-white transition-colors"
    />
  </div>
);