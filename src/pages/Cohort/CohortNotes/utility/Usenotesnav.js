// src/pages/CohortNotes/utility/useNotesNav.js

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const useNotesNav = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const parts    = location.pathname.split("/");
    const lastPart = parts[parts.length - 1];
    const isCreate = location.pathname.endsWith("/create");
    const isEdit   = !isNaN(lastPart) && lastPart !== "" && lastPart !== "create";
    setShowCreateModal(isCreate || isEdit);
  }, [location.pathname]);

  const handleCreateNote = () => {
    const base = location.pathname.endsWith("/") ? location.pathname : `${location.pathname}/`;
    navigate(`${base}create`);
  };

  const handleNoteClick = (noteId) => {
    const base = location.pathname.endsWith("/") ? location.pathname : `${location.pathname}/`;
    navigate(`${base}${noteId}`);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    const parts    = location.pathname.split("/");
    const lastPart = parts[parts.length - 1];

    if (location.pathname.endsWith("/create")) {
      navigate(location.pathname.replace("/create", ""), { replace: true });
    } else if (!isNaN(lastPart) && lastPart !== "" && lastPart !== "create") {
      navigate(parts.slice(0, -1).join("/"), { replace: true });
    } else {
      navigate(parts.slice(0, -1).join("/") || location.pathname, { replace: true });
    }
  };

  return { showCreateModal, handleCreateNote, handleNoteClick, handleCloseCreateModal };
};

export default useNotesNav;