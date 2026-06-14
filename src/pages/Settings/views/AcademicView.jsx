import React from "react";
import { GraduationCap } from "lucide-react";
import { cardClass, Field, Inp, Sel, SecHead, TopBar } from "../components/ProfilePrimitives";

const AcademicView = ({ studentData, setStudentData, onSave, loading }) => {
    const setN = (parent, k) => (e) => setStudentData(prev => ({ ...prev, [parent]: { ...prev[parent], [k]: e.target.value } }));

    const ABlock = ({ title, stateKey, fields }) => (
        <section className={cardClass}>
            <SecHead icon={GraduationCap} label={title} color="text-violet-600" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {fields.map(f => (
                    <Field key={f.key} label={f.label} span2={f.span2}>
                        {f.type === "select"
                            ? <Sel value={studentData[stateKey][f.key]} onChange={setN(stateKey, f.key)} options={f.options} placeholder={`Select ${f.label}`} />
                            : <Inp value={studentData[stateKey][f.key]} onChange={setN(stateKey, f.key)} placeholder={f.placeholder} type={f.type || "text"} />}
                    </Field>
                ))}
            </div>
        </section>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <TopBar title="Academic History" onSave={onSave} loading={loading} />
            <ABlock title="10th Standard" stateKey="tenth" fields={[
                { key:"school", label:"School Name" },
                { key:"board",  label:"Board", type:"select", options:["CBSE","ICSE","State Board","Other"] },
                { key:"year",   label:"Year of Passing", placeholder:"YYYY" },
                { key:"percentage", label:"Percentage / CGPA" },
                { key:"subjects",   label:"Main Subjects", span2:true },
            ]} />
            <ABlock title="12th Standard / Intermediate" stateKey="twelfth" fields={[
                { key:"school", label:"School / College Name" },
                { key:"board",  label:"Board", type:"select", options:["CBSE","ICSE","State Board","Other"] },
                { key:"year",   label:"Year of Passing", placeholder:"YYYY" },
                { key:"percentage", label:"Percentage / CGPA" },
                { key:"stream", label:"Stream", type:"select", options:["Science (PCM)","Science (PCB)","Commerce","Arts","Other"] },
            ]} />
            <ABlock title="Diploma (if applicable)" stateKey="diploma" fields={[
                { key:"college", label:"College Name" }, { key:"board", label:"Board / University" },
                { key:"year",    label:"Year of Passing", placeholder:"YYYY" },
                { key:"percentage", label:"Percentage / CGPA" }, { key:"branch", label:"Branch / Specialization" },
            ]} />
            <ABlock title="Undergraduate (UG)" stateKey="ug" fields={[
                { key:"college",    label:"College Name" }, { key:"university", label:"University" },
                { key:"year",       label:"Year of Passing / Expected", placeholder:"YYYY" },
                { key:"cgpa",       label:"CGPA / Percentage" },
                { key:"branch",     label:"Branch / Degree", span2:true },
            ]} />
            <ABlock title="Postgraduate (PG)" stateKey="pg" fields={[
                { key:"college",    label:"College Name" }, { key:"university", label:"University" },
                { key:"year",       label:"Year of Passing / Expected", placeholder:"YYYY" },
                { key:"cgpa",       label:"CGPA / Percentage" },
                { key:"branch",     label:"Programme / Specialization", span2:true },
            ]} />
        </div>
    );
};

export default AcademicView;