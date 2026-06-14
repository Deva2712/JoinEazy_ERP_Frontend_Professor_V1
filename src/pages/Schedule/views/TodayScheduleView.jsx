// src/pages/Schedule/views/TodayScheduleView.jsx

import React, { useState, useMemo } from "react";
import { Calendar, Plus, Import, X } from "lucide-react";
import { formatTo12Hour } from "../utils";
import MiniCalendar from "../../../components/common/MiniCalendar";
import TimetableCard from "../components/TimetableCard";

const TodayScheduleView = ({
	schedule,
	handleDateClick,
	allDisplayMeetings,
	selectedDateFilter,
	filteredTimetable,
	filteredMeetings,
	setShowImportModal,
	onAddEvent,
}) => {
	const [isAddingEvent, setIsAddingEvent] = useState(false);
	const [newEventData, setNewEventData] = useState({
		title: "",
		startTime: "10:00",
		endTime: "11:00",
		location: "",
	});

	const todayStr = useMemo(() => new Date().toLocaleDateString("en-US"), []);

	const selectedDateStr = useMemo(() => {
		if (selectedDateFilter instanceof Date) {
			return selectedDateFilter.toLocaleDateString("en-US");
		}
		return selectedDateFilter || todayStr;
	}, [selectedDateFilter, todayStr]);

	const sortedTimetable = useMemo(() => {
		const parseTimeToMinutes = (timeStr) => {
			if (!timeStr) return 0;
			const [time, modifier] = timeStr.split(" ");
			let [hours, minutes] = time.split(":").map(Number);

			if (modifier === "PM" && hours < 12) hours += 12;
			if (modifier === "AM" && hours === 12) hours = 0;

			return hours * 60 + minutes;
		};

		return [...filteredTimetable].sort((a, b) => {
			return (
				parseTimeToMinutes(a.startTime) -
				parseTimeToMinutes(b.startTime)
			);
		});
	}, [filteredTimetable]);

	const calendarMarkers = useMemo(() => {
		const markersMap = new Map();
		const todayISO = new Date().toLocaleDateString("en-CA");

		allDisplayMeetings?.forEach((m) => {
			const dateValue = m.startTime || m.dateTime || m.requestedTime;
			if (dateValue) {
				const dateStr = dateValue.split("T")[0];
				markersMap.set(dateStr, {
					date: dateStr,
					dotColor: "bg-rose-500",
					className:
						"bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white",
				});
			}
		});

		schedule?.timetable?.forEach((slot) => {
			if (slot.startDate && slot.endDate && slot.day) {
				const start = new Date(slot.startDate + "T00:00:00");
				const end = new Date(slot.endDate + "T00:00:00");

				let current = new Date(start);
				const days = [
					"Sunday",
					"Monday",
					"Tuesday",
					"Wednesday",
					"Thursday",
					"Friday",
					"Saturday",
				];
				while (days[current.getDay()] !== slot.day && current <= end) {
					current.setDate(current.getDate() + 1);
				}

				while (current <= end) {
					const dateStr = current.toLocaleDateString("en-CA");
					if (!markersMap.has(dateStr)) {
						markersMap.set(dateStr, {
							date: dateStr,
							className:
								"bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white",
						});
					}
					current.setDate(current.getDate() + 7);
				}
			}
		});

		const existingToday = markersMap.get(todayISO);
		markersMap.set(todayISO, {
			...(existingToday || { date: todayISO }),
			className:
				"bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 font-bold",
		});

		return Array.from(markersMap.values());
	}, [schedule?.timetable, allDisplayMeetings]);

	const onFormSubmit = () => {
		if (newEventData.title && selectedDateFilter) {
			const days = [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
			];
			const selectedDate = new Date(selectedDateFilter);
			const dateStr = selectedDate.toISOString().split("T")[0];

			onAddEvent({
				courseName: newEventData.title,
				startTime: formatTo12Hour(newEventData.startTime),
				endTime: formatTo12Hour(newEventData.endTime),
				day: days[selectedDate.getDay()],
				startDate: dateStr,
				endDate: dateStr,
				courseCode: "EVENT",
			});

			setNewEventData({
				title: "",
				startTime: "10:00",
				endTime: "11:00",
				location: "",
			});
			setIsAddingEvent(false);
		}
	};

	return (
		<div className="px-4 sm:px-0">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
				<div>
					<h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
						Today's Schedule
					</h3>
					<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
						Your daily academic commitments.
					</p>
				</div>
				<div className="flex gap-3">
					<button
						onClick={() => setShowImportModal(true)}
						className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 shadow-sm transition-all text-sm font-bold w-full sm:w-auto"
					>
						<Import className="w-4 h-4" />
						Import Schedule
					</button>
					{!isAddingEvent && (
						<button
							onClick={() => setIsAddingEvent(true)}
							className="flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 shadow-sm transition-all text-sm font-bold w-full sm:w-auto animate-in fade-in zoom-in-95 duration-200"
						>
							<Plus className="w-4 h-4" />
							Add Event
						</button>
					)}
				</div>
			</div>

			<div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
				<div className="lg:col-span-8 order-1 lg:order-2 space-y-4">
					{selectedDateFilter && isAddingEvent && (
						<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-200">
							<div className="flex items-center justify-between mb-4">
								<h4 className="font-black text-xs md:text-sm text-rose-600 dark:text-rose-400 uppercase tracking-wider">
									New Event (
									{new Date(
										selectedDateStr,
									).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
										year: "numeric"
									})}
									)
								</h4>
								<div className="flex gap-2">
									<button
										onClick={() => setIsAddingEvent(false)}
										className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-full transition-all active:scale-95"
									>
										<X className="w-4 h-4 stroke-[3]" />
									</button>
									<button
										onClick={onFormSubmit}
										disabled={!newEventData.title}
										className="p-3 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 text-white rounded-full transition-all active:scale-95"
									>
										<Plus className="w-4 h-4 stroke-[3]" />
									</button>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="md:col-span-2">
									<label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
										Subject
									</label>
									<input
										type="text"
										placeholder="e.g. Research Sync"
										value={newEventData.title}
										onChange={(e) =>
											setNewEventData({
												...newEventData,
												title: e.target.value,
											})
										}
										className="w-full mt-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-sm outline-none transition-all focus:border-rose-500"
									/>
								</div>
								<div>
									<label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
										Start
									</label>
									<input
										type="time"
										value={newEventData.startTime}
										onChange={(e) =>
											setNewEventData({
												...newEventData,
												startTime: e.target.value,
											})
										}
										className="w-full mt-1 px-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-sm outline-none"
									/>
								</div>
								<div>
									<label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
										End
									</label>
									<input
										type="time"
										value={newEventData.endTime}
										onChange={(e) =>
											setNewEventData({
												...newEventData,
												endTime: e.target.value,
											})
										}
										className="w-full mt-1 px-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-sm outline-none"
									/>
								</div>
							</div>
						</div>
					)}

					{sortedTimetable.length > 0 ||
					filteredMeetings.length > 0 ? (
						<div className="space-y-4">
							{sortedTimetable.map((slot, i) => (
								<TimetableCard
									key={`item-${slot.id || i}`}
									slot={slot}
									variant={
										slot.courseCode === "EVENT"
											? "event"
											: "class"
									}
								/>
							))}
							{filteredMeetings.map((m, idx) => (
								<TimetableCard
									key={`meeting-${m.id || idx}`}
									variant="meeting"
									slot={{
										courseCode: "MEETING",
										courseName:
											m.participantName ||
											"Scheduled Meeting",
										batchSection:
											m.subject || "Consultation",
										roomNumber:
											m.location || "Online/Office",
										startTime: new Date(
											m.startTime,
										).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										}),
										endTime: "",
									}}
								/>
							))}
						</div>
					) : (
						!isAddingEvent && (
							<div className="text-center py-16 md:py-20 bg-gray-50/50 dark:bg-gray-900/20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
								<div className="bg-white dark:bg-gray-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
									<Calendar className="w-8 h-8 text-gray-300 dark:text-gray-600" />
								</div>
								<h4 className="text-gray-900 dark:text-white font-bold">
									Free Day!
								</h4>
								<p className="text-gray-500 text-sm mt-1">
									No classes or confirmed meetings on this
									date.
								</p>
							</div>
						)
					)}
				</div>

				<div className="lg:col-span-4 order-2 lg:order-1 flex flex-col-reverse lg:flex-col gap-6">
					<MiniCalendar
						onDateClick={(date) => handleDateClick(new Date(date))}
						selectedDate={new Date(
							selectedDateStr,
						).toLocaleDateString("en-CA")}
						customMarkers={calendarMarkers}
						selectedDateColor="bg-rose-600"
					/>
				</div>
			</div>
		</div>
	);
};

export default TodayScheduleView;