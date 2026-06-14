import React from 'react';
import { AlertCircle } from 'lucide-react';
import {
  getTagColor, getPriorityConfig, formatDate, isExpiryUpcoming,
  getRoleBadgeClass, getRoleLabel,
} from '../utils/Announcementutils';

export function TagBadge({ tag }) {
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getTagColor(tag)}`}>{tag}</span>
  );
}

export function PriorityBadge({ priority }) {
  const config = getPriorityConfig(priority);
  if (!config) return null;
  return <span className={`text-xs font-bold px-2 py-1 rounded ${config.className}`}>{config.label}</span>;
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

export function RoleBadge({ role, isCurrentUser }) {
  if (isCurrentUser) {
    return (
      <span className="px-1.5 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded text-xs font-medium">
        You
      </span>
    );
  }
  const cls = getRoleBadgeClass(role);
  const label = getRoleLabel(role);
  if (!cls || !label) return null;
  return <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${cls}`}>{label}</span>;
}