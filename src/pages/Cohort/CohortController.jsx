import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CohortUI from "./CohortUI";
import CohortSettingsController from "./CohortSettings/CohortSettingsController";
import useCohortData from "./useCohortData";

const CohortController = () => {
  const { cohortId, tab } = useParams();
  const navigate = useNavigate();

  // FIX: useCohortData ko refetch trigger karne ke liye refreshKey use karo
  // Pehle: settings close hone par window.location.reload() — poora page flush hota tha,
  // React state reset, scroll top, flickering sab kuch.
  // Ab: refreshKey badalne se sirf useCohortData ka useEffect re-run hota hai.
  const [refreshKey, setRefreshKey] = useState(0);
  const { cohortData, loading }     = useCohortData(cohortId, refreshKey);

  const [activeTab, setActiveTab]               = useState("details");
  const [isCohortSettingsOpen, setIsCohortSettingsOpen] = useState(false);

  // ── Settings handlers ────────────────────────────────────────────────────
  const handleCohortSettingsClick = () => setIsCohortSettingsOpen(true);

  const handleCohortSettingsClose = useCallback(() => {
    setIsCohortSettingsOpen(false);
    // Trigger a clean re-fetch of cohort data so updated title/dates/limits
    // are reflected immediately — no full page reload needed.
    setRefreshKey((prev) => prev + 1);
  }, []);

  // ── Tab list — attendance only for professor/admin ───────────────────────
  const requiredTabs = useMemo(() => {
    const baseTabs = [
      "details",
      "members",
      "assignments",
      "materials",
      "announcements",
      "my-meetings",
      "meetings-requested",
    ];

    if (cohortData?.user_type === 1 || cohortData?.is_admin) {
      // Insert attendance after members (index 2)
      baseTabs.splice(2, 0, "attendance");
    }

    return baseTabs;
  }, [cohortData]);

  // ── Sync activeTab with URL param ────────────────────────────────────────
  useEffect(() => {
    if (!cohortData) return; // cohortData load hone ka wait karo
    if (tab && requiredTabs.includes(tab)) {
      setActiveTab(tab);
    } else {
      setActiveTab("details");
      if (!tab) {
        navigate(`/c/${cohortId}/details`, { replace: true });
      }
    }
  }, [tab, cohortId, navigate, requiredTabs, cohortData]);

  // ── Document title ───────────────────────────────────────────────────────
  useEffect(() => {
    document.title = cohortData?.title
      ? `${cohortData.title} - Joineazy`
      : "Course - Joineazy";
  }, [cohortData?.title]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/c/${cohortId}/${tabId}`, { replace: true });
  };

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0f1117]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading course...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <CohortUI
        cohortId={cohortId}
        cohortData={cohortData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        requiredTabs={requiredTabs}
        onTabChange={handleTabChange}
        handleCohortSettingsClick={handleCohortSettingsClick}
      />
      <CohortSettingsController
        isOpen={isCohortSettingsOpen}
        onClose={handleCohortSettingsClose}
        cohortData={cohortData}
      />
    </>
  );
};

export default CohortController;