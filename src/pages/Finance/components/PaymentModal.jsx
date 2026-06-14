// src/pages/Finance/components/PaymentModal.jsx
import React, { useState } from "react";
import {
  ArrowLeft, CheckCircle, ShieldCheck, AlertCircle,
  RefreshCw, Award, Smartphone, CreditCard,
  Landmark, Wallet, Eye, EyeOff,
  MapPin, Clock, Phone, Mail, Building2,
  IndianRupee,
} from "lucide-react";
import { fmt, FieldInput } from "./shared";

// ── Step indicator ────────────────────────────────────────────────────────────
const STEPS = ["Mode", "Details", "Verify", "Done"];

const StepBar = ({ current }) => (
  <div className="flex items-center gap-0 mb-6">
    {STEPS.map((label, i) => (
      <React.Fragment key={label}>
        <div className="flex flex-col items-center gap-1">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
            i < current
              ? "bg-emerald-600 border-emerald-600 text-white"
              : i === current
                ? "bg-white dark:bg-[#1a1d26] border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400"
          }`}>
            {i < current ? <CheckCircle className="size-3.5" /> : i + 1}
          </div>
          <span className={`text-[10px] font-semibold ${i === current ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"}`}>
            {label}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <div className={`flex-1 h-0.5 mb-4 mx-1 rounded transition-all duration-500 ${i < current ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ── Amount banner ─────────────────────────────────────────────────────────────
const AmountBanner = ({ fee }) => (
  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-4 mb-5 border border-emerald-100 dark:border-emerald-800">
    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider mb-1">Amount Due</p>
    <p className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-300">{fmt(fee.due)}</p>
    {fee.scholarship > 0 && (
      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
        <Award className="size-3" /> Scholarship of {fmt(fee.scholarship)} already deducted
      </p>
    )}
  </div>
);

// ── Payment mode forms ────────────────────────────────────────────────────────
const UPIDetailsForm = ({ details, setDetails }) => (
  <>
    <FieldInput
      label="UPI ID" placeholder="yourname@upi / 9876543210@paytm"
      value={details.upiId || ""}
      onChange={(v) => setDetails({ ...details, upiId: v })}
    />
    <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl text-xs text-blue-700 dark:text-blue-400">
      Supported: GPay, PhonePe, Paytm, BHIM & all UPI apps
    </div>
  </>
);

const CardDetailsForm = ({ details, setDetails }) => {
  const [showCvv, setShowCvv] = useState(false);
  const fmtCard   = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const fmtExpiry = (v) => { const c = v.replace(/\D/g, "").slice(0, 4); return c.length > 2 ? `${c.slice(0, 2)}/${c.slice(2)}` : c; };
  return (
    <>
      <FieldInput label="Cardholder Name" placeholder="As printed on card" value={details.name || ""} onChange={(v) => setDetails({ ...details, name: v })} />
      <div className="mb-3">
        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Card Number</label>
        <input type="text" value={details.cardNumber || ""} maxLength={19} placeholder="1234 5678 9012 3456"
          onChange={(e) => setDetails({ ...details, cardNumber: fmtCard(e.target.value) })}
          className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-emerald-500 text-gray-900 dark:text-white font-mono tracking-widest" />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Expiry</label>
          <input type="text" value={details.expiry || ""} maxLength={5} placeholder="MM/YY"
            onChange={(e) => setDetails({ ...details, expiry: fmtExpiry(e.target.value) })}
            className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-emerald-500 text-gray-900 dark:text-white" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">CVV</label>
          <div className="relative">
            <input type={showCvv ? "text" : "password"} value={details.cvv || ""} maxLength={4} placeholder="•••"
              onChange={(e) => setDetails({ ...details, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
              className="w-full px-4 py-2.5 pr-10 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-emerald-500 text-gray-900 dark:text-white" />
            <button type="button" onClick={() => setShowCvv(!showCvv)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showCvv ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const NetBankingForm = ({ details, setDetails }) => {
  const banks = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra", "Punjab National Bank", "Other"];
  return (
    <>
      <div className="mb-3">
        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Select Bank</label>
        <select value={details.bank || ""} onChange={(e) => setDetails({ ...details, bank: e.target.value })}
          className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-emerald-500 text-gray-900 dark:text-white">
          <option value="">-- Choose your bank --</option>
          {banks.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <FieldInput label="Registered Mobile / Customer ID" placeholder="Mobile number or Customer ID"
        value={details.customerId || ""} onChange={(v) => setDetails({ ...details, customerId: v })} />
    </>
  );
};

const OfflineInfo = () => (
  <>
    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-700 dark:text-amber-400 space-y-2">
      <p className="font-bold">How to pay offline:</p>
      <ol className="list-decimal list-inside space-y-1 text-xs leading-relaxed">
        <li>Download your fee challan from the Receipts tab.</li>
        <li>Visit the <strong>Finance Office – Admin Block, Room 101</strong>.</li>
        <li>Office hours: <strong>Mon – Fri, 9 AM – 4 PM</strong>.</li>
        <li>Pay by cash or demand draft in favour of the institution.</li>
        <li>Collect the stamped receipt and upload a scan via the portal.</li>
      </ol>
      <p className="text-xs mt-2 text-amber-600 dark:text-amber-500">Note: Offline payments may take 1–2 working days to reflect.</p>
    </div>
    <div className="mt-4 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-800/60 px-4 py-3 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700">
        <Building2 className="size-4 text-gray-500 dark:text-gray-400" />
        <p className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Finance Office</p>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {[
          { icon: MapPin, title: "Admin Block, Room 101",         sub: "Ground Floor, Near Main Entrance" },
          { icon: Clock,  title: "Mon – Fri: 9:00 AM – 4:00 PM", sub: "Closed on weekends & public holidays" },
          { icon: Phone,  title: "+91-11-2345-6789",              sub: "Ext. 101 – Finance Desk" },
        ].map(({ icon: Icon, title, sub }) => (
          <div key={title} className="flex items-start gap-3 px-4 py-3">
            <Icon className="size-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-gray-800 dark:text-white">{title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{sub}</p>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-3 px-4 py-3">
          <Mail className="size-4 text-emerald-500 shrink-0" />
          <a href="mailto:finance@institution.edu.in" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
            finance@institution.edu.in
          </a>
        </div>
      </div>
    </div>
  </>
);

// ── Steps ─────────────────────────────────────────────────────────────────────
const PAYMENT_MODES = [
  { key: "UPI",        label: "UPI",         icon: Smartphone },
  { key: "Card",       label: "Debit/Credit", icon: CreditCard },
  { key: "NetBanking", label: "Net Banking",  icon: Landmark   },
  { key: "Offline",    label: "Pay Offline",  icon: Wallet     },
];

const ModeStep = ({ fee, mode, setMode, onNext }) => (
  <>
    <AmountBanner fee={fee} />
    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Select Payment Mode</p>
    <div className="grid grid-cols-2 gap-2 mb-5">
      {PAYMENT_MODES.map(({ key, label, icon: Icon }) => (
        <button key={key} onClick={() => setMode(key)}
          className={`flex items-center gap-2 px-3 py-3 rounded-xl border text-sm font-semibold transition-all ${
            mode === key
              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 shadow-sm"
              : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
          }`}>
          <Icon className="size-4" />{label}
        </button>
      ))}
    </div>
    <button onClick={onNext} disabled={!mode}
      className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all">
      Continue →
    </button>
  </>
);

const isDetailsValid = (mode, details) => {
  if (mode === "UPI")        return !!details.upiId?.trim();
  if (mode === "Card")       return !!(details.name && details.cardNumber?.replace(/\s/g, "").length === 16 && details.expiry?.length === 5 && details.cvv?.length >= 3);
  if (mode === "NetBanking") return !!(details.bank && details.customerId?.trim());
  if (mode === "Offline")    return true;
  return false;
};

const BackBtn = ({ onClick }) => (
  <button onClick={onClick} className="flex items-center gap-1.5 px-4 py-3 border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
    <ArrowLeft className="size-4" /> Back
  </button>
);

const DetailsStep = ({ fee, mode, details, setDetails, onBack, onNext }) => (
  <>
    <AmountBanner fee={fee} />
    {mode === "UPI"        && <UPIDetailsForm     details={details} setDetails={setDetails} />}
    {mode === "Card"       && <CardDetailsForm    details={details} setDetails={setDetails} />}
    {mode === "NetBanking" && <NetBankingForm     details={details} setDetails={setDetails} />}
    {mode === "Offline"    && <OfflineInfo />}
    <div className="flex gap-3 mt-4">
      <BackBtn onClick={onBack} />
      <button onClick={onNext} disabled={!isDetailsValid(mode, details)}
        className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all">
        Review Payment →
      </button>
    </div>
  </>
);

const maskCard = (n = "") => n.replace(/\s/g, "").replace(/(\d{4})(\d{4})(\d{4})(\d{1,4})/, "**** **** **** $4");

const VerifyStep = ({ fee, mode, details, onBack, onConfirm, processing }) => {
  const rows = [];
  if (mode === "UPI")        rows.push(["UPI ID", details.upiId]);
  if (mode === "Card")       { rows.push(["Cardholder", details.name]); rows.push(["Card Number", maskCard(details.cardNumber)]); rows.push(["Expiry", details.expiry]); }
  if (mode === "NetBanking") { rows.push(["Bank", details.bank]); rows.push(["Customer ID", details.customerId]); }
  if (mode === "Offline")    rows.push(["Method", "Walk-in – Finance Office"]);
  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
        <p className="text-sm font-bold text-gray-800 dark:text-white">Review & Confirm</p>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden mb-4 text-sm">
        {[["Fee", fee.label], ["Amount", fmt(fee.due)], ["Mode", mode], ...rows].map(([label, value]) => (
          <div key={label} className="flex justify-between items-center px-4 py-3">
            <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">{label}</span>
            <span className={`font-semibold text-gray-900 dark:text-white text-xs font-mono ${label === "Amount" ? "text-emerald-600 dark:text-emerald-400 font-extrabold text-sm font-sans" : ""}`}>{value}</span>
          </div>
        ))}
      </div>
      <div className="flex items-start gap-2 mb-5 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl text-xs text-blue-700 dark:text-blue-400">
        <AlertCircle className="size-4 shrink-0 mt-0.5" />
        Please verify all details before confirming. Payments cannot be reversed once processed.
      </div>
      <div className="flex gap-3">
        <BackBtn onClick={onBack} />
        <button onClick={onConfirm} disabled={processing}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all">
          {processing ? <RefreshCw className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
          {processing ? "Processing…" : `Confirm & Pay ${fmt(fee.due)}`}
        </button>
      </div>
    </>
  );
};

// ── PaymentModal ──────────────────────────────────────────────────────────────
const PaymentModal = ({ fee, onClose, onPay }) => {
  const [step, setStep]       = useState(0);
  const [mode, setMode]       = useState("");
  const [details, setDetails] = useState({});
  const [processing, setProc] = useState(false);

  const handleConfirm = async () => {
    setProc(true);
    await new Promise((r) => setTimeout(r, 1800));
    setProc(false);
    setStep(3);
    setTimeout(() => { onPay({ feeId: fee.id, mode, amount: fee.due, details }); onClose(); }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-[#1a1d26] rounded-3xl border border-gray-200 dark:border-gray-700 w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {step < 3 && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Pay {fee.label}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none">×</button>
          </div>
        )}
        <StepBar current={step === 3 ? 4 : step} />
        {step === 0 && <ModeStep    fee={fee} mode={mode} setMode={setMode} onNext={() => setStep(1)} />}
        {step === 1 && <DetailsStep fee={fee} mode={mode} details={details} setDetails={setDetails} onBack={() => setStep(0)} onNext={() => setStep(2)} />}
        {step === 2 && <VerifyStep  fee={fee} mode={mode} details={details} onBack={() => setStep(1)} onConfirm={handleConfirm} processing={processing} />}
        {step === 3 && (
          <div className="flex flex-col items-center py-10 gap-3">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="size-9 text-green-500" />
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">Payment Successful!</p>
            <p className="text-sm text-gray-500 text-center">{fmt(fee.due)} paid via {mode}</p>
            <p className="text-xs text-gray-400 mt-1">Redirecting…</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;