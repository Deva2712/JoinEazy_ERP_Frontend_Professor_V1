// import { useEffect, useState } from "react";
// import { cohortService } from "../../../../api/services/cohort.service";

// const dummyEvents = {
//   Upcoming: [],
//   Past: [],
//   Requested: [],
// };

// const useEvents = (cohortId) => {
//   // States
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [eventsData, setEventsData] = useState({});
//   const [activeTab, setActiveTab] = useState("Upcoming");

//   // Fetch Events
//   const fetchEventsData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await cohortService.getEvents(cohortId);

//       if (!response.success) {
//         throw new Error(response.error || "Failed to fetch events");
//       }

//       setEventsData(response.data);
//     } catch (err) {
//       console.error("Error fetching events:", err);

//       setError(err.message || "Failed to load events");

//       setEventsData(dummyEvents);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (cohortId) {
//       fetchEventsData();
//     }
//   }, [cohortId]);

//   // Events
//   const events =
//     loading
//       ? {}
//       : Object.keys(eventsData).length > 0
//       ? eventsData
//       : dummyEvents;

//   // Filtered Events
//   const filteredEvents =
//     activeTab === "Calendar view"
//       ? [
//           ...(events.Upcoming || []),
//           ...(events.Past || []),
//           ...(events.Requested || []),
//         ]
//       : events[activeTab] || [];

//   return {
//     loading,
//     error,
//     activeTab,
//     filteredEvents,

//     handleRetry: fetchEventsData,

//     handleUpcomingClick: () =>
//       setActiveTab("Upcoming"),

//     handlePastClick: () =>
//       setActiveTab("Past"),

//     handleRequestedClick: () =>
//       setActiveTab("Requested"),

//     handleCalendarViewClick: () =>
//       setActiveTab("Calendar view"),
//   };
// };

// export default useEvents;
import { useEffect, useState } from "react";
import { cohortService } from "../../../../api/services/cohort.service";

const dummyEvents = {
  Upcoming: [],
  Past: [],
  Requested: [],
};

const useEvents = (cohortId) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventsData, setEventsData] = useState({});
  const [activeTab, setActiveTab] = useState("Upcoming");

  const fetchEventsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await cohortService.getEvents(cohortId);

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch events");
      }

      setEventsData(response.data);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.message || "Failed to load events");
      setEventsData(dummyEvents);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cohortId) {
      fetchEventsData();
    }
  }, [cohortId]);

  const events =
    loading
      ? {}
      : Object.keys(eventsData).length > 0
      ? eventsData
      : dummyEvents;

  const filteredEvents =
    activeTab === "Calendar view"
      ? [
          ...(events.Upcoming || []),
          ...(events.Past || []),
          ...(events.Requested || []),
        ]
      : events[activeTab] || [];

  // NEW: past events always available for history modal
  const pastEvents = events.Past || [];

  return {
    loading,
    error,
    activeTab,
    filteredEvents,
    pastEvents,       // ← NEW export

    handleRetry: fetchEventsData,

    handleUpcomingClick: () => setActiveTab("Upcoming"),
    handlePastClick: () => setActiveTab("Past"),
    handleRequestedClick: () => setActiveTab("Requested"),
    handleCalendarViewClick: () => setActiveTab("Calendar view"),
  };
};

export default useEvents;