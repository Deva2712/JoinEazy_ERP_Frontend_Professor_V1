
// export default CohortEventsDetailsUI;


import React from "react";
import { X } from "lucide-react";
import { EventHeader } from "../CohortEvents/components/EventHeader";
import { EventActions } from "../CohortEvents/components/EventActions";
import { EventComments } from "../CohortEvents/components/EventComments";

const CohortEventsDetailsUI = ({
  isOpen, onClose, eventData, loading,
  onShareEvent, onGoingStatusChange, onAddComment, onCommentDelete, onRequestAction, commentsData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 sm:p-4 overflow-y-auto">
      <div className="bg-white sm:rounded-2xl w-full sm:max-w-[35rem] h-[100vh] sm:h-auto sm:max-h-[90vh] flex flex-col my-auto sm:border border-[#52586633]">
        <div className="flex items-center justify-between p-5 border-b border-[#52586633]">
          <h2 className="text-lg sm:text-xl font-semibold text-black">
            {loading ? "Loading..." : "Event Details"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-12 text-lg text-gray-600">Loading event details...</div>
          ) : eventData ? (
            <>
              <EventHeader eventData={eventData} />
              <EventActions eventData={eventData} onShareEvent={onShareEvent}
                onGoingStatusChange={onGoingStatusChange} onRequestAction={onRequestAction} />
              <EventComments commentsData={commentsData} onAddComment={onAddComment} onCommentDelete={onCommentDelete} />
            </>
          ) : (
            <div className="flex items-center justify-center p-12 text-lg text-gray-600">Event not found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CohortEventsDetailsUI;