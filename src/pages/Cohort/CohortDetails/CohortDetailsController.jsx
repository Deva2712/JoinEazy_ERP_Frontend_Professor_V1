import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DetailsUI from "./CohortDetailsUI";
import { courseService } from "../../../api/services/course.service";
import { cohortService } from "../../../api/services/cohort.service";
import {
  transformDetailsData,
  FALLBACK_DETAILS_DATA,
  DEFAULT_CARD_IDS,
} from "./cohortdetailshelpers";

const CohortDetailsController = ({ cohortId, cohortData }) => {
  const [detailsData, setDetailsData] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [refreshKey, setRefreshKey]   = useState(0);

  const navigate    = useNavigate();
  const user_type   = cohortData?.user_type || 0;
  const isProfessor = user_type === 1;

  // ── Auth-error redirect helper ──────────────────────────────────────────────
  const redirectIfUnauthorized = (errOrResponse) => {
    const status  = errOrResponse?.status;
    const message = errOrResponse?.message || "";
    if (status === 401 || message.includes("unauthorized")) {
      navigate("/login", {
        state: { from: `/c/${cohortId}`, message: "Please log in to view this course" },
      });
      return true;
    }
    return false;
  };

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchDetailsData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching course details for cohortId:", cohortId);
      const response = await courseService.getCourseDetails(cohortId);
      console.log("Course details API response:", response);

      if (response.success) {
        const data = response.data;
        console.log("Actual course details data:", data);
        const transformed = transformDetailsData(data, isProfessor);
        console.log("Transformed data:", transformed);
        setDetailsData(transformed);
      } else {
        if (redirectIfUnauthorized(response)) return;
        setError(response.error || "Failed to fetch details");
        setDetailsData(FALLBACK_DETAILS_DATA);
      }
    } catch (err) {
      console.error("Error fetching details:", err);
      if (redirectIfUnauthorized(err)) return;
      setError("Failed to load details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cohortId) fetchDetailsData();
  }, [cohortId, refreshKey]);

  // ── Section helpers ─────────────────────────────────────────────────────────
  const updateContainerById = (id, updater) =>
    setDetailsData((prev) => ({
      ...prev,
      containers: prev.containers.map((c) => (c.id === id ? updater(c) : c)),
    }));

  const replaceContainerId = (oldId, newId, title, content) =>
    updateContainerById(oldId, () => ({ id: newId, title, content }));

  // ── Save (create-or-update) ─────────────────────────────────────────────────
  const handleSubSectionSave = async ({ id, title, content }) => {
    try {
      console.log("Saving section:", { id, title });

      // Default cards (IDs 1-3) → always POST
      if (DEFAULT_CARD_IDS.includes(id)) {
        console.log("Creating new section for default card");
        const response = await cohortService.addDetailSection(cohortId, {
          title: title.trim(),
          subsec_description: content.trim(),
        });
        console.log("Add section response:", response);

        if (response.success) {
          const newId = response.data.id || response.data.data?.id || Date.now();
          replaceContainerId(id, newId, title, content);
          return null;
        }
        return response.error || "Failed to create section";
      }

      // Existing saved sections → try PUT, fall back to POST
      console.log("Updating existing section:", id);
      const editResponse = await cohortService.editDetailSection(cohortId, id, {
        title,
        subsec_description: content,
      });
      console.log("Edit section response:", editResponse);

      if (editResponse.success) {
        updateContainerById(id, (c) => ({ ...c, title, content }));
        return null;
      }

      console.warn("Edit failed, falling back to create:", editResponse.error);
      const createResponse = await cohortService.addDetailSection(cohortId, {
        title: title.trim(),
        subsec_description: content.trim(),
      });

      if (createResponse.success) {
        const newId = createResponse.data.id || createResponse.data.data?.id || Date.now();
        replaceContainerId(id, newId, title, content);
        return null;
      }
      return createResponse.error || "Failed to save section";
    } catch (err) {
      console.error("Error saving section:", err);
      return "Failed to save section";
    }
  };

  // ── Create ──────────────────────────────────────────────────────────────────
  const handleSubSectionCreate = async ({ title, content }) => {
    try {
      if (!title.trim())   return "Title is required";
      if (!content.trim()) return "Content is required";

      const response = await cohortService.addDetailSection(cohortId, {
        title: title.trim(),
        subsec_description: content.trim(),
      });

      if (response.success) {
        const newContainer = {
          id:      response.data.id || response.data.data?.id || Date.now(),
          title:   title.trim(),
          content: content.trim(),
        };
        setDetailsData((prev) => ({
          ...prev,
          containers: [...prev.containers, newContainer],
        }));
        return null;
      }
      return response.error || "Failed to create section";
    } catch (err) {
      console.error("Error creating section:", err);
      return "Failed to create section";
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleSubSectionDelete = async (sectionId) => {
    try {
      console.log("Deleting section:", sectionId);

      const removeLocally = () =>
        setDetailsData((prev) => ({
          ...prev,
          containers: prev.containers.filter((c) => c.id !== sectionId),
        }));

      // Default cards → local-only removal
      if (DEFAULT_CARD_IDS.includes(sectionId)) {
        removeLocally();
        return null;
      }

      const response = await cohortService.deleteDetailSection(cohortId, sectionId);
      if (response.success) {
        removeLocally();
        return null;
      }
      return response.error || "Failed to delete section";
    } catch (err) {
      console.error("Error deleting section:", err);
      return "Failed to delete section";
    }
  };

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  // ── Render states ───────────────────────────────────────────────────────────
  if (loading) return <div className="p-6">Loading details...</div>;

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load details
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDetailsData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <DetailsUI
      cohortId={cohortId}
      cohortData={cohortData}
      detailsData={detailsData}
      user_type={user_type}
      handleSubSectionSave={handleSubSectionSave}
      handleSubSectionCreate={handleSubSectionCreate}
      handleSubSectionDelete={handleSubSectionDelete}
      quickDetails={detailsData?.quickDetails}
    />
  );
};

export default CohortDetailsController;