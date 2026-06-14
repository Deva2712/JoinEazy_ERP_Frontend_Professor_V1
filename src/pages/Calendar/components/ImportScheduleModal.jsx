import React, { useState, useRef } from "react";
import { X, FileUp, Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const SUPPORTED_FORMATS = [
    { ext: "CSV",  desc: "Columns: title, date (YYYY-MM-DD), type, time, notes" },
    { ext: "ICS",  desc: "Standard iCalendar format from Google Calendar, Outlook, etc." },
    { ext: "JSON", desc: "Array of objects with title, date, type, time, notes fields" },
];

const ImportScheduleModal = ({ onClose, onImport }) => {
    const fileRef             = useRef(null);
    const [file, setFile]     = useState(null);
    const [status, setStatus] = useState("idle"); // "idle" | "loading" | "success" | "error"
    const [errorMsg, setErrorMsg] = useState("");

    const handleFileChange = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;

        const ext = f.name.split(".").pop().toLowerCase();
        if (!["csv", "ics", "json"].includes(ext)) {
            setErrorMsg("Unsupported format. Please upload a .csv, .ics, or .json file.");
            setFile(null);
            return;
        }

        setErrorMsg("");
        setFile(f);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        handleFileChange({ target: { files: e.dataTransfer.files } });
    };

    const handleImport = async () => {
        if (!file) return;
        setStatus("loading");
        await new Promise((r) => setTimeout(r, 1400));
        try {
            onImport(file);
            setStatus("success");
            setTimeout(onClose, 1200);
        } catch {
            setStatus("error");
            setErrorMsg("Failed to parse the file. Please check its format.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-white dark:bg-[#1a1d26] rounded-3xl border border-gray-200 dark:border-gray-700 w-full max-w-md p-6 shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-violet-100 dark:bg-violet-900/30">
                            <FileUp className="size-4 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Import Schedule</h3>
                            <p className="text-[11px] text-gray-400">CSV, ICS or JSON formats supported</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <X className="size-4 text-gray-400" />
                    </button>
                </div>

                {/* Success state */}
                {status === "success" && (
                    <div className="flex flex-col items-center py-10 gap-3">
                        <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/20">
                            <CheckCircle className="size-10 text-green-500" />
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white">Schedule Imported!</p>
                        <p className="text-xs text-gray-400">Your events have been added to the calendar.</p>
                    </div>
                )}

                {/* Loading state */}
                {status === "loading" && (
                    <div className="flex flex-col items-center py-10 gap-3">
                        <Loader2 className="size-10 text-violet-500 animate-spin" />
                        <p className="font-bold text-gray-700 dark:text-gray-300">Importing schedule…</p>
                    </div>
                )}

                {/* Idle / Error state */}
                {(status === "idle" || status === "error") && (
                    <div className="space-y-4">
                        {/* Drop zone */}
                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => fileRef.current?.click()}
                            className={`w-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center py-10 cursor-pointer transition-all gap-2 ${
                                file
                                    ? "border-violet-400 bg-violet-50 dark:bg-violet-900/10"
                                    : "border-gray-200 dark:border-gray-700 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/10"
                            }`}
                        >
                            <input
                                ref={fileRef}
                                type="file"
                                accept=".csv,.ics,.json"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            {file ? (
                                <>
                                    <div className="p-3 rounded-full bg-violet-100 dark:bg-violet-900/30">
                                        <CheckCircle className="size-6 text-violet-600 dark:text-violet-400" />
                                    </div>
                                    <p className="text-sm font-bold text-violet-700 dark:text-violet-300">{file.name}</p>
                                    <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB · Click to change</p>
                                </>
                            ) : (
                                <>
                                    <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
                                        <Upload className="size-6 text-gray-400" />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                        Drop your file here or <span className="text-violet-600 dark:text-violet-400">browse</span>
                                    </p>
                                    <p className="text-[11px] text-gray-400">.csv · .ics · .json</p>
                                </>
                            )}
                        </div>

                        {/* Error message */}
                        {errorMsg && (
                            <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                <AlertCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-red-600 dark:text-red-400">{errorMsg}</p>
                            </div>
                        )}

                        {/* Supported formats info */}
                        <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4 space-y-2">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Supported formats</p>
                            {SUPPORTED_FORMATS.map(({ ext, desc }) => (
                                <div key={ext} className="flex items-start gap-2">
                                    <span className="px-1.5 py-0.5 rounded-md bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-[10px] font-bold shrink-0">
                                        {ext}
                                    </span>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-bold rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleImport}
                                disabled={!file}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all"
                            >
                                <FileUp className="size-4" />Import
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImportScheduleModal;