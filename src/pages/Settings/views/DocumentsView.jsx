import React from "react";
import { FileText, Upload } from "lucide-react";
import { cardClass, Sel, SecHead, TopBar, AddBtn, DelBtn, VerBadge, deleteItem, updateItem } from "../components/ProfilePrimitives";

const DOC_TYPES = ["10th Marksheet","12th Marksheet","Diploma Certificate","UG Degree","PG Degree","Aadhaar Card","PAN Card","Passport","Transfer Certificate","Migration Certificate","Character Certificate","Other"];

const DocumentsView = ({ portfolioData, setPortfolioData, onUpload, loading }) => {
    const items = portfolioData.documents;
    const setItems = (fn) => setPortfolioData(prev => ({ ...prev, documents: typeof fn === "function" ? fn(prev.documents) : fn }));

    const handleFileChange = async (id, file) => {
        updateItem(setItems, id, "file", file);
        if (onUpload && file) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("documentId", id);
            await onUpload(formData);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <TopBar title="Documents" showSave={false} loading={loading} />
            <section className={cardClass}>
                <SecHead icon={FileText} label="Documents" color="text-rose-600" />
                <div className="space-y-3">
                    {items.map(doc => (
                        <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-gray-50 dark:bg-[#0f1117] rounded-xl">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <FileText className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{doc.type}</span>
                                    <VerBadge status={doc.status} />
                                </div>
                                <label className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                                    <Upload className="w-3.5 h-3.5" />
                                    {doc.file ? doc.file.name : "Upload file"}
                                    <input type="file" className="hidden" onChange={e => handleFileChange(doc.id, e.target.files[0])} />
                                </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sel value={doc.type} onChange={e => updateItem(setItems, doc.id, "type", e.target.value)} options={DOC_TYPES} />
                                {items.length > 1 && <DelBtn onClick={() => deleteItem(setItems, doc.id)} />}
                            </div>
                        </div>
                    ))}
                    <AddBtn label="Add Document" onClick={() => setItems(prev => [...prev, { id: Date.now(), type: "Other", file: null, status: "pending" }])} />
                </div>
            </section>
        </div>
    );
};

export default DocumentsView;