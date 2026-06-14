// src/pages/Registrar/RegistrarController.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RegistrarUI from "./RegistrarUI";
import { registrarService } from "@/api/services/registrar.service";
import { lorService } from "@/api/services/Lor.service";

const RegistrarController = () => {
    const { tab } = useParams();

    const [loading, setLoading]                     = useState(true);
    const [error, setError]                         = useState(null);
    const [documentRequests, setDocumentRequests]   = useState([]);
    const [adminSubmittedDocs, setAdminSubmittedDocs] = useState([]);
    const [lorRequests, setLorRequests]             = useState([]);
    const userRole = localStorage.getItem("userRole") || "student";

    // ── Data fetch ───────────────────────────────────────────────────────────
    const fetchData = async () => {
        try {
            setLoading(true); setError(null);

            const res = await registrarService.getOverview();
            if (!res.success) throw new Error(res.error || "Failed to load");
            setAdminSubmittedDocs(res.data.adminSubmittedDocs ?? []);
            setDocumentRequests(res.data.documentRequests ?? []);

            // LoR requests — professor gets full inbox, student gets their own
            const lorRes = await lorService.getLorRequests();
            if (lorRes.success) setLorRequests(lorRes.data ?? []);
        } catch (err) {
            console.error("Registrar Load Error:", err);
            setError("Failed to load registrar data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); document.title = "Registrar Office – Joineazy"; }, []);

    // ── Document handlers ────────────────────────────────────────────────────
    const handleRequestDocument = async (data, lorFile) => {
        if (lorFile) data.supportingDocFileName = lorFile.name;
        const res = await registrarService.createRequest(data);
        if (res.success) await fetchData();
        else console.error("Request creation failed:", res.error);
    };

    const handleCancelRequest = async (requestId) => {
        const res = await registrarService.cancelRequest(requestId);
        if (res.success) await fetchData();
    };

    // ── LoR handlers (professor side) ────────────────────────────────────────
    const handleLorApprove = async (requestId, remarks) => {
        const res = await lorService.approveRequest(requestId, remarks);
        if (res.success) {
            setLorRequests(prev => prev.map(r =>
                r.id === requestId ? { ...r, status: "Approved", professorRemarks: remarks } : r
            ));
        }
    };

    const handleLorReject = async (requestId, remarks) => {
        const res = await lorService.rejectRequest(requestId, remarks);
        if (res.success) {
            setLorRequests(prev => prev.map(r =>
                r.id === requestId ? { ...r, status: "Rejected", professorRemarks: remarks } : r
            ));
        }
    };

    const handleLorSubmit = async (requestId, lorFile, remarks) => {
        const res = await lorService.submitLor(requestId, lorFile, remarks);
        if (res.success) {
            const url = res.data?.lorFileUrl || lorFile.name;
            setLorRequests(prev => prev.map(r =>
                r.id === requestId ? { ...r, status: "Submitted", lorFileUrl: url, professorRemarks: remarks } : r
            ));
            // Also sync back into documentRequests so registrar sees it
            setDocumentRequests(prev => prev.map(r =>
                r.id === requestId ? { ...r, status: "Completed", lorFileUrl: url } : r
            ));
        }
    };

    // ── Schedule meeting handler (both roles) ────────────────────────────────
    const handleScheduleMeeting = (meetingData) => {
        // Persist to outgoing meeting requests via scheduleService if needed.
        // For now we just log; plug into scheduleService.createOutgoingRequest if desired.
        console.log("LoR meeting scheduled:", meetingData);
    };

    return (
        <RegistrarUI
            loading={loading} error={error} onRetry={fetchData}
            activeTabOverride={tab}
            documentRequests={documentRequests}
            adminSubmittedDocs={adminSubmittedDocs}
            onRequestDocument={handleRequestDocument}
            onCancelRequest={handleCancelRequest}
            lorRequests={lorRequests}
            userRole={userRole}
            onLorApprove={handleLorApprove}
            onLorReject={handleLorReject}
            onLorSubmit={handleLorSubmit}
            onScheduleMeeting={handleScheduleMeeting}
        />
    );
};

export default RegistrarController;