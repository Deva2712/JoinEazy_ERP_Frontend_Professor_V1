// src/pages/Mentor/components/MentorDetailsTab.jsx
import React from "react";
import { Users, Mail, Phone, MapPin, Clock } from "lucide-react";

const INFO_FIELDS = [
    { label: "Email",        key: "email",          icon: Mail  },
    { label: "Phone",        key: "phone",          icon: Phone  },
    { label: "Office",       key: "officeLocation", icon: MapPin },
    { label: "Office Hours", key: "officeHours",    icon: Clock  },
];

export default function MentorDetailsTab({ mentor }) {
    if (!mentor) {
        return (
            <div className="text-center py-20">
                <Users className="size-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No mentor assigned yet.</p>
            </div>
        );
    }

    const initials = mentor.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

    return (
        <div className="animate-in fade-in duration-300 max-w-2xl">
            <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                {/* Avatar + name */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="size-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-extrabold shrink-0">
                        {initials}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{mentor.name}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{mentor.designation} · {mentor.department}</p>
                    </div>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {INFO_FIELDS.map(({ label, key, icon: Icon }) => (
                        <div key={key} className="flex items-start gap-3">
                            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 shrink-0">
                                <Icon className="size-4 text-cyan-600 dark:text-cyan-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{mentor[key]}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}