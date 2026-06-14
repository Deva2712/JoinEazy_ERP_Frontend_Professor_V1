import React from "react";
import { Landmark, Shield } from "lucide-react";
import { cardClass, Field, Inp, Sel, SecHead, TopBar, UploadBox } from "../components/ProfilePrimitives";

const BankView = ({ studentData, setStudentData, onSave, loading }) => {
    const set = (k) => (e) => setStudentData(prev => ({ ...prev, [k]: e.target.value }));

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <TopBar title="Bank Details" onSave={onSave} loading={loading} />
            <section className={cardClass}>
                <SecHead icon={Landmark} label="Bank Details" color="text-blue-700" />
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-5 flex gap-3">
                    <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Bank details are encrypted and used only for scholarship disbursements.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Account Holder Name *"><Inp placeholder="As per bank records" /></Field>
                    <Field label="Account Number *"><Inp type="password" value={studentData.accountNumber} onChange={set("accountNumber")} placeholder="Enter account number" /></Field>
                    <Field label="Confirm Account Number"><Inp placeholder="Re-enter account number" /></Field>
                    <Field label="IFSC Code *"><Inp value={studentData.ifscCode}   onChange={set("ifscCode")}   placeholder="e.g. SBIN0001234" /></Field>
                    <Field label="Bank Name"><Inp    value={studentData.bankName}   onChange={set("bankName")}   placeholder="e.g. State Bank of India" /></Field>
                    <Field label="Branch Name"><Inp  value={studentData.branchName} onChange={set("branchName")} placeholder="Branch location" /></Field>
                    <Field label="Scholarship Linked?"><Sel value={studentData.scholarshipLinked} onChange={set("scholarshipLinked")} options={["No","Yes"]} /></Field>
                    <Field label="Upload Passbook / Cancelled Cheque"><UploadBox label="Upload document" hint="PDF, JPG, PNG — max 5 MB" /></Field>
                </div>
            </section>
        </div>
    );
};

export default BankView;