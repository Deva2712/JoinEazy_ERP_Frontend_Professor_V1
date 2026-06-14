// src/pages/Login/hooks/useInvitationHandler.js
import { courseService } from "@/api/services/course.service";

export default function useInvitationHandler({ invitationToken, navigate }) {

  const processInvitation = async (userData) => {
    const processedToken = localStorage.getItem("processedInvitationToken");

    // Priority 1: pendingInvitationToken (from CourseJoinController)
    const pendingInvitationToken = localStorage.getItem("pendingInvitationToken");
    if (pendingInvitationToken && processedToken !== pendingInvitationToken) {
      localStorage.removeItem("pendingInvitationToken");
      localStorage.removeItem("pendingInvitationTokenTime");
      try {
        const response = await courseService.joinCourseWithInvitation({ token: pendingInvitationToken });
        if (response.success) {
          localStorage.setItem("processedInvitationToken", pendingInvitationToken);
          localStorage.setItem("processedInvitationTokenTime", Date.now().toString());
          alert("Successfully joined the course!");
          navigate("/dashboard");
          return true;
        } else {
          alert("Failed to join course: " + response.message);
        }
      } catch (error) {
        console.error("Error joining course after login:", error);
        alert("Failed to join course after login");
      }
    } else if (pendingInvitationToken) {
      localStorage.removeItem("pendingInvitationToken");
      localStorage.removeItem("pendingInvitationTokenTime");
    }

    // Priority 2: invitationToken from route state
    if (invitationToken && processedToken !== invitationToken) {
      try {
        const result = await courseService.joinWithInvitation(invitationToken);
        if (result.success) {
          localStorage.setItem("processedInvitationToken", invitationToken);
          localStorage.setItem("processedInvitationTokenTime", Date.now().toString());
          alert(`Welcome! You have been successfully added to ${result.cohortName}`);
          navigate(`/c/${result.cohortId}`);
          return true;
        } else {
          console.error("Failed to join course:", result.message);
        }
      } catch (error) {
        console.error("Error joining course:", error);
      }
    }

    // Priority 3: pendingInvitation (legacy)
    const pendingInvitation = localStorage.getItem("pendingInvitation");
    if (pendingInvitation && processedToken !== pendingInvitation) {
      localStorage.removeItem("pendingInvitation");
      const invitation = JSON.parse(pendingInvitation);
      try {
        const response = await courseService.joinCourseWithInvitation({
          token: invitation.token,
          email: userData.email,
        });
        if (response.success) {
          localStorage.setItem("processedInvitationToken", invitation.token);
          localStorage.setItem("processedInvitationTokenTime", Date.now().toString());
          alert("Successfully joined the course!");
          navigate(`/c/${response.cohortId}`);
          return true;
        } else {
          alert("Failed to join course: " + response.message);
        }
      } catch (error) {
        console.error("Error joining course:", error);
        alert("Failed to join course after login");
      }
    }

    return false; // no invitation processed
  };

  return { processInvitation };
}