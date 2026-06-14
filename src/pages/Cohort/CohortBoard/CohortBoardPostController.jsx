import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CohortBoardPostUI from "./CohortBoardPostUI";
import useCohortBoardPost from "./utils/Usecohortboardpost";

const CohortBoardPostController = ({ cohortId, cohortData, isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    postData,
    loading,
    likeState,
    shareState,
    commentsData,
    onLike,
    onShare,
    onCommentLike,
    onCommentShare,
    onCommentSubmit,
    onDeletePost,
    onDeleteComment,
    resetPost,
  } = useCohortBoardPost({ cohortId, isOpen });

  const handleEdit = () => {
    navigate(`${location.pathname}/edit`);
  };

  const handleTagToNote = () => {
    const pathParts = location.pathname.split("/");
    const cohortIndex = pathParts.indexOf("c");
    const resolvedCohortId = cohortIndex >= 0 ? pathParts[cohortIndex + 1] : "1";
    navigate(`/c/${resolvedCohortId}/notes/create?tag=${encodeURIComponent(window.location.href)}`);
  };

  const handleClose = () => {
    resetPost();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <CohortBoardPostUI
      isOpen={isOpen}
      onClose={handleClose}
      postData={postData}
      loading={loading}
      likeState={likeState}
      shareState={shareState}
      onLike={onLike}
      onShare={onShare}
      onTagToNote={handleTagToNote}
      cohortData={cohortData}
      isEditable={postData?.isEditable || false}
      onEdit={handleEdit}
      onDelete={onDeletePost}
      commentsData={commentsData}
      onCommentLike={onCommentLike}
      onCommentDelete={onDeleteComment}
      onCommentShare={onCommentShare}
      onCommentSubmit={onCommentSubmit}
    />
  );
};

export default CohortBoardPostController;