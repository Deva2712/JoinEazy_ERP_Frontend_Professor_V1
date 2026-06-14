import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { courseService } from "@/api/services/course.service.js";

const cohortSettingsSchema = z.object({
  cohortName: z.string().min(1, "Name cannot be empty"),
  cohortUrl: z.string().optional().refine((val) => {
    if (!val || val.trim() === "") return true;
    try {
      const u = new URL(val.trim());
      return u.protocol === "http:" || u.protocol === "https:";
    } catch (_) { return false; }
  }, "Please enter a valid URL (http/https)"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

const useCohortSettings = ({ cohortData, isOpen, onClose }) => {
  // ── Form ─────────────────────────────────────────────────────────
  const form = useForm({
    resolver: zodResolver(cohortSettingsSchema),
    defaultValues: {
      cohortName: cohortData?.name || cohortData?.title || "",
      cohortUrl:  cohortData?.external_url || "",
      startDate:  cohortData?.start_date ? cohortData.start_date.split("T")[0] : "",
      endDate:    cohortData?.end_date   ? cohortData.end_date.split("T")[0]   : "",
    },
    mode: "onBlur",
  });

  // Sync form when modal reopens
  useState(() => {
    if (isOpen) {
      form.reset({
        cohortName: cohortData?.name || cohortData?.title || "",
        cohortUrl:  cohortData?.external_url || "",
        startDate:  cohortData?.start_date ? cohortData.start_date.split("T")[0] : "",
        endDate:    cohortData?.end_date   ? cohortData.end_date.split("T")[0]   : "",
      });
    }
  }, [isOpen, cohortData]);

  // ── State ─────────────────────────────────────────────────────────
  const [importParticipantsFile, setImportParticipantsFile] = useState(null);
  const [maxGroupMembers, setMaxGroupMembers] = useState(cohortData?.max_groups_members || 4);
  const [minGroupMembers, setMinGroupMembers] = useState(cohortData?.min_groups_members || 1);
  const [maxCourseMembers, setMaxCourseMembers] = useState(cohortData?.max_course_members || 1400);
  const [saveError, setSaveError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // ── Handlers ──────────────────────────────────────────────────────
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSave = async (formData) => {
    try {
      setSaveError(null);
      const updateData = {
        cohort_name:        formData.cohortName,
        external_url:       formData.cohortUrl || null,
        start_date:         formData.startDate || null,
        end_date:           formData.endDate || null,
        max_groups_members: maxGroupMembers,
        min_groups_members: minGroupMembers,
        max_course_members: maxCourseMembers,
      };

      const response = await courseService.updateCourse(cohortData.id, updateData);

      if (response.success) {
        if (importParticipantsFile) {
          try {
            const participantResponse = await courseService.uploadParticipants(cohortData.id, importParticipantsFile);
            const msg = participantResponse.data?.data?.message || participantResponse.data?.message || "Participants imported successfully";
            alert(participantResponse.success
              ? `Success! Course updated and ${msg}`
              : `Course updated, but failed to import participants: ${participantResponse.message}`
            );
          } catch {
            alert("Course updated successfully, but there was an error importing participants.");
          }
          setImportParticipantsFile(null);
        } else {
          alert("Course updated successfully!");
        }
        onClose();
      } else {
        if (/external_url/.test(response.error || "")) {
          try {
            const urlVal = formData.cohortUrl?.trim();
            urlVal
              ? window.localStorage.setItem(`cohort:${cohortData.id}:external_url`, urlVal)
              : window.localStorage.removeItem(`cohort:${cohortData.id}:external_url`);
          } catch (_) {}
          onClose();
        } else {
          setSaveError(response.error || "Failed to update cohort settings");
        }
      }
    } catch {
      setSaveError("An unexpected error occurred");
    }
  };

  const handleDeleteCourse = async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      const response = await courseService.deleteCourse(cohortData.id);
      if (response.success) {
        window.location.href = "/dashboard";
      } else {
        setDeleteError(response.error || "Failed to delete course");
      }
    } catch {
      setDeleteError("An unexpected error occurred while deleting the course");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleImportParticipants = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx,.xls,.csv";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImportParticipantsFile(file);
        alert(`File "${file.name}" selected. Click "Save Changes" to import participants.`);
      }
    };
    input.click();
  };

  return {
    form,
    saveError,
    deleteError,
    isDeleting,
    showDeleteConfirmation,
    importParticipantsFile,
    maxGroupMembers,  setMaxGroupMembers,
    minGroupMembers,  setMinGroupMembers,
    maxCourseMembers, setMaxCourseMembers,
    handleOverlayClick,
    handleSave,
    handleDeleteCourse,
    handleImportParticipants,
    handleDeleteClick:  () => setShowDeleteConfirmation(true),
    handleDeleteCancel: () => { setShowDeleteConfirmation(false); setDeleteError(null); },
  };
};

export default useCohortSettings;