import React from 'react';

export default function CreateDiscussionForm({ newDiscussion, setNewDiscussion, creating, onSubmit, onCancel }) {
  return (
    <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-700">
      <div className="space-y-2">
        <input
          type="text"
          value={newDiscussion.title}
          onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Question title..."
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={creating}
        />
        <textarea
          value={newDiscussion.content}
          onChange={(e) => setNewDiscussion(prev => ({ ...prev, content: e.target.value }))}
          placeholder="Describe your question..."
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={creating}
        />
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            disabled={creating}
            className="flex-1 px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={creating || !newDiscussion.title.trim() || !newDiscussion.content.trim()}
            className="flex-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? 'Posting...' : 'Post Question'}
          </button>
        </div>
      </div>
    </div>
  );
}