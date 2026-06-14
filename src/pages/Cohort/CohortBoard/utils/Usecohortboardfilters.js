import { useState } from "react";

// Available filter options for post types
const POST_TYPE_FILTERS = [
  { id: "all", label: "Everything" },
  { id: "announcements", label: "Announcements" },
  { id: "discussions", label: "Discussions" },
  { id: "questions", label: "Questions" },
  { id: "resources", label: "Resources" },
];

// Sort options
const SORT_OPTIONS = [
  { id: "latest", label: "Sort by Latest" },
  { id: "oldest", label: "Sort by Oldest" },
];

// Posts from options
const POSTS_FROM_OPTIONS = [
  { id: "everyone", label: "Everyone" },
  { id: "admin", label: "Admin" },
  { id: "me", label: "Me" },
];

const useCohortBoardFilters = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortBy, setSortBy] = useState("latest");
  const [postsFrom, setPostsFrom] = useState("everyone");

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filterId) => {
    setActiveFilters((prev) => {
      if (filterId === "all") return [];
      if (prev.includes(filterId)) return prev.filter((id) => id !== filterId);
      return [...prev, filterId];
    });
  };

  const handleFilterDropdownToggle = () => {
    setShowFilterDropdown((prev) => !prev);
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
  };

  const handlePostsFromChange = (postsFromType) => {
    setPostsFrom(postsFromType);
  };

  return {
    // State
    searchQuery,
    activeFilters,
    showFilterDropdown,
    sortBy,
    postsFrom,

    // Static config
    postTypeFilters: POST_TYPE_FILTERS,
    sortOptions: SORT_OPTIONS,
    postsFromOptions: POSTS_FROM_OPTIONS,

    // Handlers
    onSearchChange: handleSearchChange,
    onFilterChange: handleFilterChange,
    onFilterDropdownToggle: handleFilterDropdownToggle,
    onSortChange: handleSortChange,
    onPostsFromChange: handlePostsFromChange,
  };
};

export default useCohortBoardFilters;