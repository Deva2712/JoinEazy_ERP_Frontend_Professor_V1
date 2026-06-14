import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const useCourseModals = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [editCourseId, setEditCourseId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    const createIndex = pathSegments.indexOf("create");
    const editIndex = pathSegments.findIndex((s) => s === "edit");
    const coursesIndex = pathSegments.indexOf("courses");

    if (coursesIndex !== -1 && pathSegments[coursesIndex + 1] && !isNaN(pathSegments[coursesIndex + 1])) {
      const courseId = pathSegments[coursesIndex + 1];
      if (!pathSegments.includes("create") && !pathSegments.includes("edit")) {
        setSelectedCourseId(courseId);
        setIsContentModalOpen(true);
        return;
      }
    }
    if (createIndex !== -1) {
      setIsCreateModalOpen(true); setIsEditMode(false); setEditCourseId(null);
    } else if (editIndex !== -1 && editIndex > 0) {
      const courseId = pathSegments[editIndex - 1];
      if (courseId && !isNaN(courseId)) {
        setEditCourseId(parseInt(courseId)); setIsEditMode(true); setIsCreateModalOpen(true);
      }
    }
  }, [location.pathname]);

  const handleCreateClick = () => {
    setIsEditMode(false); setEditCourseId(null); setIsCreateModalOpen(true);
    const currentPath = location.pathname;
    if (!currentPath.includes("/create")) navigate(`${currentPath}/create`, { replace: true });
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false); setIsEditMode(false); setEditCourseId(null);
    const currentPath = location.pathname;
    if (currentPath.includes("/create")) {
      navigate(currentPath.replace("/create", ""), { replace: true });
    } else if (currentPath.includes("/edit")) {
      const pathSegments = currentPath.split("/");
      const editIndex = pathSegments.findIndex((s) => s === "edit");
      if (editIndex > 0) { pathSegments.splice(editIndex - 1, 2); navigate(pathSegments.join("/"), { replace: true }); }
    }
  };

  const handleCourseClick = (courseId) => {
    setSelectedCourseId(courseId); setIsContentModalOpen(true);
    const currentPath = location.pathname;
    const courseIdStr = courseId.toString();
    if (!currentPath.endsWith(`/${courseIdStr}`)) {
      navigate(`${currentPath.replace(/\/$/, "")}/${courseIdStr}`, { replace: true });
    }
  };

  const handleCloseContentModal = () => {
    setIsContentModalOpen(false); setSelectedCourseId(null);
    const currentPath = location.pathname;
    const pathSegments = currentPath.split("/");
    const coursesIndex = pathSegments.indexOf("courses");
    if (coursesIndex !== -1 && pathSegments[coursesIndex + 1] && !isNaN(pathSegments[coursesIndex + 1])) {
      pathSegments.splice(coursesIndex + 1, 1);
      navigate(pathSegments.join("/"), { replace: true });
    }
  };

  return {
    isCreateModalOpen, isContentModalOpen, selectedCourseId,
    editCourseId, isEditMode,
    handleCreateClick, handleCloseCreateModal, handleCourseClick, handleCloseContentModal,
  };
};

export default useCourseModals;