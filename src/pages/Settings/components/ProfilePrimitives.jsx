import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Check, Plus, Trash2, Upload, CheckCircle, Clock, XCircle } from "lucide-react";

export const cardClass  = "bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 md:p-8 transition-all";
export const inputCls   = "w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0f1117] text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm";
export const labelCls   = "block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase";

export const Field = ({ label, children, span2 }) => (
    <div className={span2 ? "md:col-span-2" : ""}>
        <label className={labelCls}>{label}</label>
        {children}
    </div>
);

export const Inp = ({ value, onChange, ...rest }) => (
    <input className={inputCls} value={value ?? ""} onChange={onChange} {...rest} />
);

export const Sel = ({ value, onChange, options = [], placeholder }) => (
    <select className={inputCls} value={value ?? ""} onChange={onChange}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
    </select>
);

export const Txa = ({ value, onChange, rows = 3, ...rest }) => (
    <textarea className={`${inputCls} resize-y`} rows={rows} value={value ?? ""} onChange={onChange} {...rest} />
);

export const SecHead = ({ icon: Icon, label, color }) => (
    <div className={`flex items-center gap-2 ${color} mb-6 uppercase tracking-[0.2em] text-[10px] md:text-xs font-black`}>
        <Icon className="size-4" /> {label}
    </div>
);

export const AddBtn = ({ label, onClick }) => (
    <button type="button" onClick={onClick}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-blue-600 dark:text-blue-400 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all">
        <Plus className="w-4 h-4" /> {label}
    </button>
);

export const DelBtn = ({ onClick }) => (
    <button type="button" onClick={onClick}
        className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-all">
        <Trash2 className="w-4 h-4" />
    </button>
);

export const VerBadge = ({ status = "pending" }) => {
    const map = {
        verified: { icon: CheckCircle, label: "Verified", cls: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800" },
        pending:  { icon: Clock,       label: "Pending",  cls: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800" },
        rejected: { icon: XCircle,     label: "Rejected", cls: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800" },
    };
    const { icon: Icon, label, cls } = map[status] || map.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border ${cls}`}>
            <Icon className="w-3.5 h-3.5" /> {label}
        </span>
    );
};

export const UploadBox = ({ label, hint }) => (
    <label className="flex flex-col items-center justify-center w-full py-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 transition-all gap-2 bg-gray-50 dark:bg-[#0f1117]">
        <Upload className="w-5 h-5 text-blue-500" />
        <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{label}</span>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
        <input type="file" className="hidden" />
    </label>
);

export const LevelPill = ({ level, onChange }) => {
    const colors = {
        Beginner:     "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
        Intermediate: "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300",
        Advanced:     "bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300",
        Expert:       "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300",
    };
    return (
        <select value={level} onChange={e => onChange(e.target.value)}
            className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 ${colors[level] || colors.Beginner} focus:outline-none cursor-pointer`}>
            {["Beginner","Intermediate","Advanced","Expert"].map(l => <option key={l}>{l}</option>)}
        </select>
    );
};

export const SaveBtn = ({ onClick, loading, saved, className = "" }) => (
    <button onClick={onClick} disabled={loading || saved}
        className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all
            ${saved ? "bg-green-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"} disabled:opacity-50 ${className}`}>
        {saved ? <Check className="size-4" /> : <Save className="size-4" />}
        {saved ? "Saved!" : loading ? "Saving..." : "Save Changes"}
    </button>
);

// TopBar — uses navigate internally; onSave is the controller handler
export const TopBar = ({ title, showSave = true, onSave, loading }) => {
    const navigate = useNavigate();
    const [saved, setSaved] = React.useState(false);

    const handleSave = async () => {
        if (onSave) await onSave();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate("/settings")}
                    className="flex items-center justify-center size-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1d26] hover:bg-gray-50 dark:hover:bg-[#252a36] transition-all">
                    <ArrowLeft className="size-4 text-gray-600 dark:text-gray-400" />
                </button>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">{title}</h1>
            </div>
            {showSave && (
                <>
                    <SaveBtn onClick={handleSave} loading={loading} saved={saved} className="hidden md:flex" />
                    <SaveBtn onClick={handleSave} loading={loading} saved={saved} className="md:hidden w-full" />
                </>
            )}
        </div>
    );
};

// Pure utility functions — no hooks, safe to call anywhere
export const addItem    = (setter, template)        => setter(prev => [...prev, { ...template, id: Date.now() }]);
export const deleteItem = (setter, id)              => setter(prev => prev.filter(i => i.id !== id));
export const updateItem = (setter, id, key, value)  => setter(prev => prev.map(i => i.id === id ? { ...i, [key]: value } : i));