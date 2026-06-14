// src/pages/Finance/components/FinanceTabContent.jsx
import { IndianRupee, Clock, Receipt } from "lucide-react";
import FeeCard              from "./FeeCard";
import DueReminderBanner    from "./DueReminderBanner";
import HistoryCard          from "./HistoryCard";
import ReceiptCard          from "./ReceiptCard";
import FinanceOfficeSection from "./FinanceOfficeSection";
import { fmt }              from "./shared";

// ── History summary mini-cards ────────────────────────────────────────────────
function HistorySummary({ paymentHistory }) {
  const stats = [
    {
      label: "Transactions",
      value: paymentHistory.length,
      color: "text-gray-900 dark:text-white",
    },
    {
      label: "Amount Paid",
      value: fmt(paymentHistory.filter((h) => h.status === "Paid").reduce((s, h) => s + h.amount, 0)),
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Pending / Failed",
      value: paymentHistory.filter((h) => h.status !== "Paid").length,
      color: "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map(({ label, value, color }) => (
        <div key={label} className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 px-4 py-3">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{label}</p>
          <p className={`text-lg font-extrabold ${color}`}>{value}</p>
        </div>
      ))}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function FinanceTabContent({
  activeTab,
  fees, dueReminders, onReminderPay, onPayFee,
  paymentHistory,
  receipts, onDownloadReceipt, onViewReceipt,
}) {
  if (activeTab === "contact") return (
    <div className="animate-in fade-in duration-300">
      <FinanceOfficeSection />
    </div>
  );

  if (activeTab === "fees") return (
    <div className="animate-in fade-in duration-300">
      <DueReminderBanner reminders={dueReminders} onPayNow={onReminderPay} />
      {fees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fees.map((fee) => <FeeCard key={fee.id} fee={fee} onPay={onPayFee} />)}
        </div>
      ) : (
        <div className="text-center py-20">
          <IndianRupee className="size-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No fees found.</p>
        </div>
      )}
    </div>
  );

  if (activeTab === "history") return (
    <div className="animate-in fade-in duration-300 flex justify-center">
      <div className="w-full max-w-3xl space-y-4">
        {paymentHistory.length > 0 ? (
          <>
            <HistorySummary paymentHistory={paymentHistory} />
            <div className="space-y-3">
              {paymentHistory.map((h) => <HistoryCard key={h.id} entry={h} />)}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Clock className="size-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No payment history.</p>
          </div>
        )}
      </div>
    </div>
  );

  if (activeTab === "receipts") return (
    <div className="animate-in fade-in duration-300">
      {receipts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {receipts.map((r) => (
            <ReceiptCard key={r.id} receipt={r} onDownload={onDownloadReceipt} onView={onViewReceipt} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Receipt className="size-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No receipts available.</p>
        </div>
      )}
    </div>
  );

  return null;
}