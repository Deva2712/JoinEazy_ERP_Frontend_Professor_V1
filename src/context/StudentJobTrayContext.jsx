// src/context/StudentJobTrayContext.jsx
import React, {
    createContext,
    useContext,
    useState,
    useRef,
    useMemo,
    useEffect,
} from "react";
import { studentJobService } from "../services/studentJobService";

const StudentJobTrayContext = createContext();

export const StudentJobTrayProvider = ({ children }) => {
    const [rawJobs, setRawJobs] = useState([]);
    const [readJobIds, setReadJobIds] = useState(() => {
        const saved = localStorage.getItem("studentReadJobIds");
        return saved ? JSON.parse(saved) : [];
    });
    const [isLoading, setIsLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);
    const isFetching = useRef(false);

    useEffect(() => {
        localStorage.setItem("studentReadJobIds", JSON.stringify(readJobIds));
    }, [readJobIds]);

    const hasUnreadJobs = useMemo(() => {
        return rawJobs.some((job) => !readJobIds.includes(job.id));
    }, [rawJobs, readJobIds]);

    const jobs = useMemo(() => {
        return rawJobs.map((job) => ({
            ...job,
            isRead: readJobIds.includes(job.id),
        }));
    }, [rawJobs, readJobIds]);

    const refreshJobs = async () => {
        if (isFetching.current) return;
        if (!hasFetched) setIsLoading(true);

        isFetching.current = true;
        try {
            const data = await studentJobService.getAllPendingJobs();
            setRawJobs(data);
            setHasFetched(true);
        } finally {
            setIsLoading(false);
            isFetching.current = false;
        }
    };

    const markJobAsRead = (jobId) => {
        if (!readJobIds.includes(jobId)) {
            setReadJobIds((prev) => [...prev, jobId]);
        }
    };

    return (
        <StudentJobTrayContext.Provider
            value={{
                jobs,
                isLoading,
                refreshJobs,
                hasFetched,
                hasUnreadJobs,
                markJobAsRead,
            }}
        >
            {children}
        </StudentJobTrayContext.Provider>
    );
};

export const useStudentJobs = () => useContext(StudentJobTrayContext);