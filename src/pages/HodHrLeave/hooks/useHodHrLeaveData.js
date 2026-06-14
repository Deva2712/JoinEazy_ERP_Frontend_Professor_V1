// src/pages/HodHrLeave/hooks/useHodHrLeaveData.js
import { useState, useEffect } from "react";
import { leaveService } from "@/api/services/leave.service";

/**
 * Hook that fetches ALL leave applications for HoD/HR review.
 * Reuses the same /leaves/applications endpoint as professor view
 * (backend should return all applications when role = hod/hr).
 */
export default function useHodHrLeaveData(role) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
    document.title = `${role === "hod" ? "HoD" : "HR"} — Leave Approvals`;
  }, [role]);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await leaveService.getApplications();
      const data = response.data || response;

      if (data) {
        const apps = (data.applications || [])
          .map((app) => ({
            ...app,
            leaveApproval: app.leaveApproval || {
              HoD: { status: "Pending", remark: null },
              HR:  { status: "Pending", remark: null },
            },
          }))
          .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
        setApplications(apps);
      }
    } catch {
      setError("Failed to load leave applications.");
    } finally {
      setLoading(false);
    }
  };

  return { applications, loading, error, fetchApplications };
}