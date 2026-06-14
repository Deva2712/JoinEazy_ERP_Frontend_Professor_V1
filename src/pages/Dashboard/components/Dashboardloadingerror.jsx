// src/pages/ProfessorDashboard/components/DashboardLoadingError.jsx
import { RefreshCw, AlertCircle } from "lucide-react";
import HeaderController from "../../../components/layout/Header/HeaderController";
import BottomNavController from "../../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../../components/layout/Footer/FooterController";

export function DashboardLoading() {
  return (
    <div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans">
      <HeaderController />
      <main className="mx-auto px-4 py-5 lg:py-6 xl:py-8 pb-24 md:pb-5 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading dashboard...</span>
          </div>
        </div>
      </main>
      <BottomNavController />
      <FooterController />
    </div>
  );
}

export function DashboardError({ error, onRetry }) {
  return (
    <div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans">
      <HeaderController />
      <main className="mx-auto px-4 py-5 lg:py-6 xl:py-8 pb-24 md:pb-5 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Failed to load dashboard
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
      <BottomNavController />
      <FooterController />
    </div>
  );
}