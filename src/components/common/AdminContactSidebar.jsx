// src/components/common/AdminContactSidebar.jsx

import React from "react";
import { User, Mail, Phone } from "lucide-react";

const AdminContactSidebar = ({
	admins = [],
	themeColor = "blue",
	isTabbedView = false,
}) => {
	const colorMap = {
		blue: { text: "text-blue-500", hover: "hover:text-blue-400" },
		teal: { text: "text-teal-500", hover: "hover:text-teal-400" },
		emerald: { text: "text-emerald-500", hover: "hover:text-emerald-400" },
		green: { text: "text-green-500", hover: "hover:text-green-400" },
		yellow: { text: "text-yellow-500", hover: "hover:text-yellow-400" },
		amber: { text: "text-amber-500", hover: "hover:text-amber-400" },
		orange: { text: "text-orange-500", hover: "hover:text-orange-400" },
	};

	const colors = colorMap[themeColor] || colorMap.blue;

	return (
		<aside className={`${isTabbedView ? "w-full" : "w-full lg:w-80 flex-shrink-0"}`}>
			<div className={`${isTabbedView ? "" : "sticky top-8"} space-y-6`}>
				<div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 ${isTabbedView ? "" : "shadow-sm"}`}>
					<div className="flex items-center justify-between mb-4">
						<h4 className="text-xs font-black uppercase text-gray-600 dark:text-gray-300 flex items-center gap-2">
							<User className={`size-4 ${colors.text}`} />
							Contact Support
						</h4>
					</div>

					<p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
						Questions about your submissions or requests? Reach out to our administrators.
					</p>

					{admins.length > 0 ? (
						<div className={`grid grid-cols-1 ${isTabbedView ? "sm:grid-cols-2" : "lg:grid-cols-1"} gap-4`}>
							{admins.map((admin, idx) => (
								<div key={idx} className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
									<p className="font-bold text-gray-900 dark:text-white text-sm mb-2">
										{admin.name}
									</p>
									<div className="space-y-1">
										<a
											href={`mailto:${admin.email}`}
											className={`flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 ${colors.hover} transition-colors break-all`}
										>
											<Mail className="size-3 flex-shrink-0" /> {admin.email}
										</a>
										<a
											href={`tel:${admin.phone}`}
											className={`flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 ${colors.hover} transition-colors`}
										>
											<Phone className="size-3 flex-shrink-0" /> {admin.phone}
										</a>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-12 bg-gray-50/50 dark:bg-gray-900/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
							<User className="size-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
							<p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
								No active contacts
							</p>
						</div>
					)}
				</div>
			</div>
		</aside>
	);
};

export default AdminContactSidebar;