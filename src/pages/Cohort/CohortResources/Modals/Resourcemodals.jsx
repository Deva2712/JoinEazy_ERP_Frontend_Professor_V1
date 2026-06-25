import React, { useState } from "react";

// Week Modal Component
export const WeekModal = ({ onClose, onSave, week = null, existingWeeks = [] }) => {
  // Parse existing dateRange back to startDate/endDate if editing
  const parseDateRange = (w) => {
    if (!w) return { startDate: "", endDate: "" };
    if (w.startDate && w.endDate) return { startDate: w.startDate, endDate: w.endDate };
     return { startDate: w.startDate || "", endDate: w.endDate || "" };
  };
  const { startDate: initStart, endDate: initEnd } = parseDateRange(week);

  const [formData, setFormData] = useState({
    weekNumber: parseInt(week?.weekNumber) || (existingWeeks.length + 1),
    title:     week?.title || "",
    startDate: initStart,
    endDate:   initEnd,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Build dateRange string from startDate + endDate
  const buildDateRange = (start, end) => {
    if (!start && !end) return "";
    const fmt = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
    return start && end ? `${fmt(start)} - ${fmt(end)}` : fmt(start) || fmt(end);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) { setError("Week title is required"); return; }
    if (!formData.startDate)    { setError("Start date is required"); return; }
    if (!formData.endDate)      { setError("End date is required"); return; }
    if (formData.endDate < formData.startDate) { setError("End date must be after start date"); return; }

    setSaving(true);
    try {
      const result = await onSave({
        title:      formData.title.trim(),
        weekNumber: parseInt(formData.weekNumber) || 1,
        order:      (parseInt(formData.weekNumber) || 1) - 1,
        startDate:  formData.startDate,
        endDate:    formData.endDate,
        dateRange:  buildDateRange(formData.startDate, formData.endDate),
      });
      if (result && !result.success) {
        setError(result.error || "Failed to save week");
        setSaving(false);
      }
    } catch {
      setError("An error occurred while saving");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6"
        style={{ fontFamily: '"Roboto", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          {week ? "Edit Week" : "Add Week"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Week Number</label>
            <input
              type="number"
              value={formData.weekNumber}
              onChange={(e) => setFormData({ ...formData, weekNumber: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Week Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Introduction to Programming"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* FIX: date pickers instead of plain text input */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                min={formData.startDate || undefined}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Preview */}
          {formData.startDate && formData.endDate && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Date range: <span className="font-medium text-blue-600">{buildDateRange(formData.startDate, formData.endDate)}</span>
            </p>
          )}

          <div className="flex gap-2 pt-4">
            <button type="button" onClick={onClose} disabled={saving}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Resource Modal Component
export const ResourceModal = ({ onClose, onSave, resource = null }) => {
  const [formData, setFormData] = useState({
    title: resource?.title || "",
    description: resource?.description || "",
    type: resource?.type || "link",
    url: resource?.url || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.title.trim()) { setError("Resource title is required"); return; }
    if (!formData.description.trim()) { setError("Description is required"); return; }
    if (!formData.url.trim()) { setError("URL is required"); return; }
    try { new URL(formData.url); } catch { setError("Please enter a valid URL"); return; }

    setSaving(true);
    try {
      const result = await onSave(formData);
      if (result && !result.success) { setError(result.error || "Failed to save resource"); setSaving(false); }
    } catch { setError("An error occurred while saving"); setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6"
        style={{ fontFamily: '"Roboto", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          {resource ? "Edit Resource" : "Add Resource"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-md text-sm">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Resource Type</label>
            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="slides">Slides</option>
              <option value="video">Video</option>
              <option value="document">Document</option>
              <option value="link">Link</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Lecture Slides: Basic Concepts"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the resource"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL</label>
            <input type="url" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div className="flex gap-2 pt-4">
            <button type="button" onClick={onClose} disabled={saving}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};