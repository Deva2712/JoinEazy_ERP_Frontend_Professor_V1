// src/pages/CohortMembers/CohortMembersHeader.jsx
import React from "react";
import { Plus, Download, Search } from "lucide-react";

const memberTypeOptions = ["Individual", "Groups"];

const CohortMembersHeader = ({
	memberType,
	memberTypeRef,
	user_type,
	isInGroup,
	searchTerm,
	totalGroups,
	membersInGroups,
	currentCourseMembers,
	onMemberTypeChange,
	onCreateGroup,
	onExport,
	onSearchChange,
	setShowDisabledCreatePopup,
}) => (
	<div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
		<div className="flex items-center justify-between mb-3">
			<div className="flex items-center gap-2">
				<h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
					Course Members
				</h2>
				<span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-md">
					{memberType === "Individual"
						? currentCourseMembers
						: `${totalGroups} groups, ${membersInGroups} members`}
				</span>
			</div>
		</div>

		<div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
			<div
				className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5"
				ref={memberTypeRef}
			>
				{memberTypeOptions.map((option) => (
					<button
						key={option}
						onClick={() => onMemberTypeChange(option)}
						className={`px-3 py-1.5 text-xs rounded-md ${
							memberType === option ? "bg-blue-600 text-white" : "text-gray-600"
						}`}
					>
						{option}
					</button>
				))}
			</div>

			<div className="flex items-center gap-2 flex-1">
				<div className="relative flex-1">
					<Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder={`Search ${memberType.toLowerCase()}...`}
						value={searchTerm || ""}
						onChange={(e) => onSearchChange?.(e.target.value)}
						className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border rounded-lg"
					/>
				</div>

				{user_type === 1 ? (
					<>
						<button
							onClick={onCreateGroup}
							className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md flex items-center gap-1"
						>
							<Plus size={14} /> Create
						</button>
						<button
							onClick={onExport}
							className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-md flex items-center gap-1"
						>
							<Download size={14} /> Export
						</button>
					</>
				) : (
					<button
						onClick={() => (!isInGroup ? onCreateGroup() : setShowDisabledCreatePopup(true))}
						className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md flex items-center gap-1"
					>
						<Plus size={14} /> Create Group
					</button>
				)}
			</div>
		</div>
	</div>
);

export default CohortMembersHeader;