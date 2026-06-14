import React, { useState, useRef, useEffect } from "react";
import {
  Calendar, Building2, Users, Badge, Share2, Clock,
  BookOpen, FileText, User, Mail, Phone, MapPin, Link,
  Star, Heart, Tag, Folder, Globe, Lock, Eye, Bell,
} from "lucide-react";

import ContainerCard from "../CohortDetails/components/ContainerCard";
import CreateSectionModal from "../CohortDetails/components/CreateSectionModal";
import QuickDetails from "../CohortDetails/components//QuickDetails";

// Icon string → Lucide component
const ICON_MAP = {
  Calendar, Building2, Users, Badge, Share2, Clock,
  BookOpen, FileText, User, Mail, Phone, MapPin, Link,
  Star, Heart, Tag, Folder, Globe, Lock, Eye, Bell,
};

const getIconComponent = (iconName) => {
  return ICON_MAP[iconName] || FileText;
};

const CohortDetailsUI = ({
  cohortId,
  detailsData,
  user_type,
  quickDetails,
  handleSubSectionSave,
  handleSubSectionCreate,
  handleSubSectionDelete,
}) => {
  const [editingContainer, setEditingContainer] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", content: "" });
  const [isCreatingSection, setIsCreatingSection] = useState(false);
  const [createForm, setCreateForm] = useState({ title: "", content: "" });
  const [expandedCards, setExpandedCards] = useState({});
  const [quickDetailShareState, setQuickDetailShareState] = useState({
    text: "Share this Page",
    clicked: false,
  });
  const [saveError, setSaveError] = useState("");
  const [createError, setCreateError] = useState("");

  const containerRefs = useRef({});
  const bottomRef = useRef(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash.startsWith("block-")) {
        const id = hash.replace("block-", "");
        const el = containerRefs.current[id];
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 100);
        }
      }
    };
    if (window.location.hash) handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [detailsData]);

  const handleEditClick = (container) => {
    setEditingContainer(container.id);
    setEditForm({ title: container.title, content: container.content });
    setSaveError("");
  };

  const handleCancelEdit = () => {
    setEditingContainer(null);
    setEditForm({ title: "", content: "" });
  };

  const handleSave = async () => {
    const error = await handleSubSectionSave({
      id: editingContainer,
      title: editForm.title,
      content: editForm.content,
    });
    if (error) { setSaveError(error); return; }
    setEditingContainer(null);
    setEditForm({ title: "", content: "" });
    setSaveError("");
  };

  const handleCreate = async () => {
    const error = await handleSubSectionCreate({
      title: createForm.title,
      content: createForm.content,
    });
    if (error) { setCreateError(error); return; }
    setIsCreatingSection(false);
    setCreateForm({ title: "", content: "" });
    setCreateError("");
  };

  const handleCancelCreate = () => {
    setIsCreatingSection(false);
    setCreateForm({ title: "", content: "" });
    setCreateError("");
  };

  const handleQuickDetailShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setQuickDetailShareState({ text: "Copied", clicked: true });
      setTimeout(() => {
        setQuickDetailShareState({ text: "Share this Page", clicked: false });
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!detailsData?.containers?.length) {
    return (
      <div className="p-10 text-center text-gray-500">
        No content available
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {/* LEFT */}
      <div className="flex-1 space-y-4">
        {detailsData.containers.map((c) => (
          <ContainerCard
            key={c.id}
            container={c}
            user_type={user_type}
            isEditing={editingContainer === c.id}
            editForm={editForm}
            setEditForm={setEditForm}
            handleEditClick={handleEditClick}
            handleCancelEdit={handleCancelEdit}
            handleSave={handleSave}
            handleDeleteSection={handleSubSectionDelete}
            expandedCards={expandedCards}
            setExpandedCards={setExpandedCards}
            containerRefs={containerRefs}
          />
        ))}

        <CreateSectionModal
          isOpen={isCreatingSection}
          createForm={createForm}
          setCreateForm={setCreateForm}
          handleCreate={handleCreate}
          handleCancelCreate={handleCancelCreate}
          createError={createError}
        />

        <div ref={bottomRef} />
      </div>

      {/* RIGHT */}
      <div className="w-[300px] sticky top-4">
        <QuickDetails
          quickDetails={quickDetails}
          getIconComponent={getIconComponent}
          handleQuickDetailShare={handleQuickDetailShare}
          quickDetailShareState={quickDetailShareState}
        />
      </div>
    </div>
  );
};

export default CohortDetailsUI;