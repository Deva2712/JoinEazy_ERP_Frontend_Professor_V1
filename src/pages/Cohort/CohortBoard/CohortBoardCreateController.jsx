import React from "react";
import CohortBoardCreateUI from "./ui/CohortBoardCreateUI";
import useCohortBoardCreate from "./utils/Usecohortboardcreate";

const CohortBoardCreateController = ({
  cohortId,
  cohortData,
  isOpen,
  onClose,
  editMode = false,
  editPostId = null,
}) => {
  const {
    postData,
    setPostData,
    error,
    user_type,
    memberType,
    membersList,
    groupsList,
    postForOptions,
    handleSave,
    handleCoverUpload,
    handleClose,
  } = useCohortBoardCreate({ cohortId, cohortData, editMode, editPostId, onClose });

  return (
    <CohortBoardCreateUI
      isOpen={isOpen}
      onClose={handleClose}
      postData={postData}
      setPostData={setPostData}
      handleSave={handleSave}
      error={error}
      postForOptions={postForOptions}
      membersList={membersList}
      groupsList={groupsList}
      memberType={memberType}
      user_type={user_type}
      handleCoverUpload={handleCoverUpload}
      cohortId={cohortId}
      editMode={editMode}
      editPostId={editPostId}
    />
  );
};

export default CohortBoardCreateController;