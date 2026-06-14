import React from "react";
import { Clipboard } from "lucide-react";
import { cardClass, Field, Inp, Sel, SecHead, TopBar, AddBtn, DelBtn, addItem, deleteItem, updateItem } from "../components/ProfilePrimitives";

const EntranceView = ({ portfolioData, setPortfolioData, onSave, loading }) => {
    const items = portfolioData.entranceExams;
    const setItems = (fn) => setPortfolioData(prev => ({ ...prev, entranceExams: typeof fn === "function" ? fn(prev.entranceExams) : fn }));

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <TopBar title="Entrance Exams" onSave={onSave} loading={loading} />
            <section className={cardClass}>
                <SecHead icon={Clipboard} label="Entrance Exams" color="text-sky-600" />
                <div className="space-y-4">
                    {items.map((ex, i) => (
                        <div key={ex.id} className="bg-gray-50 dark:bg-[#0f1117] rounded-xl p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Exam {i + 1}</span>
                                {items.length > 1 && <DelBtn onClick={() => deleteItem(setItems, ex.id)} />}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Field label="Exam Name">
                                    <Sel value={ex.name} onChange={e => updateItem(setItems, ex.id, "name", e.target.value)}
                                        placeholder="Select" options={["JEE Main","JEE Advanced","EAMCET","NEET","CAT","GATE","GMAT","GRE","Other"]} />
                                </Field>
                                <Field label="Year"><Inp value={ex.year}  onChange={e => updateItem(setItems, ex.id, "year",  e.target.value)} placeholder="YYYY" maxLength={4} /></Field>
                                <Field label="Rank"><Inp value={ex.rank}  onChange={e => updateItem(setItems, ex.id, "rank",  e.target.value)} placeholder="e.g. 4521" /></Field>
                                <Field label="Score / Percentile"><Inp value={ex.score} onChange={e => updateItem(setItems, ex.id, "score", e.target.value)} placeholder="e.g. 98.5%" /></Field>
                            </div>
                        </div>
                    ))}
                    <AddBtn label="Add Exam" onClick={() => addItem(setItems, { name:"", rank:"", score:"", year:"" })} />
                </div>
            </section>
        </div>
    );
};

export default EntranceView;