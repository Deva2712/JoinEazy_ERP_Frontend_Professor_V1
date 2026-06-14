// utility/Usememberexport.js
// Custom hook that encapsulates all CSV export logic for the CohortMembers feature.
// Usage:
//   const { handleExportMembers } = useMemberExport({ members, assignments, grades, cohortData, memberType });

// ── Helpers ───────────────────────────────────────────────────────────────────

const getRollNumberFromEmail = (email) => {
  if (!email) return "Unknown";
  const emailPrefix = email.split("@")[0];
  if (/^[A-Za-z]{2}\d{2}[A-Za-z]{4}\d{3}$/.test(emailPrefix)) {
    return emailPrefix.toUpperCase();
  }
  if (
    emailPrefix.toLowerCase().includes("new") ||
    emailPrefix.toLowerCase().includes("user")
  ) {
    return emailPrefix.toUpperCase();
  }
  return emailPrefix.toUpperCase();
};

const getMemberDisplayName = (member) => {
  const displayName = (
    member?.display_name ||
    member?.username ||
    member?.name ||
    member?.email ||
    ""
  ).toString();
  const email = member?.email || "";
  if (
    displayName.toLowerCase().includes("new user") ||
    displayName.toLowerCase().includes("newuser")
  ) {
    return getRollNumberFromEmail(email);
  }
  if (displayName && displayName.trim() !== "") return displayName;
  return getRollNumberFromEmail(email);
};

/**
 * Sanitise a single CSV cell value so it is safe for Excel.
 * Strips emoji / non-ASCII characters and escapes internal double-quotes.
 */
const sanitizeCell = (value) =>
  `"${String(value)
    .replace(/"/g, '""')
    .replace(/[\u{1F600}-\u{1F64F}]/gu, "")
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, "")
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, "")
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, "")
    .replace(/[\u{2600}-\u{26FF}]/gu, "")
    .replace(/[\u{2700}-\u{27BF}]/gu, "")
    .replace(/[^\x00-\x7F]/g, "")}"`;

/**
 * Convert a 2-D array (headers + rows) to a UTF-8 BOM CSV string.
 */
const buildCsv = (headers, rows) => {
  const BOM = "\uFEFF";
  const lines = [
    headers.map(sanitizeCell).join(","),
    ...rows.map((row) => row.map(sanitizeCell).join(",")),
  ];
  return BOM + lines.join("\n");
};

/**
 * Trigger a browser file download.
 */
const downloadCsv = (csvContent, fileName) => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * @param {object} params
 * @param {Array}  params.members      – full members array (individuals + groups)
 * @param {Array}  params.assignments  – assignments array
 * @param {object} params.grades       – grades map  { `${userId}_${assignmentId}`: { score, ... } }
 * @param {object} params.cohortData   – cohort metadata (used for file name)
 * @param {string} params.memberType   – "Individual" | "Groups"
 */
const useMemberExport = ({ members, assignments, grades, cohortData, memberType }) => {
  const courseName = cohortData?.name || cohortData?.title || "Course";
  const sanitizedCourseName = courseName.replace(/[^a-zA-Z0-9_-]/g, "_");

  // ── Individual export ──────────────────────────────────────────────────────
  const exportIndividuals = () => {
    const individualMembers = members.filter((m) => m.type === "individual");

    if (individualMembers.length === 0) {
      alert("No individual members to export.");
      return;
    }

    const headers = [
      "Roll Number/Name",
      "Email",
      "Joined Date",
      "In Group",
      "Group Name",
      ...assignments.map((a) => a.title || a.name),
      "Total Score",
    ];

    const rows = individualMembers
      .map((member) => {
        // Resolve group name
        let groupName = "Not in any group";
        if (member.isInGroup && member.groupId) {
          const group = members.find(
            (m) => m.type === "group" && m.groupId === member.groupId
          );
          if (group) groupName = group.name;
        }

        // Per-assignment scores
        const assignmentScores = assignments.map((assignment) => {
          const grade = grades[`${member.id}_${assignment.id}`];
          return grade?.score != null ? String(grade.score) : "-";
        });

        // Total score
        const totalScore = assignments.reduce((sum, assignment) => {
          const grade = grades[`${member.id}_${assignment.id}`];
          return sum + (parseInt(grade?.score) || 0);
        }, 0);

        return [
          member.name || "Unknown",
          member.email || "No email",
          member.joinedDate
            ? new Date(member.joinedDate).toLocaleDateString()
            : "Unknown",
          member.isInGroup ? "Yes" : "No",
          groupName,
          ...assignmentScores,
          String(totalScore),
        ];
      })
      // Sort A-Z by name
      .sort((a, b) => a[0].toUpperCase().localeCompare(b[0].toUpperCase()));

    const csv = buildCsv(headers, rows);
    downloadCsv(csv, `${sanitizedCourseName}_Individual_Complete.csv`);
    console.log(`Exported ${individualMembers.length} individual members.`);
  };

  // ── Groups export ──────────────────────────────────────────────────────────
  const exportGroups = () => {
    const groupMembers = members.filter((m) => m.type === "group");

    if (groupMembers.length === 0) {
      alert("No groups to export.");
      return;
    }

    // Only group-type assignments
    const groupAssignments = assignments.filter((a) => a.type === "group");

    const headers = [
      "Group Name",
      "Project Name",
      "Roll no.",
      "Date Joined",
      "E-mail",
      ...groupAssignments.map((a) => a.title || a.name),
      "Total Score",
    ];

    const rows = [];

    groupMembers.forEach((group) => {
      // Find individual members belonging to this group
      const groupMembersList = members
        .filter(
          (m) =>
            m.type === "individual" &&
            m.isInGroup &&
            m.groupId === group.groupId
        )
        .sort((a, b) =>
          getRollNumberFromEmail(a.email)
            .toUpperCase()
            .localeCompare(getRollNumberFromEmail(b.email).toUpperCase())
        );

      if (groupMembersList.length === 0) {
        rows.push([
          group.name || "Unknown Group",
          group.projectName || "No project",
          "No members",
          "",
          "",
          ...Array(groupAssignments.length).fill("-"),
          "-",
        ]);
      } else {
        groupMembersList.forEach((member, index) => {
          const assignmentScores = groupAssignments.map((assignment) => {
            const grade = grades[`${member.id}_${assignment.id}`];
            return grade?.score != null ? String(grade.score) : "-";
          });

          const totalScore = groupAssignments.reduce((sum, assignment) => {
            const grade = grades[`${member.id}_${assignment.id}`];
            return sum + (parseInt(grade?.score) || 0);
          }, 0);

          rows.push([
            index === 0 ? group.name || "Unknown Group" : "",
            index === 0 ? group.projectName || "No project" : "",
            getRollNumberFromEmail(member.email),
            member.joinedDate
              ? new Date(member.joinedDate).toLocaleDateString()
              : "Unknown",
            member.email || "No email",
            ...assignmentScores,
            String(totalScore),
          ]);
        });
      }

      // Blank separator row between groups
      rows.push(Array(headers.length).fill(""));
    });

    // Remove trailing blank row
    if (rows.length > 0 && rows[rows.length - 1].every((c) => c === "")) {
      rows.pop();
    }

    const csv = buildCsv(headers, rows);
    downloadCsv(csv, `${sanitizedCourseName}_Group_Complete.csv`);
    console.log(`Exported ${groupMembers.length} groups.`);
  };

  // ── Public API ─────────────────────────────────────────────────────────────
  const handleExportMembers = () => {
    try {
      if (memberType === "Individual") {
        exportIndividuals();
      } else if (memberType === "Groups") {
        exportGroups();
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Failed to export data. Please try again.");
    }
  };

  return { handleExportMembers };
};

export default useMemberExport;