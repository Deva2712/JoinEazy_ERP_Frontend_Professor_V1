// src/pages/Hostel/HostelController.jsx
import React, { useState, useEffect } from "react";
import HostelUI from "./HostelUI";
// import { hostelAPI } from "../../services/api";
import { hostelService } from "@/api/services/hostel.service";

export default function HostelController() {
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);
    const [data,    setData]    = useState({
        roomAllotment:       null,
        leaveRequests:       [],
        outingRequests:      [],
        maintenanceRequests: [],
        complaints:          [],
        userProfile:         {},
        maintenanceDept:     {},
        antiRaggingDept:     {},
        studentAffairs:      {},
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);



            const res = await hostelService.getDashboard();
            if (!res.success) throw new Error(res.error);
            setData(res.data);
        } catch (err) {
            console.error("Hostel load error:", err);
            setError("Failed to load hostel data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        document.title = "Hostel – Joineazy";
    }, []);

    const handleSubmitLeaveRequest = async (formData) => {
        const res = await hostelService.submitLeaveRequest(formData);
        if (res.success) await fetchData(); // re-fetch instead of prepend
        return res.success;
    };

    const handleSubmitOutingRequest = async (formData) => {
        const res = await hostelService.submitOutingRequest(formData);
        if (res.success) await fetchData();
        return res.success;
    };

    const handleSubmitMaintenance = async (formData) => {
        const res = await hostelService.submitMaintenanceRequest(formData);
        if (res.success) await fetchData();
        return res.success;
    };

    const handleSubmitComplaint = async (formData) => {
        const res = await hostelService.submitComplaint(formData);
        if (res.success) await fetchData();
        return res.success;
    };

    return (
        <HostelUI
            loading={loading}
            error={error}
            onRetry={fetchData}
            {...data}
            onSubmitLeaveRequest={handleSubmitLeaveRequest}
            onSubmitOutingRequest={handleSubmitOutingRequest}
            onSubmitMaintenance={handleSubmitMaintenance}
            onSubmitComplaint={handleSubmitComplaint}
        />
    );
}