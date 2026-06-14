// src/pages/Library/LibraryController.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { libraryService } from "../../api/services/library.service";
import { useNotifications } from "../../context/NotificationContext";
import useLibraryData from "./hooks/Uselibrarydata";
import LibraryUI from "./LibraryUI";

export default function LibraryController() {
  const [filters, setFilters] = useState({ category: "all", availability: "all", author: "all" });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { tab } = useParams();
  const navigate = useNavigate();
  const { refreshNotifications } = useNotifications();

  const {
    myRequests, setMyRequests,
    borrowedBooks, setBorrowedBooks,
    availableBooks, setAvailableBooks,
    admins, loading, error, setError,
    fetchAllData, availableCategories, availableAuthors,
  } = useLibraryData();

  const activeTab = tab || "borrowed";

  const handleRequestBook = async (bookId, duration) => {
    try {
      const res = await libraryService.requestBook(bookId, duration);
      if (res.success) {
        if (res.data) {
          setMyRequests((prev) => [res.data, ...prev]);
          refreshNotifications();
        }
      } else {
        setError(res.message || "Failed to request book");
      }
    } catch (err) {
      console.error("Error requesting book:", err);
      setError("Failed to request book. Please try again.");
    }
  };

  const handleExtendBorrow = async (bookId, additionalDays) => {
    try {
      const res = await libraryService.requestExtension(bookId, additionalDays);
      if (res.success) {
        setMyRequests((prev) => [res.data, ...prev]);
        refreshNotifications();
      }
    } catch (err) {
      console.error("Error creating extension request:", err);
      setError("Failed to request extension.");
    }
  };

  const handleApproveExtension = async (requestId, bookId, additionalDays) => {
    try {
      const res = await libraryService.approveExtension(requestId, bookId, additionalDays);
      if (res.success) {
        setBorrowedBooks((prev) =>
          prev.map((b) => b.id === bookId ? { ...b, dueDate: res.newDueDate } : b)
        );
        setMyRequests((prev) => prev.filter((r) => r.id !== requestId));
        refreshNotifications();
      } else {
        setError(res.message || "Failed to approve extension");
      }
    } catch (err) {
      console.error("Error approving extension:", err);
      setError("Failed to process extension approval.");
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      const res = await libraryService.cancelRequest(requestId);
      if (res.success) {
        const cancelled = myRequests.find((r) => r.id === requestId);
        if (cancelled) {
          setAvailableBooks((prev) =>
            prev.map((book) =>
              book.isbn === cancelled.isbn
                ? { ...book, availableCopies: book.availableCopies + 1 }
                : book
            )
          );
        }
        setMyRequests((prev) => prev.filter((r) => r.id !== requestId));
        refreshNotifications();
      } else {
        setError(res.message || "Failed to cancel request");
      }
    } catch (err) {
      console.error("Error cancelling request:", err);
      setError("Failed to cancel request. Please try again.");
    }
  };

  return (
    <LibraryUI
      myRequests={myRequests}
      borrowedBooks={borrowedBooks}
      availableBooks={availableBooks}
      admins={admins}
      loading={loading}
      error={error}
      activeTab={activeTab}
      filters={filters}
      setFilters={setFilters}
      isFilterOpen={isFilterOpen}
      setIsFilterOpen={setIsFilterOpen}
      availableCategories={availableCategories}
      availableAuthors={availableAuthors}
      onRefresh={fetchAllData}
      onRequestBook={handleRequestBook}
      onHandleExtendBorrow={handleExtendBorrow}
      handleApproveExtension={handleApproveExtension}
      onCancelRequest={handleCancelRequest}
      onTabChange={(newTab) => navigate(`/library/${newTab}`)}
    />
  );
}