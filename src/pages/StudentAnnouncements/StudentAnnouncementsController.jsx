// src/pages/StudentAnnouncements/StudentAnnouncementsController.jsx

import React, { useState, useEffect, useMemo } from "react";
import StudentAnnouncementsUI from "./StudentAnnouncementsUI";
import { bulletinService } from "@/api/services/bulletin.service";
import { userService} from "@/api/services/user.service";
import { announcementsService } from "@/api/services/announcements.service";
/**
 * Controller component for Student Announcements.
 * Fetches institution/department bulletins and course-specific announcements.
 * Provides filtering and search capabilities while maintaining read-only access.
 */
const StudentAnnouncementsController = () => {
	const [announcements, setAnnouncements] = useState([]);
	const [cohorts, setCohorts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [filters, setFilters] = useState({
		search: "",
		category: "all",
		priority: "all",
		dateRange: "all",
		course: "all",
	});

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	// Calculate statistics
	const stats = useMemo(() => {
		const now = new Date();
		const todayStr = now.toISOString().split("T")[0];

		const startOfWeek = new Date(now);
		startOfWeek.setDate(now.getDate() - now.getDay());
		startOfWeek.setHours(0, 0, 0, 0);

		return {
			todayCount: announcements.filter((a) => {
				const dateStr = new Date(a.createdAt || a.created_at || a.date)
					.toISOString()
					.split("T")[0];
				return dateStr === todayStr;
			}).length,
			priorityCount: announcements.filter((a) => {
				const date = new Date(a.createdAt || a.created_at || a.date);
				const isHighPriority =
					["high", "urgent"].includes(a.priority?.toLowerCase()) ||
					a.is_pinned;
				return isHighPriority && date >= startOfWeek;
			}).length,
			totalCount: announcements.length,
		};
	}, [announcements]);

	// Apply filters to announcements
	const filteredAnnouncements = useMemo(() => {
		return announcements.filter((a) => {
			const matchesCategory =
				filters.category === "all"
					? true
					: a.level === filters.category;
			const matchesPriority =
				filters.priority === "all"
					? true
					: a.priority?.toLowerCase() === filters.priority;
			const announcementCohortId = a.cohortId || a.cohort_id;
			const matchesCourse =
				filters.course === "all"
					? true
					: announcementCohortId === filters.course;
			const matchesSearch =
				a.title.toLowerCase().includes(filters.search.toLowerCase()) ||
				a.content.toLowerCase().includes(filters.search.toLowerCase());

			let matchesDate = true;
			if (filters.dateRange !== "all") {
				const aDate = new Date(a.createdAt || a.created_at || a.date);
				const now = new Date();
				const diffTime = Math.abs(now - aDate);
				const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

				if (filters.dateRange === "today") {
					matchesDate = aDate.toDateString() === now.toDateString();
				} else if (filters.dateRange === "week") {
					matchesDate = diffDays <= 7;
				} else if (filters.dateRange === "month") {
					matchesDate = diffDays <= 30;
				}
			}

			return (
				matchesCategory &&
				matchesPriority &&
				matchesSearch &&
				matchesDate &&
				matchesCourse
			);
		});
	}, [announcements, filters]);

	// Sort filtered announcements (pinned first, then by date)
	const sortedAnnouncements = useMemo(() => {
		return [...filteredAnnouncements].sort((a, b) => {
			const pinnedA = a.is_pinned ? 1 : 0;
			const pinnedB = b.is_pinned ? 1 : 0;

			if (pinnedA !== pinnedB) {
				return pinnedB - pinnedA;
			}
			return (
				new Date(b.createdAt || b.created_at || b.date) -
				new Date(a.createdAt || a.created_at || a.date)
			);
		});
	}, [filteredAnnouncements]);

	useEffect(() => {
		fetchData();
		document.title = "Announcements - Student";
	}, []);

	/**
	 * Fetches institution bulletins and course announcements.
	 * Normalizes data from different sources into consistent format.
	 */
	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);

			const [bulletinRes, userRes] = await Promise.all([
				bulletinService.getBulletins(),
				userService.getDashboardOverview(),
			]);

			let allAnnouncements = [];
			let userCohorts = [];

			// Add institution/department bulletins
			if (bulletinRes.success && bulletinRes.data) {
				allAnnouncements = bulletinRes.data.map((bulletin) => ({
					...bulletin,
					id: bulletin.id || bulletin._id,
					title: bulletin.title || "Announcement",
					content: bulletin.content || bulletin.message || "",
					level: bulletin.level || "institution",
					createdAt: bulletin.createdAt || bulletin.created_at,
					is_pinned: bulletin.is_pinned || false,
					priority: bulletin.priority || "Normal",
				}));
			}

			// Fetch course announcements
			if (userRes.success && userRes.data) {
				userCohorts = [
					...(userRes.data.createdCohorts || []),
					...(userRes.data.joinedCohorts || []),
				].map((cohort) => ({
					id: cohort.id || cohort._id,
					name: cohort.cohort_name || cohort.name || "Untitled Course",
					course_code: cohort.course_code,
				}));

				setCohorts(userCohorts);

				const announcementPromises = userCohorts.map((cohort) =>
					announcementsService.getAnnouncements(cohort.id),
				);

				const announcementResults =
					await Promise.all(announcementPromises);

				announcementResults.forEach((res, index) => {
					if (res.success && res.data) {
						const normalized = res.data.map((ann) => ({
							...ann,
							id: ann.id || ann._id,
							title: ann.title || "Course Update",
							content: ann.content || ann.message || "",
							level: "course",
							courseName: userCohorts[index].name,
							cohortId: userCohorts[index].id,
							createdAt: ann.createdAt || ann.created_at,
							author: ann.author_name,
							is_pinned: ann.is_pinned || false,
							priority: ann.priority || "Normal",
						}));
						allAnnouncements = [...allAnnouncements, ...normalized];
					}
				});
			}

			setAnnouncements(allAnnouncements);
		} catch (err) {
			setError("Failed to load announcements. Please try again.");
			console.error("Error fetching announcements:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<StudentAnnouncementsUI
			announcements={sortedAnnouncements}
			cohorts={cohorts}
			loading={loading}
			error={error}
			stats={stats}
			filters={filters}
			setFilters={setFilters}
			onRefresh={fetchData}
		/>
	);
};

export default StudentAnnouncementsController;