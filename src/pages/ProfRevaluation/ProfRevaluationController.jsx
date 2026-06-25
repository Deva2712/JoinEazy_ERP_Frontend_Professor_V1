// src/pages/ProfRevaluation/ProfRevaluationController.jsx

import React, { useState, useEffect } from "react";
import ProfRevaluationUI from "./ProfRevaluationUI";
import { profRevaluationService } from "../../api/services/ProfessorRevaluation.service";

const ProfRevaluationController = () => {
    const [loading,          setLoading]          = useState(true);
    const [error,            setError]            = useState(null);
    const [pendingRequests,  setPendingRequests]  = useState([]);
    const [resolvedRequests, setResolvedRequests] = useState([]);
    const [stats,            setStats]            = useState({});
    const [myCourses,        setMyCourses]        = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await profRevaluationService.getOverview();

            if (!response.success) {
                throw new Error(response.error || "Failed to load revaluation data");
            }

            // Backend returns: { success, overview, requests: [...] }
            // requests already have normalized fields (studentName, subjectName, etc.)
            const allRequests = response.requests ?? response.data?.requests ?? [];
            const overview    = response.overview  ?? response.data?.overview ?? {};

            // Backend already normalizes status to Pending/UnderReview/Approved/Rejected
            const pending  = allRequests.filter(r => r.status === "Pending");
            const inReview = allRequests.filter(r => r.status === "UnderReview");
            const resolved = allRequests.filter(r => ["Approved", "Rejected"].includes(r.status));

            setPendingRequests([...pending, ...inReview]);
            setResolvedRequests(resolved);
            setStats({
                total:       overview.total       ?? allRequests.length,
                pending:     overview.pending      ?? pending.length,
                underReview: overview.under_review ?? inReview.length,
                resolved:    overview.resolved     ?? resolved.length,
                approved:    allRequests.filter(r => r.status === "Approved").length,
                rejected:    allRequests.filter(r => r.status === "Rejected").length,
            });
            setMyCourses([]);
        } catch (err) {
            console.error("Prof Revaluation Load Error:", err);
            setError(err.message || "Failed to load revaluation data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        document.title = "Revaluation – Joineazy";
    }, []);

    // ── Accept (move to UnderReview) ──────────────────────────────────────────
    const handleAccept = async (requestId) => {
        try {
            const response = await profRevaluationService.acceptRequest(requestId);
            if (response.success) {
                setPendingRequests((prev) =>
                    prev.map((r) =>
                        r.id === requestId ? { ...r, status: "UnderReview", updatedAt: new Date().toISOString() } : r
                    )
                );
                setStats((prev) => ({
                    ...prev,
                    pending:     Math.max(0, (prev.pending     ?? 0) - 1),
                    underReview: (prev.underReview ?? 0) + 1,
                }));
            }
        } catch (err) {
            console.error("Accept Error:", err);
        }
    };

    // ── Upload result (Approve) ───────────────────────────────────────────────
    const handleUploadResult = async (requestId, resultData) => {
        try {
            const response = await profRevaluationService.uploadResult(requestId, resultData);
            if (response.success) {
                const updated = response.data;
                setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));
                setResolvedRequests((prev) => [updated, ...prev]);
                setStats((prev) => ({
                    ...prev,
                    underReview: Math.max(0, (prev.underReview ?? 0) - 1),
                    approved:    (prev.approved ?? 0) + 1,
                }));
            }
        } catch (err) {
            console.error("Upload Result Error:", err);
        }
    };

    // ── Reject ────────────────────────────────────────────────────────────────
    const handleReject = async (requestId, reason) => {
        try {
            const response = await profRevaluationService.rejectRequest(requestId, reason);
            if (response.success) {
                const updated = response.data;
                setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));
                setResolvedRequests((prev) => [updated, ...prev]);
                setStats((prev) => ({
                    ...prev,
                    pending:     Math.max(0, (prev.pending     ?? 0) - 1),
                    underReview: Math.max(0, (prev.underReview ?? 0) - 1),
                    rejected:    (prev.rejected ?? 0) + 1,
                }));
            }
        } catch (err) {
            console.error("Reject Error:", err);
        }
    };

    return (
        <ProfRevaluationUI
            loading={loading}
            error={error}
            onRetry={fetchData}
            pendingRequests={pendingRequests}
            resolvedRequests={resolvedRequests}
            stats={stats}
            myCourses={myCourses}
            onAccept={handleAccept}
            onUploadResult={handleUploadResult}
            onReject={handleReject}
        />
    );
};

export default ProfRevaluationController;