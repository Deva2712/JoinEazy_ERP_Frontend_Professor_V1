// src/pages/Library/LibraryUI.jsx
import React, { useEffect, useState } from "react";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import LibraryBanner from "./components/Librarybanner";
import LibraryTabContent from "./components/Librarytabcontent";
import LibraryFilterSidebar from "./components/LibraryFilterSidebar";
import DurationModal from "./components/DurationModal";

const LibraryUI = ({
  myRequests = [], borrowedBooks = [], availableBooks = [], admins = [],
  loading = false, error = null,
  onRequestBook, onCancelRequest, onHandleExtendBorrow, onRefresh,
  activeTab, onTabChange, filters, setFilters,
  isFilterOpen, setIsFilterOpen, availableCategories, availableAuthors,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, data: null });

  useEffect(() => { window.scrollTo(0, 0); }, [activeTab]);

  const openModal  = (data, type) => setModalConfig({ isOpen: true, type, data });
  const closeModal = ()           => setModalConfig({ isOpen: false, type: null, data: null });

  const searchFilter = (item) =>
    ["bookTitle", "title", "author", "category", "isbn"]
      .some((k) => item[k]?.toLowerCase().includes(searchQuery.toLowerCase()));

  const applyFilters = (data) =>
    data.filter((item) => {
      const matchCategory = filters.category === "all" || item.category === filters.category;
      const matchAuthor   = filters.author === "all" || item.author.split(/[&,]/).map((a) => a.trim()).includes(filters.author);
      const matchAvail    = filters.availability === "all" || (filters.availability === "available" ? item.availableCopies > 0 : item.availableCopies === 0);
      return matchCategory && matchAuthor && matchAvail;
    });

  const now = new Date();
  const overdueCount  = borrowedBooks.filter((b) => now > new Date(b.dueDate)).length;
  const pendingCount  = myRequests.filter((r) => r.status === "pending" || r.status === "extension-pending").length;

  const filteredBorrowed  = borrowedBooks.filter(searchFilter);
  const filteredRequests  = myRequests.filter(searchFilter);
  const filteredAvailable = applyFilters(availableBooks).filter(searchFilter);

  return (
    <div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans">
      <HeaderController />

      <LibraryBanner
        activeTab={activeTab}
        onTabChange={onTabChange}
        borrowedBooks={borrowedBooks}
        overdueCount={overdueCount}
        pendingCount={pendingCount}
      />

      <main className="max-w-7xl mx-auto px-4 py-8 w-full pb-24 md:pb-12">
        <LibraryTabContent
          activeTab={activeTab} onTabChange={onTabChange}
          filteredBorrowed={filteredBorrowed}
          filteredAvailable={filteredAvailable}
          filteredRequests={filteredRequests}
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen}
          admins={admins} onCancelRequest={onCancelRequest}
          onOpenExtendModal={(b)  => openModal(b, "extend")}
          onOpenRequestModal={(b) => openModal(b, "request")}
          loading={loading} error={error} onRefresh={onRefresh}
        />
      </main>

      <LibraryFilterSidebar
        isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}
        filters={filters} setFilters={setFilters}
        availableCategories={availableCategories} availableAuthors={availableAuthors}
      />

      <DurationModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.type === "request" ? "Borrow Book" : "Extend Borrowing"}
        onClose={closeModal}
        onConfirm={(days) => {
          if (modalConfig.type === "request") onRequestBook(modalConfig.data.id, days);
          if (modalConfig.type === "extend")  onHandleExtendBorrow(modalConfig.data.id, days);
          closeModal();
        }}
      />

      <BottomNavController />
      <FooterController />
    </div>
  );
};

export default LibraryUI;