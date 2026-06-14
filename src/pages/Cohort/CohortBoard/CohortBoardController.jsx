import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CohortBoardCreateController from "./CohortBoardCreateController";
import CohortBoardUI from "../CohortBoard/ui/CohortBoardUI";
import CohortBoardPostController from "./CohortBoardPostController";
import { cohortService } from "../../../api/services/cohort.service";
import useCohortBoardFilters from "./utils/Usecohortboardfilters";

const CohortBoardController = ({ cohortId, cohortData }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editPostId, setEditPostId]           = useState(null);
  const [showPostModal, setShowPostModal]     = useState(false);
  const [selectedPostId, setSelectedPostId]   = useState(null);
  const [boardData, setBoardData]             = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);

  const user_type = cohortData?.user_type ?? 0;
  const filters   = useCohortBoardFilters();

  // ── Base route — matches app's /c/:cohortId/:tab pattern ─────────────────
  // FIX: was using /cohort/${cohortId}/board — correct path is /c/${cohortId}/board
  const boardBase = `/c/${cohortId}/board`;

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchBoardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cohortService.getBoardPosts(cohortId);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch board posts");
      }
      setBoardData(response.data);
    } catch (err) {
      console.error("Error fetching board posts:", err);
      setError(err.message || "Failed to load board posts");
      setBoardData({ posts: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cohortId) fetchBoardData();
  }, [cohortId]);

  // ── Sync modal state with URL ─────────────────────────────────────────────
  // FIX: location.pathname was being matched against /cohort/ paths.
  // Now we match against the correct /c/:cohortId/board/... pattern.
  useEffect(() => {
    const path = location.pathname;

    // /c/:cohortId/board/create
    if (path === `${boardBase}/create`) {
      setShowCreateModal(true);
      setEditPostId(null);
      return;
    }

    // /c/:cohortId/board/:postId/edit
    const editMatch = path.match(/\/c\/[^/]+\/board\/(\d+)\/edit$/);
    if (editMatch) {
      const postId = parseInt(editMatch[1]);
      setEditPostId(postId);
      setShowCreateModal(true);
      return;
    }

    // /c/:cohortId/board/:postId
    const postMatch = path.match(/\/c\/[^/]+\/board\/(\d+)$/);
    if (postMatch) {
      const postId = parseInt(postMatch[1]);
      setSelectedPostId(postId);
      setShowPostModal(true);
      return;
    }

    // /c/:cohortId/board  (base — close all modals)
    setShowCreateModal(false);
    setEditPostId(null);
    setShowPostModal(false);
    setSelectedPostId(null);
  }, [location.pathname, boardBase]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleEditPost = (postId) => {
    setEditPostId(postId);
    setShowCreateModal(true);
    // FIX: was /cohort/${cohortId}/... → now /c/${cohortId}/...
    navigate(`${boardBase}/${postId}/edit`);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setEditPostId(null);
    navigate(boardBase);
  };

  const handlePostClick = (postId) => {
    setSelectedPostId(postId);
    setShowPostModal(true);
    // FIX: was /cohort/${cohortId}/... → now /c/${cohortId}/...
    navigate(`${boardBase}/${postId}`);
  };

  const handleClosePostModal = () => {
    setShowPostModal(false);
    setSelectedPostId(null);
    navigate(boardBase);
  };

  const handleLikePost = async (postId) => {
    try {
      await cohortService.likePost(cohortId, postId);
      fetchBoardData();
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  return (
    <>
      <CohortBoardUI
        cohortId={cohortId}
        cohortData={cohortData}
        boardData={boardData}
        loading={loading}
        error={error}
        user_type={user_type}
        onRetry={fetchBoardData}
        onRefresh={fetchBoardData}
        // FIX: was navigate(`/cohort/${cohortId}/board/create`)
        onCreatePost={() => navigate(`${boardBase}/create`)}
        onEditPost={handleEditPost}
        onLike={handleLikePost}
        onPostClick={handlePostClick}
        {...filters}
      />

      {showCreateModal && (
        <CohortBoardCreateController
          cohortId={cohortId}
          editPostId={editPostId}
          onClose={handleCloseCreateModal}
          onSuccess={() => {
            handleCloseCreateModal();
            fetchBoardData();
          }}
        />
      )}

      {showPostModal && selectedPostId && (
        <CohortBoardPostController
          cohortId={cohortId}
          postId={selectedPostId}
          onClose={handleClosePostModal}
          onEdit={handleEditPost}
        />
      )}
    </>
  );
};

export default CohortBoardController;