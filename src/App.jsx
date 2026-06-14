import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster.jsx";
import { TooltipProvider } from "@/components/ui/tooltip.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import ModalWithBackground from "./components/layout/ModalWithBackground";

import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { NotificationProvider, useNotifications } from "./context/NotificationContext.jsx";
import { JobTrayProvider, useJobs } from "./context/JobTrayContext.jsx";
import { StudentJobTrayProvider, useStudentJobs } from "./context/StudentJobTrayContext.jsx";
import { StudentNotificationProvider, useStudentNotifications } from "./context/StudentNotificationContext.jsx";

import LandingPage from "./pages/Landing-components/Landing.jsx";
import LoginController from "./pages/Login/LoginController.jsx";
import SignupController from "./pages/Signup/SignupController.jsx";
import ResetPasswordController from "./pages/ResetPassword/ResetPasswordController.jsx";

import GuideController from "./components/layout/Guide/GuideController";
import SettingsController from "./pages/Settings/SettingsController";
import DashboardController from "./pages/Dashboard/DashboardController";
import MyCoursesController from "./pages/MyCourses/MyCoursesController.jsx";
import StudentCoursesController from "./pages/StudentCourses/StudentCoursesController.jsx";
import CohortController from "./pages/Cohort/CohortController";
import CourseJoinController from "./pages/CourseJoin/CourseJoinController";
import ScheduleController from "./pages/Schedule/ScheduleController.jsx";
import LibraryController from "./pages/Library/LibraryController.jsx";
import SessionPlanningController from "./pages/SessionPlanning/SessionPlanningController.jsx";
import MaintenanceController from "./pages/Maintenance/MaintenanceController.jsx";
import AttendanceManagementController from "./pages/AttendanceMangement/AttendanceManagementController.jsx";
import LeaveApplicationController from "./pages/LeaveApplication/LeaveApplicationController.jsx";
import ExamDutiesController from "./pages/ExamDuties/ExamDutiesController.jsx";
import PayrollController from "./pages/Payroll/PayrollController.jsx";
import AssetRequestController from "./pages/AssetRequest/AssetRequestController.jsx";
import FinanceManagementController from "./pages/FinanceMangement/FinanceManagementController.jsx";
import BulletinsController from "./pages/Bulletins/BulletinsController.jsx";
import ResearchController from "./pages/Research/ResearchController.jsx";

// ── New student module controllers ────────────────────────────────────────────
import HostelController from "./pages/Hostel/HostelController.jsx";
import PlacementController from "./pages/Placement/PlacementController.jsx";
import RegistrarController from "./pages/Registrar/RegistrarController.jsx";
import ExaminationController from "./pages/Examination/ExaminationController.jsx";
import MentorController from "./pages/Mentor/MentorController.jsx";
import PlacementApplyUI from "./pages/Placement/PlacementapplyUI.jsx";
import FinanceController from "./pages/Finance/FinanceController.jsx";
import CalendarController from "@/pages/Calendar/CalendarController/Calendarcontroller.jsx";
import StudentAnnouncementsController from "./pages/StudentAnnouncements/StudentAnnouncementsController.jsx";
import StudentAttendanceController from "./pages/StudentAttendance/StudentAttendanceController.jsx";
import StudentResearchController from "./pages/StudentResearch/StudentResearchController.jsx";
import StudentScheduleController from "./pages/StudentSchedule/StudentScheduleController.jsx";
import RevaluationController from "./pages/Revaluation/RevaluationController.jsx";
import ProfRevaluationController from "./pages/ProfRevaluation/ProfRevaluationController.jsx";
import HodHrLeaveController from "./pages/HodHrLeave/HodHrLeaveController.jsx";

// Resolves /my-courses to the correct controller based on the user's role
const MyCoursesRoute = () => {
    const role = localStorage.getItem("userRole");
    const isProfOrHod = role === "professor" || role === "hod" || role === "hr";
    return isProfOrHod ? <MyCoursesController /> : <StudentCoursesController />;
};

  const RevaluationRoute = () => {
      const isProfessor = ["professor", "hod"].includes(localStorage.getItem("userRole"));
       return isProfessor
           ? <ProfRevaluationController />
           : <RevaluationController />;
   };

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<TooltipProvider>
				<ThemeProvider>
					<AuthProvider>
						<NotificationProvider>
							<StudentNotificationProvider> 
							<JobTrayProvider>
								<StudentJobTrayProvider>
								<Toaster />
								<AppContent />
								</StudentJobTrayProvider>
							</JobTrayProvider>
							</StudentNotificationProvider>
						</NotificationProvider>
					</AuthProvider>
				</ThemeProvider>
			</TooltipProvider>
		</QueryClientProvider>
	);
}

const AppContent = () => {
	const { refreshJobs } = useJobs();
	const { refreshJobs: refreshStudentJobs } = useStudentJobs();
	const { refreshNotifications } = useNotifications();
	const { refreshNotifications: refreshStudentNotifications } = useStudentNotifications();

	useEffect(() => {
		/**
		 * Initial data fetch for the application's global indicators.
		 * Fetches both pending jobs and notifications on mount.
		 */
		const initializeAppData = async () => {
			await Promise.all([
				refreshJobs(),
				refreshStudentJobs(),
				refreshNotifications(),
				refreshStudentNotifications(),
			]);
		};

		initializeAppData();
	}, []);

	return (
		<BrowserRouter
			future={{
				v7_startTransition: true,
				v7_relativeSplatPath: true,
			}}
		>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/login" element={<LoginController />} />
				<Route path="/signup" element={<SignupController />} />
				<Route
					path="/reset-password"
					element={<ResetPasswordController />}
				/>
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute>
							<DashboardController />
						</ProtectedRoute>
					}
				/>

				{/* My Courses Route — role-aware: professor → MyCoursesController, student → StudentCoursesController */}
				<Route
					path="/my-courses"
					element={
						<ProtectedRoute>
							<MyCoursesRoute />
						</ProtectedRoute>
					}
				/>

				{/* Schedule & Meetings Route */}
				<Route
					path="/schedule"
					element={
						<ProtectedRoute>
							<ScheduleController />
						</ProtectedRoute>
					}
				/>
				{/* ── Placement Apply Route ── */}
<Route
    path="/placement/apply/:jobId"
    element={
        <ProtectedRoute>
            <PlacementApplyUI />
        </ProtectedRoute>
    }
/>
				<Route
					path="/schedule/:tab"
					element={
						<ProtectedRoute>
							<ScheduleController />
						</ProtectedRoute>
					}
				/>

				{/* Library Module Route */}
				<Route
					path="/library"
					element={
						<ProtectedRoute>
							<LibraryController />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/library/:tab"
					element={
						<ProtectedRoute>
							<LibraryController />
						</ProtectedRoute>
					}
				/>

				{/* Session Planning Route */}
				<Route
					path="/session-planning"
					element={
						<ProtectedRoute>
							<SessionPlanningController />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/session-planning/:tab"
					element={
						<ProtectedRoute>
							<SessionPlanningController />
						</ProtectedRoute>
					}
				/>

				{/* Maintenance Requests Route */}
				<Route
					path="/maintenance"
					element={
						<ProtectedRoute>
							<MaintenanceController />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/maintenance/:tab"
					element={
						<ProtectedRoute>
							<MaintenanceController />
						</ProtectedRoute>
					}
				/>
				{/* ── Student Announcements Routes ── */}
<Route
    path="/announcements"
    element={
        <ProtectedRoute>
            <StudentAnnouncementsController />
        </ProtectedRoute>
    }
/>
<Route
    path="/announcements/:tab"
    element={
        <ProtectedRoute>
            <StudentAnnouncementsController />
        </ProtectedRoute>
    }
/>
{/* ── Student Research Routes ── */}
<Route
    path="/student-research"
    element={
        <ProtectedRoute>
            <StudentResearchController />
        </ProtectedRoute>
    }
/>
<Route
    path="/student-research/:tab"
    element={
        <ProtectedRoute>
            <StudentResearchController />
        </ProtectedRoute>
    }
/>
{/* ── Student Research Routes ── */}
<Route path="/student-research" element={<ProtectedRoute><StudentResearchController /></ProtectedRoute>} />
<Route path="/student-research/:tab" element={<ProtectedRoute><StudentResearchController /></ProtectedRoute>} />
<Route path="/student-research/:tab/project/:projectId" element={<ProtectedRoute><StudentResearchController /></ProtectedRoute>} />
<Route path="/student-research/:tab/publication/:pubId" element={<ProtectedRoute><StudentResearchController /></ProtectedRoute>} />
				<Route path="/student-schedule" element={<ProtectedRoute><StudentScheduleController /></ProtectedRoute>} />
<Route path="/student-schedule/:tab" element={<ProtectedRoute><StudentScheduleController /></ProtectedRoute>} />
				{/* Attendance Management Routes */}
				<Route
					path="/attendance-management"
					element={
						<ProtectedRoute>
							<AttendanceManagementController />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/attendance-management/logs"
					element={
						<ProtectedRoute>
							<AttendanceManagementController />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/attendance-management/:courseId"
					element={
						<ProtectedRoute>
							<AttendanceManagementController />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/attendance-management/:courseId/qr"
					element={
						<ProtectedRoute>
							<AttendanceManagementController />
						</ProtectedRoute>
					}
				/>

				{/* Student Attendance Routes */}
				<Route
					path="/student-attendance"
					element={
						<ProtectedRoute>
							<StudentAttendanceController />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/student-attendance/:tab"
					element={
						<ProtectedRoute>
							<StudentAttendanceController />
						</ProtectedRoute>
					}
				/>

				{/* Asset Request Route */}
				<Route
					path="/asset-requests"
					element={
						<ProtectedRoute>
							<AssetRequestController />
						</ProtectedRoute>
					}
				/>

				{/* Finance Management Routes */}
				<Route
					path="/finance-management"
					element={
						<ProtectedRoute>
							<FinanceManagementController />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/finance-management/:tab"
					element={
						<ProtectedRoute>
							<FinanceManagementController />
						</ProtectedRoute>
					}
				/>

				{/* Exam Duties Route */}
				<Route
					path="/exam-duties"
					element={
						<ProtectedRoute>
							<ExamDutiesController />
						</ProtectedRoute>
					}
				/>

				{/* Leave Application Route */}
				<Route
					path="/leave-applications"
					element={
						<ProtectedRoute>
							<LeaveApplicationController />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/leave-applications/:tab"
					element={<LeaveApplicationController />}
				/>

				{/* HoD Leave Approval Dashboard */}
                <Route path="/hod-leave-dashboard" element={<ProtectedRoute><HodHrLeaveController role="HoD" /></ProtectedRoute>} />
                <Route path="/hod-leave-dashboard/:tab" element={<ProtectedRoute><HodHrLeaveController role="HoD" /></ProtectedRoute>} />

                 {/* HR Leave Approval Dashboard */}
                <Route path="/hr-leave-dashboard" element={<ProtectedRoute><HodHrLeaveController role="HR" /></ProtectedRoute>} />
                <Route path="/hr-leave-dashboard/:tab" element={<ProtectedRoute><HodHrLeaveController role="HR" /></ProtectedRoute>} />

				{/* Payroll Route */}
				<Route
					path="/payroll"
					element={
						<ProtectedRoute>
							<PayrollController />
						</ProtectedRoute>
					}
				/>

				{/* Bulletins Route */}
				<Route
					path="/bulletins"
					element={
						<ProtectedRoute>
							<BulletinsController />
						</ProtectedRoute>
					}
				/>

				{/* Research & Publications Routes */}
				<Route
					path="/research-publications"
					element={
						<ProtectedRoute>
							<ResearchController />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/research-publications/:tab"
					element={
						<ProtectedRoute>
							<ResearchController />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/research-publications/:tab/project/:projectId"
					element={
						<ProtectedRoute>
							<ResearchController />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/research-publications/:tab/publication/:pubId"
					element={
						<ProtectedRoute>
							<ResearchController />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/research-publications/:tab/user/:userId"
					element={
						<ProtectedRoute>
							<ResearchController />
						</ProtectedRoute>
					}
				/>

				{/* ── Hostel Route ── */}
				<Route
					path="/hostel"
					element={
						<ProtectedRoute>
							<HostelController />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/hostel/:tab"
					element={
						<ProtectedRoute>
							<HostelController />
						</ProtectedRoute>
					}
				/>

				{/* ── Placement Cell Routes ── */}
				<Route
					path="/placement"
					element={
						<ProtectedRoute>
							<PlacementController />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/placement/:tab"
					element={
						<ProtectedRoute>
							<PlacementController />
						</ProtectedRoute>
					}
				/>

				{/* ── Registrar Office Routes ── */}
				<Route
					path="/registrar"
					element={
						<ProtectedRoute>
							<RegistrarController />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/registrar/:tab"
					element={
						<ProtectedRoute>
							<RegistrarController />
						</ProtectedRoute>
					}
				/>

				{/* ── Examinations Routes ── */}
				<Route
					path="/examinations"
					element={
						<ProtectedRoute>
							<ExaminationController />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/examinations/:tab"
					element={
						<ProtectedRoute>
							<ExaminationController />
						</ProtectedRoute>
					}
				/>

				{/* ── Mentor Routes ── */}
				<Route
					path="/mentor"
					element={
						<ProtectedRoute>
							<MentorController />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/mentor/:tab"
					element={
						<ProtectedRoute>
							<MentorController />
						</ProtectedRoute>
					}
				/>

				{/* Cohort routes */}
				<Route
					path="/c/:cohortId"
					element={
						<ProtectedRoute>
							<CohortController />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/c/:cohortId/:tab"
					element={
						<ProtectedRoute>
							<CohortController />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/c/:cohortId/join"
					element={<CourseJoinController />}
				/>

				{/* Settings Page */}
				<Route
					path="/settings"
					element={
						<ProtectedRoute>
							<SettingsController />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/settings/:view"
					element={
						<ProtectedRoute>
							<SettingsController />
						</ProtectedRoute>
					}
				/>
				{/* ── Finance Routes ── */}
<Route
    path="/finance"
    element={
        <ProtectedRoute>
            <FinanceController />
        </ProtectedRoute>
    }
/>
<Route
    path="/finance/:tab"
    element={
        <ProtectedRoute>
            <FinanceController />
        </ProtectedRoute>
    }
/>

{/* ── Calendar Routes ── */}
<Route
    path="/calendar"
    element={
        <ProtectedRoute>
            <CalendarController />
        </ProtectedRoute>
    }
/>
<Route
    path="/calendar/:tab"
    element={
        <ProtectedRoute>
            <CalendarController />
        </ProtectedRoute>
    }
/>

				{/* Modal routes */}
				<Route
					path="/notifications"
					element={
						<ModalWithBackground
							modalType="notifications"
							onClose={() => {
								if (window.history.length > 1) {
									window.history.back();
								} else {
									window.location.href = "/dashboard";
								}
							}}
						/>
					}
				/>
				<Route
					path="/create"
					element={
						<ModalWithBackground
							modalType="create"
							onClose={() => {
								if (window.history.length > 1) {
									window.history.back();
								} else {
									window.location.href = "/dashboard";
								}
							}}
						/>
					}
				/>
				{/* /* Revaluation Routes (role-aware: professor → ProfRevaluationController, student → RevaluationController) */ }
				
				<Route
       path="/revaluation"
       element={
           <ProtectedRoute>
               <RevaluationRoute />
           </ProtectedRoute>
       }
   />
   <Route
       path="/revaluation/:tab"
       element={
           <ProtectedRoute>
               <RevaluationRoute />
           </ProtectedRoute>
       }
   />
				<Route
					path="/guide"
					element={
						<ProtectedRoute>
							<GuideController />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</BrowserRouter>
	);


};

export default App;
