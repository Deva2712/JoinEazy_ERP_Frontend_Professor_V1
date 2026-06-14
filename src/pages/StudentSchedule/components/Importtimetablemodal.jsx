import React, { useState } from "react";
import { Upload, X, FileText, AlertCircle, Check } from "lucide-react";

const ImportTimetableModal = ({ onClose, onImport }) => {
    const [file, setFile] = useState(null);
    const [parsing, setParsing] = useState(false);
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState([]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // Validate file type
        const validTypes = [".csv", ".xlsx", ".xls"];
        const extension = selectedFile.name.substring(selectedFile.name.lastIndexOf("."));
        
        if (!validTypes.includes(extension.toLowerCase())) {
            setError("Please upload a CSV or Excel file (.csv, .xlsx, .xls)");
            return;
        }

        setFile(selectedFile);
        setError(null);
        parseFile(selectedFile);
    };

    const parseFile = async (file) => {
        setParsing(true);
        setError(null);

        try {
            // This is a placeholder - you'll need to implement actual file parsing
            // using libraries like Papa Parse for CSV or SheetJS for Excel
            
            // Simulated parsing result
            const mockData = [
                {
                    courseName: "Data Structures",
                    courseCode: "CS201",
                    courseType: "Theory",
                    day: "Monday",
                    startTime: "09:00 AM",
                    endTime: "10:30 AM",
                    professor: "Dr. Smith",
                    roomNumber: "201",
                    buildingName: "CS Building",
                },
                {
                    courseName: "Data Structures Lab",
                    courseCode: "CS201L",
                    courseType: "Lab",
                    day: "Tuesday",
                    startTime: "02:00 PM",
                    endTime: "05:00 PM",
                    professor: "Prof. Johnson",
                    roomNumber: "Lab-3",
                    buildingName: "CS Building",
                },
            ];

            setPreview(mockData);
        } catch (err) {
            setError("Failed to parse file. Please check the format and try again.");
        } finally {
            setParsing(false);
        }
    };

    const handleImport = () => {
        if (preview.length === 0) return;
        onImport(preview);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white dark:bg-gray-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                            <Upload className="size-5 text-indigo-600" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Import Timetable</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <X className="size-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    {/* Instructions */}
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-4">
                        <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-2">
                            File Format Requirements
                        </h3>
                        <ul className="text-xs text-indigo-700 dark:text-indigo-400 space-y-1">
                            <li>• Upload a CSV or Excel file with your class schedule</li>
                            <li>• Required columns: Course Name, Course Code, Day, Start Time, End Time</li>
                            <li>• Optional: Course Type, Professor, Room Number, Building Name</li>
                            <li>• Time format: 09:00 AM or 14:30 (24-hour format)</li>
                        </ul>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <FileText className="size-10 text-gray-400 mb-3" />
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-bold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-400">CSV, XLSX, or XLS files only</p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept=".csv,.xlsx,.xls"
                                onChange={handleFileChange}
                            />
                        </label>

                        {file && (
                            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Check className="size-4 text-green-500" />
                                <span className="font-medium">{file.name}</span>
                            </div>
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl">
                            <AlertCircle className="size-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Preview */}
                    {parsing && (
                        <div className="text-center py-8">
                            <div className="inline-block size-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3" />
                            <p className="text-sm text-gray-500">Parsing file...</p>
                        </div>
                    )}

                    {preview.length > 0 && !parsing && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                                Preview ({preview.length} classes found)
                            </h3>
                            <div className="max-h-64 overflow-y-auto space-y-2 border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-gray-50 dark:bg-gray-900">
                                {preview.slice(0, 5).map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white dark:bg-gray-800 rounded-lg p-3 text-xs border border-gray-200 dark:border-gray-700"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                                {item.courseCode}
                                            </span>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {item.day}
                                            </span>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {item.startTime} - {item.endTime}
                                            </span>
                                        </div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {item.courseName}
                                        </p>
                                    </div>
                                ))}
                                {preview.length > 5 && (
                                    <p className="text-center text-gray-400 pt-2">
                                        + {preview.length - 5} more classes
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-100 dark:border-gray-700 flex gap-3 bg-gray-50/50 dark:bg-gray-800/50">
                    <button
                        onClick={onClose}
                        className="flex-1 h-11 font-bold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleImport}
                        disabled={preview.length === 0 || parsing}
                        className="flex-1 h-11 flex items-center justify-center gap-2 font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        <Upload className="size-4" />
                        Import {preview.length > 0 && `(${preview.length})`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportTimetableModal;