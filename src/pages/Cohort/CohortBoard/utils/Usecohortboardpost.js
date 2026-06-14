import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { cohortService } from "@/api/services/cohort.service";

const useCohortBoardPost = ({ cohortId, isOpen }) => {
  const location = useLocation();
  const { postId } = useParams();

  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeState, setLikeState] = useState(false);
  const [shareState, setShareState] = useState({ text: "Share", clicked: false });
  const [commentsData, setCommentsData] = useState([]);

  // Extract postId from URL if useParams doesn't work
  const extractPostIdFromUrl = () => {
    const pathParts = location.pathname.split("/");
    const boardIndex = pathParts.indexOf("board");
    if (boardIndex > 0 && pathParts[boardIndex + 1]) {
      const extracted = parseInt(pathParts[boardIndex + 1]);
      return !isNaN(extracted) ? extracted : null;
    }
    return null;
  };

  const currentPostId = postId || extractPostIdFromUrl();

  const fetchPostData = async (id) => {
    try {
      console.log("Fetching post data for postId:", id);
      setLoading(true);

      const response = await cohortService.getBoardPosts(cohortId);
      if (!response.success) throw new Error(response.error || "Failed to fetch post data");

      const post = response.data.posts.find((p) => p.id === parseInt(id));
      if (!post) throw new Error("Post not found");

      console.log("Post data loaded:", post);
      setPostData(post);
      setLikeState(post.isLiked || false);
      setCommentsData(post.comments || []);
    } catch (error) {
      console.error("Error fetching post data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered - isOpen:", isOpen, "postId:", currentPostId);

    if (isOpen && currentPostId) {
      fetchPostData(currentPostId);
    } else if (!isOpen) {
      setLoading(true);
      setPostData(null);
    }
  }, [isOpen, currentPostId, location.pathname]);

  const handleLike = () => {
    setLikeState((prev) => !prev);
    if (postData) {
      setPostData((prev) => ({
        ...prev,
        likes: likeState ? prev.likes - 1 : prev.likes + 1,
        isLiked: !likeState,
      }));
    }
  };

  const handleCommentLike = (commentId) => {
    setCommentsData((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, isLiked: !comment.isLiked, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1 }
          : comment
      )
    );
  };

  const handleCommentShare = async (commentId) => {
    try {
      const commentUrl = `${window.location.href}#comment-${commentId}`;
      await navigator.clipboard.writeText(commentUrl);
      console.log("Comment link copied:", commentUrl);
      setTimeout(() => {
        document.getElementById(`comment-${commentId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } catch (error) {
      console.error("Failed to copy comment link:", error);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareState({ text: "Copied", clicked: true });
      setTimeout(() => setShareState({ text: "Share", clicked: false }), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handleCommentSubmit = (commentText) => {
    console.log("New comment submitted:", commentText);
  };

  const handleDeletePost = () => {
    console.log("Delete post:", postData?.id);
  };

  const handleDeleteComment = (commentId) => {
    console.log("Delete comment:", commentId);
  };

  const resetPost = () => {
    setPostData(null);
    setLoading(true);
  };

  return {
    postData,
    loading,
    likeState,
    shareState,
    commentsData,
    onLike: handleLike,
    onShare: handleShare,
    onCommentLike: handleCommentLike,
    onCommentShare: handleCommentShare,
    onCommentSubmit: handleCommentSubmit,
    onDeletePost: handleDeletePost,
    onDeleteComment: handleDeleteComment,
    resetPost,
  };
};

export default useCohortBoardPost;