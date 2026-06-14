// src/pages/StudentDashboard/components/StudentHeroBanner.jsx
import { Calendar as CalendarIcon, Building2, GraduationCap } from "lucide-react";

export default function StudentHeroBanner({ greetingName, userProfile, semester, academicYear }) {
  return (
    <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 dark:from-blue-900 dark:via-blue-950 dark:to-indigo-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="grid lg:grid-cols-2 gap-6 items-center">

          <div>
            <h1 className="text-2xl font-bold">
              👋 Welcome back, {greetingName}!
            </h1>
            <p className="text-blue-100 dark:text-blue-200 text-sm mt-1">
              Here's an overview of your courses, assignments, and upcoming deadlines.
            </p>
          </div>

          <div className="flex flex-wrap lg:flex-nowrap gap-3 lg:justify-end w-full text-white">
            <div className="bg-white/10 dark:bg-white/5 px-4 py-3 rounded-xl border border-white/10 backdrop-blur-md flex-1 min-w-[160px] shadow-sm">
              <div className="flex items-center gap-2 mb-1 text-blue-200 dark:text-blue-300">
                <CalendarIcon className="size-4 shrink-0" />
                <h3 className="text-[9px] font-bold uppercase tracking-[0.2em]">Today</h3>
              </div>
              <p className="text-sm font-semibold leading-snug">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long", month: "long", day: "numeric", year: "numeric",
                })}
              </p>
            </div>

            <div className="bg-white/10 dark:bg-white/5 px-4 py-3 rounded-xl border border-white/10 backdrop-blur-md flex-1 min-w-[160px] shadow-sm">
              <div className="flex items-center gap-2 mb-1 text-blue-200 dark:text-blue-300">
                <Building2 className="size-4 shrink-0" />
                <h3 className="text-[9px] font-bold uppercase tracking-[0.2em]">Institution</h3>
              </div>
              <p className="text-sm font-semibold leading-snug truncate">
                {userProfile.organization}
              </p>
            </div>

            <div className="bg-white/10 dark:bg-white/5 px-4 py-3 rounded-xl border border-white/10 backdrop-blur-md flex-1 min-w-[160px] shadow-sm">
              <div className="flex items-center gap-2 mb-1 text-blue-200 dark:text-blue-300">
                <GraduationCap className="size-4 shrink-0" />
                <h3 className="text-[9px] font-bold uppercase tracking-[0.2em]">Academic Year</h3>
              </div>
              <p className="text-sm font-semibold leading-snug">{semester}</p>
              <p className="text-xs text-blue-200 dark:text-blue-300 mt-0.5">{academicYear}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}