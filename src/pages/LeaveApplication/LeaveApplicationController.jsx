
// src/pages/LeaveApplication/LeaveApplicationController.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { leaveService } from "../../api/services/leave.service";
import { useJobs } from "../../context/JobTrayContext";
import { useNotifications } from "../../context/NotificationContext";
import useLeaveData from "./hooks/Useleavedata";
import LeaveApplicationUI from "./LeaveApplicationUI";

const LeaveApplicationController = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { tab } = useParams();
  const navigate = useNavigate();
  const { refreshJobs } = useJobs();
  const { refreshNotifications } = useNotifications();

  const {
    applications, substitutionRequests, admins, faculties, courses,
    loading, setLoading, error, fetchApplications,
  } = useLeaveData();

  const activeTab = tab || "my-leaves";

  
const handleSubmit = async (formData) => {
  setLoading(true);
  try {
    const currentApp     = applications.find((a) => a.id === formData.id);
    const isResubmission = currentApp?.status === "Rejected";
    const isSubstitutionUpdate = currentApp?.substitutionStatus === "Rejected";
 
    let payload = {
      ...formData,
      substitutionDeclined: undefined,
      status: "Pending",
      substitutionStatus: formData.replacementFaculty ? "Pending" : null,
      leaveApproval: {
        HoD: { status: "Pending", remark: null },
        HR:  { status: "Pending", remark: null },
      },
    };
 
    if (isResubmission) {
      payload = {
        ...payload,
        status: "Resubmitted",
        previousVersion: {
          leaveType:          currentApp.leaveType,
          fromDate:           currentApp.fromDate,
          toDate:             currentApp.toDate,
          reason:             currentApp.reason,
          replacementFaculty: currentApp.replacementFaculty,
          appliedAt:          currentApp.appliedAt,
          leaveApproval:      currentApp.leaveApproval,
          timings:            currentApp.timings,
        },
      };
    }
 
    // supporting_doc_file — File object hai toh leaveService khud FormData banayega
    // supporting_doc_link — text URL hai toh JSON mein jaata hai
    const submitPayload = formData.id
      ? payload
      : { ...payload, appliedAt: new Date().toISOString() };
 
    const response = formData.id
      ? await leaveService.updateApplication(formData.id, submitPayload)
      : await leaveService.createApplication(submitPayload);
 
    if (response) {
      setIsModalOpen(false);
      await fetchApplications();
      await refreshJobs();
      if (isSubstitutionUpdate || formData.replacementFaculty) {
        await refreshNotifications();
      }
    }
  } catch (err) {
    console.error("Submission error:", err);
  } finally {
    setLoading(false);
  }
};
  const handleSubstitutionResponse = async (id, action) => {
    try {
      const response = await leaveService.respondToSubstitution(id, action);
      if (response.success) {
        await Promise.all([fetchApplications(), refreshJobs(), refreshNotifications()]);
      }
    } catch (err) {
      console.error("Substitution error:", err);
    }
  };

  return (
    <LeaveApplicationUI
      applications={applications}
      substitutionRequests={substitutionRequests}
      admins={admins}
      faculties={faculties}
      courses={courses}
      loading={loading}
      error={error}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      activeTab={activeTab}
      onRefresh={fetchApplications}
      onSubmit={handleSubmit}
      onRespondToSubstitution={handleSubstitutionResponse}
      onTabChange={(newTab) => navigate(`/leave-applications/${newTab}`)}
    />
  );
};

export default LeaveApplicationController;