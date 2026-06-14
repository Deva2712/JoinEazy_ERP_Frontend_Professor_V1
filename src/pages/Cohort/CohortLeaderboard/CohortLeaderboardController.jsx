import React, { useState, useEffect } from "react";
import CohortLeaderboardUI from "./CohortLeaderboardUI";
import { cohortService } from "../../../api/services/cohort.service";
import { MOCK_INDIVIDUALS, MOCK_GROUPS } from "./Cohortleaderboardmock";

// Returns medal type based on rank (top 3 only)
const getMedalType = (rank) => {
  if (rank === 1) return "gold";
  if (rank === 2) return "silver";
  if (rank === 3) return "bronze";
  return null;
};

const CohortLeaderboardController = ({ cohortId, cohortData }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [groupData, setGroupData]             = useState([]);
  const [activeTab, setActiveTab]             = useState("individual");
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await cohortService.getLeaderboard(cohortId);

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch leaderboard data");
      }

      const { data } = response;

      setLeaderboardData(
        data.individuals.map((item) => ({ ...item, medalType: getMedalType(item.rank) }))
      );
      setGroupData(
        data.groups.map((item) => ({ ...item, medalType: getMedalType(item.rank) }))
      );
    } catch (err) {
      console.error("Error fetching leaderboard data:", err);
      setError(err.message || "Failed to load leaderboard data");

      // Fallback to mock data
      setLeaderboardData(MOCK_INDIVIDUALS);
      setGroupData(MOCK_GROUPS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cohortId) fetchLeaderboardData();
  }, [cohortId]);

  return (
    <CohortLeaderboardUI
      leaderboardData={leaderboardData}
      groupData={groupData}
      activeTab={activeTab}
      loading={loading}
      error={error}
      onTabChange={setActiveTab}
      onRefresh={fetchLeaderboardData}
    />
  );
};

export default CohortLeaderboardController;