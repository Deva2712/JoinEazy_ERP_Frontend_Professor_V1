import { Calendar, MapPin, Users, ListCheck } from "lucide-react";

export const EventHeader = ({ eventData }) => {
  const formatDate = (d) => new Date(d).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  const statusColor = { confirmed: "bg-green-500", pending: "bg-yellow-500", cancelled: "bg-red-500" };
  const typeLabel = { upcoming: "bg-green-100 text-green-800", past: "bg-purple-100 text-purple-800", requested: "bg-red-100 text-red-800" };

  const statusText = eventData.type === "requested"
    ? eventData.status === "confirmed" ? "Requested & Confirmed" : "Requested"
    : eventData.status.charAt(0).toUpperCase() + eventData.status.slice(1);

  return (
    <div className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${statusColor[eventData.status] || "bg-gray-500"}`} />
        <span className="text-[15px] font-medium text-gray-700">{statusText}</span>
      </div>

      <h1 className="text-xl font-semibold text-black mb-3">{eventData.title}</h1>
      <p className="text-gray-800 text-base mb-5">{eventData.description}</p>

      {/* Host */}
      <div className="mb-7">
        {[{ label: "Hosted by", person: eventData.organizer },
          ...(eventData.type === "requested" && eventData.requester
            ? [{ label: "Requested by", person: eventData.requester }] : [])
        ].map(({ label, person }) => (
          <div key={label} className="mb-4 last:mb-0">
            <h3 className="text-sm font-semibold text-gray-800 mb-2.5">{label}</h3>
            <div className="flex items-center gap-3">
              <img src={person.avatar} alt={person.name} className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-medium text-black text-[15px]">{person.name}</p>
                <p className="text-gray-700 text-sm line-clamp-1">{person.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Meta Info */}
      <div className="space-y-2 mb-2">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-black" />
          <p className="text-[15px] text-black">
            {formatDate(eventData.date)} • {eventData.startTime} – {eventData.endTime}
          </p>
        </div>
        {!(eventData.type === "requested" && eventData.status !== "confirmed") && (
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-black" />
            <span className="text-[15px] text-black">{eventData.location}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Users size={18} className="text-black" />
          <span className="text-[15px] text-black">{eventData.participants}</span>
        </div>
        {eventData.goingStats && (
          <div className="flex items-center gap-2">
            <ListCheck size={18} className="text-black" />
            <span className="text-[15px] text-black">
              {eventData.goingStats.going} Going • {eventData.goingStats.notGoing} Not Going
            </span>
          </div>
        )}
      </div>
    </div>
  );
};