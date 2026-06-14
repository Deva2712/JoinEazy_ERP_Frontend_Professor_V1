// src/pages/Revaluation/RevaluationController.jsx

import React, { useState, useEffect } from "react";
import RevaluationUI from "./RevaluationUI";
import { revaluationService } from "../../api/services/revaluation.service";

const RevaluationController = () => {
    const [loading,          setLoading]          = useState(true);
    const [error,            setError]            = useState(null);
    const [eligibleSubjects, setEligibleSubjects] = useState([]);
    const [requests,         setRequests]         = useState([]);
    const [stats,            setStats]            = useState({});

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await revaluationService.getOverview();

            if (!response.success) {
                throw new Error(response.error || "Failed to load revaluation data");
            }

            const { eligibleSubjects, requests, stats } = response.data;

            setEligibleSubjects(eligibleSubjects ?? []);
            setRequests(requests                ?? []);
            setStats(stats                      ?? {});
        } catch (err) {
            console.error("Revaluation Load Error:", err);
            setError(err.message || "Failed to load revaluation data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        document.title = "Revaluation – Joineazy";
    }, []);

    const handleSubmitRequest = async (data) => {
        try {
            const response = await revaluationService.submitRequest(data);
            if (response.success) {
                setRequests((prev) => [response.data, ...prev]);
                setStats((prev) => ({
                    ...prev,
                    totalRequests: (prev.totalRequests ?? 0) + 1,
                    pending:       (prev.pending       ?? 0) + 1,
                }));
            }
        } catch (err) {
            console.error("Revaluation Submit Error:", err);
        }
    };

    const handleCancelRequest = async (requestId) => {
        try {
            const response = await revaluationService.cancelRequest(requestId);
            if (response.success) {
                setRequests((prev) => prev.filter((r) => r.id !== requestId));
                setStats((prev) => ({
                    ...prev,
                    totalRequests: Math.max(0, (prev.totalRequests ?? 0) - 1),
                    pending:       Math.max(0, (prev.pending       ?? 0) - 1),
                }));
            }
        } catch (err) {
            console.error("Revaluation Cancel Error:", err);
        }
    };

    return (
        <RevaluationUI
            loading={loading}
            error={error}
            onRetry={fetchData}
            eligibleSubjects={eligibleSubjects}
            requests={requests}
            stats={stats}
            onSubmitRequest={handleSubmitRequest}
            onCancelRequest={handleCancelRequest}
        />
    );
};

export default RevaluationController;
