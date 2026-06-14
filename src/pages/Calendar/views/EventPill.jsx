import React from "react";
import { EVENT_TYPES } from "../constants/calendar.constants";

const EventPill = ({ event }) => {
    const cfg = EVENT_TYPES[event.type] ?? EVENT_TYPES.personal;

    return (
        <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md truncate border ${cfg.light}`}>
            {event.title}
        </div>
    );
};

export default EventPill;