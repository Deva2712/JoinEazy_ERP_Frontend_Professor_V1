// src/pages/Library/components/LibraryTabContent.jsx
import { useState } from "react";
import { Search, X, SlidersHorizontal, AlertCircle, RefreshCw } from "lucide-react";
import AdminContactSidebar from "../../../components/common/AdminContactSidebar";
import BorrowedTab  from "./Borrowedtab";
import BrowseTab    from "./Browsetab";
import RequestsTab  from "./Requesttab";

export default function LibraryTabContent({
  activeTab, onTabChange,
  filteredBorrowed, filteredAvailable, filteredRequests,
  searchQuery, setSearchQuery,
  isFilterOpen, setIsFilterOpen,
  admins, onCancelRequest,
  onOpenExtendModal, onOpenRequestModal,
  loading, error, onRefresh,
}) {
  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
        <AlertCircle className="size-10 text-red-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">{error}</p>
      <button onClick={onRefresh} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold transition-all">
        <RefreshCw className="size-4" /> Try Again
      </button>
    </div>
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <RefreshCw className="size-12 animate-spin mb-4 text-green-600" />
      <p className="font-bold text-gray-900 dark:text-white">Loading Library Data</p>
      <p className="text-sm">Please wait while we fetch your borrowed books...</p>
    </div>
  );

  return (
    <>
      {activeTab !== "support" && (
        <div className="mb-8 flex items-center gap-3">
          <div className="relative group flex-1">
            <Search className="size-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          {activeTab === "browse" && (
            <button onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 font-bold text-sm hover:border-emerald-500/50 active:scale-95">
              <SlidersHorizontal className="size-5 text-emerald-600" />
              <span className="hidden sm:inline text-gray-900 dark:text-white">Filters</span>
            </button>
          )}
        </div>
      )}

      {activeTab === "support" ? (
        <div className="lg:hidden max-w-md mx-auto">
          <AdminContactSidebar admins={admins} themeColor="green" isTabbedView={true} />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex-1">
            {activeTab === "borrowed"    && <BorrowedTab books={filteredBorrowed}   searchQuery={searchQuery} onExtend={onOpenExtendModal}   />}
            {activeTab === "browse"      && <BrowseTab   books={filteredAvailable}  searchQuery={searchQuery} onRequest={onOpenRequestModal} />}
            {activeTab === "my-requests" && <RequestsTab requests={filteredRequests} searchQuery={searchQuery} onCancelRequest={onCancelRequest} onBrowse={() => onTabChange("browse")} />}
          </div>
          {activeTab === "my-requests" && (
            <div className="hidden lg:block lg:w-80 flex-shrink-0">
              <AdminContactSidebar admins={admins} themeColor="green" />
            </div>
          )}
        </div>
      )}
    </>
  );
}