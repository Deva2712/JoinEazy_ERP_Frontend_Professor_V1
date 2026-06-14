// src/pages/Hostel/components/RoomTab.jsx
import React from "react";
import { BedDouble, MapPin, Home, Wrench, ShieldAlert, Building2, Phone, Mail, CheckCircle } from "lucide-react";

const ContactCard = ({ label, icon: Icon, color, name, phone, email }) => (
    <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className={`h-1 bg-${color}-400`} />
        <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
                <div className={`size-7 rounded-lg bg-${color}-50 dark:bg-${color}-900/20 flex items-center justify-center`}>
                    <Icon className={`size-3.5 text-${color}-500`} />
                </div>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
            </div>
            {name && <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2.5">{name}</p>}
            <div className="space-y-1.5">
                {phone && (
                    <a href={`tel:${phone}`} className={`flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-${color}-600 transition-colors`}>
                        <Phone className="size-3 flex-shrink-0" />{phone}
                    </a>
                )}
                {email && (
                    <a href={`mailto:${email}`} className={`flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-${color}-600 transition-colors truncate`}>
                        <Mail className="size-3 flex-shrink-0" />{email}
                    </a>
                )}
            </div>
        </div>
    </div>
);

export default function RoomTab({ roomAllotment, userProfile, maintenanceDept, antiRaggingDept, studentAffairs }) {
    if (!roomAllotment) {
        return (
            <div className="text-center py-16">
                <BedDouble className="size-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No room allotted yet.</p>
            </div>
        );
    }

    const deptCards = [
        { label: "Student Affairs", icon: Building2,  color: "blue", name: studentAffairs.name,  phone: studentAffairs.officeContact, email: studentAffairs.email  },
        { label: "Maintenance",     icon: Wrench,      color: "teal", name: maintenanceDept.name, phone: maintenanceDept.contact,      email: maintenanceDept.email },
        { label: "Anti-Ragging",    icon: ShieldAlert, color: "red",  name: antiRaggingDept.name, phone: antiRaggingDept.contact,      email: antiRaggingDept.email },
    ].filter(({ name, phone, email }) => name || phone || email);

    return (
        <div className="animate-in fade-in duration-300 grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Room hero — 2 cols */}
            <div className="lg:col-span-2 bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400" />
                <div className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="size-9 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                            <BedDouble className="size-4 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Allotted Room</p>
                            <h2 className="text-lg font-extrabold text-gray-900 dark:text-white leading-tight">Room {roomAllotment.roomNumber}</h2>
                        </div>
                        <span className="ml-auto px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-bold border border-green-200 dark:border-green-800">Active</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { label: "Block",    value: roomAllotment.block,                  color: "orange" },
                            { label: "Room No.", value: roomAllotment.roomNumber,             color: "amber"  },
                            { label: "Type",     value: roomAllotment.type,                   color: "yellow" },
                            { label: "Floor",    value: `Floor ${roomAllotment.floorNumber}`, color: "orange" },
                        ].map(({ label, value, color }) => (
                            <div key={label} className={`bg-${color}-50 dark:bg-${color}-900/20 rounded-xl p-3`}>
                                <p className={`text-[10px] font-bold text-${color}-600 dark:text-${color}-400 uppercase tracking-wider mb-0.5`}>{label}</p>
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{value}</p>
                            </div>
                        ))}
                    </div>
                    {roomAllotment.allottedFrom && (
                        <p className="mt-3 text-xs text-gray-400 flex items-center gap-1.5">
                            <CheckCircle className="size-3.5 text-green-500" />
                            Allotted since {new Date(roomAllotment.allottedFrom).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </p>
                    )}
                </div>
            </div>

            {/* Warden quick contact */}
            {(userProfile.wardenContact || userProfile.wardenEmail) && (
                <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-orange-400 to-amber-400" />
                    <div className="p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="size-8 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                                <Home className="size-4 text-orange-500" />
                            </div>
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Warden</p>
                        </div>
                        <div className="space-y-2">
                            {userProfile.wardenContact && (
                                <a href={`tel:${userProfile.wardenContact}`} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors group">
                                    <div className="size-7 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                                        <Phone className="size-3.5 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone</p>
                                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-orange-600 truncate">{userProfile.wardenContact}</p>
                                    </div>
                                </a>
                            )}
                            {userProfile.wardenEmail && (
                                <a href={`mailto:${userProfile.wardenEmail}`} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors group">
                                    <div className="size-7 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                                        <Mail className="size-3.5 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email</p>
                                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-orange-600 truncate">{userProfile.wardenEmail}</p>
                                    </div>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Dept contact cards */}
            {deptCards.map((card) => <ContactCard key={card.label} {...card} />)}
        </div>
    );
}