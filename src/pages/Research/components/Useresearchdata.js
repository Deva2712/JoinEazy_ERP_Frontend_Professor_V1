// src/pages/Research/useResearchData.js
import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { researchService } from "@/api/services/research.service";
import { userService } from "@/api/services/user.service";

export function useResearchData() {
    const { tab, projectId, pubId, userId } = useParams();

    const [availableProjects, setAvailableProjects]       = useState([]);
    const [availablePublications, setAvailablePublications] = useState([]);
    const [myProjects, setMyProjects]                     = useState([]);
    const [myApplications, setMyApplications]             = useState([]);
    const [myPublications, setMyPublications]             = useState([]);
    const [allUsers, setAllUsers]                         = useState([]);
    const [selectedItem, setSelectedItem]                 = useState(null);
    const [selectedUser, setSelectedUser]                 = useState(null);
    const [previousSelectedItem, setPreviousSelectedItem] = useState(null);
    const [currentUserSettings, setCurrentUserSettings]   = useState(null);
    const [personalSearchQuery, setPersonalSearchQuery]   = useState("");
    const [exploreSearchQuery, setExploreSearchQuery]     = useState("");
    const [loading, setLoading]                           = useState(true);
    const [error, setError]                               = useState(null);
    const [filters, setFilters] = useState({
        status: "all", sortBy: "newest", showProjects: true,
        showPublications: true, category: "all", collaborationType: "all", year: "all",
    });

    const viewMode = tab || "my-projects";

    const fetchData = async () => {
        try {
            setLoading(true);
            const [dashboardRes, usersRes] = await Promise.all([
                researchService.getResearchDashboard(),
                researchService.getUsers(),
            ]);

            if (dashboardRes.success) {
                // Backend returns: { projects, discover, applications }
                setMyProjects(dashboardRes.data.projects          || []);
                setAvailableProjects(dashboardRes.data.discover   || []);
               setMyPublications(dashboardRes.data.publications || []);
setAvailablePublications(dashboardRes.data.availablePublications || []);

                const sentApps = (dashboardRes.data.applications || []).map(
                    (app) => ({ ...app, isSentApplication: true }),
                );
                const receivedApps = (dashboardRes.data.projects || [])
                    .filter((proj) => proj.isOwner && proj.applicants)
                    .flatMap((proj) =>
                        proj.applicants.map((applicant) => ({
                            ...applicant,
                            projectTitle: proj.title,
                            projectId: proj.id,
                            isSentApplication: false,
                        })),
                    );
                setMyApplications([...sentApps, ...receivedApps]);
            }

            if (usersRes.success) setAllUsers(usersRes.data || []);
        } catch {
            setError("Failed to load research data");
        } finally {
            setLoading(false);
        }
    };

    const fetchUserSettings = async () => {
        try {
            const res = await userService.getDashboardOverview();
            if (res.success) setCurrentUserSettings(res.data.user || res.data);
        } catch (err) {
            console.error("Failed to fetch base profile data", err);
        }
    };

    useEffect(() => {
        document.title = "Research & Publications";
        fetchData();
        fetchUserSettings();
    }, []);

    // Sync URL params → selected item / user
    useEffect(() => {
        if (loading) return;
        if (userId) {
            const user = allUsers.find((u) => u.id === userId);
            if (user) { setSelectedUser(user); setSelectedItem(null); return; }
        }
        const id = projectId || pubId;
        if (!id) { setSelectedItem(null); if (!userId) setSelectedUser(null); return; }
        if (projectId) {
            const proj = myProjects.find((p) => p.id === projectId) || availableProjects.find((p) => p.id === projectId);
            if (proj) {
                const role = localStorage.getItem("userRole");
                setSelectedItem({ type: "project", data: proj, viewType: (proj.isOwner || role === "hod") ? "professor" : "student" });
            }
        } else if (pubId) {
            const pub = myPublications.find((p) => p.id === pubId || p.url === pubId) || availablePublications.find((p) => p.id === pubId || p.url === pubId);
            if (pub) setSelectedItem({ type: "publication", data: pub });
        }
    }, [projectId, pubId, userId, loading, myProjects, availableProjects, myPublications, availablePublications, allUsers]);

    const processedSelectedUser = useMemo(() => {
        if (!selectedUser || !currentUserSettings) return selectedUser;
        if (selectedUser.id === currentUserSettings.employeeId) {
            return {
                ...selectedUser,
                email: currentUserSettings.officialEmail || selectedUser.email,
                office: currentUserSettings.officeLocation || selectedUser.office,
                department: currentUserSettings.department || selectedUser.department,
                linkedinUrl: currentUserSettings.linkedinProfile || selectedUser.linkedinUrl,
            };
        }
        return selectedUser;
    }, [selectedUser, currentUserSettings]);

    const availableParticipants = useMemo(() => {
        if (!selectedItem?.data) return [];
        const participants = [];
        if (selectedItem.data.professorName) participants.push({ name: selectedItem.data.professorName });
        const extras = selectedItem.type === "project" ? selectedItem.data.contributors : selectedItem.data.coAuthors;
        if (Array.isArray(extras)) extras.forEach((name) => { if (name) participants.push({ name }); });
        return participants;
    }, [selectedItem]);

    const userPortfolio = useMemo(() => {
        if (!selectedUser) return { projects: [], publications: [] };
        const dedup = (arr) => Array.from(new Map(arr.map((i) => [i.id, i])).values());
        return {
            projects: dedup([...myProjects, ...availableProjects].filter(
                (p) => p.ownerId === selectedUser.id || p.professorName === selectedUser.name || p.collaborators?.includes(selectedUser.name),
            )),
            publications: dedup([...myPublications, ...availablePublications].filter(
                (pub) => pub.authorId === selectedUser.id || pub.professorName === selectedUser.name || pub.coAuthors?.includes(selectedUser.name),
            )),
        };
    }, [selectedUser, myProjects, availableProjects, myPublications, availablePublications]);

    return {
        // raw state
        availableProjects, setAvailableProjects,
        availablePublications, setAvailablePublications,
        myProjects, setMyProjects,
        myPublications, setMyPublications,
        myApplications, setMyApplications,
        allUsers,
        selectedItem, setSelectedItem,
        selectedUser, setSelectedUser,
        previousSelectedItem, setPreviousSelectedItem,
        personalSearchQuery, setPersonalSearchQuery,
        exploreSearchQuery, setExploreSearchQuery,
        filters, setFilters,
        loading, error,
        // derived
        viewMode,
        processedSelectedUser,
        availableParticipants,
        userPortfolio,
        fetchData,
    };
}