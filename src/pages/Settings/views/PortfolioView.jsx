import React from "react";
import {
    Code2, FolderGit2, Briefcase, TrendingUp, Award,
    BookOpen, FileText, Activity, Users, Target,
} from "lucide-react";
import { ExternalLink } from "lucide-react";
import {
    cardClass, Field, Inp, Sel, Txa, SecHead, TopBar,
    AddBtn, DelBtn, UploadBox, LevelPill,
    addItem, deleteItem, updateItem,
} from "../components/ProfilePrimitives";

const PortfolioView = ({ portfolioData, setPortfolioData, onSave, loading }) => {
    const update = (key) => (fn) =>
        setPortfolioData(prev => ({ ...prev, [key]: typeof fn === "function" ? fn(prev[key]) : fn }));

    const setSkills        = update("skills");
    const setProjects      = update("projects");
    const setExperience    = update("experience");
    const setInternships   = update("internships");
    const setAchievements  = update("achievements");
    const setResearchBooks = update("researchBooks");
    const setResearchPapers= update("researchPapers");
    const setSports        = update("sports");
    const setClubs         = update("clubs");
    const setEvents        = update("events");

    const { skills, projects, experience, internships, achievements, researchBooks, researchPapers, sports, clubs, events } = portfolioData;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <TopBar title="My Portfolio" onSave={onSave} loading={loading} />

            {/* Skills */}
            <section className={cardClass}>
                <SecHead icon={Code2} label="Technical Skills" color="text-indigo-600" />
                <div className="space-y-3">
                    {skills.map(sk => (
                        <div key={sk.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#0f1117] rounded-xl">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <Inp value={sk.name}     onChange={e => updateItem(setSkills, sk.id, "name",     e.target.value)} placeholder="Skill name" />
                                <Sel value={sk.category} onChange={e => updateItem(setSkills, sk.id, "category", e.target.value)} options={["Language","Framework","Library","Tool","Database","Cloud","Other"]} />
                                <LevelPill level={sk.level} onChange={val => updateItem(setSkills, sk.id, "level", val)} />
                            </div>
                            {skills.length > 1 && <DelBtn onClick={() => deleteItem(setSkills, sk.id)} />}
                        </div>
                    ))}
                    <AddBtn label="Add Skill" onClick={() => addItem(setSkills, { name:"", category:"Language", level:"Beginner" })} />
                </div>
            </section>

            {/* Projects */}
            <section className={cardClass}>
                <SecHead icon={FolderGit2} label="Projects" color="text-cyan-600" />
                <div className="space-y-4">
                    {projects.map((p, i) => (
                        <div key={p.id} className="bg-gray-50 dark:bg-[#0f1117] rounded-xl p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Project {i + 1}</span>
                                {projects.length > 1 && <DelBtn onClick={() => deleteItem(setProjects, p.id)} />}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Project Title" span2><Inp value={p.title}       onChange={e => updateItem(setProjects, p.id, "title",       e.target.value)} placeholder="e.g. E-Commerce Platform" /></Field>
                                <Field label="Description"   span2><Txa value={p.description} onChange={e => updateItem(setProjects, p.id, "description", e.target.value)} placeholder="Brief description..." /></Field>
                                <Field label="Technologies"><Inp value={p.tech} onChange={e => updateItem(setProjects, p.id, "tech", e.target.value)} placeholder="React, Node.js, MongoDB" /></Field>
                                <Field label="GitHub / Live Link">
                                    <div className="relative">
                                        <Inp value={p.github} onChange={e => updateItem(setProjects, p.id, "github", e.target.value)} placeholder="https://github.com/..." />
                                        {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500"><ExternalLink className="w-4 h-4" /></a>}
                                    </div>
                                </Field>
                            </div>
                        </div>
                    ))}
                    <AddBtn label="Add Project" onClick={() => addItem(setProjects, { title:"", description:"", tech:"", github:"" })} />
                </div>
            </section>

            {/* Experience */}
            <section className={cardClass}>
                <SecHead icon={Briefcase} label="Work Experience" color="text-amber-600" />
                <div className="space-y-4">
                    {experience.map((ex, i) => (
                        <div key={ex.id} className="bg-gray-50 dark:bg-[#0f1117] rounded-xl p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Experience {i + 1}</span>
                                <DelBtn onClick={() => deleteItem(setExperience, ex.id)} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Company Name"><Inp value={ex.company}     onChange={e => updateItem(setExperience, ex.id, "company",     e.target.value)} /></Field>
                                <Field label="Role"><Inp         value={ex.role}        onChange={e => updateItem(setExperience, ex.id, "role",        e.target.value)} /></Field>
                                <Field label="From"><Inp type="month" value={ex.from}   onChange={e => updateItem(setExperience, ex.id, "from",        e.target.value)} /></Field>
                                <Field label="To"><Inp   type="month" value={ex.to}     onChange={e => updateItem(setExperience, ex.id, "to",          e.target.value)} /></Field>
                                <Field label="Description" span2><Txa value={ex.description} onChange={e => updateItem(setExperience, ex.id, "description", e.target.value)} /></Field>
                            </div>
                        </div>
                    ))}
                    <AddBtn label="Add Experience" onClick={() => addItem(setExperience, { company:"", role:"", from:"", to:"", description:"" })} />
                </div>
            </section>

            {/* Internships */}
            <section className={cardClass}>
                <SecHead icon={TrendingUp} label="Training & Internships" color="text-lime-600" />
                <div className="space-y-4">
                    {internships.map((item, i) => (
                        <div key={item.id} className="bg-gray-50 dark:bg-[#0f1117] rounded-xl p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Internship {i + 1}</span>
                                {internships.length > 1 && <DelBtn onClick={() => deleteItem(setInternships, item.id)} />}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Organisation"><Inp value={item.org}  onChange={e => updateItem(setInternships, item.id, "org",  e.target.value)} /></Field>
                                <Field label="Role / Domain"><Inp value={item.role} onChange={e => updateItem(setInternships, item.id, "role", e.target.value)} /></Field>
                                <Field label="From"><Inp type="month" value={item.from} onChange={e => updateItem(setInternships, item.id, "from", e.target.value)} /></Field>
                                <Field label="To"><Inp   type="month" value={item.to}   onChange={e => updateItem(setInternships, item.id, "to",   e.target.value)} /></Field>
                                <Field label="Certificate" span2><UploadBox label="Upload completion certificate" hint="PDF, JPG, PNG — max 5 MB" /></Field>
                            </div>
                        </div>
                    ))}
                    <AddBtn label="Add Internship" onClick={() => addItem(setInternships, { org:"", role:"", from:"", to:"" })} />
                </div>
            </section>

            {/* Achievements */}
            <section className={cardClass}>
                <SecHead icon={Award} label="Awards & Achievements" color="text-yellow-600" />
                <div className="space-y-4">
                    {achievements.map((ach, i) => (
                        <div key={ach.id} className="bg-gray-50 dark:bg-[#0f1117] rounded-xl p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Achievement {i + 1}</span>
                                {achievements.length > 1 && <DelBtn onClick={() => deleteItem(setAchievements, ach.id)} />}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Title"><Inp value={ach.title} onChange={e => updateItem(setAchievements, ach.id, "title", e.target.value)} placeholder="e.g. First Prize in Hackathon" /></Field>
                                <Field label="Type"><Sel  value={ach.type}  onChange={e => updateItem(setAchievements, ach.id, "type",  e.target.value)} options={["Award","Competition","Scholarship","Recognition","Certification","Other"]} /></Field>
                                <Field label="Year"><Inp  value={ach.year}  onChange={e => updateItem(setAchievements, ach.id, "year",  e.target.value)} placeholder="YYYY" maxLength={4} /></Field>
                                <Field label="Issuing Body"><Inp placeholder="e.g. NASSCOM, University" /></Field>
                                <Field label="Description" span2><Txa value={ach.description} onChange={e => updateItem(setAchievements, ach.id, "description", e.target.value)} /></Field>
                            </div>
                        </div>
                    ))}
                    <AddBtn label="Add Achievement" onClick={() => addItem(setAchievements, { title:"", type:"Award", year:"", description:"" })} />
                </div>
            </section>

            {/* Research Books */}
            <section className={cardClass}>
                <SecHead icon={BookOpen} label="Book Publications" color="text-purple-600" />
                <div className="space-y-4">
                    {researchBooks.map((book, i) => (
                        <div key={book.id} className="bg-gray-50 dark:bg-[#0f1117] rounded-xl p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Book {i + 1}</span>
                                {researchBooks.length > 1 && <DelBtn onClick={() => deleteItem(setResearchBooks, book.id)} />}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Title" span2><Inp value={book.title}     onChange={e => updateItem(setResearchBooks, book.id, "title",     e.target.value)} /></Field>
                                <Field label="Publisher"><Inp   value={book.publisher} onChange={e => updateItem(setResearchBooks, book.id, "publisher", e.target.value)} /></Field>
                                <Field label="Year"><Inp        value={book.year}      onChange={e => updateItem(setResearchBooks, book.id, "year",      e.target.value)} placeholder="YYYY" maxLength={4} /></Field>
                                <Field label="ISBN"><Inp        value={book.isbn}      onChange={e => updateItem(setResearchBooks, book.id, "isbn",      e.target.value)} placeholder="978-..." /></Field>
                            </div>
                        </div>
                    ))}
                    <AddBtn label="Add Book" onClick={() => addItem(setResearchBooks, { title:"", publisher:"", year:"", isbn:"" })} />
                </div>
            </section>

            {/* Research Papers */}
            <section className={cardClass}>
                <SecHead icon={FileText} label="Paper Publications" color="text-purple-600" />
                <div className="space-y-4">
                    {researchPapers.map((paper, i) => (
                        <div key={paper.id} className="bg-gray-50 dark:bg-[#0f1117] rounded-xl p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Paper {i + 1}</span>
                                {researchPapers.length > 1 && <DelBtn onClick={() => deleteItem(setResearchPapers, paper.id)} />}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Paper Title" span2><Inp value={paper.title}   onChange={e => updateItem(setResearchPapers, paper.id, "title",   e.target.value)} /></Field>
                                <Field label="Journal / Conference"><Inp value={paper.journal} onChange={e => updateItem(setResearchPapers, paper.id, "journal", e.target.value)} /></Field>
                                <Field label="Year"><Inp value={paper.year} onChange={e => updateItem(setResearchPapers, paper.id, "year", e.target.value)} placeholder="YYYY" maxLength={4} /></Field>
                                <Field label="DOI / Link" span2><Inp value={paper.doi}  onChange={e => updateItem(setResearchPapers, paper.id, "doi",  e.target.value)} placeholder="https://doi.org/..." /></Field>
                            </div>
                        </div>
                    ))}
                    <AddBtn label="Add Paper" onClick={() => addItem(setResearchPapers, { title:"", journal:"", year:"", doi:"" })} />
                </div>
            </section>

            {/* Sports */}
            <section className={cardClass}>
                <SecHead icon={Activity} label="Sports" color="text-fuchsia-600" />
                <div className="space-y-3">
                    {sports.map(s => (
                        <div key={s.id} className="flex items-center gap-3 bg-gray-50 dark:bg-[#0f1117] rounded-xl p-3">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <Inp value={s.name}        onChange={e => updateItem(setSports, s.id, "name",        e.target.value)} placeholder="Sport name" />
                                <Sel value={s.level}       onChange={e => updateItem(setSports, s.id, "level",       e.target.value)} placeholder="Level" options={["School","College","District","State","National","International"]} />
                                <Inp value={s.achievement} onChange={e => updateItem(setSports, s.id, "achievement", e.target.value)} placeholder="Achievement (if any)" />
                            </div>
                            {sports.length > 1 && <DelBtn onClick={() => deleteItem(setSports, s.id)} />}
                        </div>
                    ))}
                    <AddBtn label="Add Sport" onClick={() => addItem(setSports, { name:"", level:"", achievement:"" })} />
                </div>
            </section>

            {/* Clubs */}
            <section className={cardClass}>
                <SecHead icon={Users} label="Clubs & Societies" color="text-fuchsia-600" />
                <div className="space-y-3">
                    {clubs.map(c => (
                        <div key={c.id} className="bg-gray-50 dark:bg-[#0f1117] rounded-xl p-3">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <Inp value={c.name} onChange={e => updateItem(setClubs, c.id, "name", e.target.value)} placeholder="Club name" />
                                <Inp value={c.role} onChange={e => updateItem(setClubs, c.id, "role", e.target.value)} placeholder="Your role" />
                                <Inp type="month" value={c.from} onChange={e => updateItem(setClubs, c.id, "from", e.target.value)} />
                                <div className="flex gap-2">
                                    <Inp type="month" value={c.to} onChange={e => updateItem(setClubs, c.id, "to", e.target.value)} />
                                    {clubs.length > 1 && <DelBtn onClick={() => deleteItem(setClubs, c.id)} />}
                                </div>
                            </div>
                        </div>
                    ))}
                    <AddBtn label="Add Club" onClick={() => addItem(setClubs, { name:"", role:"", from:"", to:"" })} />
                </div>
            </section>

            {/* Events */}
            <section className={cardClass}>
                <SecHead icon={Award} label="Events & Competitions" color="text-fuchsia-600" />
                <div className="space-y-3">
                    {events.map(ev => (
                        <div key={ev.id} className="flex items-center gap-3 bg-gray-50 dark:bg-[#0f1117] rounded-xl p-3">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <Inp value={ev.name} onChange={e => updateItem(setEvents, ev.id, "name", e.target.value)} placeholder="Event name" />
                                <Inp value={ev.role} onChange={e => updateItem(setEvents, ev.id, "role", e.target.value)} placeholder="Role / Position" />
                                <Inp value={ev.year} onChange={e => updateItem(setEvents, ev.id, "year", e.target.value)} placeholder="Year" maxLength={4} />
                            </div>
                            {events.length > 1 && <DelBtn onClick={() => deleteItem(setEvents, ev.id)} />}
                        </div>
                    ))}
                    <AddBtn label="Add Event" onClick={() => addItem(setEvents, { name:"", role:"", year:"" })} />
                </div>
            </section>

            {/* Career */}
            <section className={cardClass}>
                <SecHead icon={Target} label="Career Objectives" color="text-green-600" />
                <div className="space-y-5">
                    <Field label="Short Bio / Career Summary">
                        <Txa value={portfolioData.careerObjective || ""}
                            onChange={e => setPortfolioData(prev => ({ ...prev, careerObjective: e.target.value }))}
                            rows={6} placeholder="Describe your career goals, strengths, and professional aspirations..." />
                    </Field>
                    <Field label="Area of Interest"><Inp placeholder="e.g. Machine Learning, Full Stack Development" /></Field>
                    <Field label="Preferred Job Roles"><Inp placeholder="e.g. Software Engineer, Data Analyst" /></Field>
                    <Field label="Preferred Location"><Inp placeholder="e.g. Hyderabad, Bengaluru, Remote" /></Field>
                </div>
            </section>
        </div>
    );
};

export default PortfolioView;