// src/pages/Revaluation/components/RevalStatusBadge.jsx

import React from "react";
import { Clock, CheckCircle2, XCircle, RefreshCw } from "lucide-react";

const STYLES = {
    Pending: {
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
        text: "text-yellow-700 dark:text-yellow-400",
        border: "border-yellow-200 dark:border-yellow-800",
        icon: Clock,
    },
    UnderReview: {
        bg: "bg-blue-50 dark:bg-blue-900/20",
        text: "text-blue-700 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800",
        icon: RefreshCw,
    },
    Approved: {
        bg: "bg-green-50 dark:bg-green-900/20",
        text: "text-green-700 dark:text-green-400",
        border: "border-green-200 dark:border-green-800",
        icon: CheckCircle2,
    },
    Rejected: {
        bg: "bg-red-50 dark:bg-red-900/20",
        text: "text-red-700 dark:text-red-400",
        border: "border-red-200 dark:border-red-800",
        icon: XCircle,
    },
};

const RevalStatusBadge = ({ status }) => {
    const style = STYLES[status] || STYLES.Pending;
    const Icon  = style.icon;
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border
                ${style.bg} ${style.text} ${style.border}`}
        >
            <Icon className="size-3.5" />
            {status === "UnderReview" ? "Under Review" : status}
        </span>
    );
};

export default RevalStatusBadge;
