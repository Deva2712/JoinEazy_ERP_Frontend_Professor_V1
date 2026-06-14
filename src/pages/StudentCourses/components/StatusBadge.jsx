// src/pages/StudentCourses/components/StatusBadge.jsx
import React from "react";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

const STYLES = {
    Confirmed: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    Pending:   "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    Rejected:  "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
};
const ICONS = { Confirmed: CheckCircle, Pending: AlertCircle, Rejected: XCircle };

export default function StatusBadge({ status }) {
    const Icon = ICONS[status] || AlertCircle;
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${STYLES[status] || STYLES.Pending}`}>
            <Icon className="size-3" />{status}
        </span>
    );
}