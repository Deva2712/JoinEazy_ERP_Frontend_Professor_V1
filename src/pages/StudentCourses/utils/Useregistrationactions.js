// src/pages/StudentCourses/hooks/useRegistrationActions.js
import { studentCoursesService } from "@/api/services/studentCourses.service";

/**
 * Handles registration submit, elective swap and feedback submission.
 * @param {Function} setMyRegistrations - state setter from controller
 * @param {Function} fetchData          - refetch callback for rollback
 */
const useRegistrationActions = (setMyRegistrations, fetchData) => {

    /** Optimistic fallback registration builder */
    const buildOptimisticRegs = (selectedCourses) =>
        selectedCourses
            .filter((c) => !c.isCompulsory)
            .map((c) => ({
                id:           `REG${Date.now()}-${c.id}`,
                courseId:     c.id,
                title:        c.title,
                courseCode:   c.courseCode,
                instructor:   c.instructor,
                credits:      c.credits,
                isElective:   !!c.isElective,
                isCompulsory: !!c.isCompulsory,
                status:       "Pending",
                appliedAt:    new Date().toISOString(),
                adminRemarks: null,
            }));

    /**
     * Submit registration for the selected courses.
     * Calls the API, then refreshes the registration list from the response.
     */
    const handleSubmitRegistration = async (selectedCourses) => {
        try {
            const res = await studentCoursesService.submitRegistration(selectedCourses);
            if (res.success) {
                setMyRegistrations(res.data);
            } else {
                setMyRegistrations((prev) => [...buildOptimisticRegs(selectedCourses), ...prev]);
            }
        } catch {
            setMyRegistrations((prev) => [...buildOptimisticRegs(selectedCourses), ...prev]);
        }
    };

    /**
     * Swap one elective registration for a different course.
     * @param {string} regId       — registration to replace
     * @param {string} newCourseId — course to swap to
     */
    const handleSwapElective = async (regId, newCourseId) => {
        try {
            const res = await studentCoursesService.swapElective(regId, newCourseId);
            if (res.success) {
                setMyRegistrations(res.data);
            }
        } catch {
            fetchData();
        }
    };

    /** Submit star-rating feedback for a cohort. */
    const handleSubmitFeedback = async (cohortId, feedback) => {
        try {
            await studentCoursesService.submitFeedback(cohortId, feedback);
        } catch (err) {
            console.error("Feedback submission error:", err);
        }
    };

    return { handleSubmitRegistration, handleSwapElective, handleSubmitFeedback };
};

export default useRegistrationActions;