import React, { useEffect } from "react";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";

import CohortHeader from "./Cohortheader";
import DetailsController from "./CohortDetails/CohortDetailsController";
import NotesController from "./CohortNotes/CohortNotesController";
import LeaderboardController from "./CohortLeaderboard/CohortLeaderboardController";
import BoardController from "./CohortBoard/CohortBoardController";
import EventsController from "./CohortEvents/CohortEventsController";
import CoursesController from "./CohortCourses/CohortCoursesController";
import MembersController from "./CohortMembers/CohortMembersController";
import AssignmentsController from "./CohortAssignments/CohortAssignmentsController";
import CohortMaterialsController from "./CohortResources/CohortResourcesController";
import AnnouncementsController from "./CohortAnnouncements/CohortAnnouncementsController";
import MyMeetingsController from "./CohortMeetings/MyMeetingsController";
import CohortAttendanceController from "./CohortAttendance/CohortAttendanceController";

const allTabs = [
  { id: "details",       name: "Details" },
  { id: "members",       name: "Members" },
  { id: "attendance",    name: "Attendance" },
  { id: "assignments",   name: "Assignments",  professorOnly: true },
  { id: "materials",     name: "Resources" },
  { id: "my-meetings",   name: "My Meetings",  studentOnly: true },
  { id: "announcements", name: "Announcements" },
  { id: "board",         name: "Board" },
  { id: "courses",       name: "Submissions" },
  { id: "leaderboard",   name: "Leaderboard" },
  { id: "events",        name: "Events" },
  { id: "notes",         name: "Notes" },
];

export default function CohortUI({ cohortId, cohortData, activeTab, setActiveTab, requiredTabs, onTabChange, handleCohortSettingsClick }) {
  const user_type = cohortData?.user_type ?? 0;

  const tabs = requiredTabs
    ? allTabs.filter((tab) => {
        if (tab.studentOnly)  return user_type === 0 && requiredTabs.includes(tab.id);
        if (tab.professorOnly) return user_type === 1 && requiredTabs.includes(tab.id);
        return requiredTabs.includes(tab.id);
      })
    : allTabs.filter((tab) => {
        if (tab.studentOnly)  return user_type === 0;
        if (tab.professorOnly) return user_type === 1;
        return tab.id === "details" || tab.id === "members";
      });

  useEffect(() => {
    if (activeTab && !tabs.some((t) => t.id === activeTab)) {
      const fallback = tabs[0]?.id || "details";
      setActiveTab(fallback);
      onTabChange?.(fallback);
    }
  }, [activeTab, tabs, onTabChange, setActiveTab]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const tabProps = { cohortId, cohortData };

  return (
    <div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen transition-colors duration-300 font-sans">
      <HeaderController />

      {cohortData && (
        <CohortHeader
          cohortData={cohortData}
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={handleTabClick}
          onSettingsClick={handleCohortSettingsClick}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 py-8 w-full pb-24 md:pb-12">
        {activeTab === "details"       && <DetailsController       {...tabProps} />}
        {activeTab === "members"       && <MembersController       {...tabProps} />}
        {activeTab === "assignments"   && <AssignmentsController   {...tabProps} />}
        {activeTab === "materials"     && <CohortMaterialsController {...tabProps} />}
        {activeTab === "announcements" && <AnnouncementsController {...tabProps} />}
        {activeTab === "my-meetings"   && user_type === 0 && <MyMeetingsController {...tabProps} />}
        {activeTab === "attendance"    && <CohortAttendanceController {...tabProps} />}
        {activeTab === "board"         && <BoardController         {...tabProps} />}
        {activeTab === "courses"       && <CoursesController       {...tabProps} />}
        {activeTab === "leaderboard"   && <LeaderboardController   {...tabProps} />}
        {activeTab === "events"        && <EventsController        {...tabProps} />}
        {activeTab === "notes"         && <NotesController         {...tabProps} />}
      </main>

      <FooterController />
      <BottomNavController />
    </div>
  );
}

