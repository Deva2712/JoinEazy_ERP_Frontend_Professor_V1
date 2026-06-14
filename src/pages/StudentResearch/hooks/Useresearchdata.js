// src/pages/StudentResearch/hooks/useResearchData.js
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { studentResearchService } from "@/api/services/studentResearch.service";
import { useNotifications } from "../../../context/NotificationContext";

const useResearchData = () => {
    const { projectId, pubId } = useParams();
    const { refreshNotifications } = useNotifications();

    const [availableProjects,     setAvailableProjects]     = useState([]);
    const [availablePublications, setAvailablePublications] = useState([]);
    const [myProjects,            setMyProjects]            = useState([]);
    const [myApplications,        setMyApplications]        = useState([]);
    const [myPublications,        setMyPublications]        = useState([]);
    const [allUsers,              setAllUsers]              = useState([]);
    const [loading,               setLoading]               = useState(true);
    const [error,                 setError]                 = useState(null);
    const [selectedItem,          setSelectedItem]          = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await studentResearchService.getDashboard();
            if (!res.success) throw new Error(res.error || "Failed to load research data");

            const {
                availableProjects:     ap   = [],
                myProjects:            mp   = [],
                availablePublications: apub = [],
                myPublications:        mpub = [],
                myApplications:        apps = [],
                allUsers:              users = [],
            } = res.data;

            setAvailableProjects(ap);
            setMyProjects(mp);
            setAvailablePublications(apub);
            setMyPublications(mpub);
            setMyApplications(apps);
            setAllUsers(users);
        } catch (err) {
            setError("Failed to load research opportunities. Please try again.");
            console.error("Student research fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Resolve deep-link URL params into selectedItem once data is loaded
    useEffect(() => {
        if (loading) return;
        const id = projectId || pubId;
        if (!id) { setSelectedItem(null); return; }

        if (projectId) {
            const proj =
                myProjects.find((p) => p.id === projectId) ||
                availableProjects.find((p) => p.id === projectId);
            if (proj) setSelectedItem({ type: "project", data: proj });
        } else if (pubId) {
            const pub =
                myPublications.find((p) => p.id === pubId || p.url === pubId) ||
                availablePublications.find((p) => p.id === pubId || p.url === pubId);
            if (pub) setSelectedItem({ type: "publication", data: pub });
        }
    }, [
        projectId, pubId, loading,
        myProjects, availableProjects,
        myPublications, availablePublications,
    ]);

    // ── Actions ───────────────────────────────────────────────────────────

    const handleApply = async (itemId, formData, itemType = "Project") => {
        try {
            const res = await studentResearchService.applyToItem(itemId, { ...formData, itemType });
            if (res.success) {
                if (res.data) {
                    setMyApplications((prev) => {
                        if (prev.some((app) => app.id === res.data.id)) return prev;
                        return [res.data, ...prev];
                    });
                }
                if (itemType === "Project") {
                    setAvailableProjects((prev) => prev.filter((p) => p.id !== itemId));
                } else {
                    setAvailablePublications((prev) => prev.filter((p) => p.id !== itemId));
                }
                await Promise.all([fetchData(), refreshNotifications()]);
            }
            return res;
        } catch (err) {
            console.error("Application submission failed:", err);
            return { success: false, error: err };
        }
    };

    const handleToggleStar = async (id) => {
        let isNowStarred = false;
        const updateList = (list) =>
            list.map((item) => {
                if (item.id !== id) return item;
                isNowStarred = !item.isStarred;
                return {
                    ...item,
                    isStarred:  isNowStarred,
                    starsCount: isNowStarred
                        ? (item.starsCount || 0) + 1
                        : Math.max(0, (item.starsCount || 0) - 1),
                };
            });

        setMyProjects((p) => updateList(p));
        setAvailableProjects((p) => updateList(p));
        setMyPublications((p) => updateList(p));
        setAvailablePublications((p) => updateList(p));
        setSelectedItem((prev) => {
            if (prev?.data?.id !== id) return prev;
            return {
                ...prev,
                data: {
                    ...prev.data,
                    isStarred:  isNowStarred,
                    starsCount: isNowStarred
                        ? (prev.data.starsCount || 0) + 1
                        : Math.max(0, (prev.data.starsCount || 0) - 1),
                },
            };
        });

        try {
            const res = await studentResearchService.toggleStar(id);
            if (!res.success) fetchData();
        } catch {
            fetchData();
        }
    };

    return {
        // state
        availableProjects,
        availablePublications,
        myProjects,
        myPublications,
        myApplications,
        allUsers,
        loading,
        error,
        selectedItem,
        setSelectedItem,
        // actions
        fetchData,
        handleApply,
        handleToggleStar,
    };
};

export default useResearchData;