// components/BorrowedTab.jsx
import React from "react";
import { BookMarked } from "lucide-react";
import LibraryBookCard from "./LibraryBookCard";

/**
 * Props:
 *   books        {Array}
 *   searchQuery  {string}
 *   onExtend     {(book) => void}
 */
const BorrowedTab = ({ books, searchQuery, onExtend }) =>
  books.length === 0 ? (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
      <BookMarked className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No borrowed books</h3>
      <p className="text-gray-600 dark:text-gray-400">
        {searchQuery ? "No books match your search" : "Books you borrow will appear here"}
      </p>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {books.map((book) => (
        <LibraryBookCard key={book.id} book={book} status="borrowed" onAction={(b) => onExtend(b)} />
      ))}
    </div>
  );

export default BorrowedTab;