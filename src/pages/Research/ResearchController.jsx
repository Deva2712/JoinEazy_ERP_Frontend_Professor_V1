// src/pages/Research/ResearchController.jsx
import React from "react";
import ResearchUI from "./ResearchUI";
import { useResearchData } from "./components/Useresearchdata";
import { useResearchActions } from "./components/Usersearchactions";

const ResearchController = () => {
    const dataState = useResearchData();
    const { filtered, handlers } = useResearchActions(dataState);

    const {
        myApplications, allUsers, selectedItem, selectedUser,
        processedSelectedUser, availableParticipants, userPortfolio,
        availableProjects, availablePublications, myProjects, myPublications,
        personalSearchQuery, exploreSearchQuery, filters, setFilters,
        loading, error, viewMode, fetchData,
        setPersonalSearchQuery, setExploreSearchQuery,
    } = dataState;

    const {
        handleToggleStar, handleApply, handleApplicationAction,
        handleCreateSubmit, handleUpdateSubmit, handleUpdateUser,
        handleAddTimelineEvent, handleUpdateTimelineEvent, handleDeleteTimelineEvent,
        onUpdateRole, onCreateRole, onDeleteRole,
        handleTabChange, handleSetSelectedItem, handleViewUser, handleClearUser,
    } = handlers;

    return (
        <ResearchUI
            data={{
                myProjects:               filtered.filteredMyProjects,
                myPublications:           filtered.filteredMyPublications,
                availableProjects:        filtered.filteredAvailableProjects,
                availablePublications:    filtered.filteredAvailablePublications,
                rawAvailableProjects:     availableProjects,
                rawAvailablePublications: availablePublications,
                rawMyProjects:            myProjects,
                rawMyPublications:        myPublications,
                myApplications,
                timelineEvents:           selectedItem?.data?.timeline || [],
                availableParticipants,
                allUsers,
                userProjects:             userPortfolio.projects,
                userPublications:         userPortfolio.publications,
                selectedUser:             processedSelectedUser,
            }}
            view={{
                loading, error, viewMode, selectedItem, selectedUser,
                personalSearchQuery, exploreSearchQuery, filters,
            }}
            actions={{
                onRefresh:               fetchData,
                onTabChange:             handleTabChange,
                onApply:                 handleApply,
                onApplicationAction:     handleApplicationAction,
                onStar:                  handleToggleStar,
                onCreateSubmit:          handleCreateSubmit,
                onUpdateSubmit:          handleUpdateSubmit,
                onCreateRole,
                onUpdateRole,
                onDeleteRole,
                setFilters,
                setSelectedItem:         handleSetSelectedItem,
                onViewUser:              handleViewUser,
                onClearUser:             handleClearUser,
                onUpdateUser:            handleUpdateUser,
                onPersonalSearchChange:  setPersonalSearchQuery,
                onExploreSearchChange:   setExploreSearchQuery,
                onAddTimelineEvent:      handleAddTimelineEvent,
                onUpdateTimelineEvent:   handleUpdateTimelineEvent,
                onDeleteTimelineEvent:   handleDeleteTimelineEvent,
            }}
        />
    );
};

export default ResearchController;