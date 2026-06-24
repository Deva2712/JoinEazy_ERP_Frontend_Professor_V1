import React from "react";
import { Edit } from "lucide-react";
import RichTextArea from "@/components/RichTextArea";

const ContainerCard = ({
  container,
  user_type,
  isEditing,
  editForm,
  setEditForm,
  saveError,
  expandedCards,
  setExpandedCards,
  handleEditClick,
  handleCancelEdit,
  handleSave,
  handleDeleteSection,
  containerRefs,
}) => {


  if (isEditing) {
    return (
      <div
        ref={(el) => { if (el) containerRefs.current[container.id] = el; }}
        id={`block-${container.id}`}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow"
      >
        <div className="mb-3">
          <label className="block text-xs font-semibold text-gray-900 dark:text-gray-100 mb-1.5">
            Section Title
          </label>
          <input
            type="text"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="mb-3">
          <label className="block text-xs font-semibold text-gray-900 dark:text-gray-100 mb-1.5">
            Section Content
          </label>
          <RichTextArea
            value={editForm.content}
            onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
            placeholder={
              container.id === 1
                ? "Welcome to this course! This is where you can provide an overview of what students will learn and what to expect from this course."
                : container.id === 2
                ? "Provide a detailed description of the course content, learning objectives, and what students will gain from taking this course."
                : container.id === 3
                ? "List important resources, materials, tools, or references that students will need for this course."
                : "Enter your content here..."
            }
            className="bg-gray-50 dark:bg-gray-700"
            style={{ minHeight: "150px" }}
          />
        </div>

        {saveError && (
          <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-xs">{saveError}</p>
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <button
            onClick={handleCancelEdit}
            className="px-4 py-1.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-medium"
          >
            Cancel
          </button>
          {user_type === 1 && (
            <button
              onClick={() => handleDeleteSection(container.id)}
              className="px-4 py-1.5 text-white text-sm bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Delete
            </button>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-1.5 text-white text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all font-medium"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  const isExpanded = expandedCards[container.id];
  const contentLength = container.content.trim().length;
  const hasLongContent = contentLength > 400;

  return (
    <div
      ref={(el) => { if (el) containerRefs.current[container.id] = el; }}
      id={`block-${container.id}`}
      className="border-b border-gray-200 dark:border-gray-700 py-4 first:pt-0 last:border-b-0 last:pb-0"
    >
      <div className="flex justify-between items-center mb-2.5">
        <div className="flex-1 pr-4">
          <h4 className="font-bold text-base text-gray-900 dark:text-gray-100 leading-snug">
            {container.title}
          </h4>
        </div>
        <div className="flex items-start gap-3 font-arial">
          {user_type === 1 && (
            <button
              onClick={() => handleEditClick(container)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
              style={{ flexShrink: 0 }}
            >
              <Edit size={14} />
              <span>Edit</span>
            </button>
          )}
        </div>
      </div>

      <div className="font-normal text-gray-700 dark:text-gray-100">
        <div
          className={`prose prose-sm max-w-none dark:prose-invert ${!isExpanded && hasLongContent ? "line-clamp-3" : ""}`}
          dangerouslySetInnerHTML={{ __html: container.content }}
          style={{ lineHeight: "1", whiteSpace: "pre-line" }}
        />

        {hasLongContent && (
          <button
            onClick={() =>
              setExpandedCards((prev) => {
                if (prev[container.id]) return {};
                return { [container.id]: true };
              })
            }
            className="mt-3 inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm transition-colors"
          >
            {isExpanded ? (
              <>
                See Less
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </>
            ) : (
              <>
                See More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ContainerCard;