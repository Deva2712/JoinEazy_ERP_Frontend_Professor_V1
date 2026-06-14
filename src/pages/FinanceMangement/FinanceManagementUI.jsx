// src/pages/FinanceManagement/FinanceManagementUI.jsx
import React from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";
import HeaderController    from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController    from "../../components/layout/Footer/FooterController";
import AdminContactSidebar from "../../components/common/AdminContactSidebar";
import FinanceRequestModal from "./components/FinanceRequestModal";
import HistoryFilterSidebar from "./components/HistoryFilterSidebar";
import HistorySection      from "./components/Historysection";
import ClaimsSection       from "./components/Claimsection";
import FinanceHero         from "./components/FinanceHero";
import useFinanceManagement from "./hooks/Usefinancemanagement";

const FinanceManagementUI = ({
  expenses = [], advances = [], allExpenses = [], allAdvances = [],
  admins = [], loading, error, activeTab, onTabChange, onRefresh, onSubmit,
  filters, setFilters,
}) => {
  const {
    isModalOpen, isFilterDrawerOpen, modalType, editingItem,
    filterMetadata, groupedHistory, pendingCount, rejectedCount,
    openEditModal, openNewModal, closeModal, setIsFilterDrawerOpen,
  } = useFinanceManagement({ expenses, advances, allExpenses, allAdvances, filters, activeTab });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] transition-colors duration-300 font-sans">
      <HeaderController />

      <FinanceHero
        pendingCount={pendingCount}
        rejectedCount={rejectedCount}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />

      <main className="max-w-7xl mx-auto px-4 py-8 pb-24">
        {error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
              <AlertTriangle className="size-10 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">{error}</p>
            <button onClick={onRefresh} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-bold transition-all">
              <RefreshCw className="size-4" /> Try Again
            </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <RefreshCw className="size-12 animate-spin mb-4 text-amber-600" />
            <p className="font-bold text-gray-900 dark:text-white">Loading Finances Data</p>
            <p className="text-sm">Please wait while we fetch your claims and requests...</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex-grow">
              {activeTab === "support" ? (
                <AdminContactSidebar admins={admins} themeColor="amber" isTabbedView={true} />
              ) : activeTab === "history" ? (
                <HistorySection
                  filters={filters} setFilters={setFilters}
                  groupedHistory={groupedHistory}
                  onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
                  onEditItem={openEditModal}
                />
              ) : (
                <ClaimsSection
                  activeTab={activeTab}
                  items={activeTab === "expenses" ? expenses : advances}
                  loading={loading} onRefresh={onRefresh}
                  onNew={() => openNewModal(activeTab === "expenses" ? "Expense" : "Advance")}
                  onEditItem={openEditModal}
                />
              )}
            </div>

            <div className="hidden lg:block w-80 shrink-0">
              {activeTab === "history" ? (
                <HistoryFilterSidebar
                  filters={filters} setFilters={setFilters}
                  filterMetadata={filterMetadata}
                  isOpen={isFilterDrawerOpen}
                  onClose={() => setIsFilterDrawerOpen(false)}
                />
              ) : (
                <AdminContactSidebar admins={admins} themeColor="amber" />
              )}
            </div>
          </div>
        )}
      </main>

      <FinanceRequestModal
        isOpen={isModalOpen}
        onClose={closeModal}
        type={modalType}
        initialData={editingItem}
        onSubmit={onSubmit}
      />

      <div className="lg:hidden">
        <HistoryFilterSidebar
          filters={filters} setFilters={setFilters}
          filterMetadata={filterMetadata}
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
        />
      </div>

      <BottomNavController />
      <FooterController />
    </div>
  );
};

export default FinanceManagementUI;