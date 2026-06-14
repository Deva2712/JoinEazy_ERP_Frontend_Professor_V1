// src/pages/FinanceMangement/FinanceManagementController.jsx

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import FinanceManagementUI from "./FinanceManagementUI";
import { useFinanceData, useFinanceActions, useFinanceFilters } from "./hooks/Usefinancehooks";

const FinanceManagementController = () => {
  const { tab } = useParams();
  const navigate = useNavigate();

  const activeTab = tab || "expenses";

  const { expenses, setExpenses, advances, setAdvances, admins, loading, error, fetchData } = useFinanceData();

  const { handleCreateRequest } = useFinanceActions({ expenses, setExpenses, advances, setAdvances, fetchData });

  const { filters, setFilters, filteredHistory, filterByStatus } = useFinanceFilters({ expenses, advances });

  const handleTabChange = (newTab) => {
    navigate(`/finance-management/${newTab}`);
  };

  return (
    <FinanceManagementUI
      expenses={filterByStatus(expenses, activeTab === "history")}
      advances={filterByStatus(advances, activeTab === "history")}
      filteredHistory={filteredHistory}
      admins={admins}
      loading={loading}
      error={error}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onRefresh={fetchData}
      onSubmit={handleCreateRequest}
      allExpenses={expenses}
      allAdvances={advances}
      filters={filters}
      setFilters={setFilters}
    />
  );
};

export default FinanceManagementController;