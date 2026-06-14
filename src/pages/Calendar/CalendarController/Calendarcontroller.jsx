import React, { useState, useEffect, useMemo } from "react";
// import { calendarAPI } from "../../services/api";
import { calendarService } from "@/api/services/calendar.service";
import CalendarUI from "../ui/Calendarui";
import {
    buildCalendarGrid,
    getNextMonthCursor,
    getPrevMonthCursor,
    getUpcomingEvents,
    toDateKey,
    isSameDay,
    downloadICSFile,
} from "../utils/calendar.utils";

const CalendarController = () => {
    const today = useMemo(() => new Date(), []);

    const [loading, setLoading]             = useState(true);
    const [error, setError]                 = useState(null);
    const [events, setEvents]               = useState([]);
    const [filter, setFilter]               = useState("all");
    const [cursor, setCursor]               = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedDate, setSelectedDate]   = useState(today);
    const [showAddModal, setShowAddModal]   = useState(false);
    const [addModalDate, setAddModalDate]   = useState(null);
    const [showImportModal, setShowImportModal] = useState(false);

    useEffect(() => {
        document.title = "Calendar";
        fetchEvents();
    }, []);

    /* ── Data fetching ─────────────────────────────────────────── */
    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await calendarService.getEvents();
            if (res.success) setEvents(Array.isArray(res.data) ? res.data : []);
            else setError("Failed to load calendar data.");
        } catch (err) {
            console.error("Calendar load error:", err);
            setError("Failed to load calendar data.");
        } finally {
            setLoading(false);
        }
    };

    /* ── Derived / memoised values ─────────────────────────────── */
    const filteredEvents = useMemo(
        () => (filter === "all" ? events : events.filter((e) => e.type === filter)),
        [events, filter]
    );

    const grid = useMemo(() => buildCalendarGrid(cursor), [cursor]);

    const upcomingEvents = useMemo(
        () => getUpcomingEvents(filteredEvents, today, 6),
        [filteredEvents, today]
    );

    /* ── Navigation handlers ───────────────────────────────────── */
    const handlePrevMonth = () => setCursor((c) => getPrevMonthCursor(c));
    const handleNextMonth = () => setCursor((c) => getNextMonthCursor(c));
    const handleSelectDate = (date) => { if (date) setSelectedDate(date); };
    const handleFilterChange = (f) => setFilter(f);

    /* ── Modal handlers ────────────────────────────────────────── */
    const handleOpenAddModal = (date) => {
        setAddModalDate(date);
        setShowAddModal(true);
    };
    const handleCloseAddModal = () => {
        setShowAddModal(false);
        setAddModalDate(null);
    };

    /* ── Event CRUD ────────────────────────────────────────────── */
    const handleAddEvent = async (data) => {
        const res = await calendarService.createEvent(data);
        if (res.success) await fetchEvents();
        handleCloseAddModal();
    };

    const handleImportSchedule = (file) => {
        // TODO: parse file and bulk-insert events via API
        console.log("Import file received:", file.name);
        setShowImportModal(false);
    };

    const handleExportGoogleCalendar = () => downloadICSFile(events);

    /* ── Date helpers (passed to UI for cell rendering) ───────── */
    const getEventsForDate = (date) => {
        if (!date) return [];
        return filteredEvents.filter((e) => e.date === toDateKey(date));
    };

    const isToday    = (date) => isSameDay(date, today);
    const isSelected = (date) => isSameDay(date, selectedDate);

    return (
        <CalendarUI
            loading={loading}
            error={error}
            onRetry={fetchEvents}
            events={events}
            filteredEvents={filteredEvents}
            upcomingEvents={upcomingEvents}
            grid={grid}
            cursor={cursor}
            selectedDate={selectedDate}
            filter={filter}
            showAddModal={showAddModal}
            addModalDate={addModalDate}
            showImportModal={showImportModal}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onSelectDate={handleSelectDate}
            onFilterChange={handleFilterChange}
            onOpenAddModal={handleOpenAddModal}
            onCloseAddModal={handleCloseAddModal}
            onOpenImportModal={() => setShowImportModal(true)}
            onCloseImportModal={() => setShowImportModal(false)}
            onAddEvent={handleAddEvent}
            onImportSchedule={handleImportSchedule}
            onExportGoogleCalendar={handleExportGoogleCalendar}
            getEventsForDate={getEventsForDate}
            isToday={isToday}
            isSelected={isSelected}
        />
    );
};

export default CalendarController;