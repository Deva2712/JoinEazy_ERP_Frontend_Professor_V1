// src/pages/Research/views/ExploreResearchView.jsx

import React, { useState, useMemo, useEffect } from "react";
import {
	Search,
	ChevronRight,
	ArrowLeft,
	TrendingUp,
	Clock,
	FileSearch,
	Users,
	Inbox,
	SlidersHorizontal,
} from "lucide-react";
import ResearchCard from "../components/ResearchCard";

const ExploreResearchView = ({
	availableProjects = [],
	allPublications = [],
	allUsers = [],
	onSelectItem,
	onViewUser,
	searchQuery = "",
	onSearchChange,
	filters,
	onOpenFilters,
}) => {
	const [expandedSection, setExpandedSection] = useState(null);
	const [isMobile, setIsMobile] = useState(false);

	// Handles responsive slice logic for Contributors grid
	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 1024);
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	const toggleSection = (section) => {
		setExpandedSection((prev) => (prev === section ? null : section));
	};

	const processedData = useMemo(() => {
		let combined = [];
		if (filters.showProjects) {
			combined = [
				...combined,
				...availableProjects.map((p) => ({
					...p,
					itemType: "project",
				})),
			];
		}
		if (filters.showPublications) {
			combined = [
				...combined,
				...allPublications.map((p) => ({
					...p,
					itemType: "publication",
				})),
			];
		}

		return Array.from(
			new Map(combined.map((item) => [item.id, item])).values(),
		);
	}, [
		availableProjects,
		allPublications,
		filters.showProjects,
		filters.showPublications,
	]);

	const searchResults = useMemo(() => {
		if (!searchQuery) return [];
		const query = searchQuery.toLowerCase();

		return processedData
			.map((item) => {
				const matchedRole = item.openRoles?.find(
					(role) =>
						role.roleName?.toLowerCase().includes(query) ||
						role.title?.toLowerCase().includes(query) || 
						role.description?.toLowerCase().includes(query),
				);
				
				return {
					...item,
					currentMatch: matchedRole ? (matchedRole.roleName || matchedRole.title) : null,
				};
			})
			.filter((item) => {
				return (
					item.title?.toLowerCase().includes(query) ||
					item.abstract?.toLowerCase().includes(query) ||
					item.professorName?.toLowerCase().includes(query) ||
					item.currentMatch !== null ||
					item.keywords?.some(k => k.toLowerCase().includes(query))
				);
			});
	}, [processedData, searchQuery]);

	const filteredUsers = useMemo(() => {
		if (!searchQuery) return [];
		const query = searchQuery.toLowerCase();
		return allUsers.filter(
			(user) =>
				user.name?.toLowerCase().includes(query) ||
				user.role?.toLowerCase().includes(query) ||
				user.department?.toLowerCase().includes(query),
		);
	}, [allUsers, searchQuery]);

	const popularItems = useMemo(
		() =>
			[...processedData].sort(
				// trendingScore = (stars x2 + applicants) x recency boost
				(a, b) => (b.trendingScore || b.starsCount || 0) - (a.trendingScore || a.starsCount || 0),
			),
		[processedData],
	);

	const newItems = useMemo(
		() =>
			[...processedData].sort(
				(a, b) =>
					new Date(b.createdAt || b.publishedDate) -
					new Date(a.createdAt || a.publishedDate),
			),
		[processedData],
	);

	const SectionHeader = ({
		title,
		icon: Icon,
		iconColor,
		onToggle,
		isExpanded,
		showButton,
	}) => (
		<div className={`flex items-center gap-4 mb-4 transition-all duration-300 ${isExpanded ? "flex-row" : "justify-between"}`}>
			{showButton && isExpanded && (
				<button
					onClick={onToggle}
					className="flex items-center justify-center size-9 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-400 bg-white dark:bg-gray-800 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-sm transition-all"
				>
					<ArrowLeft className="size-4" />
				</button>
			)}

			<div className="flex-1 flex items-center gap-3">
				{Icon && <Icon className={`size-5 ${iconColor}`} />}
				<h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
					{title}
				</h2>
			</div>

			{showButton && !isExpanded && (
				<button
					onClick={onToggle}
					className="inline-flex items-center gap-2.5 py-2 text-gray-600 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-400 font-semibold transition-all group rounded-full shrink-0"
				>
					<span className="text-xs font-semibold hidden sm:inline uppercase tracking-widest">
						View More
					</span>
					<div className="flex items-center justify-center size-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 group-hover:border-emerald-200 dark:group-hover:border-emerald-800 group-hover:shadow-sm transition-all">
						<ChevronRight className="size-4" />
					</div>
				</button>
			)}
		</div>
	);

	const EmptySectionState = ({ message }) => (
		<div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl bg-gray-50/30 dark:bg-gray-900/10">
			<Inbox className="size-8 text-gray-300 dark:text-gray-700 mb-3" />
			<p className="text-sm text-gray-400 italic text-center">
				{message}
			</p>
		</div>
	);

	return (
		<div className="flex flex-col gap-6">
            {/* Search & Filter Header */}
           <div className="flex gap-3">
                <div className="relative group flex-1">
                    <Search className="size-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search titles, authors, roles..."
                        value={searchQuery}
                        onChange={(e) => {
                            onSearchChange(e.target.value);
                            setExpandedSection(null);
                        }}
                        className="w-full pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm outline-none focus:border-emerald-500 transition-all"
                    />
                </div>
				{(searchQuery || expandedSection) && (
				<button
					onClick={onOpenFilters}
					className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 font-bold text-sm transition-all hover:border-emerald-500/50 active:scale-95"
                >
                    <SlidersHorizontal className="size-5 text-emerald-700" />
                    <span className="hidden sm:inline text-gray-900 dark:text-white">Filters</span>
                </button>
				)}
			</div>

			<div className="relative overflow-hidden">
                <main className="w-full transition-all duration-300">
					{!searchQuery ? (
						<div className="space-y-8">
							{/* Popular Research UI Section */}
							{(!expandedSection || expandedSection === "popular") && (
								<section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
									<SectionHeader
										title="Popular Research"
										icon={TrendingUp}
										iconColor="text-orange-500"
										showButton={popularItems.length > 3 || expandedSection === "popular"}
										isExpanded={expandedSection === "popular"}
										onToggle={() => toggleSection("popular")}
									/>
									{popularItems.length > 0 ? (
										<div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
											{(expandedSection === "popular" ? popularItems : popularItems.slice(0, 3)).map((item) => (
												<ResearchCard
													key={item.id}
													item={item}
													type={item.itemType}
													onClick={() => onSelectItem({ type: item.itemType, data: item })}
													onStar={onStar}
												/>
											))}
										</div>
									) : (
										<EmptySectionState message="No popular research items found." />
									)}
								</section>
							)}

							{/* Newest Arrivals UI Section */}
							{(!expandedSection || expandedSection === "newest") && (
								<section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
									<SectionHeader
										title="Newest Arrivals"
										icon={Clock}
										iconColor="text-blue-500"
										showButton={newItems.length > 3 || expandedSection === "newest"}
										isExpanded={expandedSection === "newest"}
										onToggle={() => toggleSection("newest")}
									/>
									{newItems.length > 0 ? (
										<div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
											{(expandedSection === "newest" ? newItems : newItems.slice(0, 3)).map((item) => (
												<ResearchCard
													key={item.id}
													item={item}
													type={item.itemType}
													onClick={() => onSelectItem({ type: item.itemType, data: item })}
													onStar={onStar}
												/>
											))}
										</div>
									) : (
										<EmptySectionState message="No new research has been added recently." />
									)}
								</section>
							)}
						</div>
					) : (
						<div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
							{/* Contributors Grid */}
							{filteredUsers.length > 0 && (!expandedSection || expandedSection === "contributors") && (
								<section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
									<SectionHeader
										title="Contributors"
										icon={Users}
										iconColor="text-amber-600"
										showButton={filteredUsers.length > (isMobile ? 4 : 5) || expandedSection === "contributors"}
										isExpanded={expandedSection === "contributors"}
										onToggle={() => toggleSection("contributors")}
									/>
									<div className="grid gap-4 transition-all duration-300 grid-cols-2 lg:grid-cols-5">
										{(expandedSection === "contributors"
											? filteredUsers
											: filteredUsers.slice(0, isMobile ? 4 : 5)
										).map((user) => (
											<div
												key={user.id}
												onClick={() => onViewUser(user.id)}
												className="flex-1 group bg-white dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-200/60 dark:border-gray-800 flex flex-col items-center text-center gap-2 hover:border-amber-500/30 dark:hover:border-amber-500/30 hover:shadow-2xl hover:shadow-gray-500/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer ring-1 ring-transparent hover:ring-amber-500/10"
											>
												<div className="size-14 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 text-lg font-black border border-amber-100 dark:border-amber-800/50">
													{user.name?.charAt(0)}
												</div>
												<div className="min-w-0 w-full">
													<h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
														{user.name}
													</h4>
													<p className="text-[10px] font-semibold text-gray-400 uppercase truncate">
														{user.department || "Research"}
													</p>
												</div>
											</div>
										))}
									</div>
								</section>
							)}

							{/* Search Results / Relevant Research Section */}
							{(!expandedSection || expandedSection === "results") && (
								<section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
									<SectionHeader
										title="Relevant Research"
										icon={FileSearch}
										iconColor="text-emerald-500"
										showButton={searchResults.length > 4 || expandedSection === "results"}
										isExpanded={expandedSection === "results"}
										onToggle={() => toggleSection("results")}
									/>

									{searchResults.length > 0 ? (
										<div className="grid gap-4 grid-cols-1 md:grid-cols-3">
											{(expandedSection === "results" ? searchResults : searchResults.slice(0, 6)).map((item) => (
												<ResearchCard
													key={item.id}
													item={item}
													type={item.itemType}
													matchedRole={item.currentMatch}
													onClick={() => onSelectItem({ type: item.itemType, data: item })}
												/>
											))}
										</div>
									) : (
										<div className="py-20 text-center border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-3xl">
											<p className="text-sm text-gray-400 italic">
												No research works match your query.
											</p>
										</div>
									)}
								</section>
							)}
						</div>
					)}
				</main>
			</div>
		</div>
	);
};

export default ExploreResearchView;