import React from "react";
import { Users } from "lucide-react";
import { cardClass, Field, Inp, Sel, SecHead, TopBar } from "../components/ProfilePrimitives";

const FamilyView = ({ studentData, setStudentData, onSave, loading }) => {
    const setN = (parent, k) => (e) => setStudentData(prev => ({ ...prev, [parent]: { ...prev[parent], [k]: e.target.value } }));

    const ParentBlock = ({ parentKey, title }) => (
        <section className={cardClass}>
            <SecHead icon={Users} label={title} color="text-orange-600" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Full Name"><Inp value={studentData[parentKey].name}       onChange={setN(parentKey,"name")}       /></Field>
                <Field label="Occupation"><Inp value={studentData[parentKey].occupation} onChange={setN(parentKey,"occupation")} /></Field>
                <Field label="Annual Income (₹)"><Inp type="number" value={studentData[parentKey].income} onChange={setN(parentKey,"income")} placeholder="e.g. 500000" /></Field>
                <Field label="Mobile Number"><Inp type="tel" value={studentData[parentKey].mobile} onChange={setN(parentKey,"mobile")} /></Field>
                <Field label="Email" span2><Inp type="email" value={studentData[parentKey].email} onChange={setN(parentKey,"email")} /></Field>
            </div>
        </section>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <TopBar title="Family Details" onSave={onSave} loading={loading} />
            <ParentBlock parentKey="father"   title="Father's Details"   />
            <ParentBlock parentKey="mother"   title="Mother's Details"   />
            <section className={cardClass}>
                <SecHead icon={Users} label="Guardian's Details" color="text-orange-600" />
                <div className="mb-5">
                    <Field label="Relation to Student">
                        <Sel value={studentData.guardian.relation} onChange={setN("guardian","relation")}
                            placeholder="Select relation" options={["Parent","Uncle","Aunt","Grandparent","Sibling","Other"]} />
                    </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Full Name"><Inp value={studentData.guardian.name}       onChange={setN("guardian","name")}       /></Field>
                    <Field label="Occupation"><Inp value={studentData.guardian.occupation} onChange={setN("guardian","occupation")} /></Field>
                    <Field label="Annual Income (₹)"><Inp type="number" value={studentData.guardian.income} onChange={setN("guardian","income")} /></Field>
                    <Field label="Mobile Number"><Inp type="tel" value={studentData.guardian.mobile} onChange={setN("guardian","mobile")} /></Field>
                    <Field label="Email" span2><Inp type="email" value={studentData.guardian.email} onChange={setN("guardian","email")} /></Field>
                </div>
            </section>
        </div>
    );
};

export default FamilyView;