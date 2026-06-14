// src/pages/Mentor/MentorController.jsx
import React, { useState, useEffect } from "react";
import MentorUI from "./MentorUI";
import{mentorService} from "@/api/services/mentor.service";

export default function MentorController() {
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);
    const [data,    setData]    = useState({
        mentor:          null,
        meetings:        [],
        feedbackHistory: [],
        meetingRequests: [],
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await mentorService.getDashboard();
            if (!res.success) throw new Error(res.error);
            setData(res.data);
        } catch (err) {
            console.error("Mentor load error:", err);
            setError("Failed to load mentor data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        document.title = "Mentor – Joineazy";
    }, []);

    const handleRequestMeeting = async (formData) => {
        const res = await mentorService.requestMeeting(formData);
        if (res.success) await fetchData();
        return res.success;
    };

    const handleSubmitFeedback = async (formData) => {
        const res = await mentorService.submitFeedback(formData);
        if (res.success) await fetchData();
        return res.success;
    };

    return (
        <MentorUI
            loading={loading}
            error={error}
            onRetry={fetchData}
            {...data}
            onRequestMeeting={handleRequestMeeting}
            onSubmitFeedback={handleSubmitFeedback}
        />
    );
}