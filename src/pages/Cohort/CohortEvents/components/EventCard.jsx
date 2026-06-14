import { Clock, MapPin, Share2 } from "lucide-react";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: date.getDate(),
  };
};

const getDateColor = (type) => {
  if (type === "past") return { text: "#863ced", background: "#f8f3ff" };
  return { text: "#159339", background: "#ebf9ef" };
};

const EventCard = ({ event, isShared, onEventClick, onShareClick }) => {
  const { month, day } = formatDate(event.date);
  const colors = getDateColor(event.type);

  return (
    <div
      className="bg-white border-t border-b sm:border border-[#D3D6DA] sm:rounded-[18px] p-4 sm:p-5 flex items-start gap-3.5 sm:gap-4 hover:cursor-pointer transition-shadow"
      onClick={() => onEventClick(event.id)}
    >
      <div
        className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 mt-0.5 sm:mt-1 flex flex-col items-center justify-center rounded-lg"
        style={{ backgroundColor: colors.background, color: colors.text }}
      >
        <div className="text-xs sm:text-[13px] font-semibold mt-[1px]">{month}</div>
        <div className="text-base sm:text-[17px] text-black font-semibold">{day}</div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-black text-[15px] sm:text-base line-clamp-1 mb-1 sm:mb-1.5">
          {event.title}
        </h3>
        <p className="text-sm text-gray-800 line-clamp-1 mb-1.5 sm:mb-2.5">{event.description}</p>
        <div className="flex items-center gap-4 text-gray-600 font-medium">
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span className="text-xs sm:text-[13px] whitespace-nowrap">
              {event.startTime} - {event.endTime} {event.timezone}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={14} />
            <span className="text-xs text-[13px] line-clamp-1">{event.location}</span>
          </div>
        </div>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onShareClick(event.id); }}
        className="hidden sm:flex flex-shrink-0 my-auto p-2 sm:p-2.5 bg-white border border-[#D3D6DA] rounded-full"
      >
        <Share2 size={16} className={isShared ? "text-green-600" : "text-gray-600"} />
      </button>
    </div>
  );
};

export default EventCard;