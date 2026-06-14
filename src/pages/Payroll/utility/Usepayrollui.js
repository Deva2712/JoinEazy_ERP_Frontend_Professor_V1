// src/pages/Payroll/usePayrollUI.js
import { useState, useEffect } from "react";

export function usePayrollUI({ onReturnToCurrent, onSelectMonth }) {
	const [activeTab, setActiveTab] = useState("current");

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [activeTab]);

	const handleTabChange = (tab) => {
		setActiveTab(tab);
		if (tab === "current") {
			onReturnToCurrent();
		} else {
			onSelectMonth("");
		}
	};

	const getNextPaymentDate = () => {
		const now = new Date();
		const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
		return nextMonth.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
	};

	const getPaidDate = (activeTab, history, selectedMonth) => {
		if (activeTab === "current") return getNextPaymentDate();
		const record = history.find((h) => h.month === selectedMonth);
		return record
			? new Date(record.paidAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
			: "...";
	};

	return { activeTab, handleTabChange, getPaidDate };
}