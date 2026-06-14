// src/pages/Library/hooks/useLibraryData.js
import { useState, useEffect, useMemo } from "react";
import { libraryService } from "@/api/services/library.service";

export default function useLibraryData() {
  const [myRequests, setMyRequests] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData();
    document.title = "Library";
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await libraryService.getLibraryDashboard();
      if (res.success) {
        const { admins, requests, borrowed, inventory } = res.data;
        setMyRequests(requests);
        setBorrowedBooks(borrowed);
        setAvailableBooks(inventory);
        setAdmins(admins);
      } else {
        throw new Error("Failed to load dashboard data");
      }
    } catch (err) {
      setError("Failed to load library data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const availableCategories = [...new Set(availableBooks.map((b) => b.category))];

  const availableAuthors = useMemo(() => {
    const authorSet = new Set();
    availableBooks.forEach((book) => {
      if (book.author) {
        book.author.split(/[&,]/).forEach((name) => {
          const cleanName = name.trim();
          if (cleanName) authorSet.add(cleanName);
        });
      }
    });
    return Array.from(authorSet).sort();
  }, [availableBooks]);

  return {
    myRequests, setMyRequests,
    borrowedBooks, setBorrowedBooks,
    availableBooks, setAvailableBooks,
    admins, loading, error, setError,
    fetchAllData,
    availableCategories, availableAuthors,
  };
}