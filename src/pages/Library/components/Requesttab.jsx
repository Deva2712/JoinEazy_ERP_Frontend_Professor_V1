// components/RequestsTab.jsx
import React from "react";
import { Clock, Package } from "lucide-react";
import BookRequestCard from "./BookRequestCard";

/**
 * Props:
 *   requests         {Array}
 *   searchQuery      {string}
 *   onCancelRequest  {(id) => void}
 *   onBrowse         {() => void}
 */
const RequestsTab = ({ requests, searchQuery, onCancelRequest, onBrowse }) =>
  requests.length === 0 ? (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
      <Clock className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No requests yet</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {searchQuery ? "No requests match your search" : "Browse books and submit a request to get started"}
      </p>
      {!searchQuery && (
        <button
          onClick={onBrowse}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          <Package className="w-4 h-4" /> Browse Books
        </button>
      )}
    </div>
  ) : (
    <div className="grid grid-cols-1 gap-4">
      {requests.map((r) => (
        <BookRequestCard key={r.id} request={r} onCancelRequest={onCancelRequest} />
      ))}
    </div>
  );

export default RequestsTab;