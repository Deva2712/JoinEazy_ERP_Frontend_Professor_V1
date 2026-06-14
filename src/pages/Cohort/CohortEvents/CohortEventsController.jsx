// // export default CohortEventsController;

// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// import CohortEventsUI from "./CohortEventsUI";
// import CohortEventsDetailsController from "./CohortEventsDetailsController";
// import CohortEventsCreateController from "./CohortEventsCreateController";

// import useEvents from "./hooks/useEvents";

// const CohortEventsController = ({ cohortId, cohortData }) => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const user_type = 1;

//   // Events Hook
//   const {
//     loading,
//     error,
//     activeTab,
//     filteredEvents,

//     handleRetry,

//     handleUpcomingClick,
//     handlePastClick,
//     handleRequestedClick,
//     handleCalendarViewClick,
//   } = useEvents(cohortId);

//   // Share State
//   const [sharedEvents, setSharedEvents] = useState(new Set());

//   // Details Modal State
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//   const [selectedEventId, setSelectedEventId] = useState(null);

//   // Create/Edit Modal State
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [editEventId, setEditEventId] = useState(null);
//   const [isEditMode, setIsEditMode] = useState(false);

//   // Request Mode
//   const [isRequestMode, setIsRequestMode] = useState(false);

//   // Handle Event Details Route
//   useEffect(() => {
//     const pathParts = location.pathname.split("/");
//     const eventsIndex = pathParts.findIndex(
//       (part) => part === "events"
//     );

//     if (eventsIndex !== -1 && pathParts[eventsIndex + 1]) {
//       const eventIdFromUrl = pathParts[eventsIndex + 1];

//       if (
//         !isNaN(eventIdFromUrl) &&
//         eventIdFromUrl !== ""
//       ) {
//         setSelectedEventId(parseInt(eventIdFromUrl));
//         setIsDetailsModalOpen(true);
//       }
//     }
//   }, [location.pathname]);

//   // Handle Create/Edit Route
//   useEffect(() => {
//     const pathParts = location.pathname.split("/");
//     const eventsIndex = pathParts.findIndex(
//       (part) => part === "events"
//     );

//     if (eventsIndex !== -1) {
//       const nextPart = pathParts[eventsIndex + 1];

//       // /events/create
//       if (nextPart === "create") {
//         setIsCreateModalOpen(true);
//         setIsEditMode(false);
//         setEditEventId(null);
//       }

//       // /events/:id/edit
//       else if (
//         nextPart &&
//         !isNaN(nextPart) &&
//         pathParts[eventsIndex + 2] === "edit"
//       ) {
//         setIsCreateModalOpen(true);
//         setIsEditMode(true);
//         setEditEventId(parseInt(nextPart));
//       }

//       // Close
//       else {
//         setIsCreateModalOpen(false);
//         setIsRequestMode(false);
//         setIsEditMode(false);
//         setEditEventId(null);
//       }
//     }
//   }, [location.pathname]);

//   // New Event
//   const handleNewEventClick = () => {
//     setIsRequestMode(false);

//     const currentPath =
//       location.pathname.replace(/\/+$/, "");

//     navigate(`${currentPath}/create`);
//   };

//   // Request Event
//   const handleRequestEventClick = () => {
//     setIsRequestMode(true);

//     const currentPath =
//       location.pathname.replace(/\/+$/, "");

//     navigate(`${currentPath}/create`);
//   };

//   // Edit Event
//   const handleEditEvent = (eventId) => {
//     const currentPath =
//       location.pathname.replace(/\/+$/, "");

//     navigate(`${currentPath}/${eventId}/edit`);
//   };

//   // Close Create Modal
//   const handleCloseCreateModal = () => {
//     setIsCreateModalOpen(false);
//     setIsEditMode(false);
//     setEditEventId(null);
//     setIsRequestMode(false);

//     const pathParts = location.pathname.split("/");

//     const eventsIndex = pathParts.findIndex(
//       (part) => part === "events"
//     );

//     if (eventsIndex !== -1) {
//       const newPath = pathParts
//         .slice(0, eventsIndex + 1)
//         .join("/");

//       navigate(newPath);
//     }
//   };

//   // Bookmark
//   const handleBookmarkToggle = (eventId) => {
//     console.log("Bookmark toggled:", eventId);
//   };

//   // Share
//   const handleShareClick = async (eventId) => {
//     try {
//       const eventUrl =
//         `${window.location.origin}/events/${eventId}`;

//       await navigator.clipboard.writeText(eventUrl);

//       setSharedEvents(
//         (prev) => new Set([...prev, eventId])
//       );

//       setTimeout(() => {
//         setSharedEvents((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete(eventId);
//           return newSet;
//         });
//       }, 2000);
//     } catch (err) {
//       console.error("Copy failed:", err);
//     }
//   };

//   // Open Event Details
//   const handleEventClick = (eventId) => {
//     setSelectedEventId(eventId);
//     setIsDetailsModalOpen(true);

//     const currentPath = location.pathname;

//     const newPath = currentPath.endsWith("/")
//       ? `${currentPath}${eventId}`
//       : `${currentPath}/${eventId}`;

//     navigate(newPath, { replace: true });
//   };

//   // Close Event Details
//   const handleCloseDetailsModal = () => {
//     setIsDetailsModalOpen(false);
//     setSelectedEventId(null);

//     const pathParts = location.pathname.split("/");

//     const eventsIndex = pathParts.findIndex(
//       (part) => part === "events"
//     );

//     if (
//       eventsIndex !== -1 &&
//       pathParts[eventsIndex + 1] &&
//       !isNaN(pathParts[eventsIndex + 1])
//     ) {
//       const newPath = pathParts
//         .slice(0, eventsIndex + 1)
//         .join("/");

//       navigate(newPath, { replace: true });
//     }
//   };

//   return (
//     <>
//       <CohortEventsUI
//         user_type={user_type}
//         activeTab={activeTab}
//         events={filteredEvents}
//         sharedEvents={sharedEvents}
//         loading={loading}
//         error={error}
//         onRetry={handleRetry}
//         onUpcomingClick={handleUpcomingClick}
//         onPastClick={handlePastClick}
//         onRequestedClick={handleRequestedClick}
//         onCalendarViewClick={
//           handleCalendarViewClick
//         }
//         onNewEventClick={handleNewEventClick}
//         onRequestEventClick={
//           handleRequestEventClick
//         }
//         onBookmarkToggle={
//           handleBookmarkToggle
//         }
//         onShareClick={handleShareClick}
//         onEventClick={handleEventClick}
//         onEditEvent={handleEditEvent}
//       />

//       <CohortEventsDetailsController
//         isOpen={isDetailsModalOpen}
//         onClose={handleCloseDetailsModal}
//         eventId={selectedEventId}
//       />

//       <CohortEventsCreateController
//         isOpen={isCreateModalOpen}
//         onClose={handleCloseCreateModal}
//         cohortId={cohortId}
//         editEventId={editEventId}
//         cohortData={cohortData}
//         isRequestMode={isRequestMode}
//       />
//     </>
//   );
// };

// export default CohortEventsController;
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import CohortEventsUI from "./CohortEventsUI";
import CohortEventsDetailsController from "./CohortEventsDetailsController";
import CohortEventsCreateController from "./CohortEventsCreateController";

import useEvents from "./hooks/useEvents";

const CohortEventsController = ({ cohortId, cohortData }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const user_type = 1;

  // Events Hook
  const {
    loading,
    error,
    activeTab,
    filteredEvents,
    pastEvents,       // NEW: destructure pastEvents

    handleRetry,

    handleUpcomingClick,
    handlePastClick,
    handleRequestedClick,
    handleCalendarViewClick,
  } = useEvents(cohortId);

  // Share State
  const [sharedEvents, setSharedEvents] = useState(new Set());

  // Details Modal State
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  // Create/Edit Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Request Mode
  const [isRequestMode, setIsRequestMode] = useState(false);

  // Handle Event Details Route
  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const eventsIndex = pathParts.findIndex((part) => part === "events");

    if (eventsIndex !== -1 && pathParts[eventsIndex + 1]) {
      const eventIdFromUrl = pathParts[eventsIndex + 1];
      if (!isNaN(eventIdFromUrl) && eventIdFromUrl !== "") {
        setSelectedEventId(parseInt(eventIdFromUrl));
        setIsDetailsModalOpen(true);
      }
    }
  }, [location.pathname]);

  // Handle Create/Edit Route
  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const eventsIndex = pathParts.findIndex((part) => part === "events");

    if (eventsIndex !== -1) {
      const nextPart = pathParts[eventsIndex + 1];

      if (nextPart === "create") {
        setIsCreateModalOpen(true);
        setIsEditMode(false);
        setEditEventId(null);
      } else if (
        nextPart &&
        !isNaN(nextPart) &&
        pathParts[eventsIndex + 2] === "edit"
      ) {
        setIsCreateModalOpen(true);
        setIsEditMode(true);
        setEditEventId(parseInt(nextPart));
      } else {
        setIsCreateModalOpen(false);
        setIsRequestMode(false);
        setIsEditMode(false);
        setEditEventId(null);
      }
    }
  }, [location.pathname]);

  const handleNewEventClick = () => {
    setIsRequestMode(false);
    const currentPath = location.pathname.replace(/\/+$/, "");
    navigate(`${currentPath}/create`);
  };

  const handleRequestEventClick = () => {
    setIsRequestMode(true);
    const currentPath = location.pathname.replace(/\/+$/, "");
    navigate(`${currentPath}/create`);
  };

  const handleEditEvent = (eventId) => {
    const currentPath = location.pathname.replace(/\/+$/, "");
    navigate(`${currentPath}/${eventId}/edit`);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setIsEditMode(false);
    setEditEventId(null);
    setIsRequestMode(false);

    const pathParts = location.pathname.split("/");
    const eventsIndex = pathParts.findIndex((part) => part === "events");

    if (eventsIndex !== -1) {
      const newPath = pathParts.slice(0, eventsIndex + 1).join("/");
      navigate(newPath);
    }
  };

  const handleBookmarkToggle = (eventId) => {
    console.log("Bookmark toggled:", eventId);
  };

  const handleShareClick = async (eventId) => {
    try {
      const eventUrl = `${window.location.origin}/events/${eventId}`;
      await navigator.clipboard.writeText(eventUrl);

      setSharedEvents((prev) => new Set([...prev, eventId]));

      setTimeout(() => {
        setSharedEvents((prev) => {
          const newSet = new Set(prev);
          newSet.delete(eventId);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleEventClick = (eventId) => {
    setSelectedEventId(eventId);
    setIsDetailsModalOpen(true);

    const currentPath = location.pathname;
    const newPath = currentPath.endsWith("/")
      ? `${currentPath}${eventId}`
      : `${currentPath}/${eventId}`;

    navigate(newPath, { replace: true });
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedEventId(null);

    const pathParts = location.pathname.split("/");
    const eventsIndex = pathParts.findIndex((part) => part === "events");

    if (
      eventsIndex !== -1 &&
      pathParts[eventsIndex + 1] &&
      !isNaN(pathParts[eventsIndex + 1])
    ) {
      const newPath = pathParts.slice(0, eventsIndex + 1).join("/");
      navigate(newPath, { replace: true });
    }
  };

  return (
    <>
      <CohortEventsUI
        user_type={user_type}
        activeTab={activeTab}
        events={filteredEvents}
        pastEvents={pastEvents}   
        sharedEvents={sharedEvents}
        loading={loading}
        error={error}
        onRetry={handleRetry}
        onUpcomingClick={handleUpcomingClick}
        onPastClick={handlePastClick}
        onRequestedClick={handleRequestedClick}
        onCalendarViewClick={handleCalendarViewClick}
        onNewEventClick={handleNewEventClick}
        onRequestEventClick={handleRequestEventClick}
        onBookmarkToggle={handleBookmarkToggle}
        onShareClick={handleShareClick}
        onEventClick={handleEventClick}
        onEditEvent={handleEditEvent}
      />

      <CohortEventsDetailsController
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        eventId={selectedEventId}
      />

      <CohortEventsCreateController
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        cohortId={cohortId}
        editEventId={editEventId}
        cohortData={cohortData}
        isRequestMode={isRequestMode}
      />
    </>
  );
};

export default CohortEventsController;