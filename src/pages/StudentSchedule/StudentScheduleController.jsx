import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { studentScheduleAPI } from "../../services/api";
import { studentScheduleService } from "@/api/services/studentSchedule.service";
import StudentScheduleUI from "./StudentScheduleUI";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function parseTime(timeStr) {
    if (!timeStr) return 0;
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
}

const StudentScheduleController = () => {
    const { tab } = useParams();
    const navigate = useNavigate();

    const activeTab = tab || "today";
    const todayName = DAYS[new Date().getDay()];
    const todayStr = new Date().toISOString().split("T")[0];

    const [loading, setLoading] = useState(true);
    const [timetable, setTimetable] = useState([]);
    const [allTasks, setAllTasks] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);

    useEffect(() => {
        document.title = "My Schedule";
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [timetableRes, tasksRes, sessionsRes] = await Promise.all([
                studentScheduleService.getTimetable(),
                studentScheduleService.getTasks(todayStr),
                studentScheduleService.getSessions(),
            ]);
            if (timetableRes.success) setTimetable(Array.isArray(timetableRes.data) ? timetableRes.data : []);
            if (tasksRes.success) setAllTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
            if (sessionsRes.success) setSessions(Array.isArray(sessionsRes.data) ? sessionsRes.data : []);
        } catch (err) {
            console.error("Failed to fetch schedule data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (t) => {
        navigate(`/student-schedule/${t}`);
    };

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleOpenImportModal = () => setShowImportModal(true);
    const handleCloseImportModal = () => setShowImportModal(false);

    const handleImportTimetable = async (importedData) => {
        const res = await studentScheduleService.importTimetable(importedData);
        if (res.success) {
            setTimetable(Array.isArray(res.data) ? res.data : []);
            handleCloseImportModal();
        }
    };

    const handleAddTask = async (taskData) => {
        const payload = { ...taskData, date: todayStr };
        const res = await studentScheduleService.createTask(payload);
        if (res.success) {
            setAllTasks((prev) => [...prev, res.data]);
        }
        handleCloseModal();
    };

    const handleToggleTask = async (taskId) => {
        const res = await studentScheduleService.toggleTask(taskId);
        if (res.success) {
            setAllTasks((prev) =>
                prev.map((t) => (t.id === taskId ? res.data : t))
            );
        }
    };

    const handleDeleteTask = async (taskId) => {
        const res = await studentScheduleService.deleteTask(taskId);
        if (res.success) {
            setAllTasks((prev) => prev.filter((t) => t.id !== taskId));
        }
    };

    const todaysClasses = timetable
        .filter((cls) => cls.day === todayName)
        .sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime));

    const todaysTasks = allTasks
        .filter((t) => t.date === todayStr)
        .sort((a, b) => parseTime(a.time) - parseTime(b.time));

    return (
        <StudentScheduleUI
            loading={loading}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            todaysClasses={todaysClasses}
            todaysTasks={todaysTasks}
            timetable={timetable}
            sessions={sessions}
            showModal={showModal}
            onOpenModal={handleOpenModal}
            onCloseModal={handleCloseModal}
            showImportModal={showImportModal}
            onOpenImportModal={handleOpenImportModal}
            onCloseImportModal={handleCloseImportModal}
            onImportTimetable={handleImportTimetable}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            todayName={todayName}
        />
    );
};

export default StudentScheduleController;