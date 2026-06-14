import { useState, useEffect } from "react";
import { cohortService } from "@/api/services/cohort.service";
import { uploadService } from "@/api/services/upload.service";

const useCohortBoardCreate = ({ cohortId, cohortData, editMode, editPostId, onClose }) => {
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    postFor: "Everyone",
    selectedMember: null,
    selectedGroup: null,
    postType: "",
  });
  const [error, setError] = useState("");

  const user_type = cohortData?.user_type || 0;
  const memberType = cohortData?.memberType || 1;
  const membersList = cohortData?.members || [];
  const groupsList = cohortData?.groups || [];

  const resetForm = () => {
    setPostData({
      title: "",
      content: "",
      postFor: "Everyone",
      selectedMember: null,
      selectedGroup: null,
      postType: "",
    });
    setError("");
  };

  useEffect(() => {
    resetForm();
  }, [editMode]);

  const getPostForOptions = () => {
    const options = ["Everyone"];
    if (user_type === 0) {
      options.push("Admin");
    } else {
      options.push("Select Member");
      if (memberType === 1) options.push("Select Group");
    }
    return options;
  };

  const handleSave = async () => {
    try {
      const response = editMode && editPostId
        ? await cohortService.updatePost(cohortId, editPostId, postData)
        : await cohortService.createPost(cohortId, postData);

      if (!response.success) {
        throw new Error(response.error || "Failed to save post");
      }

      onClose();
    } catch (err) {
      console.error("Error saving post:", err);
      setError(err.message || "Failed to save post. Please try again.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleCoverUpload = async (file) => {
    try {
      const response = await uploadService.uploadFile(file, "post_cover");
      if (!response.success) throw new Error(response.error || "Failed to upload cover image");

      setPostData((prev) => ({ ...prev, coverImage: response.data.fileUrl }));
      return [true, "Cover image uploaded successfully"];
    } catch (err) {
      console.error("Error uploading cover image:", err);
      return [false, err.message || "Failed to upload cover image. Please try again."];
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return {
    postData,
    setPostData,
    error,
    user_type,
    memberType,
    membersList,
    groupsList,
    postForOptions: getPostForOptions(),
    handleSave,
    handleCoverUpload,
    handleClose,
  };
};

export default useCohortBoardCreate;