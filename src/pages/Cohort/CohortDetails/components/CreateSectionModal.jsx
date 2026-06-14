import React from "react";
import { X } from "lucide-react";
import RichTextArea from "@/components/RichTextArea";

const CreateSectionModal = ({
  isCreatingSection,
  createForm,
  setCreateForm,
  createError,
  handleCreate,
  handleCancelCreate,
}) => {
  if (!isCreatingSection) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 w-full max-w-md max-h-[90vh] overflow-y-auto border dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Create New Section
          </h2>
          <button
            onClick={handleCancelCreate}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {createError && (
          <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-xs font-medium">{createError}</p>
          </div>
        )}

        <form className="space-y-2.5">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={createForm.title}
              onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
              placeholder="Enter section title"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content *
            </label>
            <RichTextArea
              value={createForm.content}
              onChange={(e) => setCreateForm({ ...createForm, content: e.target.value })}
              placeholder="Enter section content"
              className="bg-white dark:bg-gray-700"
              style={{ minHeight: "120px" }}
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleCancelCreate}
              className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              className="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Create Section
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSectionModal;