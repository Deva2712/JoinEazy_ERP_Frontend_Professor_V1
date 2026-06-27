import { useState, useEffect, useMemo, useRef } from "react";
import { expensesService } from "@/api/services/expenses.service";
import { advancesService } from "@/api/services/advances.service";
import { uploadService } from "@/api/services/upload.service";
import { useJobs } from "../../../context/JobTrayContext";
import { useNotifications } from "../../../context/NotificationContext";

// ─── Data Fetching ────────────────────────────────────────────────────────────

export const useFinanceData = () => {
  const [expenses, setExpenses] = useState([]);
  const [advances, setAdvances] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [expenseRes, advanceRes] = await Promise.allSettled([
        expensesService.getExpenses(),
        advancesService.getAdvances(),
      ]);

      let combinedAdmins = [];

      if (expenseRes.status === "fulfilled") {
        const res = expenseRes.value;
        const expObj = res?.data?.expenses || {};
        setExpenses(expObj.expenses || []);
        if (expObj.financeAdmins) combinedAdmins.push(...expObj.financeAdmins);
      }

      if (advanceRes.status === "fulfilled") {
        const res = advanceRes.value;
        const advObj = res?.data?.advances || {};
        setAdvances(advObj.advances || []);
        if (advObj.advanceAdmins) combinedAdmins.push(...advObj.advanceAdmins);
      }

      const uniqueAdmins = Array.from(
        new Map(combinedAdmins.map((a) => [a.email, a])).values()
      );
      setAdmins(uniqueAdmins);
    } catch (err) {
      setError("Unable to sync financial records. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    document.title = "Finance Management";
  }, []);

  return { expenses, setExpenses, advances, setAdvances, admins, loading, error, fetchData };
};

// ─── Create / Update Request ──────────────────────────────────────────────────

export const useFinanceActions = ({ expenses, setExpenses, advances, setAdvances, fetchData }) => {
  const { refreshJobs } = useJobs();
  const { refreshNotifications } = useNotifications();
  const pendingRequestId = useRef(null);

  const handleCreateRequest = async (formData) => {
    const isUpdate = !!formData.id;
    const isAdvance = formData.type === "Advance";
    const allRecords = [...expenses, ...advances];
    const currentRecord = allRecords.find((r) => r.id === formData.id);
    const isResubmission = currentRecord?.status === "Rejected";

    // Optimistic update
    let tempId = null;
    if (!isUpdate) {
      tempId = `temp-${Date.now()}`;
      pendingRequestId.current = tempId;

      const tempRecord = {
        ...formData,
        id: tempId,
        status: "Pending",
        date: new Date().toISOString(),
        amount_spent: isAdvance ? undefined : formData.amount,
        amount_requested: isAdvance ? formData.amount : undefined,
      };

      if (isAdvance) setAdvances((prev) => [tempRecord, ...prev]);
      else setExpenses((prev) => [tempRecord, ...prev]);
    }

    try {
      let response;

      // Agar user ne actual file select ki hai (File object), pehle usse
      // S3 pe upload karo aur URL nikalo — File object ko seedha JSON mein
      // bhejna kaam nahi karta, JSON.stringify se file data lost ho jaata hai.
      let proofDocUrl = formData.proof_doc_file;
      if (formData.proof_doc_file instanceof File) {
        const uploadRes = await uploadService.uploadFile(formData.proof_doc_file, "finance_proof");
        proofDocUrl = uploadRes?.data?.fileUrl || null;
      }

      let payload = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        amount: formData.amount,
        proof_doc_link: formData.proof_doc_link,
        proof_doc_file: proofDocUrl,
        status: isResubmission ? "Resubmitted" : isUpdate ? currentRecord.status : "Pending",
      };

      if (isResubmission) {
        payload.previousVersion = {
          title: currentRecord.title,
          amount: currentRecord.amount_spent || currentRecord.amount_requested,
          date: currentRecord.date,
          description: currentRecord.description,
          adminComments: currentRecord.adminComments,
          proof_doc_link: currentRecord.proof_doc_link,
          proof_doc_file: proofDocUrl,
        };
      }

      if (isUpdate) {
        response = isAdvance
          ? await advancesService.updateAdvance(formData.id, payload)
          : await expensesService.updateExpense(formData.id, payload);
      } else {
        response = isAdvance
          ? await advancesService.createAdvance({ ...payload, amount_requested: formData.amount })
          : await expensesService.createExpense({ ...payload, amount_spent: formData.amount, receipt_link: formData.proof_doc_link });
      }

      if (response.success) {
        const [expRes, advRes] = await Promise.all([
          expensesService.getExpenses(),
          advancesService.getAdvances(),
        ]);

        await Promise.all([refreshJobs(), refreshNotifications()]);

        const serverExpenses = expRes.value?.data?.expenses?.expenses || expRes.data?.expenses?.expenses || [];
        const serverAdvances = advRes.value?.data?.advances?.advances || advRes.data?.advances?.advances || [];

        setExpenses((prev) => {
          const existsOnServer = serverExpenses.some((r) => r.id === response.data?.id);
          if (isUpdate || existsOnServer) { pendingRequestId.current = null; return serverExpenses; }
          const tempCard = prev.find((r) => r.id === pendingRequestId.current);
          const others = serverExpenses.filter((r) => r.id !== tempCard?.id);
          return tempCard ? [tempCard, ...others] : serverExpenses;
        });

        setAdvances((prev) => {
          const existsOnServer = serverAdvances.some((r) => r.id === response.data?.id);
          if (isUpdate || existsOnServer) { pendingRequestId.current = null; return serverAdvances; }
          const tempCard = prev.find((r) => r.id === pendingRequestId.current);
          const others = serverAdvances.filter((r) => r.id !== tempCard?.id);
          return tempCard ? [tempCard, ...others] : serverAdvances;
        });
      }
    } catch (err) {
      console.error("Submission error:", err);
      fetchData();
    }
  };

  return { handleCreateRequest };
};

// ─── Filters ──────────────────────────────────────────────────────────────────

export const useFinanceFilters = ({ expenses, advances }) => {
  const [filters, setFilters] = useState({
    search: "",
    year: "all",
    month: "",
    type: "all",
  });

  const filterByStatus = (items, isHistory) => {
    return items.filter((item) => {
      const isPendingOrResubmitted = item.status === "Pending" || item.status === "Resubmitted";
      const isRejected = item.status === "Rejected";
      const needsAction = isPendingOrResubmitted || (isRejected && !item.isArchived);
      return isHistory ? !needsAction : needsAction;
    });
  };

  const filteredHistory = useMemo(() => {
    let results =
      filters.type === "all"
        ? [...expenses, ...advances]
        : filters.type === "expenses"
          ? [...expenses]
          : [...advances];

    if (filters.search) {
      const query = filters.search.toLowerCase().trim();
      results = results.filter(
        (item) =>
          item.title?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
      );
    }

    return results.filter((item) => {
      const date = new Date(item.appliedAt || item.createdAt || item.date);
      const itemYear = date.getFullYear().toString();
      const itemMonth = date.toLocaleString("default", { month: "long" });
      const matchesYear = filters.year === "all" || itemYear === filters.year;
      const matchesMonth = filters.month === "" || itemMonth === filters.month;
      return matchesYear && matchesMonth;
    });
  }, [expenses, advances, filters]);

  return { filters, setFilters, filteredHistory, filterByStatus };
};