import React from "react";
import { User } from "lucide-react";
import { cardClass, Field, Inp, Sel, SecHead, TopBar } from "../components/ProfilePrimitives";

const PersonalView = ({ studentData, setStudentData, onSave, loading }) => {
    const set = (k) => (e) => setStudentData(prev => ({ ...prev, [k]: e.target.value }));

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <TopBar title="Personal Information" onSave={onSave} loading={loading} />
            <section className={cardClass}>
                <SecHead icon={User} label="Personal Information" color="text-blue-600" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Full Name *"><Inp value={studentData.fullName}              onChange={set("fullName")}              placeholder="Enter full name" /></Field>
                    <Field label="Date of Birth *"><Inp type="date" value={studentData.dob}  onChange={set("dob")} /></Field>
                    <Field label="Gender *"><Sel value={studentData.gender}                  onChange={set("gender")}                placeholder="Select gender" options={["Male","Female","Other","Prefer not to say"]} /></Field>
                    <Field label="Aadhaar Number"><Inp value={studentData.aadhaarNumber}     onChange={set("aadhaarNumber")}         placeholder="XXXX XXXX XXXX" maxLength={14} /></Field>
                    <Field label="Nationality *"><Sel value={studentData.nationality}        onChange={set("nationality")}           options={["Indian","Other"]} /></Field>
                    <Field label="Religion"><Inp value={studentData.religion}                onChange={set("religion")}              placeholder="Optional" /></Field>
                    <Field label="Caste Category"><Sel value={studentData.casteCategory}     onChange={set("casteCategory")}        placeholder="Select" options={["General","OBC","SC","ST","EWS"]} /></Field>
                    <Field label="Mother Tongue"><Inp value={studentData.motherTongue}       onChange={set("motherTongue")}          placeholder="e.g. Telugu, Hindi" /></Field>
                    <Field label="Physically Handicapped"><Sel value={studentData.physicallyHandicapped} onChange={set("physicallyHandicapped")} options={["No","Yes"]} /></Field>
                </div>
            </section>
        </div>
    );
};

export default PersonalView;