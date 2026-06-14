// src/pages/Examination/components/StatusBadge.jsx

import React from "react";

const StatusBadge = ({ status }) => {
	const styles = {
		Pass: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
		Fail: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
		Submitted: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
	};

	return (
		<span
			className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${
				styles[status] || "bg-gray-50 border-gray-200 text-gray-600"
			}`}
		>
			{status}
		</span>
	);
};

export default StatusBadge;