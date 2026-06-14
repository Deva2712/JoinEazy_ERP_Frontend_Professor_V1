// src/pages/Cohort/useCohortData.js
import { useState, useEffect } from "react";
import { courseService } from "@/api/services/course.service";

// FIX: Accept refreshKey as second param so CohortController can trigger
// a re-fetch after settings save — instead of window.location.reload().
const useCohortData = (cohortId, refreshKey = 0) => {
  const [cohortData, setCohortData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCohortData = async () => {
      setLoading(true);
      try {
        const response = await courseService.getCourseDetails(cohortId);

        if (response.success) {
          const data = response.data;

          const transformed = {
            // Identity
            id: data.id || cohortId,

            // Title — API returns cohort_name, UI expects title
            title: data.cohort_name || data.title || data.name || "Untitled Course",
            name:  data.cohort_name || data.title || data.name || "Untitled Course",

            // Description
            description: data.cohort_description || data.description || "",

            // Course codes — normalise to array
            course_codes: Array.isArray(data.course_codes)
              ? data.course_codes
              : data.course_codes
              ? [data.course_codes]
              : data.course_code
              ? [data.course_code]
              : [],

            // Instructor
            instructor: data.instructor || data.professor_name || "Professor",

            // Dates
            start_date: data.start_date || data.startDate || null,
            end_date:   data.end_date   || data.endDate   || null,
            created_at: data.created_at || data.createdAt || null,

            // Status
            status:     data.status     || "Live",
            visibility: data.visibility || "Active",

            // Organisation
            organization_name: data.organization_name || data.organizationName || "",

            // User role — 1 = professor/admin, 0 = student
            user_type: data.user_type ?? (data.is_admin ? 1 : 0),
            is_admin:  data.is_admin  ?? (data.user_type === 1) ?? false,

            // Counts
            member_count: data.member_count ?? data.memberCount ?? 0,
            group_count:  data.group_count  ?? data.groupCount  ?? 0,

            // Assignments summary
            pending_assignments:   data.pending_assignments   ?? data.pendingAssignments   ?? 0,
            completed_assignments: data.completed_assignments ?? data.completedAssignments ?? 0,
            total_assignments:     data.total_assignments     ?? data.totalAssignments     ?? 0,

            // Student-specific group info
            group_name:      data.group_name      || data.groupName      || null,
            is_group_leader: data.is_group_leader ?? data.isGroupLeader  ?? false,

            // Group size limits (used in CreateGroupModal)
            max_groups_members: data.max_groups_members ?? data.maxGroupsMembers ?? 4,
            min_groups_members: data.min_groups_members ?? data.minGroupsMembers ?? 1,
            max_course_members: data.max_course_members ?? data.maxCourseMembers ?? 1400,

            // Office hours (used in MyMeetingsController)
            office_hours: data.office_hours || data.officeHours || [],

            // Detail sections (used in CohortDetailsController)
            detail_sections: data.detail_sections || data.detailSections || [],
          };

          setCohortData(transformed);
        } else {
          setCohortData({
            id:                   cohortId,
            title:                "Untitled Course",
            name:                 "Untitled Course",
            user_type:            0,
            is_admin:             false,
            course_codes:         [],
            member_count:         0,
            group_count:          0,
            pending_assignments:  0,
            completed_assignments:0,
            total_assignments:    0,
            group_name:           null,
            is_group_leader:      false,
            office_hours:         [],
            detail_sections:      [],
          });
        }
      } catch (error) {
        console.error("Error fetching cohort data:", error);
        setCohortData({
          id:                   cohortId,
          title:                "Untitled Course",
          name:                 "Untitled Course",
          user_type:            0,
          is_admin:             false,
          course_codes:         [],
          member_count:         0,
          group_count:          0,
          pending_assignments:  0,
          completed_assignments:0,
          total_assignments:    0,
          group_name:           null,
          is_group_leader:      false,
          office_hours:         [],
          detail_sections:      [],
        });
      } finally {
        setLoading(false);
      }
    };

    if (cohortId) fetchCohortData();
  }, [cohortId, refreshKey]); // refreshKey added — incrementing it re-fetches data

  return { cohortData, loading };
};

export default useCohortData;