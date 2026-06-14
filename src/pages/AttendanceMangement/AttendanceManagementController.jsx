// src/pages/AttendanceManagement/AttendanceManagementController.jsx
import React from "react";
import { AttendanceProvider } from "./context/Attendancecontext";
import AttendanceManagementUI from "./AttendanceManagementUI";
/**
 * Entry point for the Attendance Management module.
 *
 * Responsibilities:
 *  - Wrap the page in AttendanceProvider (all state + API calls live there).
 *  - Render AttendanceManagementUI, which reads from context directly.
 *
 * Nothing else belongs here. Keep this file thin.
 */
const AttendanceManagementController = () => {
	return (
		<AttendanceProvider>
			<AttendanceManagementUI />
		</AttendanceProvider>
	);
};

export default AttendanceManagementController;