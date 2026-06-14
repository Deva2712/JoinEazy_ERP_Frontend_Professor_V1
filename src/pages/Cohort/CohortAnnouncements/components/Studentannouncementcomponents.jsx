import React from 'react';
import { MessageSquare, AlertCircle, Calendar, Pin, Lock, ChevronDown } from 'lucide-react';
import { formatDate, replyLabel } from '../utils/Announcementutils';
import { TagBadge, PriorityBadge, ArchivedBadge, ExpiryWarning } from './SharedAtoms';

export function StudentFilterBar({ filter, setFilter, tagFilter, setTagFilter }) {
  return (
    <div className="flex flex-wrap gap-2">
      <div className="relative">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="appearance-none px-3 py-1.5 pr-9 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-colors"
        >
          <option value="active">Active Announcements</option>
          <option value="archived">Archived</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400" size={16} />
      </div>
      <div className="relative">
        <select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="appearance-none px-3 py-1.5 pr-9 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-colors"
        >
          <option value="all">All Tags</option>
          <option value="Discussion">💬 Discussion</option>
          <option value="Exam">📝 Exam</option>
          <option value="Assignment">📚 Assignment</option>
          <option value="Urgent">🔥 Urgent</option>
          <option value="Class">📚 Class</option>
          <option value="General">💬 General</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400" size={16} />
      </div>
    </div>
  );
}

export function StudentAnnouncementCard({ announcement, onView }) {
  return (
    <div
      onClick={() => onView(announcement)}
      className={`bg-white dark:bg-gray-800 rounded-2xl border ${
        announcement.is_pinned
          ? 'border-blue-300 dark:border-blue-700 shadow-md'
          : 'border-gray-200 dark:border-gray-700'
      } shadow-sm overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {announcement.is_pinned && <Pin size={16} className="text-blue-600 dark:text-blue-400 fill-current flex-shrink-0" />}
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {announcement.title}
              </h3>
              {announcement.is_locked && <Lock size={16} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />}
              <PriorityBadge priority={announcement.priority} />
              {announcement.tags?.map((tag, i) => <TagBadge key={i} tag={tag} />)}
              {announcement.is_archived && <ArchivedBadge />}
            </div>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-2">{announcement.content}</p>
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 flex-wrap gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5"><Calendar size={14} className="flex-shrink-0" />{formatDate(announcement.created_at)}</span>
            <span className="flex items-center gap-1"><MessageSquare size={14} />{replyLabel(announcement.replies_count)}</span>
          </div>
          <span className="text-blue-600 dark:text-blue-400 hover:underline font-medium">View Details →</span>
        </div>
        <ExpiryWarning expiryDate={announcement.expiry_date} />
      </div>
    </div>
  );
}

export function StudentEmptyState({ filter }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-12 text-center">
      <MessageSquare className="mx-auto mb-4 text-gray-400" size={48} />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No announcements yet</h3>
      <p className="text-gray-600 dark:text-gray-400">
        {filter === 'archived'
          ? 'No archived announcements at the moment.'
          : "Your professor hasn't posted any announcements yet. Check back later!"}
      </p>
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
          <AlertCircle className="mr-2" size={20} /><span>{error}</span>
        </div>
      </div>
    </div>
  );
}