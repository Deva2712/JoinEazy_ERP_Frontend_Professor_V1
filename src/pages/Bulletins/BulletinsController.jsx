// src/pages/Bulletins/BulletinsController.jsx

import React, { useState, useEffect, useMemo } from "react";
import BulletinsUI from "./BulletinsUI";
// import { bulletinAPI, userAPI, announcementsAPI } from "../../services/api";

import{ bulletinService } from "../../api/services/bulletin.service";
import { userService } from "../../api/services/user.service";
import { announcementsService } from "../../api/services/announcements.service";
/**
 * Controller component for Bulletins and Announcements.
 * Handles data fetching from multiple sources (Global Bulletins and Course Announcements),
 * normalizes the data structure, and manages global/course-specific stats.
 */
const BulletinsController = () => {
	const [bulletins, setBulletins] = useState([]);
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

	const stats = useMemo(() => {
		const now = new Date();
		// Use local date (not UTC) to avoid timezone mismatch with backend
		const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;

		const startOfWeek = new Date(now);
		startOfWeek.setDate(now.getDate() - now.getDay());
		startOfWeek.setHours(0, 0, 0, 0);

		const safeDate = (b) => {
			const raw = b.createdAt || b.created_at || b.date;
			if (!raw) return null;
			const d = new Date(raw);
			return isNaN(d.getTime()) ? null : d;
		};

		return {
			todayCount: bulletins.filter((b) => {
    const date = new Date(b.createdAt || b.created_at || b.date);
    return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth()    === now.getMonth()    &&
        date.getDate()     === now.getDate()
    );
}).length,
			priorityThisWeek: bulletins.filter((b) => {
				const d = safeDate(b);
				if (!d) return false;
				const isHighPriority =
					["high", "urgent"].includes(b.priority?.toLowerCase()) ||
					b.is_pinned;
				return isHighPriority && d >= startOfWeek;
			}).length,
		};
	}, [bulletins]);

	const filteredBulletins = useMemo(() => {
		return bulletins.filter((b) => {
			const matchesCategory =
				filters.category === "all"
					? true
					: b.level === filters.category;
			const matchesPriority =
				filters.priority === "all"
					? true
					: b.priority?.toLowerCase() === filters.priority;
			const bulletinCohortId = b.cohortId || b.cohort_id;
			const matchesCourse =
				filters.course === "all"
					? true
					: bulletinCohortId === filters.course;
			const matchesSearch =
				b.title.toLowerCase().includes(filters.search.toLowerCase()) ||
				b.content.toLowerCase().includes(filters.search.toLowerCase());

			let matchesDate = true;
			if (filters.dateRange !== "all") {
				const bDate = new Date(b.createdAt || b.created_at || b.date);
				const now = new Date();
				const diffTime = Math.abs(now - bDate);
				const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

				if (filters.dateRange === "today") {
					matchesDate = bDate.toDateString() === now.toDateString();
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
	}, [bulletins, filters]);

	useEffect(() => {
		fetchData();
		document.title = "Bulletins";
	}, []);

	/**
	 * Fetches and merges global bulletins and course-specific announcements.
	 * Normalizes varied API responses into a consistent format for the UI.
	 */
	const fetchData = async () => {
		try {
			setLoading(true);
			const [bulletinRes, userRes] = await Promise.all([
				bulletinService.getBulletins(),
				userService.getDashboardOverview(),
			]);

			let allUpdates = [];
			let userCohorts = [];

			if (bulletinRes.success) {
				allUpdates = [...bulletinRes.data];
			}

			if (userRes.success) {
				userCohorts = [
					...(userRes.data.createdCohorts || []),
					...(userRes.data.joinedCohorts || []),
				].map((cohort) => ({
					id: cohort.id || cohort._id,
					name:
						cohort.cohort_name || cohort.name || "Untitled Course",
					course_code: cohort.course_code,
				}));

				setCohorts(userCohorts);

				const announcementPromises = userCohorts.map((cohort) =>
					announcementsService.getAnnouncements(cohort.id),
				);

				const announcementResults =
					await Promise.all(announcementPromises);

				announcementResults.forEach((res, index) => {
					if (res.success) {
						const normalized = res.data.map((ann) => ({
							...ann,
							id: ann.id || ann._id,
							title: ann.title || "Course Update",
							content: ann.content || ann.message,
							level: "course",
							courseName: userCohorts[index].name,
							cohortId: userCohorts[index].id,
							createdAt: ann.created_at,
							author: ann.author_name,
						}));
						allUpdates = [...allUpdates, ...normalized];
					}
				});
			}

			allUpdates.sort((a, b) => {
				const pinnedA = a.is_pinned ? 1 : 0;
				const pinnedB = b.is_pinned ? 1 : 0;

				if (pinnedA !== pinnedB) {
					return pinnedB - pinnedA;
				}
				return (
					new Date(b.createdAt || b.created_at) -
					new Date(a.createdAt || a.created_at)
				);
			});

			setBulletins(allUpdates);
		} catch (err) {
			setError("Failed to sync with bulletin service.");
		} finally {
			setLoading(false);
		}
	};

	const handleCreateBulletin = async (formData) => {
		try {
			const res = formData.cohortId
				? await announcementsService.createAnnouncement(
						formData.cohortId,
						formData,
					)
				: await bulletinService.createBulletin(formData);

			if (res.success) fetchData();
			return res;
		} catch (err) {
			return { success: false, error: "System error" };
		}
	};

	return (
		<BulletinsUI
			bulletins={filteredBulletins}
			cohorts={cohorts}
			loading={loading}
			error={error}
			stats={stats}
			filters={filters}
			setFilters={setFilters}
			onRefresh={fetchData}
			onSubmit={handleCreateBulletin}
		/>
	);
};

export default BulletinsController;