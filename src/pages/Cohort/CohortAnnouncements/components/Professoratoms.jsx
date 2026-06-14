import React from 'react';
import { AlertCircle } from 'lucide-react';
import { getTagColor, getPriorityConfig, formatDate, isExpiryUpcoming } from '../utils/Announcementutils';

export function TagBadge({ tag }) {
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getTagColor(tag)}`}>
      {tag}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const config = getPriorityConfig(priority);
  if (!config) return null;
  return (
    <span className={`text-xs font-bold px-2 py-1 rounded ${config.className}`}>
      {config.label}
    </span>
  );
}

export function ArchivedBadge() {
  return (
    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-300">
      Archived
    </span>
  );
}

export function ExpiryWarning({ expiryDate }) {
  if (!isExpiryUpcoming(expiryDate)) return null;
  return (
    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
        <AlertCircle size={14} />
        <span>Expires on {formatDate(expiryDate)}</span>
      </div>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="px-3 sm:px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading announcements...</span>
        </div>
      </div>
    </div>
  );
}

export function ErrorState({ error }) {
  return (
    <div className="px-3 sm:px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
        <div className="flex items-center justify-center text-red-600 dark:text-red-400">
          <AlertCircle className="mr-2" size={20} />
          <span>{error}</span>
        </div>
      </div>
    </div>
  );
}