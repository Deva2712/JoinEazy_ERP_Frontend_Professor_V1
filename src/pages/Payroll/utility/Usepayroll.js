import { useState, useEffect, useMemo } from "react";
import { payrollService } from "@/api/services/payroll.service";
import { generatePayslipPDF } from "./Generatepayslip";

/**
 * Custom hook for payroll state and actions.
 * PDF generation is handled by generatePayslip.js
 */
const usePayroll = () => {
	const [history, setHistory] = useState([]);
	const [breakdown, setBreakdown] = useState(null);
	const [latestBreakdown, setLatestBreakdown] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedYear, setSelectedYear] = useState(
		new Date().getFullYear().toString(),
	);
	const [selectedMonth, setSelectedMonth] = useState("");
	const [isHistorical, setIsHistorical] = useState(false);

	useEffect(() => {
		fetchInitialData();
		document.title = "Payroll & Salary";
	}, []);

	const fetchInitialData = async () => {
		try {
			setLoading(true);
			setError(null);
			const [historyRes, breakdownRes] = await Promise.all([
				payrollService.getHistory(),
				payrollService.getBreakdown(),
			]);
			if (historyRes.success && breakdownRes.success) {
				const historyData = Array.isArray(historyRes.data)
					? historyRes.data
					: Array.isArray(historyRes.data?.history)
					? historyRes.data.history
					: [];
				setHistory(historyData);
				setBreakdown(breakdownRes.data);
				setLatestBreakdown(breakdownRes.data);
			} else {
				setError("Failed to load payroll data.");
				setHistory([]);
			}
		} catch (err) {
			setError("A connection error occurred while fetching payroll.");
			console.error("Payroll fetch error:", err);
		} finally {
			setLoading(false);
		}
	};

	const availableYears = useMemo(() => {
		const years = history.map((item) => item.month.split(" ").pop());
		return [...new Set(years)].sort((a, b) => b - a);
	}, [history]);

	const filteredMonths = useMemo(() => {
		return history.filter((item) => item.month.includes(selectedYear));
	}, [history, selectedYear]);

	const handleDownload = () => {
		if (!isHistorical || !breakdown || !selectedMonth) return;
		const item = history.find((h) => h.month === selectedMonth);
		if (item) generatePayslipPDF(item, breakdown);
	};

	const handleYearChange = (year) => {
		setSelectedYear(year);
		setSelectedMonth("");
		setBreakdown(null);
	};

	const handleSelectMonth = (monthName) => {
		if (!monthName) {
			setIsHistorical(true);
			setBreakdown(null);
			setSelectedMonth("");
			return;
		}
		setSelectedMonth(monthName);
		const record = history.find((h) => h.month === monthName);
		if (record?.breakdown) {
			setBreakdown(record.breakdown);
			setIsHistorical(true);
		}
	};

	const handleReturnToCurrent = () => {
		setBreakdown(latestBreakdown);
		setIsHistorical(false);
		setSelectedMonth("");
	};

	const state = {
		history, breakdown, loading, error,
		years: availableYears,
		months: filteredMonths,
		selectedYear, selectedMonth, isHistorical,
	};

	const actions = {
		setSelectedYear: handleYearChange,
		onRefresh: fetchInitialData,
		onDownload: handleDownload,
		onSelectMonth: handleSelectMonth,
		onReturnToCurrent: handleReturnToCurrent,
	};

	return { state, actions };
};

export default usePayroll;