// src/pages/LeaveApplication/hooks/useLeaveData.js
import { useState, useEffect } from "react";
import { leaveService } from "@/api/services/leave.service";
import { userService } from "@/api/services/user.service";

export default function useLeaveData() {
  const [applications, setApplications] = useState([]);
  const [substitutionRequests, setSubstitutionRequests] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
    document.title = "Leave Applications";
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const [appResponse, userResponse] = await Promise.all([
        leaveService.getApplications(),
        userService.getDashboardOverview(),
      ]);

      const data = appResponse.data || appResponse;

      if (data) {
        const sortedApps = (data.applications || [])
          .map((app) => ({
            ...app,
            substitutionStatus: app.substitutionStatus || "Pending",
            leaveApproval: app.leaveApproval || {
              HoD: { status: "Pending", remark: null },
              HR:  { status: "Pending", remark: null },
            },
          }))
          .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

        setApplications(sortedApps);
        setSubstitutionRequests(data.substitutionRequests || []);
        setAdmins(data.managementContacts || []);
        setFaculties(data.faculties || []);

        if (userResponse.success) {
          setCourses(
            [...(userResponse.data.createdCohorts || []), ...(userResponse.data.joinedCohorts || [])]
              .map((cohort) => ({
                id:   cohort.id || cohort._id,
                name: cohort.cohort_name || cohort.name || "Untitled Course",
              }))
          );
        }
      }
    } catch {
      setError("Failed to fetch leaves");
    } finally {
      setLoading(false);
    }
  };

  return {
    applications, substitutionRequests, admins, faculties, courses,
    loading, setLoading, error,
    fetchApplications,
  };
}