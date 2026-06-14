// export default MyMeetingsUI;

import { useState } from "react";
import { Plus } from "lucide-react";
import { MeetingCalendar } from "../CohortMeetings/components/MeetingCalendar";
import { RequestMeetingModal } from "../CohortMeetings/components/RequestMeetingModal";
import MeetingsRequested from "./MeetingsRequested";
import UpcomingMeetings from "./UpcomingMeetings";

const tabs = ["schedule", "upcoming", "requested"];
const tabLabels = { schedule: "My Schedule", upcoming: "Upcoming meetings", requested: "Requested meetings" };

const MyMeetingsUI = ({ activeTab, setActiveTab, meetings, requests, loading, onRequestMeeting, professorName, officeHours }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="px-3 sm:px-4 py-5">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 p-6">
          <div className="flex flex-row items-center justify-between gap-2">
            <div className="flex items-center bg-white dark:bg-gray-900 rounded-lg p-1 shadow-sm overflow-x-auto">
              {tabs.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                    activeTab === tab ? "bg-blue-600 text-white shadow-md" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}>
                  {tabLabels[tab]}
                </button>
              ))}
            </div>
            <button onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-md whitespace-nowrap text-xs sm:text-sm flex-shrink-0">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Request Meeting</span>
              <span className="sm:hidden">Request</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "schedule" ? (
          loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          ) : <MeetingCalendar meetings={meetings} />
        ) : activeTab === "upcoming" ? (
          <UpcomingMeetings meetings={meetings} loading={loading} />
        ) : (
          <MeetingsRequested requests={requests} loading={loading} />
        )}
      </div>

      {isModalOpen && (
        <RequestMeetingModal onClose={() => setIsModalOpen(false)} onSubmit={onRequestMeeting}
          professorName={professorName} officeHours={officeHours} />
      )}
    </div>
  );
};

export default MyMeetingsUI;