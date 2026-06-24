import { useState, useEffect } from "react";
import { courseService } from "@/api/services/course.service";
import { checkLoginStatus } from "../../../../services/auth";

// ─── Inline helpers ────────────────────────────────────────────────────────────

export const getRollNumberFromEmail = (email) => {
  if (!email) return "Unknown";
  const emailPrefix = email.split("@")[0];
  if (/^[A-Za-z]{2}\d{2}[A-Za-z]{4}\d{3}$/.test(emailPrefix)) return emailPrefix.toUpperCase();
  if (emailPrefix.toLowerCase().includes("new") || emailPrefix.toLowerCase().includes("user"))
    return emailPrefix.toUpperCase();
  return emailPrefix.toUpperCase();
};

export const getMemberDisplayName = (member) => {
  const displayName = (
    member?.display_name || member?.username || member?.name || member?.email || ""
  ).toString();
  const email = member?.email || "";
  if (
    displayName.toLowerCase().includes("new user") ||
    displayName.toLowerCase().includes("newuser")
  )
    return getRollNumberFromEmail(email);
  if (displayName && displayName.trim() !== "") return displayName;
  return getRollNumberFromEmail(email);
};

export const getMemberInitial = (member) =>
  getMemberDisplayName(member).charAt(0).toUpperCase();

// ─── Hook ──────────────────────────────────────────────────────────────────────

const useGroupMembers = (cohortId, cohortData) => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("A-Z");
  const [memberType, setMemberType] = useState("Individual");
  const [searchTerm, setSearchTerm] = useState("");
  const [isInGroup, setIsInGroup] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [totalGroups, setTotalGroups] = useState(0);
  const [membersInGroups, setMembersInGroups] = useState(0);

  const [allAssignments, setAllAssignments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState({});

  // ── Derive user_type ──────────────────────────────────────────────────────────
  const user_type = (() => {
    if (cohortData?.user_type !== undefined) return cohortData.user_type;
    const userRole = localStorage.getItem("userRole");
    return userRole === "professor" ? 1 : 0;
  })();

  // ── fetchMembers ──────────────────────────────────────────────────────────────
  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!cohortId) throw new Error("No cohort ID provided");

      const response = await courseService.getCourseMembers(cohortId);
      if (!response.success) {
        setError(response.error || "Failed to fetch members");
        setMembers([]);
        setFilteredMembers([]);
        return;
      }

      const participantsData = response.data.participants || [];
      const groupsData = response.data.groups || [];

      setIsInGroup(!!response.data.is_group);

      const transformedParticipants = participantsData.map((participant, index) => {
        let groupId = null, isInGroup = false, groupName = null;
        const participantUserId = participant.user_details?.user_id || participant.user_id;

        for (const group of groupsData) {
          if (group.CohortGroupMembers?.some((m) => m.user_id === participantUserId)) {
            groupId = group.id;
            isInGroup = true;
            groupName = group.group_name;
            break;
          }
        }

        const displayNameFromAPI =
          participant.user_details?.display_name || participant.user_details?.username;
        const usernameFromAPI =
          participant.user_details?.username || participant.user_details?.display_name;
        const emailPrefix = participant.email.split("@")[0].toUpperCase();

        return {
          id: `participant-${index + 1}`,
          realUserId: participant.user_details?.user_id || participant.user_id,
          display_name: displayNameFromAPI,
          username: usernameFromAPI,
          name: displayNameFromAPI || emailPrefix,
          email: participant.email,
          avatar:
            participant.user_details?.profile_pic ||
            `https://randomuser.me/api/portraits/men/${index + 1}.jpg`,
          description: participant.user_details ? "Registered User" : "Invited (Not Registered)",
          type: "individual",
          groupId,
          groupName,
          isInGroup,
          isActive: participant.user_details?.is_active !== false,
          projectName: "",
          joinedDate: participant.user_details?.created_at || new Date().toISOString(),
          submissions: "0/0",
        };
      });

      const transformedGroups = groupsData.map((group, index) => ({
        id: `group-${group.id}`,
        name: group.group_name,
        email: "",
        avatar: `https://randomuser.me/api/portraits/men/${index + 1}.jpg`,
        description: group.group_description || `Group (${group.CohortGroupMembers?.length || 0} members)`,
        type: "group",
        groupId: group.id,
        isActive: true,
        projectName: group.project_name || "",
        joinedDate: group.created_at,
        submissions: "0/0",
        memberCount: group.CohortGroupMembers?.length || 0,
        maxMembers: cohortData?.max_groups_members || 4,
        groupMembers: group.CohortGroupMembers || [],
        isCurrentUserGroup: false,
      }));

      const allMembers = [...transformedParticipants, ...transformedGroups];
      setTotalGroups(transformedGroups.length);
      setMembersInGroups(
        groupsData.reduce((total, g) => total + (g.CohortGroupMembers?.length || 0), 0)
      );
      setMembers(allMembers);
      setFilteredMembers(allMembers);
    } catch (err) {
      console.error("Error fetching members:", err);
      setError("Failed to load members");
      setMembers([]);
      setFilteredMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // ── fetchAssignmentsAndGrades ─────────────────────────────────────────────────
  const fetchAssignmentsAndGrades = async () => {
    try {
      const assignmentsResponse = await courseService.getAssignments(cohortId);
      const fetched = assignmentsResponse.data?.assignments || [];

      if (assignmentsResponse.success) {
        setAllAssignments(fetched);
        setAssignments(fetched);
      }

      const storageKey = `grades_${cohortId}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setGrades(JSON.parse(stored));
      } else {
        const initial = {};
        fetched.forEach((assignment) => {
          if (assignment.status === "submitted") {
            members.forEach((member) => {
              if (member.type === "individual") {
                initial[`${member.realUserId}_${assignment.id}`] = {
                  isSubmitted: true,
                  submittedAt: assignment.submittedAt || null,
                };
              }
            });
          }
        });
        setGrades(initial);
      }
    } catch (err) {
      console.error("Error fetching assignments:", err);
    }
  };

  // ── handleGradeSubmit ─────────────────────────────────────────────────────────
  const handleGradeSubmit = async (member, assignment, score, feedback, isGroupGrading) => {
    try {
      const updated = { ...grades };
      const wasLate = assignment.deadline && new Date() > new Date(assignment.deadline);

      const applyGrade = (userId) => {
        const key = `${userId}_${assignment.id}`;
        const existing = updated[key] || {};
        updated[key] = {
          ...existing,
          score,
          feedback,
          submittedAt: existing.submittedAt || new Date().toISOString(),
          isSubmitted: true,
          wasLate,
        };
      };

      if (isGroupGrading) {
        const groupMembers =
          member.groupMembers ||
          members.find((m) => m.type === "group" && m.groupId === member.groupId)?.groupMembers;

        if (groupMembers) {
          groupMembers.forEach((gm) => applyGrade(gm.user_id));
        } else {
          applyGrade(member.realUserId);
        }
      } else {
        applyGrade(member.realUserId);
      }

      setGrades(updated);
      localStorage.setItem(`grades_${cohortId}`, JSON.stringify(updated));
      return { success: true };
    } catch (err) {
      console.error("Error submitting grade:", err);
      return { success: false, error: err };
    }
  };

  // ── handleRemoveMember ────────────────────────────────────────────────────────
  const handleRemoveMember = async (targetUserId) => {
    if (user_type !== 1) return;
    if (!window.confirm("Remove this member from the course?")) return;
    const resp = await courseService.removeCourseParticipant(cohortId, targetUserId);
    if (resp.success) {
      setMembers((prev) => prev.filter((m) => m.realUserId !== targetUserId));
      setFilteredMembers((prev) => prev.filter((m) => m.realUserId !== targetUserId));
    } else {
      alert(resp.error || resp.message || "Failed to remove participant");
    }
  };

  // ── handleCreateGroupSubmit ───────────────────────────────────────────────────
  const handleCreateGroupSubmit = async (groupData) => {
    const { name, description, projectName, members: selectedIds, availableMembers } = groupData;

    const realMemberIds = selectedIds
      .map((id) => availableMembers.find((m) => m.id === id)?.realUserId)
      .filter(Boolean);

    const response = await courseService.createGroup(cohortId, {
      cohort_id: cohortId,
      group_name: name,
      group_description: description || "No description provided",
      project_name: projectName,
      members: realMemberIds,
    });

    if (!response.success) throw new Error(response.error || "Failed to create group");

    setTimeout(async () => {
      await fetchMembers();
      setMemberType("Groups");
    }, 1000);
  };

  // ── Window debug helpers ──────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.markAssignmentSubmitted = (userId, assignmentId) => {
      setGrades((prev) => {
        const updated = {
          ...prev,
          [`${userId}_${assignmentId}`]: {
            ...(prev[`${userId}_${assignmentId}`] || {}),
            isSubmitted: true,
            submittedAt: new Date().toISOString(),
          },
        };
        localStorage.setItem(`grades_${cohortId}`, JSON.stringify(updated));
        return updated;
      });
    };
    window.markAllAssignmentsSubmitted = (userId) => {
      setGrades((prev) => {
        const updated = { ...prev };
        assignments.forEach(({ id }) => {
          updated[`${userId}_${id}`] = {
            ...(prev[`${userId}_${id}`] || {}),
            isSubmitted: true,
            submittedAt: new Date().toISOString(),
          };
        });
        localStorage.setItem(`grades_${cohortId}`, JSON.stringify(updated));
        return updated;
      });
    };
    window.listUsersAndAssignments = () => {
      console.log("Users:", members.filter((m) => m.type === "individual"));
      console.log("Assignments:", assignments);
    };
  }, [grades, assignments, members, cohortId]);

  // ── Effects ───────────────────────────────────────────────────────────────────
  useEffect(() => { if (cohortId) fetchMembers(); }, [cohortId]);
  useEffect(() => { if (cohortId) fetchAssignmentsAndGrades(); }, [cohortId, members]);
  useEffect(() => { if (allAssignments.length > 0) setAssignments(allAssignments); }, [allAssignments]);

  useEffect(() => {
    (async () => {
      const status = await checkLoginStatus();
      if (status?.isLoggedIn && status.user?.user_id) setCurrentUserId(status.user.user_id);
    })();
  }, []);

  // ── Filter / sort ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let filtered = members.map((member) => {
      if (member.type === "group" && currentUserId && member.groupMembers) {
        return {
          ...member,
          isCurrentUserGroup: member.groupMembers.some((gm) => gm.user_id === currentUserId),
        };
      }
      return member;
    });

    if (memberType === "Groups") filtered = filtered.filter((m) => m.type === "group");
    else if (memberType === "Individual") filtered = filtered.filter((m) => m.type === "individual");

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((member) => {
        if (member.type === "individual") {
          return (
            getMemberDisplayName(member).toLowerCase().includes(q) ||
            member.email?.toLowerCase().includes(q) ||
            getRollNumberFromEmail(member.email).toLowerCase().includes(q)
          );
        }
        // group
        const basicMatch =
          member.name?.toLowerCase().includes(q) ||
          member.projectName?.toLowerCase().includes(q);
        const memberMatch = member.groupMembers?.some((gm) => {
          const d = gm.user_details || gm.User || gm;
          return (
            getMemberDisplayName(d).toLowerCase().includes(q) ||
            d.email?.toLowerCase().includes(q) ||
            getRollNumberFromEmail(d.email).toLowerCase().includes(q)
          );
        });
        return basicMatch || memberMatch;
      });
    }

    filtered.sort((a, b) => {
      if (memberType === "Individual" && currentUserId) {
        if (a.realUserId === currentUserId) return -1;
        if (b.realUserId === currentUserId) return 1;
      }
      if (memberType === "Groups" && currentUserId) {
        if (a.isCurrentUserGroup && !b.isCurrentUserGroup) return -1;
        if (b.isCurrentUserGroup && !a.isCurrentUserGroup) return 1;
      }
      return sortBy === "Z-A"
        ? b.name.localeCompare(a.name)
        : a.name.localeCompare(b.name);
    });

    // Sync isCurrentUserGroup back into members if changed
    const changed = filtered.some((f) => {
      const orig = members.find((m) => m.id === f.id);
      return orig && orig.isCurrentUserGroup !== f.isCurrentUserGroup;
    });
    if (changed && currentUserId) {
      setMembers((prev) =>
        prev.map((m) => filtered.find((f) => f.id === m.id) || m)
      );
    }

    setFilteredMembers(filtered);
  }, [members, sortBy, memberType, searchTerm, currentUserId]);

  return {
    // data
    members,
    filteredMembers,
    loading,
    error,
    isInGroup,
    currentUserId,
    totalGroups,
    membersInGroups,
    assignments,
    grades,
    user_type,
    // ui state
    sortBy,
    memberType,
    searchTerm,
    // setters
    setSortBy,
    setMemberType,
    setSearchTerm,
    // actions
    fetchMembers,
    handleGradeSubmit,
    handleRemoveMember,
    handleCreateGroupSubmit,
  };
};

export default useGroupMembers;