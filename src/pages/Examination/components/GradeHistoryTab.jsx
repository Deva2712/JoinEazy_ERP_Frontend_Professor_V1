// src/pages/Examination/components/GradeHistoryTab.jsx

import React from "react";
import { Award, FileText, Users } from "lucide-react";

const GradeHistoryTab = ({ gradeHistory = [], gradeSem, setGradeSem }) => {
	const gradeSemesters = ["All", ...gradeHistory.map((g) => g.semester)];
	const filteredGrades = gradeSem === "All" ? gradeHistory : gradeHistory.filter((g) => g.semester === gradeSem);

	if (filteredGrades.length === 0) {
		return (
			<div className="text-center py-20 bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800">
				<Award className="size-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
				<p className="text-gray-400">No grade history available.</p>
			</div>
		);
	}

	return (
		<div className="animate-in fade-in duration-300 space-y-6">
			{/* Semester Dropdown Filter */}
			<div className="flex items-center gap-3">
				<label className="text-sm font-bold text-gray-600 dark:text-gray-400 whitespace-nowrap">
					Semester:
				</label>
				<select
					value={gradeSem}
					onChange={(e) => setGradeSem(e.target.value)}
					className="px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white bg-white dark:bg-[#1a1d26] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-rose-500 cursor-pointer"
				>
					{gradeSemesters.map((s) => (
						<option key={s} value={s}>
							{s}
						</option>
					))}
				</select>
			</div>

			{filteredGrades.map((g) => (
				<div key={g.semester} className="space-y-4">
					{/* Semester Header + Overall Stats */}
					<div className="bg-white dark:bg-[#1a1d26] rounded-2xl p-5 border-2 border-rose-400 dark:border-rose-700">
						<p className="text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
							{g.semester}
						</p>
						<div className="grid grid-cols-3 gap-4">
							<div>
								<p className="text-gray-400 text-xs font-semibold mb-1">SGPA</p>
								<p className="text-3xl font-extrabold text-gray-900 dark:text-white">{g.sgpa}</p>
							</div>
							<div>
								<p className="text-gray-400 text-xs font-semibold mb-1">CGPA</p>
								<p className="text-3xl font-extrabold text-gray-900 dark:text-white">{g.cgpa}</p>
							</div>
							<div>
								<p className="text-gray-400 text-xs font-semibold mb-1">Total Credits</p>
								<p className="text-3xl font-extrabold text-gray-900 dark:text-white">
									{g.totalCredits || "—"}
								</p>
							</div>
						</div>
					</div>

					{/* Subject-wise Table with Breakdown */}
					<div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
									<th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
										Subject
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
										Credits
									</th>
									<th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
										<span className="flex items-center justify-center gap-1">
											<FileText className="size-3" />
											Assignments
										</span>
									</th>
									<th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
										<span className="flex items-center justify-center gap-1">
											<Users className="size-3" />
											Attendance
										</span>
									</th>
									<th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
										Grade
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
								{g.subjects && g.subjects.length > 0 ? (
									g.subjects.map((sub, idx) => {
										return (
											<tr key={idx} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
												<td className="px-5 py-3 font-semibold text-gray-900 dark:text-white">
													{sub.name}
												</td>
												<td className="px-4 py-3 text-center">
													<span className="font-semibold text-gray-700 dark:text-gray-300">
														{sub.midterm1 ?? "—"}/25
													</span>
												</td>
												<td className="px-4 py-3 text-center">
													<span className="font-semibold text-gray-700 dark:text-gray-300">
														{sub.midterm2 ?? "—"}/25
													</span>
												</td>
												<td className="px-4 py-3 text-center">
													<span className="font-semibold text-gray-700 dark:text-gray-300">
														{sub.endTerm ?? "—"}/50
													</span>
												</td>
												<td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300 font-semibold">
													{sub.credits ?? "—"}
												</td>
												<td className="px-4 py-3 text-center">
													<span
														className={`font-bold ${
															sub.assignments == null
																? "text-gray-400"
																: sub.assignments >= 80
																? "text-green-600 dark:text-green-400"
																: sub.assignments >= 50
																? "text-yellow-600 dark:text-yellow-400"
																: "text-red-600 dark:text-red-400"
														}`}
													>
														{sub.assignments != null ? `${sub.assignments}` : "—"}
													</span>
												</td>
												<td className="px-4 py-3 text-center">
													<span
														className={`font-bold ${
															sub.attendance == null
																? "text-gray-400"
																: sub.attendance >= 75
																? "text-green-600 dark:text-green-400"
																: "text-red-600 dark:text-red-400"
														}`}
													>
														{sub.attendance != null ? `${sub.attendance}%` : "—"}
													</span>
												</td>
												<td className="px-4 py-3 text-center font-extrabold text-rose-700 dark:text-rose-400">
													{sub.grade || "—"}
												</td>
											</tr>
										);
									})
								) : (
									<tr>
										<td colSpan={8} className="px-5 py-8 text-center text-sm text-gray-400">
											No subject data available.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			))}
		</div>
	);
};

export default GradeHistoryTab;