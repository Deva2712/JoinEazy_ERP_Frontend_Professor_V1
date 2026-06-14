// src/pages/ProfessorDashboard/components/HeroBanner.jsx
import { Building2, Calendar } from "lucide-react";

export default function HeroBanner({ greetingName, userProfile }) {
  return (
    <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 dark:from-blue-900 dark:via-blue-950 dark:to-indigo-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">

          <div className="gap-3">
            <h1 className="text-3xl font-bold">
              👋 Welcome back, {greetingName}!
            </h1>
            <p className="text-blue-100 dark:text-blue-200 text-lg">
              Here's an overview of your courses, schedules, and administrative tasks.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 lg:justify-end w-full text-white">
            <div className="bg-white/10 dark:bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md flex-1 min-w-[280px] shadow-sm">
              <div className="flex items-center gap-3 mb-2 text-blue-200 dark:text-blue-300">
                <Building2 className="size-5" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Institution</h3>
              </div>
              <p className="text-lg font-semibold truncate leading-tight">
                {userProfile.organization}
              </p>
            </div>

            <div className="bg-white/10 dark:bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md flex-1 min-w-[280px] shadow-sm">
              <div className="flex items-center gap-3 mb-2 text-blue-200 dark:text-blue-300">
                <Calendar className="size-5" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Today's Date</h3>
              </div>
              <p className="text-lg font-semibold truncate leading-tight">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}