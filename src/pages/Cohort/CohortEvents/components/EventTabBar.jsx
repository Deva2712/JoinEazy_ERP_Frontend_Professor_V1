import { Clock, History, MessageSquare, Calendar, Plus, Send } from "lucide-react";

const tabList = [
  { name: "Upcoming", icon: <Clock size={16} /> },
  { name: "Past", icon: <History size={16} /> },
  { name: "Requested", icon: <MessageSquare size={16} /> },
  { name: "Calendar view", icon: <Calendar size={15} /> },
];

const ActionButton = ({ user_type, onNewEventClick, onRequestEventClick, className = "", size = 15 }) => (
  user_type === 1 ? (
    <button onClick={onNewEventClick} className={`flex items-center justify-center gap-2 font-medium text-white bg-[#1E61F0] rounded-full ${className}`}>
      <Plus size={size} /> New Event
    </button>
  ) : (
    <button onClick={onRequestEventClick} className={`flex items-center justify-center gap-2 font-medium text-white bg-[#1E61F0] rounded-full ${className}`}>
      <Send size={size} /> Request Event
    </button>
  )
);

const EventTabBar = ({ activeTab, user_type, onUpcomingClick, onPastClick, onRequestedClick, onCalendarViewClick, onNewEventClick, onRequestEventClick }) => {
  const handlers = { Upcoming: onUpcomingClick, Past: onPastClick, Requested: onRequestedClick, "Calendar view": onCalendarViewClick };

  return (
    <>
      <div className="flex items-center justify-between px-4 sm:px-0 mb-5 sm:mb-6">
        <div className="flex-1 overflow-x-auto">
          <div className="flex items-center gap-3 min-w-max">
            {tabList.map(({ name, icon }) => (
              <button key={name} onClick={handlers[name]}
                className="flex items-center justify-center gap-2 h-[38px] px-4 text-sm font-medium rounded-full bg-white border border-[#D3D6DA] transition-all duration-200 flex-shrink-0"
                style={{ color: activeTab === name ? "rgb(30, 97, 240)" : "#374151" }}
              >
                {icon} {name}
              </button>
            ))}
          </div>
        </div>
        <div className="hidden sm:block ml-4">
          <ActionButton user_type={user_type} onNewEventClick={onNewEventClick} onRequestEventClick={onRequestEventClick}
            className="h-[38px] px-4 text-sm" />
        </div>
      </div>

      {/* Mobile FAB */}
      <div className="fixed bottom-[92px] right-5 z-50 sm:hidden">
        <ActionButton user_type={user_type} onNewEventClick={onNewEventClick} onRequestEventClick={onRequestEventClick}
          className="w-14 h-14 shadow-lg active:scale-95" size={22} />
      </div>
    </>
  );
};

export default EventTabBar;