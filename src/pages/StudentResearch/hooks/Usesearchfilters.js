// src/pages/StudentResearch/hooks/useResearchFilters.js
import { useState, useMemo } from "react";

const useResearchFilters = ({
    myProjects,
    myPublications,
    availableProjects,
    availablePublications,
}) => {
    const [personalSearchQuery, setPersonalSearchQuery] = useState("");
    const [exploreSearchQuery,  setExploreSearchQuery]  = useState("");

    const [filters, setFilters] = useState({
        status:            "all",
        sortBy:            "newest",
        showProjects:      true,
        showPublications:  true,
        category:          "all",
        collaborationType: "all",
        year:              "all",
    });

    const calculateRelevance = (item, query, activeCategory) => {
        let score = 0;
        const text = `${item.title} ${item.description ?? ""} ${item.abstract ?? ""}`.toLowerCase();
        const searchLower = query.toLowerCase();

        if (query) {
            if (item.title.toLowerCase().includes(searchLower)) score += 50;
            if (item.openRoles?.some((r) => r.roleName.toLowerCase().includes(searchLower))) score += 40;
            if (text.includes(searchLower)) score += 20;
        }
        if (activeCategory !== "all" && item.category === activeCategory) score += 30;

        const ageInDays =
            (new Date() - new Date(item.createdAt || item.publishedDate)) / (1000 * 3600 * 24);
        score += Math.max(0, 20 - ageInDays / 30);
        score += (item.starsCount || 0) * 2;
        return score;
    };

    const processItems = (items, query, currentFilters) => {
        const lowerQuery = query.toLowerCase();

        return items
            .filter((item) => {
                const matchesStatus =
                    currentFilters.status === "all" || item.status === currentFilters.status;
                const matchesCategory =
                    currentFilters.category === "all" || item.category === currentFilters.category;
                const matchesCollab =
                    currentFilters.collaborationType === "all" ||
                    item.collaborationType === currentFilters.collaborationType;
                const matchesYear =
                    currentFilters.year === "all" ||
                    (item.createdAt &&
                        new Date(item.createdAt).getFullYear().toString() === currentFilters.year) ||
                    (item.publishedDate &&
                        new Date(item.publishedDate).getFullYear().toString() === currentFilters.year);
                const matchesSearch =
                    !query ||
                    item.title?.toLowerCase().includes(lowerQuery) ||
                    item.professorName?.toLowerCase().includes(lowerQuery) ||
                    item.abstract?.toLowerCase().includes(lowerQuery) ||
                    item.category?.toLowerCase().includes(lowerQuery) ||
                    item.openRoles?.some(
                        (r) =>
                            r.roleName?.toLowerCase().includes(lowerQuery) ||
                            r.title?.toLowerCase().includes(lowerQuery),
                    ) ||
                    item.keywords?.some((k) => k.toLowerCase().includes(lowerQuery)) ||
                    item.collaborators?.some((c) => c.toLowerCase().includes(lowerQuery)) ||
                    item.coAuthors?.some((a) => a.toLowerCase().includes(lowerQuery));

                return matchesStatus && matchesCategory && matchesCollab && matchesYear && matchesSearch;
            })
            .sort((a, b) => {
                if (currentFilters.sortBy === "stars")
                    return (b.starsCount || 0) - (a.starsCount || 0);
                if (currentFilters.sortBy === "newest")
                    return (
                        new Date(b.createdAt || b.publishedDate) -
                        new Date(a.createdAt || a.publishedDate)
                    );
                if (currentFilters.sortBy === "relevance") {
                    const diff =
                        calculateRelevance(b, exploreSearchQuery, filters.category) -
                        calculateRelevance(a, exploreSearchQuery, filters.category);
                    return diff !== 0
                        ? diff
                        : new Date(b.createdAt || b.publishedDate) -
                          new Date(a.createdAt || a.publishedDate);
                }
                return 0;
            });
    };

    const filteredMyProjects = useMemo(
        () => processItems(myProjects, personalSearchQuery, filters),
        [myProjects, personalSearchQuery, filters],
    );
    const filteredMyPublications = useMemo(
        () => processItems(myPublications, personalSearchQuery, filters),
        [myPublications, personalSearchQuery, filters],
    );
    const filteredAvailableProjects = useMemo(
        () => processItems([...availableProjects, ...myProjects], exploreSearchQuery, filters),
        [availableProjects, myProjects, exploreSearchQuery, filters],
    );
    const filteredAvailablePublications = useMemo(
        () => processItems([...availablePublications, ...myPublications], exploreSearchQuery, filters),
        [availablePublications, myPublications, exploreSearchQuery, filters],
    );

    return {
        filters,
        setFilters,
        personalSearchQuery,
        exploreSearchQuery,
        onPersonalSearchChange: setPersonalSearchQuery,
        onExploreSearchChange:  setExploreSearchQuery,
        filteredMyProjects,
        filteredMyPublications,
        filteredAvailableProjects,
        filteredAvailablePublications,
    };
};

export default useResearchFilters;