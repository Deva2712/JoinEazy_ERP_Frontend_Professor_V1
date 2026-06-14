import React from "react";
import { Calendar } from "lucide-react";
import { cardClass, Field, Inp, Sel, Txa, SecHead, TopBar, UploadBox } from "../components/ProfilePrimitives";

const GapView = ({ studentData, setStudentData, onSave, loading }) => {
    const set = (k) => (e) => setStudentData(prev => ({ ...prev, [k]: e.target.value }));

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <TopBar title="Gap Details" onSave={onSave} loading={loading} />
            <section className={cardClass}>
                <SecHead icon={Calendar} label="Gap Details" color="text-slate-600" />
                <div className="space-y-5">
                    <Field label="Did you have an academic gap?">
                        <Sel value={studentData.hasGap} onChange={set("hasGap")} options={["No","Yes"]} />
                    </Field>
                    {studentData.hasGap === "Yes" && (
                        <>
                            <Field label="Gap Year(s)"><Inp value={studentData.gapYear}   onChange={set("gapYear")}   placeholder="e.g. 2021–2022" /></Field>
                            <Field label="Reason for Gap"><Txa value={studentData.gapReason} onChange={set("gapReason")} rows={4} placeholder="Medical, family, entrance preparation, etc." /></Field>
                            <Field label="Supporting Document"><UploadBox label="Upload supporting document" hint="Medical certificate, offer letter, etc." /></Field>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default GapView;