import { useState } from "react";
import { Calendar, Clock, MapPin, Video, User, ChevronLeft, ChevronRight } from "lucide-react";

const isSameDay = (a, b) =>
  a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

export const MeetingCalendar = ({ meetings }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return [
      ...Array(firstDay).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
    ];
  };

  const getMeetingsForDate = (date) =>
    meetings.filter((m) => {
      const d = m.dateTime || m.requestedTime;
      return d && isSameDay(new Date(d), date);
    });

  const selectedDateMeetings = getMeetingsForDate(selectedDate);
  const calendarDays = generateCalendarDays();
  const today = new Date();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      {/* Calendar */}
      <div className="lg:col-span-1">
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h3>
            <div className="flex gap-1">
              {[-1, 1].map((dir) => (
                <button key={dir} onClick={() => setCurrentMonth((p) => { const d = new Date(p); d.setMonth(d.getMonth() + dir); return d; })}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  {dir === -1 ? <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {["S","M","T","W","T","F","S"].map((d, i) => (
              <div key={i} className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, i) => {
              const hasMeetings = date && getMeetingsForDate(date).length > 0;
              const isSelected = date && isSameDay(date, selectedDate);
              const isTodayDate = date && isSameDay(date, today);
              return (
                <button key={i} onClick={() => date && setSelectedDate(date)} disabled={!date}
                  className={`aspect-square flex items-center justify-center rounded-md text-sm font-medium transition-all
                    ${!date ? "invisible" : ""}
                    ${isSelected ? "bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-gray-900" : ""}
                    ${hasMeetings && !isSelected ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 hover:bg-blue-200" : ""}
                    ${!hasMeetings && !isSelected && date ? "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700" : ""}
                    ${isTodayDate && !isSelected ? "ring-2 ring-blue-400" : ""}`}>
                  {date?.getDate()}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 mt-4 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-blue-100 flex items-center justify-center">
                <span className="text-blue-700 font-medium text-xs">12</span>
              </div>
              <span>Has meetings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center">
                <span className="text-white font-medium text-xs">12</span>
              </div>
              <span>Selected date</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Date Meetings */}
      <div className="lg:col-span-2 flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {selectedDateMeetings.length} {selectedDateMeetings.length === 1 ? "meeting" : "meetings"} scheduled
          </p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3">
          {selectedDateMeetings.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">No meetings scheduled</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Select a date with meetings to view details</p>
            </div>
          ) : (
            selectedDateMeetings.map((meeting) => {
              const dt = new Date(meeting.dateTime || meeting.requestedTime);
              return (
                <div key={meeting.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800 hover:shadow-md transition-all">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white">{meeting.professorName}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{meeting.reason}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Confirmed</span>
                  </div>
                  <div className="space-y-2 pl-13">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span>{dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      {meeting.meetingType === "online" ? (
                        <>
                          <Video className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                          <div className="flex flex-col gap-1">
                            <span className="text-gray-500">Online Meeting</span>
                            {meeting.meetingLink && <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{meeting.meetingLink}</a>}
                          </div>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                          <div className="flex flex-col gap-0.5">
                            <span className="text-gray-500">Venue</span>
                            <span>{meeting.location || "TBA"}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};