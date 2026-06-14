// components/BrowseTab.jsx
import React from "react";
import { Package } from "lucide-react";
import LibraryBookCard from "./LibraryBookCard";

const STEPS = [
  { step: "Browse",   desc: "Find a book"    },
  { step: "Request",  desc: "Submit interest" },
  { step: "Approval", desc: "Staff reviews"  },
  { step: "Collect",  desc: "Pick up item"   },
];

/**
 * Props:
 *   books        {Array}
 *   searchQuery  {string}
 *   onRequest    {(book) => void}
 */
const BrowseTab = ({ books, searchQuery, onRequest }) => (
  <div>
    {/* Process steps */}
    <div className="mb-8 flex items-center justify-between text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium px-2 gap-2">
      {STEPS.map(({ step, desc }, idx) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center text-center">
            <span className="text-green-700 dark:text-green-400 font-extrabold uppercase tracking-widest whitespace-nowrap">{step}</span>
            <span className="hidden md:block text-xs text-gray-400">{desc}</span>
          </div>
          {idx < STEPS.length - 1 && <div className="flex-grow h-[1px] bg-gray-200 dark:bg-gray-700 mx-2" />}
        </React.Fragment>
      ))}
    </div>

    {books.length === 0 ? (
      <div className="bg-white dark:bg-gray-900 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
        <Package className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No books available</h3>
        <p className="text-gray-600 dark:text-gray-400">
          {searchQuery ? "No books match your search" : "Check back later for available books"}
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <LibraryBookCard key={book.id} book={book} status="available" onAction={(b) => onRequest(b)} />
        ))}
      </div>
    )}
  </div>
);

export default BrowseTab;