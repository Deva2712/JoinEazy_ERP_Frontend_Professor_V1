// src/pages/Finance/FinanceUI.jsx
import React, { useState } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";
import HeaderController    from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController    from "../../components/layout/Footer/FooterController";
import PaymentModal        from "./components/PaymentModal";
import FinanceBanner       from "./components/Financebanner";
import FinanceTabContent   from "./components/Financetabcontent";

const FinanceUI = ({
  loading = false,
  error   = null,
  onRetry = () => {},
  fees            = [],
  paymentHistory  = [],
  receipts        = [],
  dueReminders    = [],
  totalDue        = 0,
  totalPaid       = 0,
  onPay               = () => {},
  onDownloadReceipt   = () => {},
  onViewReceipt       = () => {},
}) => {
  const [activeTab, setActiveTab] = useState("contact");
  const [payingFee, setPayingFee] = useState(null);

  const handlePayFee      = (fee)      => setPayingFee(fee);
  const handlePayConfirm  = (data)     => { onPay(data); setPayingFee(null); };
  const handleReminderPay = (reminder) => {
    const fee = fees.find((f) => f.id === reminder.feeId);
    if (fee) setPayingFee(fee);
    else     setActiveTab("fees");
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117]">
      <HeaderController />
      <div className="flex justify-center py-32">
        <RefreshCw className="size-10 animate-spin text-emerald-600" />
      </div>
      <BottomNavController /><FooterController />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117]">
      <HeaderController />
      <div className="flex flex-col items-center py-32 gap-4">
        <AlertTriangle className="size-10 text-red-500" />
        <p className="font-bold dark:text-white">Failed to load finance data</p>
        <button onClick={onRetry} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold">
          Retry
        </button>
      </div>
      <BottomNavController /><FooterController />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
      <HeaderController />

      <FinanceBanner
        activeTab={activeTab}
        onTabChange={setActiveTab}
        totalPaid={totalPaid}
        totalDue={totalDue}
      />

      <main className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-12 w-full">
        <FinanceTabContent
          activeTab={activeTab}
          fees={fees}
          dueReminders={dueReminders}
          onReminderPay={handleReminderPay}
          onPayFee={handlePayFee}
          paymentHistory={paymentHistory}
          receipts={receipts}
          onDownloadReceipt={onDownloadReceipt}
          onViewReceipt={onViewReceipt}
        />
      </main>

      {payingFee && (
        <PaymentModal fee={payingFee} onClose={() => setPayingFee(null)} onPay={handlePayConfirm} />
      )}

      <BottomNavController />
      <FooterController />
    </div>
  );
};

export default FinanceUI;