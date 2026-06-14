// src/pages/HodHrLeave/HodHrLeaveController.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { leaveService } from "../../api/services/leave.service";
import useHodHrLeaveData from "./hooks/useHodHrLeaveData";
import HodHrLeaveUI from "./HodHrLeaveUI";

/**
 * Controller for HoD and HR leave approval dashboards.
 *
 * Route params:
 *   :rolePath  — "hod" or "hr"  (from /hod-leave-dashboard, /hr-leave-dashboard)
 *   :tab       — optional tab key (pending | approved | rejected | all)
 *
 * The `role` prop ("HoD" | "HR") is passed in from App.jsx.
 */
const HodHrLeaveController = ({ role }) => {
  const { tab } = useParams();
  const navigate = useNavigate();

  // role prop is "HoD" | "HR"; pass lowercase version to hook for doc title
  const { applications, loading, error, fetchApplications } = useHodHrLeaveData(
    role === "HoD" ? "hod" : "hr"
  );

  const activeTab = tab || "pending";

  // Optimistic update helper — mutates the local array so UI responds immediately
  const updateLocal = (applications, id, role, status, remark) =>
    applications.map((app) =>
      app.id === id
        ? {
            ...app,
            leaveApproval: {
              ...app.leaveApproval,
              [role]: { status, remark: remark || null },
            },
            // If both sides have acted, derive the overall status
            status: deriveOverallStatus({
              ...app.leaveApproval,
              [role]: { status, remark: remark || null },
            }),
          }
        : app
    );

  /** Overall leave status = Approved only when BOTH HoD and HR approve */
  const deriveOverallStatus = (leaveApproval) => {
    const hod = leaveApproval?.HoD?.status;
    const hr  = leaveApproval?.HR?.status;
    if (hod === "Approved" && hr === "Approved") return "Approved";
    if (hod === "Rejected" || hr === "Rejected")  return "Rejected";
    return "Pending";
  };

  const handleApprove = async (id, actingRole, remark) => {
    try {
      await leaveService.updateApproval(id, actingRole, "Approved", remark || null);
      // Refresh to sync with backend
      await fetchApplications();
    } catch (err) {
      console.error("Approve error:", err);
    }
  };

  const handleReject = async (id, actingRole, remark) => {
    try {
      await leaveService.updateApproval(id, actingRole, "Rejected", remark);
      await fetchApplications();
    } catch (err) {
      console.error("Reject error:", err);
    }
  };

  const handleTabChange = (newTab) => {
    const base = role === "HoD" ? "/hod-leave-dashboard" : "/hr-leave-dashboard";
    navigate(`${base}/${newTab}`);
  };

  return (
    <HodHrLeaveUI
      applications={applications}
      loading={loading}
      error={error}
      role={role}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onRefresh={fetchApplications}
      onApprove={handleApprove}
      onReject={handleReject}
    />
  );
};

export default HodHrLeaveController;