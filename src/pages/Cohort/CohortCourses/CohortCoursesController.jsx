import React, { useState, useEffect } from "react";
import CohortCoursesUI from "./CohortCoursesUI";
import CohortCoursesCreateController from "./CohortCoursesCreateController";
import CohortCoursesContentController from "./CohortCoursesContentController";
import useCourseModals from "./hooks/userCourseModals";

const MOCK_COURSES = [
  { id: 1, title: "Final Year Project Proposal Submission", deadline: "2025-07-15", submitted: true, status: "closed", submissionCount: 78, totalSubmissions: 80, description: "Submit your final year project proposal document outlining objectives, methodology, and expected outcomes.", submissionType: "Individual", attachments: [{ name: "proposal_template.docx", size: 1024000 }] },
  { id: 2, title: "Course Project Progress Report", deadline: "2025-07-20", submitted: false, status: "open", submissionCount: 45, totalSubmissions: 80, description: "Upload the mid-term progress report for your ongoing course project. Include progress made and challenges faced.", submissionType: "Group", attachments: [] },
  { id: 3, title: "Project Code and Documentation Submission", deadline: "2025-07-30", submitted: false, status: "open", submissionCount: 12, totalSubmissions: 80, description: "Submit the final version of your project code along with proper documentation and user manual.", submissionType: "Individual", attachments: [{ name: "submission_instructions.pdf", size: 2048576 }, { name: "code_structure_guidelines.txt", size: 4096 }] },
];

const CohortCoursesController = ({ cohortId, cohortData }) => {
  const [sortBy, setSortBy] = useState("Latest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [courseShareState, setCourseShareState] = useState({ text: "Share Page", clicked: false });
  const [coursesData, setCoursesData] = useState([]);

  const user_type = cohortData?.is_admin ? 1 : 0;

  const {
    isCreateModalOpen, isContentModalOpen, selectedCourseId,
    editCourseId, isEditMode,
    handleCreateClick, handleCloseCreateModal, handleCourseClick, handleCloseContentModal,
  } = useCourseModals();

  useEffect(() => { setCoursesData(MOCK_COURSES); }, [cohortId]);

  useEffect(() => {
    const handleClickOutside = (e) => { if (!e.target.closest(".dropdown-container")) setShowSortDropdown(false); };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSortChange = (newSort) => {
    setSortBy(newSort); setShowSortDropdown(false);
    setCoursesData((prev) => [...prev].sort((a, b) => {
      const diff = new Date(a.deadline) - new Date(b.deadline);
      return newSort === "Latest" ? -diff : diff;
    }));
  };

  const handleSharePage = async () => {
    try {
      const response = await cohortAPI.generateInvitationLink(cohortId);
      if (!response.success) { alert("Failed to generate share link. Please try again."); return; }

      let finalUrl = response.data.invitationLink;
      try {
        const parsed = new URL(finalUrl, window.location.origin);
        let token = parsed.searchParams.get("token") || /[?&]token=([^&]+)/.exec(finalUrl)?.[1];
        finalUrl = token
          ? `${window.location.origin}/c/${cohortId}/join?token=${token}`
          : `${window.location.origin}${parsed.pathname}${parsed.search}`;
      } catch {
        if (finalUrl.startsWith("http") && !finalUrl.includes(window.location.hostname)) {
          const url = new URL(finalUrl);
          finalUrl = `${window.location.origin}${url.pathname}${url.search}`;
        } else if (!finalUrl.startsWith("http")) {
          finalUrl = `${window.location.origin}${finalUrl}`;
        }
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(finalUrl);
      } else {
        const el = document.createElement("textarea");
        el.value = finalUrl;
        document.body.appendChild(el);
        el.select();
        try { document.execCommand("copy"); } catch (err) { console.error(err); }
        document.body.removeChild(el);
      }

      setCourseShareState({ text: "Copied", clicked: true });
      setTimeout(() => setCourseShareState({ text: "Share Page", clicked: false }), 2000);
    } catch (error) {
      console.error("Error generating share link:", error);
      alert("Failed to generate share link. Please try again.");
    }
  };

  return (
    <>
      <CohortCoursesUI
        cohortId={cohortId} cohortData={cohortData} user_type={user_type}
        sortBy={sortBy} showSortDropdown={showSortDropdown} courseShareState={courseShareState}
        coursesData={coursesData} onSortChange={handleSortChange}
        onSortDropdownToggle={() => setShowSortDropdown((p) => !p)}
        onSharePage={handleSharePage} onCreateClick={handleCreateClick} onCourseClick={handleCourseClick}
      />
      <CohortCoursesCreateController
        cohortId={cohortId} cohortData={cohortData} isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal} isEditMode={isEditMode} editCourseId={editCourseId} coursesData={coursesData}
      />
      <CohortCoursesContentController
        cohortId={cohortId} cohortData={cohortData} isOpen={isContentModalOpen}
        onClose={handleCloseContentModal} courseId={selectedCourseId} coursesData={coursesData}
      />
    </>
  );
};

export default CohortCoursesController;