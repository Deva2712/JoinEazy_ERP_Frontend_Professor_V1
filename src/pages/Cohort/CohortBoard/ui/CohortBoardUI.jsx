
import React from "react";
import { Search, Plus, MessageCircle } from "lucide-react";
import PostCard from "../components/PostCard";
import BoardSidebar from "../components/BoardSidebar";
import FilterDropdown from "../components/FilterDropdown";

const CohortBoardUI = ({
  boardData, searchQuery, onSearchChange, activeFilters, postTypeFilters,
  onFilterChange, onCreatePost, showFilterDropdown, onFilterDropdownToggle,
  sortBy, postsFrom, sortOptions, postsFromOptions, onSortChange, onPostsFromChange,
  onLike, onPostClick, loading, error, onRetry,
}) => {
  const filteredPosts = boardData?.posts?.filter((post) => {
    const matchesSearch = !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilters.length === 0 || activeFilters.includes(post.type);
    return matchesSearch && matchesFilter;
  }) || [];

  if (loading) return (
    <div className="flex flex-col h-full items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4" />
      <p className="text-gray-600">Loading board posts...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col h-full items-center justify-center py-20">
      <div className="text-red-500 mb-4">Failed to load board posts: {error}</div>
      <button onClick={onRetry} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">Retry</button>
    </div>
  );

  return (
    <div className="pb-[92px] py-5 sm:px-4 sm:py-6 sm:pb-7 mdg:pb-5 w-full max-w-[72rem] mx-auto">
      <div className="flex gap-5 sm:gap-6 mdg:flex-row flex-col">

        {/* Left - Posts */}
        <div className="flex-1 flex flex-col gap-5 sm:gap-6">
          {/* Filter + Search */}
          <div className="w-full px-4 sm:px-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex flex-1 items-center gap-3 sm:gap-4">
              <FilterDropdown
                showFilterDropdown={showFilterDropdown}
                onFilterDropdownToggle={onFilterDropdownToggle}
                sortBy={sortBy} sortOptions={sortOptions} onSortChange={onSortChange}
                activeFilters={activeFilters} postTypeFilters={postTypeFilters} onFilterChange={onFilterChange}
                postsFrom={postsFrom} postsFromOptions={postsFromOptions} onPostsFromChange={onPostsFromChange}
              />
              <div className="relative flex-1 w-full" style={{ maxWidth: "26rem" }}>
                <Search size={15} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                <input type="text" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search posts..."
                  className="w-full pl-9 pr-4 py-2 border border-[#D3D6DA] rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-gray-600"
                  style={{ height: "38px", fontSize: "14px" }} />
              </div>
            </div>
          </div>

          {/* Posts List */}
          {filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <MessageCircle size={64} className="text-gray-400 mb-4" strokeWidth={1.5} />
              <h3 className="text-2xl font-semibold text-black mb-2">No Posts Found</h3>
              <p className="text-gray-600 text-center max-w-md leading-[1.6]">
                {searchQuery || activeFilters.length > 0 ? "Try adjusting your search or filters." : "Be the first to start a conversation on this board!"}
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => <PostCard key={post.id} post={post} onLike={onLike} onPostClick={onPostClick} />)
          )}
        </div>

        {/* Right - Sidebar */}
        <BoardSidebar boardData={boardData} onCreatePost={onCreatePost} />
      </div>

      {/* Mobile FAB */}
      <button onClick={onCreatePost}
        className="fixed bottom-[92px] md:bottom-5 right-5 w-14 h-14 bg-[#1E61F0] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 mdg:hidden z-50">
        <Plus size={24} />
      </button>
    </div>
  );
};

export default CohortBoardUI;