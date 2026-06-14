// src/pages/Hostel/components/OutingTab.jsx
import React from "react";
import { PhoneCall, Clock, AlertCircle, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { StatusBadge, ContactBanner, RequestSection, SimpleForm } from "./HostelPrimitives";

const OUTING_STEPS = [
    { label: "Submitted"     },
    { label: "Parent call"   },
    { label: "Warden review" },
    { label: "Decision"      },
];

const getState = (i, current, status) => {
    if (status === "Approved") return "done";
    if (status === "Rejected") return i < current ? "done" : "reject";
    if (i < current) return "done";
    if (i === current) return "active";
    return "wait";
};

const DOT = {
    done:   "bg-green-50 border-green-500 text-green-600 dark:bg-green-900/30 dark:border-green-500 dark:text-green-400",
    active: "bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-400",
    reject: "bg-red-50 border-red-400 text-red-500 dark:bg-red-900/30 dark:border-red-500 dark:text-red-400",
    wait:   "bg-gray-50 border-gray-200 text-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-600",
};
const LINE = {
    done: "bg-green-400 dark:bg-green-600", active: "bg-gray-200 dark:bg-gray-700",
    reject: "bg-red-300 dark:bg-red-700",   wait:   "bg-gray-200 dark:bg-gray-700",
};
const LABEL = {
    done: "text-green-600 dark:text-green-400", active: "text-blue-600 dark:text-blue-400 font-semibold",
    reject: "text-red-500 dark:text-red-400",   wait:   "text-gray-400 dark:text-gray-600",
};

const OutingProgress = ({ request }) => {
    const { status = "Pending", currentStep = 0, rejectionReason, parentContact } = request;

    return (
        <div className="mt-4">
            <div className="flex items-start">
                {OUTING_STEPS.map((step, i) => {
                    const state  = getState(i, currentStep, status);
                    const isLast = i === OUTING_STEPS.length - 1;
                    const lineState = getState(i + 1, currentStep, status);
                    return (
                        <React.Fragment key={step.label}>
                            <div className="flex flex-col items-center" style={{ minWidth: 64 }}>
                                <div className={`size-8 rounded-full border-2 flex items-center justify-center ${DOT[state]}`}>
                                    {state === "done"   && <CheckCircle className="size-3.5" />}
                                    {state === "active" && <RefreshCw   className="size-3.5 animate-spin" />}
                                    {state === "reject" && <XCircle     className="size-3.5" />}
                                    {state === "wait"   && <span className="size-2 rounded-full bg-gray-300 dark:bg-gray-600" />}
                                </div>
                                <span className={`text-[10px] mt-1.5 text-center leading-tight ${LABEL[state]}`} style={{ maxWidth: 60 }}>
                                    {step.label}
                                </span>
                            </div>
                            {!isLast && (
                                <div className="flex-1 mt-4">
                                    <div className={`h-0.5 w-full ${LINE[state === "done" ? "done" : lineState === "reject" ? "reject" : "wait"]}`} />
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            {status === "Pending" && (
                <div className="mt-3 flex items-start gap-2 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-xl px-3 py-2.5">
                    <Clock className="size-3.5 mt-0.5 flex-shrink-0" />
                    <span>
                        {currentStep === 0 && "Request submitted. Waiting for warden to initiate parent call."}
                        {currentStep === 1 && `Waiting for warden to call your parent (${parentContact || "registered number"}).`}
                        {currentStep === 2 && "Parent call completed. Warden is reviewing your request."}
                    </span>
                </div>
            )}
            {status === "Rejected" && rejectionReason && (
                <div className="mt-3 flex items-start gap-2.5 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 rounded-r-xl px-3 py-2.5">
                    <AlertCircle className="size-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-xs font-bold text-red-600 dark:text-red-400 mb-0.5">Reason for rejection</p>
                        <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed">{rejectionReason}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const OutingCard = ({ item }) => (
    <div className="bg-white dark:bg-[#1a1d26] rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <div className="flex items-start justify-between gap-4">
            <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.purpose ? item.purpose.slice(0, 60) + (item.purpose.length > 60 ? "…" : "") : "Outing request"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(item.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    {item.outTime && item.returnTime && ` · Out ${item.outTime} → Return ${item.returnTime}`}
                </p>
            </div>
            <StatusBadge status={item.status} />
        </div>
        <OutingProgress request={item} />
    </div>
);

export default function OutingTab({ outingRequests, onSubmitOutingRequest, userProfile }) {
    const fields = [
        { name: "date",          label: "Date",           type: "date",     required: true  },
        { name: "outTime",       label: "Out Time",       type: "time",     required: true  },
        { name: "returnTime",    label: "Return Time",    type: "time",     required: true  },
        { name: "purpose",       label: "Purpose",        type: "textarea", required: true,  placeholder: "Purpose of outing…" },
        { name: "parentContact", label: "Parent Contact", type: "text",     required: false, readonly: true, defaultValue: userProfile.parentContact || "" },
    ];

    return (
        <RequestSection
            newContent={
                <>
                    <ContactBanner icon={PhoneCall} label="Warden Contact" phone={userProfile.wardenContact} email={userProfile.wardenEmail} color="orange" />
                    <div className="flex items-start gap-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 mb-5">
                        <PhoneCall className="size-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                            Outing permission requires a warden–parent call for verification.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                        <SimpleForm fields={fields} onSubmit={onSubmitOutingRequest} submitLabel="Submit Outing Request" />
                    </div>
                </>
            }
            items={outingRequests}
            renderItem={(item) => <OutingCard key={item.id} item={item} />}
            accentColor="orange"
        />
    );
}