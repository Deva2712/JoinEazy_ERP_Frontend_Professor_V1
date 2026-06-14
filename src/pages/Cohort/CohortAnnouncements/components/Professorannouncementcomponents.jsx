import React from 'react';
import {
  Pin, Archive, Edit, Trash2, Lock, Unlock,
  MessageSquare, Calendar, Plus, ChevronDown,
} from 'lucide-react';
import { formatDate, replyLabel } from '../utils/Announcementutils';
import { TagBadge, PriorityBadge, ArchivedBadge, ExpiryWarning } from './ProfessorAtoms';

export function FilterBar({ filter, setFilter, tagFilter, setTagFilter }) {
  return (
    <div className="flex flex-wrap gap-2">
      <div className="relative">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="appearance-none px-3 py-1.5 pr-9 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-colors"
        >
          <option value="all">All Announcements</option>
          <option value="active">Active Only</option>
          <option value="pinned">Pinned Only</option>
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

export function AnnouncementCard({ announcement, onView, onEdit, onArchive, onDelete, onToggleLock }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl border ${
      announcement.is_pinned
        ? 'border-blue-300 dark:border-blue-700 shadow-md'
        : 'border-gray-200 dark:border-gray-700'
    } shadow-sm overflow-hidden hover:shadow-lg transition-all duration-200`}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2 gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {announcement.is_pinned && <Pin size={16} className="text-blue-600 dark:text-blue-400 fill-current flex-shrink-0" />}
              <h3
                onClick={() => onView(announcement)}
                className="text-lg font-bold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {announcement.title}
              </h3>
              {announcement.is_locked && <Lock size={16} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />}
              <PriorityBadge priority={announcement.priority} />
              {announcement.tags?.map((tag, i) => <TagBadge key={i} tag={tag} />)}
              {announcement.is_archived && <ArchivedBadge />}
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={() => onToggleLock(announcement.id, !announcement.is_locked)} className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title={announcement.is_locked ? 'Unlock Thread' : 'Lock Thread'}>
              {announcement.is_locked ? <Lock size={18} /> : <Unlock size={18} />}
            </button>
            <button onClick={() => onEdit(announcement)} className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Edit">
              <Edit size={18} />
            </button>
            <button onClick={() => onArchive(announcement.id)} className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Archive">
              <Archive size={18} />
            </button>
            <button onClick={() => onDelete(announcement.id)} className="p-2 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors" title="Delete">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-2">{announcement.content}</p>
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 flex-wrap gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5"><Calendar size={14} className="flex-shrink-0" />{formatDate(announcement.created_at)}</span>
            <span className="flex items-center gap-1.5"><MessageSquare size={14} className="flex-shrink-0" />{replyLabel(announcement.replies_count)}</span>
          </div>
          <button onClick={() => onView(announcement)} className="text-blue-600 dark:text-blue-400 hover:underline font-medium whitespace-nowrap">
            View Details →
          </button>
        </div>
        <ExpiryWarning expiryDate={announcement.expiry_date} />
      </div>
    </div>
  );
}

export function EmptyState({ onCreate }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-12 text-center">
      <MessageSquare className="mx-auto mb-4 text-gray-400" size={48} />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No announcements yet</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">Create your first announcement to start communicating with your students.</p>
      <button onClick={onCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
        <Plus size={20} />Create Announcement
      </button>
    </div>
  );
}

export function CreateSidebar({ onCreate }) {
  return (
    <div className="hidden lg:flex flex-col gap-3 w-full lg:w-[280px] xl:w-[300px] flex-shrink-0">
      <div className="lg:sticky lg:top-4 self-start">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 shadow-lg">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-white" />
              <h4 className="text-sm font-semibold text-white">Create New Announcement</h4>
            </div>
            <p className="text-xs text-blue-100 leading-snug">Add new announcements to share important updates with your students</p>
            <button onClick={onCreate} className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all shadow-sm hover:shadow-md border border-transparent dark:border-gray-700">
              <Plus size={16} className="text-blue-600 dark:text-blue-400" />New Announcement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileFAB({ onCreate }) {
  return (
    <button
      onClick={onCreate}
      className="lg:hidden fixed bottom-20 right-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 px-4 py-3 z-40 hover:scale-110 active:scale-95"
      aria-label="Create new announcement"
    >
      <Plus size={20} />
      <span className="font-semibold text-sm whitespace-nowrap">New Announcement</span>
    </button>
  );
}