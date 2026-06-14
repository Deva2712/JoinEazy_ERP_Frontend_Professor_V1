import { useState } from "react";
import { X, Clock } from "lucide-react";

export const RequestMeetingModal = ({ onClose, onSubmit, professorName, officeHours }) => {
  const [formData, setFormData] = useState({ date: "", time: "", reason: "" });

  const formatOfficeHours = () => {
    if (!officeHours?.length) return "Not set";
    const { days, startTime, endTime } = officeHours[0];
    return `${Array.isArray(days) ? days.join(", ") : days || ""} ${startTime || ""}-${endTime || ""}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ professorName: professorName || "Professor", dateTime: `${formData.date}T${formData.time}:00Z`, reason: formData.reason, submittedAt: new Date().toISOString() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Request a Meeting</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Professor Name</label>
            <input type="text" value={professorName || "Professor"} disabled
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-700 cursor-not-allowed" />
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-blue-900 dark:text-blue-300 mb-1">Professor's Office Hours</p>
                <p className="text-sm text-blue-700 dark:text-blue-400">{formatOfficeHours()}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[["date", "Date", "date"], ["time", "Time", "time"]].map(([name, label, type]) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
                <input type={type} name={name} value={formData[name]} onChange={(e) => setFormData((p) => ({ ...p, [name]: e.target.value }))} required
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reason for Meeting</label>
            <textarea name="reason" value={formData.reason} onChange={(e) => setFormData((p) => ({ ...p, reason: e.target.value }))} required rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Describe the purpose of your meeting..." />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md">
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};