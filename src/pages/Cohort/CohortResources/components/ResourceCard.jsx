import React from "react";
import { Edit2, Trash2, ExternalLink, Link as LinkIcon, FileText, Video, File } from "lucide-react";

// ── Icon map (type → icon) ────────────────────────────────────────
const ICONS = {
  slides:   <FileText size={16} className="text-blue-600" />,
  video:    <Video    size={16} className="text-red-600" />,
  document: <File     size={16} className="text-green-600" />,
  link:     <LinkIcon size={16} className="text-purple-600" />,
};

// ── ResourceCard Component ────────────────────────────────────────
const ResourceCard = ({ resource, onEdit, onDelete }) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      <div className="flex items-start gap-3">

        {/* Icon */}
        <div className="mt-1">
          {ICONS[resource.type] || ICONS.link}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 dark:text-white">{resource.title}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{resource.description}</p>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-flex items-center gap-1"
          >
            <LinkIcon size={14} className="flex-shrink-0" />
            <span className="break-all">{resource.url}</span>
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(resource)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <Edit2 size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => { if (confirm("Delete this resource?")) onDelete(resource.id); }}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/50 rounded"
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <ExternalLink size={16} className="text-gray-600 dark:text-gray-400" />
          </a>
        </div>

      </div>
    </div>
  );
};

export default ResourceCard;