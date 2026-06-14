// // export default CohortEventsUI;


// import CalendarCustom from "../../../components/ui/calendar-custom";
// import EventCard from "../CohortEvents/components/EventCard";
// import EventTabBar from "../CohortEvents/components/EventTabBar";

// const CohortEventsUI = ({ user_type, activeTab, events, sharedEvents, loading, error, onRetry,
//   onUpcomingClick, onPastClick, onRequestedClick, onCalendarViewClick,
//   onNewEventClick, onRequestEventClick, onShareClick, onEventClick,
// }) => {
//   if (loading) return (
//     <div className="flex flex-col h-full items-center justify-center py-20">
//       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4" />
//       <p className="text-gray-600">Loading events...</p>
//     </div>
//   );

//   if (error) return (
//     <div className="flex flex-col h-full items-center justify-center py-20">
//       <div className="text-red-500 mb-4">Failed to load events: {error}</div>
//       <button onClick={onRetry} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Retry</button>
//     </div>
//   );

//   return (
//     <div className="pb-[92px] py-5 sm:px-4 sm:py-6 sm:pb-7">
//       <EventTabBar activeTab={activeTab} user_type={user_type}
//         onUpcomingClick={onUpcomingClick} onPastClick={onPastClick}
//         onRequestedClick={onRequestedClick} onCalendarViewClick={onCalendarViewClick}
//         onNewEventClick={onNewEventClick} onRequestEventClick={onRequestEventClick} />

//       <div className="px-0">
//         {activeTab === "Calendar view" ? (
//           <CalendarCustom events={events} onDateClick={(date) => console.log("Date clicked:", date)} />
//         ) : events.length > 0 ? (
//           <div className="grid grid-cols-1 gap-5 sm:gap-6">
//             {events.map((event) => (
//               <EventCard key={event.id} event={event} isShared={sharedEvents?.has(event.id)}
//                 onEventClick={onEventClick} onShareClick={onShareClick} />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center text-gray-500 py-20">No {activeTab.toLowerCase()} events found</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CohortEventsUI;
import { useState } from "react";
import { History } from "lucide-react";

import CalendarCustom from "../../../components/ui/calendar-custom";
import EventCard from "../CohortEvents/components/EventCard";
import EventTabBar from "../CohortEvents/components/EventTabBar";
import EventHistoryModal from "../CohortEvents/components/EventHistoryModal";

const CohortEventsUI = ({
  user_type,
  activeTab,
  events,
  pastEvents,       // NEW: pass past events array from controller
  sharedEvents,
  loading,
  error,
  onRetry,
  onUpcomingClick,
  onPastClick,
  onRequestedClick,
  onCalendarViewClick,
  onNewEventClick,
  onRequestEventClick,
  onShareClick,
  onEventClick,
}) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  if (loading)
    return (
      <div className="flex flex-col h-full items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4" />
        <p className="text-gray-600">Loading events...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col h-full items-center justify-center py-20">
        <div className="text-red-500 mb-4">Failed to load events: {error}</div>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="pb-[92px] py-5 sm:px-4 sm:py-6 sm:pb-7">
      <EventTabBar
        activeTab={activeTab}
        user_type={user_type}
        onUpcomingClick={onUpcomingClick}
        onPastClick={onPastClick}
        onRequestedClick={onRequestedClick}
        onCalendarViewClick={onCalendarViewClick}
        onNewEventClick={onNewEventClick}
        onRequestEventClick={onRequestEventClick}
      />

      <div className="px-0">
        {activeTab === "Calendar view" ? (
          <CalendarCustom
            events={events}
            onDateClick={(date) => console.log("Date clicked:", date)}
          />
        ) : (
          <>
            {/* ── Upcoming Section Header with History Button ── */}
            {activeTab === "Upcoming" && (
              <div className="flex items-center justify-between mb-4 px-0">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Upcoming Events
                </h3>
                <button
                  onClick={() => setIsHistoryOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#1E61F0] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-full transition-all duration-150"
                >
                  <History size={13} />
                  History
                </button>
              </div>
            )}

            {/* ── Event List ── */}
            {events.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:gap-6">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isShared={sharedEvents?.has(event.id)}
                    onEventClick={onEventClick}
                    onShareClick={onShareClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-20">
                No {activeTab.toLowerCase()} events found
              </div>
            )}
          </>
        )}
      </div>

      {/* ── History Modal ── */}
      <EventHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        pastEvents={pastEvents || []}
      />
    </div>
  );
};

export default CohortEventsUI;