import React from "react";
import { Stethoscope, AlertCircle } from "lucide-react";
import { cardClass, Field, Inp, Sel, SecHead, TopBar } from "../components/ProfilePrimitives";

const MedicalView = ({ studentData, setStudentData, onSave, loading }) => {
    const set = (k) => (e) => setStudentData(prev => ({ ...prev, [k]: e.target.value }));

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <TopBar title="Medical Details" onSave={onSave} loading={loading} />
            <section className={cardClass}>
                <SecHead icon={Stethoscope} label="Medical Details" color="text-red-600" />
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-5 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">This information is confidential and used only for health & emergency purposes.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Blood Group *"><Sel value={studentData.bloodGroup} onChange={set("bloodGroup")} placeholder="Select blood group" options={["A+","A-","B+","B-","AB+","AB-","O+","O-"]} /></Field>
                    <Field label="Known Medical Conditions"><Inp value={studentData.medicalConditions} onChange={set("medicalConditions")} placeholder="e.g. Diabetes, None" /></Field>
                    <Field label="Allergies"><Inp placeholder="e.g. Penicillin, None" /></Field>
                    <Field label="Current Medications"><Inp placeholder="e.g. None" /></Field>
                    <div className="md:col-span-2 border-t border-gray-100 dark:border-gray-800 pt-5">
                        <p className="text-xs font-black text-red-600 uppercase tracking-widest mb-4">Emergency Contact</p>
                    </div>
                    <Field label="Contact Name *"><Inp value={studentData.emergencyName}     onChange={set("emergencyName")}     placeholder="Full name" /></Field>
                    <Field label="Relationship"><Inp  value={studentData.emergencyRelation} onChange={set("emergencyRelation")} placeholder="e.g. Father, Mother" /></Field>
                    <Field label="Emergency Mobile *" span2><Inp type="tel" value={studentData.emergencyContact} onChange={set("emergencyContact")} placeholder="+91 XXXXX XXXXX" /></Field>
                </div>
            </section>
        </div>
    );
};

export default MedicalView;