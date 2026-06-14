// src/pages/Finance/FinanceController.jsx
// All business logic and state. FinanceUI is purely presentational.

import React, { useState, useEffect } from "react";
import FinanceUI from "./FinanceUI";
import { financeService } from "../../../src/api/services/finance.server"; 


// ── FinanceController ─────────────────────────────────────────────────────────
const FinanceController = () => {
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [fees, setFees]                     = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [receipts, setReceipts]             = useState([]);
  const [dueReminders, setDueReminders]     = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await financeService.getOverview();
      if (!res.success) throw new Error(res.error || "Failed to load");
      setFees(res.data.fees ?? []);
      setPaymentHistory(res.data.paymentHistory ?? []);
      setReceipts(res.data.receipts ?? []);
      setDueReminders(res.data.dueReminders ?? []);
    } catch (err) {
      console.error("Finance load error:", err);
      setError("Failed to load finance data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    document.title = "Finance – Joineazy";
  }, []);

  const totalPaid = paymentHistory.reduce((s, h) => s + h.amount, 0);
  const totalDue  = fees.reduce((s, f) => s + f.due, 0);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handlePay = async ({ feeId, mode, amount, details }) => {
    const res = await financeService.pay({ feeId, mode, amount, details });
    if (!res.success) { console.error("Payment failed:", res.error); return; }
    setFees((prev) => prev.map((f) => f.id === feeId ? { ...f, due: 0, status: "Paid" } : f));
    setPaymentHistory((prev) => [res.data.historyEntry, ...prev]);
    setReceipts((prev) => [res.data.receipt, ...prev]);
    setDueReminders((prev) => prev.filter((r) => r.feeId !== feeId));
  };

  const handleDownloadReceipt = async (receipt) => {
    const res = await financeService.downloadReceipt(receipt.id);
    if (res.success && res.data?.url) window.open(res.data.url, "_blank");
    else console.error("Download failed:", res.error);
  };

  const handleViewReceipt = (receipt) => {
    // TODO: open PDF viewer or navigate to receipt detail page
    console.log("View receipt:", receipt.id);
  };

  return (
    <FinanceUI
      loading={loading}
      error={error}
      onRetry={fetchData}
      fees={fees}
      paymentHistory={paymentHistory}
      receipts={receipts}
      dueReminders={dueReminders}
      totalPaid={totalPaid}
      totalDue={totalDue}
      onPay={handlePay}
      onDownloadReceipt={handleDownloadReceipt}
      onViewReceipt={handleViewReceipt}
    />
  );
};

export default FinanceController;