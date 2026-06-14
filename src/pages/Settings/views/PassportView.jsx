import React from "react";
import { Globe, Shield } from "lucide-react";
import { cardClass, Field, Inp, Sel, SecHead, TopBar, UploadBox } from "../components/ProfilePrimitives";

const PassportView = ({ studentData, setStudentData, onSave, loading }) => {
    const set = (k) => (e) => setStudentData(prev => ({ ...prev, [k]: e.target.value }));

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <TopBar title="Passport & Visa" onSave={onSave} loading={loading} />
            <section className={cardClass}>
                <SecHead icon={Globe} label="Passport Details" color="text-emerald-600" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Passport Number"><Inp value={studentData.passportNumber} onChange={set("passportNumber")} placeholder="e.g. A1234567" /></Field>
                    <Field label="Expiry Date"><Inp type="date" value={studentData.passportExpiry} onChange={set("passportExpiry")} /></Field>
                    <Field label="Nationality (as on passport)"><Inp value={studentData.nationality2} onChange={set("nationality2")} /></Field>
                    <Field label="Place of Issue"><Inp placeholder="City, Country" /></Field>
                    <Field label="Upload Passport Copy" span2><UploadBox label="Upload scanned copy" hint="PDF, JPG, PNG — max 5 MB" /></Field>
                </div>
            </section>
            <section className={cardClass}>
                <SecHead icon={Shield} label="Visa Details" color="text-emerald-600" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Visa Type"><Sel value={studentData.visaType} onChange={set("visaType")} placeholder="Select visa type" options={["Student Visa","Work Visa","Tourist Visa","Dependent Visa","Other"]} /></Field>
                    <Field label="Visa Expiry Date"><Inp type="date" value={studentData.visaExpiry} onChange={set("visaExpiry")} /></Field>
                    <Field label="Issuing Country"><Inp placeholder="Country" /></Field>
                    <Field label="Visa Number"><Inp placeholder="Visa reference number" /></Field>
                    <Field label="Upload Visa Copy" span2><UploadBox label="Upload scanned copy" hint="PDF, JPG, PNG — max 5 MB" /></Field>
                </div>
            </section>
        </div>
    );
};

export default PassportView;