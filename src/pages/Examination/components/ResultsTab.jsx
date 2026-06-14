// src/pages/Examination/components/ResultsTab.jsx

import React from "react";
import { BarChart3, RotateCcw } from "lucide-react";
import StatusBadge from "./StatusBadge";

const ResultsTab = ({
	results = [],
	filterSem,
	setFilterSem,
	onRequestRevaluation,
	getExistingReval,
}) => {
	const semesters = ["All", ...new Set(results.map((r) => r.semester))];
	const filteredResults = filterSem === "All" ? results : results.filter((r) => r.semester === filterSem);

	return (
		<div className="animate-in fade-in duration-300">
			{/* Semester Filter */}
			<div className="flex items-center gap-2 mb-6 flex-wrap">
				{semesters.map((s) => (
					<button
						key={s}
						onClick={() => setFilterSem(s)}
						className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${
							filterSem === s
								? "bg-rose-600 text-white"
								: "bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
						}`}
					>
						{s}
					</button>
				))}
			</div>

			{filteredResults.length > 0 ? (
				<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
								<th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
									Subject
								</th>
								<th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">
									Code
								</th>
								<th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
									Midterm 1
								</th>
								<th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
									Midterm 2
								</th>
								<th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
									End Term
								</th>
								<th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
									Total Marks
								</th>
								<th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
									Grade
								</th>
								<th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
									Status
								</th>
								<th className="text-center px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
									Action
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
							{filteredResults.map((r) => {
								const existing = getExistingReval(r);

								return (
									<tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
										<td className="px-5 py-3 font-semibold text-gray-900 dark:text-white">
											{r.subject}
										</td>
										<td className="px-5 py-3 text-gray-500 hidden md:table-cell">
											{r.code}
										</td>
										<td className="px-4 py-3 text-center">
											<span className="font-semibold text-gray-700 dark:text-gray-300">
												{r.midterm1 ?? "—"}/25
											</span>
										</td>
										<td className="px-4 py-3 text-center">
											<span className="font-semibold text-gray-700 dark:text-gray-300">
												{r.midterm2 ?? "—"}/25
											</span>
										</td>
										<td className="px-4 py-3 text-center">
											<span className="font-semibold text-gray-700 dark:text-gray-300">
												{r.endTerm ?? "—"}/50
											</span>
										</td>
										<td className="px-4 py-3 text-center">
											<span className="font-bold text-gray-900 dark:text-white">
												{r.marks}/{r.maxMarks}
											</span>
										</td>
										<td className="px-4 py-3 text-center font-bold text-rose-600 dark:text-rose-400">
											{r.grade}
										</td>
										<td className="px-4 py-3 text-center">
											<StatusBadge status={r.status} />
										</td>
										<td className="px-5 py-3 text-center">
											<button
												onClick={() => onRequestRevaluation(r)}
												className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
													existing
														? "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100"
														: "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/40"
												}`}
											>
												<RotateCcw className="size-3" />
												{existing ? "View" : "Reval"}
											</button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			) : (
				<div className="text-center py-20">
					<BarChart3 className="size-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
					<p className="text-gray-400">No results yet.</p>
				</div>
			)}
		</div>
	);
};

export default ResultsTab;