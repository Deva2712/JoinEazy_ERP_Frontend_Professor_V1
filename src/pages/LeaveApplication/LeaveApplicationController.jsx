// // // src/pages/LeaveApplication/LeaveApplicationController.jsx
// // import React, { useState } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import { leaveService } from "../../api/services/leave.service";
// // import { useJobs } from "../../context/JobTrayContext";
// // import { useNotifications } from "../../context/NotificationContext";
// // import useLeaveData from "./hooks/Useleavedata";
// // import LeaveApplicationUI from "./LeaveApplicationUI";

// // const LeaveApplicationController = () => {
// //   const [isModalOpen, setIsModalOpen] = useState(false);

// //   const { tab } = useParams();
// //   const navigate = useNavigate();
// //   const { refreshJobs } = useJobs();
// //   const { refreshNotifications } = useNotifications();

// //   const {
// //     applications, substitutionRequests, admins, faculties, courses,
// //     loading, setLoading, error, fetchApplications,
// //   } = useLeaveData();

// //   const activeTab = tab || "my-leaves";

// //   const handleSubmit = async (formData) => {
// //     setLoading(true);
// //     try {
// //       const currentApp     = applications.find((a) => a.id === formData.id);
// //       const isResubmission = currentApp?.status === "Rejected";

// //       let payload = {
// //         ...formData,
// //         status: "Pending",
// //         leaveApproval: {
// //           HoD: { status: "Pending", remark: null },
// //           HR:  { status: "Pending", remark: null },
// //         },
// //       };

// //       if (isResubmission) {
// //         payload = {
// //           ...payload,
// //           status: "Resubmitted",
// //           previousVersion: {
// //             leaveType:          currentApp.leaveType,
// //             fromDate:           currentApp.fromDate,
// //             toDate:             currentApp.toDate,
// //             reason:             currentApp.reason,
// //             replacementFaculty: currentApp.replacementFaculty,
// //             appliedAt:          currentApp.appliedAt,
// //             leaveApproval:      currentApp.leaveApproval,
// //             timings:            currentApp.timings,
// //           },
// //         };
// //       }

// //       const response = formData.id
// //         ? await leaveService.updateApplication(formData.id, payload)
// //         : await leaveService.createApplication({ ...payload, appliedAt: new Date().toISOString() });

// //       if (response) {
// //         setIsModalOpen(false);
// //         await fetchApplications();
// //         await refreshJobs();
// //       }
// //     } catch (err) {
// //       console.error("Submission error:", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSubstitutionResponse = async (id, action) => {
// //     try {
// //       const response = await leaveService.respondToSubstitution(id, action);
// //       if (response.success) {
// //         await Promise.all([fetchApplications(), refreshJobs(), refreshNotifications()]);
// //       }
// //     } catch (err) {
// //       console.error("Substitution error:", err);
// //     }
// //   };

// //   return (
// //     <LeaveApplicationUI
// //       applications={applications}
// //       substitutionRequests={substitutionRequests}
// //       admins={admins}
// //       faculties={faculties}
// //       courses={courses}
// //       loading={loading}
// //       error={error}
// //       isModalOpen={isModalOpen}
// //       setIsModalOpen={setIsModalOpen}
// //       activeTab={activeTab}
// //       onRefresh={fetchApplications}
// //       onSubmit={handleSubmit}
// //       onRespondToSubstitution={handleSubstitutionResponse}
// //       onTabChange={(newTab) => navigate(`/leave-applications/${newTab}`)}
// //     />
// //   );
// // };

// // export default LeaveApplicationController;
// // src/pages/LeaveApplication/LeaveApplicationController.jsx
// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { leaveService } from "../../api/services/leave.service";
// import { useJobs } from "../../context/JobTrayContext";
// import { useNotifications } from "../../context/NotificationContext";
// import useLeaveData from "./hooks/Useleavedata";
// import LeaveApplicationUI from "./LeaveApplicationUI";

// const LeaveApplicationController = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const { tab } = useParams();
//   const navigate = useNavigate();
//   const { refreshJobs } = useJobs();
//   const { refreshNotifications } = useNotifications();

//   const {
//     applications, substitutionRequests, admins, faculties, courses,
//     loading, setLoading, error, fetchApplications,
//   } = useLeaveData();

//   const activeTab = tab || "my-leaves";

//   const handleSubmit = async (formData) => {
//     setLoading(true);
//     try {
//       const currentApp     = applications.find((a) => a.id === formData.id);
//       const isResubmission = currentApp?.status === "Rejected";
//       // NEW: treat substitution-faculty-change as an update too
//       const isSubstitutionUpdate = currentApp?.substitutionStatus === "Rejected";

//       let payload = {
//         ...formData,
//         // Strip the UI-only flag before sending to backend
//         substitutionDeclined: undefined,
//         status: "Pending",
//         // NEW: reset substitutionStatus when a new faculty is chosen
//         substitutionStatus: formData.replacementFaculty ? "Pending" : null,
//         leaveApproval: {
//           HoD: { status: "Pending", remark: null },
//           HR:  { status: "Pending", remark: null },
//         },
//       };

//       if (isResubmission) {
//         payload = {
//           ...payload,
//           status: "Resubmitted",
//           previousVersion: {
//             leaveType:          currentApp.leaveType,
//             fromDate:           currentApp.fromDate,
//             toDate:             currentApp.toDate,
//             reason:             currentApp.reason,
//             replacementFaculty: currentApp.replacementFaculty,
//             appliedAt:          currentApp.appliedAt,
//             leaveApproval:      currentApp.leaveApproval,
//             timings:            currentApp.timings,
//           },
//         };
//       }

//       const response = formData.id
//         ? await leaveService.updateApplication(formData.id, payload)
//         : await leaveService.createApplication({ ...payload, appliedAt: new Date().toISOString() });

//       if (response) {
//         setIsModalOpen(false);
//         await fetchApplications();
//         await refreshJobs();
//         // NEW: refresh notifications so the new substitution request shows up
//         if (isSubstitutionUpdate || formData.replacementFaculty) {
//           await refreshNotifications();
//         }
//       }
//     } catch (err) {
//       console.error("Submission error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubstitutionResponse = async (id, action) => {
//     try {
//       const response = await leaveService.respondToSubstitution(id, action);
//       if (response.success) {
//         await Promise.all([fetchApplications(), refreshJobs(), refreshNotifications()]);
//       }
//     } catch (err) {
//       console.error("Substitution error:", err);
//     }
//   };

//   return (
//     <LeaveApplicationUI
//       applications={applications}
//       substitutionRequests={substitutionRequests}
//       admins={admins}
//       faculties={faculties}
//       courses={courses}
//       loading={loading}
//       error={error}
//       isModalOpen={isModalOpen}
//       setIsModalOpen={setIsModalOpen}
//       activeTab={activeTab}
//       onRefresh={fetchApplications}
//       onSubmit={handleSubmit}
//       onRespondToSubstitution={handleSubstitutionResponse}
//       onTabChange={(newTab) => navigate(`/leave-applications/${newTab}`)}
//     />
//   );
// };

// export default LeaveApplicationController;


// // src/pages/LeaveApplication/LeaveApplicationController.jsx
// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { leaveService } from "../../api/services/leave.service";
// import { useJobs } from "../../context/JobTrayContext";
// import { useNotifications } from "../../context/NotificationContext";
// import useLeaveData from "./hooks/Useleavedata";
// import LeaveApplicationUI from "./LeaveApplicationUI";

// const LeaveApplicationController = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const { tab } = useParams();
//   const navigate = useNavigate();
//   const { refreshJobs } = useJobs();
//   const { refreshNotifications } = useNotifications();

//   const {
//     applications, substitutionRequests, admins, faculties, courses,
//     loading, setLoading, error, fetchApplications,
//   } = useLeaveData();

//   const activeTab = tab || "my-leaves";

//   const handleSubmit = async (formData) => {
//     setLoading(true);
//     try {
//       const currentApp     = applications.find((a) => a.id === formData.id);
//       const isResubmission = currentApp?.status === "Rejected";

//       let payload = {
//         ...formData,
//         status: "Pending",
//         leaveApproval: {
//           HoD: { status: "Pending", remark: null },
//           HR:  { status: "Pending", remark: null },
//         },
//       };

//       if (isResubmission) {
//         payload = {
//           ...payload,
//           status: "Resubmitted",
//           previousVersion: {
//             leaveType:          currentApp.leaveType,
//             fromDate:           currentApp.fromDate,
//             toDate:             currentApp.toDate,
//             reason:             currentApp.reason,
//             replacementFaculty: currentApp.replacementFaculty,
//             appliedAt:          currentApp.appliedAt,
//             leaveApproval:      currentApp.leaveApproval,
//             timings:            currentApp.timings,
//           },
//         };
//       }

//       const response = formData.id
//         ? await leaveService.updateApplication(formData.id, payload)
//         : await leaveService.createApplication({ ...payload, appliedAt: new Date().toISOString() });

//       if (response) {
//         setIsModalOpen(false);
//         await fetchApplications();
//         await refreshJobs();
//       }
//     } catch (err) {
//       console.error("Submission error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubstitutionResponse = async (id, action) => {
//     try {
//       const response = await leaveService.respondToSubstitution(id, action);
//       if (response.success) {
//         await Promise.all([fetchApplications(), refreshJobs(), refreshNotifications()]);
//       }
//     } catch (err) {
//       console.error("Substitution error:", err);
//     }
//   };

//   return (
//     <LeaveApplicationUI
//       applications={applications}
//       substitutionRequests={substitutionRequests}
//       admins={admins}
//       faculties={faculties}
//       courses={courses}
//       loading={loading}
//       error={error}
//       isModalOpen={isModalOpen}
//       setIsModalOpen={setIsModalOpen}
//       activeTab={activeTab}
//       onRefresh={fetchApplications}
//       onSubmit={handleSubmit}
//       onRespondToSubstitution={handleSubstitutionResponse}
//       onTabChange={(newTab) => navigate(`/leave-applications/${newTab}`)}
//     />
//   );
// };

// export default LeaveApplicationController;

// // src/pages/LeaveApplication/LeaveApplicationController.jsx
// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { leaveService } from "../../api/services/leave.service";
// import { useJobs } from "../../context/JobTrayContext";
// import { useNotifications } from "../../context/NotificationContext";
// import useLeaveData from "./hooks/Useleavedata";
// import LeaveApplicationUI from "./LeaveApplicationUI";

// const LeaveApplicationController = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const { tab } = useParams();
//   const navigate = useNavigate();
//   const { refreshJobs } = useJobs();
//   const { refreshNotifications } = useNotifications();

//   const {
//     applications, substitutionRequests, admins, faculties, courses,
//     loading, setLoading, error, fetchApplications,
//   } = useLeaveData();

//   const activeTab = tab || "my-leaves";

//   const handleSubmit = async (formData) => {
//     setLoading(true);
//     try {
//       const currentApp     = applications.find((a) => a.id === formData.id);
//       const isResubmission = currentApp?.status === "Rejected";

//       let payload = {
//         ...formData,
//         status: "Pending",
//         leaveApproval: {
//           HoD: { status: "Pending", remark: null },
//           HR:  { status: "Pending", remark: null },
//         },
//       };

//       if (isResubmission) {
//         payload = {
//           ...payload,
//           status: "Resubmitted",
//           previousVersion: {
//             leaveType:          currentApp.leaveType,
//             fromDate:           currentApp.fromDate,
//             toDate:             currentApp.toDate,
//             reason:             currentApp.reason,
//             replacementFaculty: currentApp.replacementFaculty,
//             appliedAt:          currentApp.appliedAt,
//             leaveApproval:      currentApp.leaveApproval,
//             timings:            currentApp.timings,
//           },
//         };
//       }

//       const response = formData.id
//         ? await leaveService.updateApplication(formData.id, payload)
//         : await leaveService.createApplication({ ...payload, appliedAt: new Date().toISOString() });

//       if (response) {
//         setIsModalOpen(false);
//         await fetchApplications();
//         await refreshJobs();
//       }
//     } catch (err) {
//       console.error("Submission error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubstitutionResponse = async (id, action) => {
//     try {
//       const response = await leaveService.respondToSubstitution(id, action);
//       if (response.success) {
//         await Promise.all([fetchApplications(), refreshJobs(), refreshNotifications()]);
//       }
//     } catch (err) {
//       console.error("Substitution error:", err);
//     }
//   };

//   return (
//     <LeaveApplicationUI
//       applications={applications}
//       substitutionRequests={substitutionRequests}
//       admins={admins}
//       faculties={faculties}
//       courses={courses}
//       loading={loading}
//       error={error}
//       isModalOpen={isModalOpen}
//       setIsModalOpen={setIsModalOpen}
//       activeTab={activeTab}
//       onRefresh={fetchApplications}
//       onSubmit={handleSubmit}
//       onRespondToSubstitution={handleSubstitutionResponse}
//       onTabChange={(newTab) => navigate(`/leave-applications/${newTab}`)}
//     />
//   );
// };

// export default LeaveApplicationController;=

// // src/pages/LeaveApplication/LeaveApplicationController.jsx
// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { leaveService } from "../../api/services/leave.service";
// import { useJobs } from "../../context/JobTrayContext";
// import { useNotifications } from "../../context/NotificationContext";
// import useLeaveData from "./hooks/Useleavedata";
// import LeaveApplicationUI from "./LeaveApplicationUI";

// const LeaveApplicationController = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const { tab } = useParams();
//   const navigate = useNavigate();
//   const { refreshJobs } = useJobs();
//   const { refreshNotifications } = useNotifications();

//   const {
//     applications, substitutionRequests, admins, faculties, courses,
//     loading, setLoading, error, fetchApplications,
//   } = useLeaveData();

//   const activeTab = tab || "my-leaves";

//   const handleSubmit = async (formData) => {
//     setLoading(true);
//     try {
//       const currentApp     = applications.find((a) => a.id === formData.id);
//       const isResubmission = currentApp?.status === "Rejected";

//       let payload = {
//         ...formData,
//         status: "Pending",
//         leaveApproval: {
//           HoD: { status: "Pending", remark: null },
//           HR:  { status: "Pending", remark: null },
//         },
//       };

//       if (isResubmission) {
//         payload = {
//           ...payload,
//           status: "Resubmitted",
//           previousVersion: {
//             leaveType:          currentApp.leaveType,
//             fromDate:           currentApp.fromDate,
//             toDate:             currentApp.toDate,
//             reason:             currentApp.reason,
//             replacementFaculty: currentApp.replacementFaculty,
//             appliedAt:          currentApp.appliedAt,
//             leaveApproval:      currentApp.leaveApproval,
//             timings:            currentApp.timings,
//           },
//         };
//       }

//       const response = formData.id
//         ? await leaveService.updateApplication(formData.id, payload)
//         : await leaveService.createApplication({ ...payload, appliedAt: new Date().toISOString() });

//       if (response) {
//         setIsModalOpen(false);
//         await fetchApplications();
//         await refreshJobs();
//       }
//     } catch (err) {
//       console.error("Submission error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubstitutionResponse = async (id, action) => {
//     try {
//       const response = await leaveService.respondToSubstitution(id, action);
//       if (response.success) {
//         await Promise.all([fetchApplications(), refreshJobs(), refreshNotifications()]);
//       }
//     } catch (err) {
//       console.error("Substitution error:", err);
//     }
//   };

//   return (
//     <LeaveApplicationUI
//       applications={applications}
//       substitutionRequests={substitutionRequests}
//       admins={admins}
//       faculties={faculties}
//       courses={courses}
//       loading={loading}
//       error={error}
//       isModalOpen={isModalOpen}
//       setIsModalOpen={setIsModalOpen}
//       activeTab={activeTab}
//       onRefresh={fetchApplications}
//       onSubmit={handleSubmit}
//       onRespondToSubstitution={handleSubstitutionResponse}
//       onTabChange={(newTab) => navigate(`/leave-applications/${newTab}`)}
//     />
//   );
// };

// export default LeaveApplicationController;
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
      // NEW: treat substitution-faculty-change as an update too
      const isSubstitutionUpdate = currentApp?.substitutionStatus === "Rejected";

      let payload = {
        ...formData,
        // Strip the UI-only flag before sending to backend
        substitutionDeclined: undefined,
        status: "Pending",
        // NEW: reset substitutionStatus when a new faculty is chosen
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

      const response = formData.id
        ? await leaveService.updateApplication(formData.id, payload)
        : await leaveService.createApplication({ ...payload, appliedAt: new Date().toISOString() });

      if (response) {
        setIsModalOpen(false);
        await fetchApplications();
        await refreshJobs();
        // NEW: refresh notifications so the new substitution request shows up
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