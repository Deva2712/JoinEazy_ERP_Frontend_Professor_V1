// src/pages/StudentResearch/StudentResearchController.jsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useResearchData    from "./hooks/Useresearchdata";
import useResearchFilters from "./hooks/Usesearchfilters";
import StudentResearchUI  from "./StudentResearchUI";

const StudentResearchController = () => {
    const { tab } = useParams();
    const navigate = useNavigate();
    const viewMode = tab || "my-projects";

    const {
        availableProjects,
        availablePublications,
        myProjects,
        myPublications,
        myApplications,
        allUsers,
        loading,
        error,
        selectedItem,
        setSelectedItem,
        fetchData,
        handleApply,
        handleToggleStar,
    } = useResearchData();

    const {
        filters,
        setFilters,
        personalSearchQuery,
        exploreSearchQuery,
        onPersonalSearchChange,
        onExploreSearchChange,
        filteredMyProjects,
        filteredMyPublications,
        filteredAvailableProjects,
        filteredAvailablePublications,
    } = useResearchFilters({
        myProjects,
        myPublications,
        availableProjects,
        availablePublications,
    });

    useEffect(() => {
        document.title = "Research Opportunities";
        fetchData();
    }, []);

    const handleTabChange = (newTab) => {
        setSelectedItem(null);
        navigate(`/student-research/${newTab}`);
    };

    const handleSetSelectedItem = (item) => {
        if (!item) {
            navigate(`/student-research/${viewMode}`);
        } else {
            const identifier =
                item.type === "publication"
                    ? item.data.url || item.data.id
                    : item.data.id;
            navigate(
                `/student-research/${viewMode}/${
                    item.type === "project" ? "project" : "publication"
                }/${identifier}`,
            );
        }
    };

    return (
        <StudentResearchUI
            data={{
                myProjects:               filteredMyProjects,
                myPublications:           filteredMyPublications,
                availableProjects:        filteredAvailableProjects,
                availablePublications:    filteredAvailablePublications,
                rawAvailableProjects:     availableProjects,
                rawAvailablePublications: availablePublications,
                rawMyProjects:            myProjects,
                rawMyPublications:        myPublications,
                myApplications,
                allUsers,
            }}
            view={{
                loading,
                error,
                viewMode,
                selectedItem,
                personalSearchQuery,
                exploreSearchQuery,
                filters,
            }}
            actions={{
                onRefresh:              fetchData,
                onTabChange:            handleTabChange,
                onApply:                handleApply,
                onStar:                 handleToggleStar,
                setSelectedItem:        handleSetSelectedItem,
                setFilters,
                onPersonalSearchChange,
                onExploreSearchChange,
            }}
        />
    );
};

export default StudentResearchController;