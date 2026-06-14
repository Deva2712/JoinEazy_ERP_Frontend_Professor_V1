import React from "react";
import { Printer, FileText } from "lucide-react";
import { cardClass, SecHead, TopBar } from "../components/ProfilePrimitives";
import { SECTIONS } from "./ListView";

const PrintView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <TopBar title="Print Profile" showSave={false} />
        <section className={cardClass}>
            <SecHead icon={Printer} label="Generate Profile / Resume" color="text-gray-600" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">Choose what to include in your generated PDF.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {SECTIONS.filter(s => s.id !== "print").map(sec => (
                    <label key={sec.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#0f1117] rounded-xl cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors">
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{sec.label}</span>
                    </label>
                ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg">
                    <Printer className="w-4 h-4" /> Generate PDF Profile
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-bold text-sm transition-all">
                    <FileText className="w-4 h-4" /> Download as Resume
                </button>
            </div>
        </section>
    </div>
);

export default PrintView;