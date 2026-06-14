// src/pages/Examination/ExaminationController.jsx

import React, { useState, useEffect } from "react";
import ExaminationUI from "./ExaminationUI";
import { examinationService } from "../../api/services/examination.service";

const ExaminationController = () => {
    const [loading,             setLoading]             = useState(true);
    const [error,               setError]               = useState(null);
    const [examSchedule,        setExamSchedule]        = useState([]);
    const [results,             setResults]             = useState([]);
    const [gradeHistory,        setGradeHistory]        = useState([]);
    const [revaluationRequests, setRevaluationRequests] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await examinationService.getOverview();

            if (!response.success) {
                throw new Error(response.error || "Failed to load examination data");
            }

            const { examSchedule, results, gradeHistory, revaluationRequests } = response.data;

            setExamSchedule(examSchedule        ?? []);
            setResults(results                  ?? []);
            setGradeHistory(gradeHistory        ?? []);
            setRevaluationRequests(revaluationRequests ?? []);
        } catch (err) {
            console.error("Examination Load Error:", err);
            setError(err.message || "Failed to load examination data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        document.title = "Examinations – Joineazy";
    }, []);

    const handleSubmitRevaluation = async (data) => {
        try {
            const response = await examinationService.submitRevaluation(data);
            if (response.success) {
                setRevaluationRequests((prev) => [response.data, ...prev]);
            }
        } catch (err) {
            console.error("Revaluation Submit Error:", err);
        }
    };

    return (
        <ExaminationUI
            loading={loading}
            error={error}
            onRetry={fetchData}
            examSchedule={examSchedule}
            results={results}
            gradeHistory={gradeHistory}
            revaluationRequests={revaluationRequests}
            onSubmitRevaluation={handleSubmitRevaluation}
        />
    );
};

export default ExaminationController;