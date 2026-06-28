// src/pages/Research/useResearchActions.js
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { researchService } from "@/api/services/research.service";
import { useNotifications } from "../../../context/NotificationContext";

// ── Filter / Sort helpers ─────────────────────────────────────────────────────

const calculateRelevance = (item, query, activeCategory) => {
    let score = 0;
    const text = `${item.title} ${item.description} ${item.abstract || ""}`.toLowerCase();
    const q = query.toLowerCase();
    if (query) {
        if (item.title.toLowerCase().includes(q)) score += 50;
        if (item.openRoles?.some((r) => r.roleName.toLowerCase().includes(q))) score += 40;
        if (text.includes(q)) score += 20;
    }
    if (activeCategory !== "all" && item.category === activeCategory) score += 30;
    const ageDays = (new Date() - new Date(item.createdAt || item.publishedDate)) / (1000 * 3600 * 24);
    score += Math.max(0, 20 - ageDays / 30);
    score += (item.starsCount || 0) * 2;
    return score;
};

export const processItems = (items, query, currentFilters) => {
    const lq = query.toLowerCase();
    const result = items.filter((item) => {
        const matchesStatus  = currentFilters.status === "all" || item.status === currentFilters.status;
        const matchesCat     = currentFilters.category === "all" || item.category === currentFilters.category;
        const matchesCollab  = currentFilters.collaborationType === "all" || item.collaborationType === currentFilters.collaborationType;
        const matchesYear    = currentFilters.year === "all" ||
            (item.createdAt && new Date(item.createdAt).getFullYear().toString() === currentFilters.year) ||
            (item.publishedDate && new Date(item.publishedDate).getFullYear().toString() === currentFilters.year);
        const matchesSearch  = !query ||
            item.title?.toLowerCase().includes(lq) ||
            item.professorName?.toLowerCase().includes(lq) ||
            item.abstract?.toLowerCase().includes(lq) ||
            item.category?.toLowerCase().includes(lq) ||
            item.openRoles?.some((r) => r.roleName?.toLowerCase().includes(lq) || r.title?.toLowerCase().includes(lq)) ||
            item.keywords?.some((k) => k.toLowerCase().includes(lq)) ||
            item.collaborators?.some((c) => c.toLowerCase().includes(lq)) ||
            item.coAuthors?.some((a) => a.toLowerCase().includes(lq));
        return matchesStatus && matchesCat && matchesCollab && matchesSearch && matchesYear;
    });

    return result.sort((a, b) => {
        if (currentFilters.sortBy === "stars") return (b.stars || 0) - (a.stars || 0);
        if (currentFilters.sortBy === "newest") return new Date(b.createdAt || b.publishedDate) - new Date(a.createdAt || a.publishedDate);
        if (currentFilters.sortBy === "relevance") {
            const diff = calculateRelevance(b, query, currentFilters.category) - calculateRelevance(a, query, currentFilters.category);
            return diff !== 0 ? diff : new Date(b.createdAt || b.publishedDate) - new Date(a.createdAt || a.publishedDate);
        }
        return 0;
    });
};

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useResearchActions(state) {
    const {
        myProjects, setMyProjects, availableProjects, setAvailableProjects,
        myPublications, setMyPublications, availablePublications, setAvailablePublications,
        myApplications, setMyApplications, allUsers,
        selectedItem, setSelectedItem, setSelectedUser, previousSelectedItem, setPreviousSelectedItem,
        personalSearchQuery, exploreSearchQuery, filters, viewMode, fetchData,
    } = state;

    const navigate = useNavigate();
    const { refreshNotifications } = useNotifications();

    // ── Filtered lists ────────────────────────────────────────────────────────
    const filteredMyProjects           = useMemo(() => processItems(myProjects, personalSearchQuery, filters), [myProjects, personalSearchQuery, filters]);
    const filteredMyPublications       = useMemo(() => processItems(myPublications, personalSearchQuery, filters), [myPublications, personalSearchQuery, filters]);
    const filteredAvailableProjects    = useMemo(() => processItems([...availableProjects, ...myProjects], exploreSearchQuery, filters), [availableProjects, myProjects, exploreSearchQuery, filters]);
    const filteredAvailablePublications = useMemo(() => processItems([...availablePublications, ...myPublications], exploreSearchQuery, filters), [availablePublications, myPublications, exploreSearchQuery, filters]);

    // ── Shared list updater ───────────────────────────────────────────────────
    const updateAllLists = (fn) => {
        setMyProjects((p) => fn(p));
        setAvailableProjects((p) => fn(p));
        setMyPublications((p) => fn(p));
        setAvailablePublications((p) => fn(p));
    };

    // ── Star toggle ───────────────────────────────────────────────────────────
    const handleToggleStar = async (id) => {
        let isNowStarred = false;
        const toggle = (list) => list.map((item) => {
            if (item.id !== id) return item;
            isNowStarred = !item.isStarred;
            return { ...item, isStarred: isNowStarred, starsCount: isNowStarred ? (item.starsCount || 0) + 1 : Math.max(0, (item.starsCount || 0) - 1) };
        });
        updateAllLists(toggle);
        setSelectedItem((prev) => prev?.data?.id === id
            ? { ...prev, data: { ...prev.data, isStarred: isNowStarred, starsCount: isNowStarred ? (prev.data.starsCount || 0) + 1 : Math.max(0, (prev.data.starsCount || 0) - 1) } }
            : prev);
        try {
            const res = await researchService.toggleStar(id);
            if (!res.success) {
                fetchData();
            } else if (res.data?.starsCount !== undefined) {
                // Backend se real starsCount se sync karo
                const realCount = res.data.starsCount;
                updateAllLists((list) => list.map((item) =>
                    item.id === id ? { ...item, starsCount: realCount, trendingScore: res.data.trendingScore ?? item.trendingScore } : item
                ));
            }
        } catch { fetchData(); }
    };

    // ── Application actions ───────────────────────────────────────────────────
    const handleApply = async (itemId, formData, itemType = "Project") => {
        try {
            const res = await researchService.newApplication(itemId, { ...formData, itemType });
            if (res.success) await Promise.all([fetchData(), refreshNotifications()]);
        } catch (err) { console.error(err); }
    };

    const handleApplicationAction = async (applicationId, status, feedback) => {
        let targetItem = null, targetApplicant = null;
        const findApplicant = (list) => { for (const item of list) { const a = item.applicants?.find((a) => a.id === applicationId); if (a) { targetItem = item; targetApplicant = a; return true; } } return false; };
        findApplicant(myProjects) || findApplicant(myPublications) || findApplicant(availableProjects) || findApplicant(availablePublications);
        if (!targetItem || !targetApplicant) return;

        const { name: memberName, role: roleName, roleId, userId } = targetApplicant;
        const isPublication = ["Publication", "publication"].includes(targetItem.type);

        const updateList = (list) => list.map((item) => {
            if (item.id === targetItem.id) {
                let applicants = [...(item.applicants || [])], openRoles = [...(item.openRoles || [])];
                let collaborators = [...(item.collaborators || [])], coAuthors = [...(item.coAuthors || [])];
                let memberCount = item.currentMemberCount || 0;
                if (status === "Accepted") {
                    applicants = applicants.map((a) => a.id !== applicationId && a.roleId === roleId && a.status === "Pending" ? { ...a, status: "Rejected", professorNotes: "Position has been filled." } : a).filter((a) => a.id !== applicationId);
                    isPublication ? (!coAuthors.includes(memberName) && coAuthors.push(memberName)) : (!collaborators.includes(memberName) && collaborators.push(memberName));
                    memberCount += 1;
                    openRoles = openRoles.filter((r) => r.roleName !== roleName);
                } else {
                    applicants = applicants.map((a) => a.id === applicationId ? { ...a, status, professorNotes: feedback } : a);
                }
                return { ...item, applicants, collaborators, coAuthors, currentMemberCount: memberCount, openRoles, openRolesCount: openRoles.length };
            }
            if (status === "Accepted" && item.applicants)
                return { ...item, applicants: item.applicants.filter((a) => !(a.userId === userId && a.roleId === roleId && a.status === "Pending")) };
            return item;
        });

        updateAllLists(updateList);
        setMyApplications((prev) => { let next = prev.filter((a) => a.id !== applicationId); if (status === "Accepted") next = next.filter((a) => a.roleId !== roleId); return next; });
        setSelectedItem((prev) => prev?.data?.id === targetItem.id ? { ...prev, data: updateList([prev.data])[0] } : prev);
        try { const res = await researchService.updateApplicationStatus(applicationId, status, { feedback }); if (!res.success) fetchData(); } catch { fetchData(); }
    };

    // ── CRUD ──────────────────────────────────────────────────────────────────
    const handleCreateSubmit = async (formData) => { try { const res = await researchService.createResearch(formData); if (res.success) fetchData(); } catch (err) { console.error(err); } };
    const handleUpdateSubmit = async (formData) => { try { const res = await researchService.updateResearch(formData.id, formData); if (res.success) fetchData(); } catch (err) { console.error(err); } };
    const handleUpdateUser   = async (userData) => { try { const res = await researchService.updateUserProfile(userData.id, userData); if (res.success) fetchData(); } catch (err) { console.error(err); } };

    // ── Timeline ──────────────────────────────────────────────────────────────
    const handleAddTimelineEvent    = async (id, data) => { try { const res = await researchService.addTimelineEvent(id, data); if (res.success) fetchData(); } catch (err) { console.error(err); } };
    const handleUpdateTimelineEvent = async (id, eid, data) => { try { const res = await researchService.updateTimelineEvent(id, eid, data); if (res.success) fetchData(); } catch (err) { console.error(err); } };
    const handleDeleteTimelineEvent = async (researchId, eventId) => {
        try {
            const res = await researchService.deleteTimelineEvent(researchId, eventId);
            if (res.success) { setSelectedItem((prev) => prev?.data?.id === researchId ? { ...prev, data: { ...prev.data, timeline: prev.data.timeline.filter((e) => e.id !== eventId) } } : prev); fetchData(); }
        } catch (err) { console.error(err); }
    };

    // ── Roles ─────────────────────────────────────────────────────────────────
    const updateRoleInLists = (researchId, transform) => {
        const fn = (list) => list.map((item) => item.id === researchId ? { ...item, openRoles: transform(item.openRoles) } : item);
        setMyProjects((p) => fn(p)); setAvailableProjects((p) => fn(p));
        setSelectedItem((prev) => prev?.data?.id === researchId ? { ...prev, data: { ...prev.data, openRoles: transform(prev.data.openRoles) } } : prev);
    };
    const onUpdateRole = async (researchId, roleId, roleData) => { try { const res = await researchService.updateRole(researchId, roleId, roleData); if (res.success) updateRoleInLists(researchId, (roles) => roles.map((r) => r.id === roleId ? { ...r, ...roleData } : r)); } catch (err) { console.error(err); } };
    const onCreateRole = async (researchId, roleData) => { try { const res = await researchService.createRole(researchId, roleData); if (res.success) { const fn = (list) => list.map((item) => item.id === researchId ? { ...item, openRoles: res.data, openRolesCount: res.data.length } : item); setMyProjects((p) => fn(p)); setAvailableProjects((p) => fn(p)); setSelectedItem((prev) => prev?.data?.id === researchId ? { ...prev, data: { ...prev.data, openRoles: res.data, openRolesCount: res.data.length } } : prev); } } catch (err) { console.error(err); } };
    const onDeleteRole = async (researchId, roleId) => { try { const res = await researchService.deleteRole(researchId, roleId); if (res.success) updateRoleInLists(researchId, (roles) => roles.filter((r) => r.id !== roleId)); } catch (err) { console.error(err); } };

    // ── Navigation ────────────────────────────────────────────────────────────
    const handleTabChange = (newTab) => { setSelectedItem(null); setSelectedUser(null); setPreviousSelectedItem(null); navigate(`/research-publications/${newTab}`); };

    const handleSetSelectedItem = (item) => {
        setSelectedUser(null); setPreviousSelectedItem(null);
        if (!item) { navigate(`/research-publications/${viewMode}`); return; }
        const identifier = item.type === "publication" ? item.data.url || item.data.id : item.data.id;
        const path = item.type === "project" ? `project/${identifier}` : `publication/${identifier}`;
        navigate(`/research-publications/${viewMode}/${path}`);
    };

    const handleViewUser = (identifier) => {
        const user = allUsers.find((u) => u.name === identifier || u.id === identifier);
        if (user) { if (selectedItem) setPreviousSelectedItem(selectedItem); setSelectedUser(user); setSelectedItem(null); navigate(`/research-publications/${viewMode}/user/${user.id}`); }
    };

    const handleClearUser = () => {
        if (previousSelectedItem) {
            const item = previousSelectedItem;
            setSelectedItem(item); setSelectedUser(null); setPreviousSelectedItem(null);
            const identifier = item.type === "publication" ? item.data.url || item.data.id : item.data.id;
            navigate(`/research-publications/${viewMode}/${item.type === "project" ? "project" : "publication"}/${identifier}`);
        } else { navigate(`/research-publications/${viewMode}`); setSelectedUser(null); }
    };

    return {
        filtered: { filteredMyProjects, filteredMyPublications, filteredAvailableProjects, filteredAvailablePublications },
        handlers: {
            handleToggleStar, handleApply, handleApplicationAction,
            handleCreateSubmit, handleUpdateSubmit, handleUpdateUser,
            handleAddTimelineEvent, handleUpdateTimelineEvent, handleDeleteTimelineEvent,
            onUpdateRole, onCreateRole, onDeleteRole,
            handleTabChange, handleSetSelectedItem, handleViewUser, handleClearUser,
        },
    };
}