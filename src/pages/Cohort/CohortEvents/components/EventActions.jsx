import React from "react";
import { Share2, StickyNote, Edit, Trash2 } from "lucide-react";

export const EventActions = ({ eventData, onShareEvent, onGoingStatusChange, onRequestAction }) => {
  const [userGoingStatus, setUserGoingStatus] = React.useState(eventData?.userGoingStatus || null);
  const [showLocationInput, setShowLocationInput] = React.useState(false);
  const [locationInput, setLocationInput] = React.useState("");

  return (
    <div className="px-5">
      {/* Going Status Buttons */}
      {!eventData.isEditable && eventData.status === "confirmed" && (
        <div className="flex gap-2 mb-4">
          {["Going", "Not Going", "Don't Know"].map((opt) => (
            <button key={opt}
              onClick={() => { onGoingStatusChange(opt); setUserGoingStatus(opt); }}
              className={`px-3.5 py-1.5 text-sm rounded-full font-medium border transition-colors ${
                userGoingStatus === opt ? "bg-[#1E61F0] text-white border-none" : "bg-white text-black border-[#52586633]"
              }`}
            >{opt}</button>
          ))}
        </div>
      )}

      {/* Accept / Decline for requested */}
      {eventData.type === "requested" && eventData.status !== "confirmed" && (
        <div className="mb-4">
          <div className="flex gap-3 mb-3">
            <button onClick={() => setShowLocationInput(true)}
              className="px-4 py-2 text-white text-sm font-medium rounded-lg bg-[#1E61F0]">Accept</button>
            <button onClick={() => onRequestAction("decline")}
              className="px-4 py-2 text-white text-sm font-medium rounded-lg bg-red-500">Decline</button>
          </div>
          {showLocationInput && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">Confirm Event Location</h4>
              <input type="text" value={locationInput} onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Enter event location..."
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3" />
              <div className="flex gap-3">
                <button onClick={() => { if (locationInput.trim()) { onRequestAction("accept", locationInput.trim()); setShowLocationInput(false); setLocationInput(""); } }}
                  disabled={!locationInput.trim()}
                  className="px-4 py-2 text-white text-sm font-medium rounded-lg bg-[#1E61F0] disabled:opacity-50">Confirm</button>
                <button onClick={() => { setShowLocationInput(false); setLocationInput(""); }}
                  className="px-4 py-2 text-gray-600 text-sm font-medium rounded-lg border border-gray-300">Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Share / Notes / Edit / Delete bar */}
      <div className="flex gap-4 border-t border-b border-[#52586633] py-4">
        <button onClick={onShareEvent} className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Share2 size={16} /> Share
        </button>
        <button className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <StickyNote size={16} /> Tag to Note
        </button>
        {eventData.isEditable && (
          <>
            <button className="ml-auto flex items-center gap-2 text-sm font-medium text-gray-700">
              <Edit size={16} /> Edit
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-red-600">
              <Trash2 size={16} /> Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};