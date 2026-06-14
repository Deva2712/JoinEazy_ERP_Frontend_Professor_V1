// src/pages/ProfessorDashboard/components/ModuleGrid.jsx
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function ModuleGrid({ navCards }) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
      {navCards.map(({ label, sublabel, route, gradient, textColor, icon: Icon }) => (
        <div
          key={route}
          onClick={() => navigate(route)}
          className="bg-white dark:bg-[#1a1d26] rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`bg-gradient-to-br ${gradient} p-4 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {label}
            </h3>
          </div>
          <div className={`flex items-center ${textColor} font-semibold group-hover:translate-x-1 transition-transform`}>
            <span>{sublabel}</span>
            <ChevronRight className="w-5 h-5 ml-1" />
          </div>
        </div>
      ))}
    </div>
  );
}