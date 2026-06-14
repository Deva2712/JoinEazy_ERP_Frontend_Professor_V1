import React, { useState, useMemo } from "react";
import { SlidersHorizontal, Check, ChevronDown, X, Search } from "lucide-react";

const FilterSection = ({ title, children, defaultOpen = true }) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);
	return (
		<div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mb-3">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full flex items-center justify-between p-4 group hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
			>
				<span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{title}</span>
				<ChevronDown className={`size-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
			</button>
			<div className={`px-4 pb-5 ${isOpen ? "block" : "hidden"}`}>{children}</div>
		</div>
	);
};

const LibraryFilterSidebar = ({ filters, setFilters, availableCategories = [], availableAuthors = [], isOpen, onClose }) => {
	const [categorySearch, setCategorySearch] = useState("");
	const [authorSearch, setAuthorSearch] = useState("");

	const filteredCategories = useMemo(() => {
		return availableCategories.filter((cat) => cat.toLowerCase().includes(categorySearch.toLowerCase()));
	}, [categorySearch, availableCategories]);

	const filteredAuthors = useMemo(() => {
		return availableAuthors.filter((auth) => auth.toLowerCase().includes(authorSearch.toLowerCase()));
	}, [authorSearch, availableAuthors]);

	const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

	const resetFilters = () => {
		setFilters({ category: "all", availability: "all", author: "all" });
		setCategorySearch("");
		setAuthorSearch("");
	};

	return (
		<>
			<div className={`fixed inset-0 bg-gray-900/40 z-[100] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={onClose} />
			<aside className={`fixed bottom-0 right-0 md:top-0 z-[110] w-full max-w-full md:max-w-[380px] md:h-full max-h-[85vh] md:max-h-full bg-white dark:bg-[#0f1117] border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800 rounded-t-[2rem] md:rounded-t-none shadow-2xl flex flex-col transform transition-transform duration-500 ease-in-out ${isOpen ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-y-0 md:translate-x-full"}`}>
				
				<div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
					<div className="flex items-center gap-2.5">
						<SlidersHorizontal className="size-5 text-green-600" />
						<h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
					</div>
					<button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-500"><X className="size-5" /></button>
				</div>

				<div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
					<FilterSection title="Category">
						<div className="relative mb-2 px-1">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
							<input type="text" placeholder="Search categories..." value={categorySearch} onChange={(e) => setCategorySearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-sm outline-none border border-transparent focus:border-green-500/30" />
						</div>
						<div className="max-h-40 overflow-y-auto">
							<button onClick={() => updateFilter("category", "all")} className={`w-full text-left px-3 py-2 rounded-xl text-sm ${filters.category === "all" ? "bg-green-50 text-green-700 font-bold" : "text-gray-500"}`}>All Categories</button>
							{filteredCategories.map((cat) => (
								<button key={cat} onClick={() => updateFilter("category", cat)} className={`w-full text-left px-3 py-2 rounded-xl text-sm ${filters.category === cat ? "bg-green-50 text-green-700 font-bold" : "text-gray-500"}`}>{cat}</button>
							))}
						</div>
					</FilterSection>

					<FilterSection title="Availability">
						{[
							{ id: "all", label: "Any" },
							{ id: "available", label: "Available Now" },
							{ id: "borrowed", label: "Out of Stock" },
						].map((item) => (
							<button key={item.id} onClick={() => updateFilter("availability", item.id)} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm ${filters.availability === item.id ? "bg-green-50 text-green-700 font-bold" : "text-gray-500"}`}>
								{item.label}
								{filters.availability === item.id && <Check className="size-4" />}
							</button>
						))}
					</FilterSection>

                    <FilterSection title="Author">
						<div className="relative mb-2 px-1">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
							<input type="text" placeholder="Search authors..." value={authorSearch} onChange={(e) => setAuthorSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-sm outline-none border border-transparent focus:border-green-500/30" />
						</div>
                        <div className="max-h-40 overflow-y-auto">
                            <button onClick={() => updateFilter("author", "all")} className={`block w-full text-left px-3 py-2 rounded-xl text-sm ${filters.author === "all" ? "bg-green-50 text-green-700 font-bold" : "text-gray-500"}`}>All Authors</button>
                            {filteredAuthors.map((author) => (
                                <button key={author} onClick={() => updateFilter("author", author)} className={`block w-full text-left px-3 py-2 rounded-xl text-sm ${filters.author === author ? "bg-green-50 text-green-700 font-bold" : "text-gray-500"}`}>{author}</button>
                            ))}
                        </div>
                    </FilterSection>
				</div>

				<div className="p-6 border-t border-gray-200 dark:border-gray-800 flex gap-3">
					<button onClick={resetFilters} className="flex-1 py-3 text-sm font-bold text-gray-500 border border-gray-200 rounded-xl">Clear</button>
					<button onClick={onClose} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold">Apply</button>
				</div>
			</aside>
		</>
	);
};

export default LibraryFilterSidebar;