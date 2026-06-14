// src/pages/FinanceManagement/hooks/useFinanceManagement.js
import { useState, useMemo, useEffect } from "react";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function useFinanceManagement({
  expenses, advances, allExpenses, allAdvances, filters, activeTab,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [modalType, setModalType] = useState("Expense");
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, [activeTab]);

  const filterMetadata = useMemo(() => {
    const years = new Set();
    [...allExpenses, ...allAdvances].forEach((item) => {
      const d = new Date(item.appliedAt || item.createdAt || item.date);
      if (!isNaN(d.getTime())) years.add(d.getFullYear().toString());
    });
    return { years: Array.from(years).sort((a, b) => b - a), months: MONTHS };
  }, [allExpenses, allAdvances]);

  const groupedHistory = useMemo(() => {
    let list = filters.type === "all"      ? [...expenses, ...advances]
             : filters.type === "expenses" ? [...expenses]
             :                               [...advances];

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter((i) =>
        i.title?.toLowerCase().includes(q) ||
        i.category?.toLowerCase().includes(q)
      );
    }

    return list.reduce((groups, item) => {
      const date      = new Date(item.appliedAt || item.createdAt || item.date);
      const itemYear  = date.getFullYear().toString();
      const itemMonth = date.toLocaleString("default", { month: "long" });
      if (filters.year  !== "all" && itemYear  !== filters.year)  return groups;
      if (filters.month !== ""    && itemMonth !== filters.month) return groups;
      const key = date.toLocaleString("default", { month: "long", year: "numeric" });
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
      return groups;
    }, {});
  }, [expenses, advances, filters]);

  const allItems     = [...allExpenses, ...allAdvances];
  const pendingCount  = allItems.filter((e) => e.status === "Pending" || e.status === "Resubmitted").length;
  const rejectedCount = allItems.filter((e) => e.status === "Rejected").length;

  const openEditModal = (item) => {
    setEditingItem(item);
    setModalType(item.amount_requested ? "Advance" : "Expense");
    setIsModalOpen(true);
  };

  const openNewModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  return {
    // state
    isModalOpen, isFilterDrawerOpen, modalType, editingItem,
    // derived
    filterMetadata, groupedHistory, pendingCount, rejectedCount,
    // actions
    openEditModal, openNewModal, closeModal,
    setIsFilterDrawerOpen,
  };
}