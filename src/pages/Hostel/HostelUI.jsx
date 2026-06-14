// src/pages/Hostel/HostelUI.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, RefreshCw, AlertTriangle, BedDouble, CalendarOff, LogOut, Wrench, MessageSquareWarning } from "lucide-react";
import HeaderController    from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController    from "../../components/layout/Footer/FooterController";
import StatSummaryCard     from "../../components/common/StatSummaryCard";

import RoomTab        from "./components/RoomTab";
import LeaveTab       from "./components/LeaveTab";
import OutingTab      from "./components/OutingTab";
import MaintenanceTab from "./components/MaintenanceTab";
import ComplaintsTab  from "./components/ComplaintsTab";

const TABS = [
    { key: "room",        label: "Room Allotment",    Icon: BedDouble            },
    { key: "leave",       label: "Leave Requests",    Icon: CalendarOff          },
    { key: "outing",      label: "Outing Permission", Icon: LogOut               },
    { key: "maintenance", label: "Maintenance",       Icon: Wrench               },
    { key: "complaints",  label: "Complaints",        Icon: MessageSquareWarning },
];

export default function HostelUI({
    loading = false,
    error = null,
    onRetry = () => {},
    roomAllotment = null,
    leaveRequests = [],
    outingRequests = [],
    maintenanceRequests = [],
    complaints = [],
    userProfile = {},
    maintenanceDept = {},
    antiRaggingDept = {},
    studentAffairs = {},
    onSubmitLeaveRequest = () => {},
    onSubmitOutingRequest = () => {},
    onSubmitMaintenance = () => {},
    onSubmitComplaint = () => {},
}) {
    const navigate    = useNavigate();
    const [activeTab, setActiveTab] = useState("room");

    if (loading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
            <HeaderController />
            <div className="flex justify-center py-32"><RefreshCw className="size-10 animate-spin text-orange-500" /></div>
            <BottomNavController /><FooterController />
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
            <HeaderController />
            <div className="flex flex-col items-center justify-center py-32 text-center px-4">
                <AlertTriangle className="size-10 text-red-600 mb-4" />
                <h2 className="text-xl font-bold dark:text-white mb-2">Failed to load</h2>
                <button onClick={onRetry} className="mt-4 bg-orange-600 text-white px-8 py-3 rounded-xl font-bold">Try Again</button>
            </div>
            <BottomNavController /><FooterController />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
            <HeaderController />

            {/* Banner */}
            <div className="bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-600 dark:from-orange-900 dark:via-amber-900 dark:to-yellow-900 text-white">
                <div className="max-w-7xl mx-auto px-4 pt-5 pb-0">
                    <div className="flex items-center justify-between gap-6 mb-4">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate("/dashboard")} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors">
                                <ArrowLeft className="size-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">Hostel Management</h1>
                                <p className="text-white/70 text-sm mt-0.5">Room, leave, outing, maintenance &amp; complaints.</p>
                            </div>
                        </div>
                        <div className="pb-2 md:pb-0">
                            <StatSummaryCard label="Room" value={roomAllotment?.roomNumber ?? "—"} icon={Home} />
                        </div>
                    </div>

                    <div className="flex items-center gap-1 overflow-x-auto">
                        {TABS.map(({ key, label, Icon }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
                                    activeTab === key
                                        ? "bg-gray-50 dark:bg-[#0f1117] text-orange-600 dark:text-orange-400"
                                        : "text-white/70 hover:bg-white/10"
                                }`}
                            >
                                <Icon className="size-4" />{label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-8 w-full pb-24 md:pb-12">
                {activeTab === "room"        && <RoomTab        roomAllotment={roomAllotment} userProfile={userProfile} maintenanceDept={maintenanceDept} antiRaggingDept={antiRaggingDept} studentAffairs={studentAffairs} />}
                {activeTab === "leave"       && <LeaveTab       leaveRequests={leaveRequests}             onSubmitLeaveRequest={onSubmitLeaveRequest}   userProfile={userProfile} />}
                {activeTab === "outing"      && <OutingTab      outingRequests={outingRequests}           onSubmitOutingRequest={onSubmitOutingRequest} userProfile={userProfile} />}
                {activeTab === "maintenance" && <MaintenanceTab maintenanceRequests={maintenanceRequests} onSubmitMaintenance={onSubmitMaintenance}     maintenanceDept={maintenanceDept} />}
                {activeTab === "complaints"  && <ComplaintsTab  complaints={complaints}                   onSubmitComplaint={onSubmitComplaint}         antiRaggingDept={antiRaggingDept} />}
            </main>

            <BottomNavController />
            <FooterController />
        </div>
    );
}