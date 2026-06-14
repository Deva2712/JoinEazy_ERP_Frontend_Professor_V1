// src/pages/StudentCourses/views/registration/RegistrationOpen.jsx
import React, { useState } from "react";
import {
    CheckCircle, BookOpen, Tag, ChevronRight, Search, Filter,
    ChevronDown, User, Mail, GraduationCap, ClipboardList,
} from "lucide-react";
import { formatDate } from "../../utils/helpers";
import CompulsoryCourseCard from "../../components/CompulsoryCourseCard";
import ElectiveCourseCard   from "../../components/ElectiveCourseCard";
import CourseModal          from "../../components/CourseModal";
import ConfirmationStep     from "./ConfirmationStep";
import RegistrationDone     from "./RegistrationDone";

export default function RegistrationOpen({
    userProfile,
    registrationCourses,
    myRegistrations,
    registrationConfig,
    onSubmitRegistration,
    onCancelRegistration,
    onSwapElective,
}) {
    const registeredIds     = new Set(myRegistrations.map((r) => r.courseId));
    const compulsoryCourses = registrationCourses.filter((c) => c.isCompulsory);
    const electiveCourses   = registrationCourses.filter((c) => c.isElective);

    const [selectedElectives, setSelectedElectives] = useState([]);
    const [step, setStep] = useState(
        myRegistrations.length > 0 ? "done" : "select",
    );
    const [searchQuery,  setSearchQuery]  = useState("");
    const [filterDept,   setFilterDept]   = useState("All");
    const [modalCourse,  setModalCourse]  = useState(null);

    const maxElectives = registrationConfig.maxElectives || 5;
    const selectedElectivesOrdered = selectedElectives.sort((a, b) => a.priority - b.priority);
    const selectedCount = selectedElectives.length;
    const allSelected  = [...compulsoryCourses, ...selectedElectivesOrdered];

    const departments = ["All", ...Array.from(
        new Set(electiveCourses.map((c) => c.department).filter(Boolean)),
    )];

    const filteredElectives = electiveCourses.filter((c) => {
        const matchesDept   = filterDept === "All" || c.department === filterDept;
        const matchesSearch = !searchQuery ||
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.instructor?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesDept && matchesSearch;
    });

    const handleToggleElective = (course) => {
        setSelectedElectives(prev => {
            const alreadySelected = prev.find(c => c.id === course.id);
            if (alreadySelected) {
                // Remove and re-number remaining
                return prev
                    .filter(c => c.id !== course.id)
                    .map((c, i) => ({ ...c, priority: i + 1 }));
            }
            if (prev.length >= maxElectives) return prev; // cap at 5
            return [...prev, { ...course, priority: prev.length + 1 }];
        });
    };

    const handleConfirm = async () => {
        await onSubmitRegistration(allSelected);
        setStep("done");
    };

    const modalElectiveSelected = modalCourse ? selectedElectives.some(c => c.id === modalCourse.id) : false;
    const modalElectiveDisabled = modalCourse
        ? (selectedCount >= maxElectives && !modalElectiveSelected) || registeredIds.has(modalCourse.id)
        : false;

    if (step === "done") {
        return (
            <RegistrationDone
                myRegistrations={myRegistrations}
                registrationConfig={registrationConfig}
                registrationCourses={registrationCourses}
                onCancelRegistration={onCancelRegistration}
                onSwapElective={onSwapElective}
            />
        );
    }

    if (step === "confirm") {
        return (
            <ConfirmationStep
                selectedCourses={allSelected}
                userProfile={userProfile}
                registrationConfig={registrationConfig}
                onConfirm={handleConfirm}
                onBack={() => setStep("select")}
            />
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Course detail modal */}
            {modalCourse && (
                <CourseModal
                    course={modalCourse}
                    onClose={() => setModalCourse(null)}
                    onToggle={handleToggleElective}
                    isSelected={modalElectiveSelected}
                    isDisabled={modalElectiveDisabled}
                    showSelect
                />
            )}

            {/* Open window banner */}
            <div className="flex items-center gap-3 px-5 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl">
                <CheckCircle className="size-5 text-green-600 dark:text-green-400 shrink-0" />
                <p className="text-sm font-bold text-green-700 dark:text-green-300">
                    Registration is open until <span className="text-green-600 dark:text-green-400">{formatDate(registrationConfig.windowEnd)}</span>
                </p>
            </div>

            {/* Student details */}
            <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <User className="size-4 text-blue-600" />Student Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { label: "Full Name",       value: userProfile.fullName,   icon: User          },
                        { label: "Roll Number",     value: userProfile.rollNumber, icon: ClipboardList },
                        { label: "Email",           value: userProfile.email,      icon: Mail          },
                        { label: "Registering For", value: `${registrationConfig.targetSemester} · ${registrationConfig.targetAcademicYear}`, icon: GraduationCap },
                    ].map(({ label, value, icon: Icon }) => (
                        <div key={label}>
                            <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
                            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300">
                                <Icon className="size-4 text-gray-400 shrink-0" />{value || "—"}
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                    Auto-filled from your profile. Contact admin if anything is incorrect.
                </p>
            </div>

            {/* ── Compulsory Courses ── */}
            <div>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <BookOpen className="size-4 text-green-600" />
                    Compulsory Courses
                    <span className="text-xs font-normal text-gray-400">(auto-enrolled · click for details)</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {compulsoryCourses.map((course) => (
                        <CompulsoryCourseCard key={course.id} course={course} onClick={setModalCourse} />
                    ))}
                </div>
            </div>

            {/* ── Elective Courses ── */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Tag className="size-4 text-purple-600" />Open Electives
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Select up to <span className="font-bold text-purple-600 dark:text-purple-400">{maxElectives}</span>{" "}
                        elective{maxElectives > 1 ? "s" : ""}. &nbsp;
                        <span className="font-bold">{selectedCount}/{maxElectives}</span> selected.
                    </p>
                </div>

                {/* Search + filter */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <div className="relative flex-1 min-w-[180px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, code, or professor…"
                            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-purple-400 transition-colors text-gray-800 dark:text-gray-200"
                        />
                    </div>
                    {departments.length > 2 && (
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 pointer-events-none" />
                            <select
                                value={filterDept}
                                onChange={(e) => setFilterDept(e.target.value)}
                                className="appearance-none pl-8 pr-8 py-2 text-xs bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-purple-400 transition-colors text-gray-800 dark:text-gray-200 font-semibold"
                            >
                                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 pointer-events-none" />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredElectives.map((course) => {
                        const selected = selectedElectives.find(c => c.id === course.id);
                        const priority = selected ? selected.priority : null;
                        const isSelected   = selected != null || registeredIds.has(course.id);
                        const isAlreadyReg = registeredIds.has(course.id);
                        const atLimit      = selectedCount >= maxElectives && !isSelected;
                        return (
                            <ElectiveCourseCard
                                key={course.id}
                                course={course}
                                priority={priority}
                                isDisabled={(atLimit && !isSelected) || isAlreadyReg}
                                onToggle={isAlreadyReg ? () => {} : handleToggleElective}
                                onClick={setModalCourse}
                            />
                        );
                    })}
                    {filteredElectives.length === 0 && (
                        <div className="col-span-full text-center py-10 text-gray-400 dark:text-gray-500">
                            <BookOpen className="size-8 mx-auto mb-2 opacity-40" />
                            <p className="text-sm">No electives match your search.</p>
                        </div>
                    )}
                </div>

                {selectedCount >= maxElectives && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-3">
                        Maximum elective limit reached. Deselect one to choose another.
                    </p>
                )}
            </div>

            {/* Proceed bar */}
            <div className="flex items-center justify-between bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
                <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {allSelected.length} course{allSelected.length !== 1 ? "s" : ""} selected
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {allSelected.reduce((s, c) => s + c.credits, 0)} total credits
                    </p>
                </div>
                <button
                    onClick={() => setStep("confirm")}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
                >
                    Review & Confirm <ChevronRight className="size-4" />
                </button>
            </div>
        </div>
    );
}