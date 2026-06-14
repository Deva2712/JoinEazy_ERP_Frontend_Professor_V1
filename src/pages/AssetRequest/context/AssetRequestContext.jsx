// src/pages/AssetRequest/context/AssetRequestContext.jsx

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useRef,
} from "react";

import { userService } from "../../../api/services/user.service";
import { assetService } from "../../../api/services/asset.service";
import { useJobs } from "../../../context/JobTrayContext";
import { useNotifications } from "../../../context/NotificationContext";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AssetRequestContext = createContext(null);

export const useAssetRequest = () => {
	const ctx = useContext(AssetRequestContext);
	if (!ctx)
		throw new Error(
			"useAssetRequest must be used inside AssetRequestProvider",
		);
	return ctx;
};

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export const AssetRequestProvider = ({ children }) => {
	const [requests, setRequests] = useState([]);
	const [admins, setAdmins] = useState([]);
	const [assets, setAssets] = useState([]);
	const [cohorts, setCohorts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { refreshJobs } = useJobs();
	const { refreshNotifications } = useNotifications();
	const pendingRequestId = useRef(null);

	// ── Initial fetch ─────────────────────────────────────────────────────────

	const fetchInitialData = async () => {
		try {
			setLoading(true);
			setError(null);

			const [userRes, assetRes, reqRes] = await Promise.all([
				userService.getDashboardOverview(),
				assetService.getAssets(),
				assetService.getRequests(),
			]);

			if (userRes.success && assetRes.success && reqRes.success) {
				setRequests(reqRes.data?.requests || []);
				setAdmins(reqRes.data?.admins || []);
				// assetRes.data should be an array; guard against {assets:[...]} or non-array shapes
				const assetsData = Array.isArray(assetRes.data)
					? assetRes.data
					: Array.isArray(assetRes.data?.assets)
					? assetRes.data.assets
					: [];
				setAssets(assetsData);
				setCohorts([
					...(userRes.data?.createdCohorts || []),
					...(userRes.data?.joinedCohorts || []),
				]);
			} else {
				setError("Failed to load data.");
				setAssets([]);
				setRequests([]);
			}
		} catch (err) {
			console.error("Asset request fetch error:", err);
			setError("A connection error occurred.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchInitialData();
		document.title = "Asset Requests";
	}, []);

	// ── Submit / update ───────────────────────────────────────────────────────

	const handleSubmit = async (formData) => {
		const isUpdate = !!formData.id;
		setIsModalOpen(false);

		// Optimistic update — new request appears immediately in the list
		if (!isUpdate) {
			const tempId = `temp-${Date.now()}`;
			pendingRequestId.current = tempId;

			const tempRequest = {
				...formData,
				id: tempId,
				status: "Pending",
				postedAt: new Date().toISOString(),
				assetName:
					assets.find((a) => a.id === formData.assetId)?.name ||
					"New Asset",
			};
			setRequests((prev) => [tempRequest, ...prev]);
		}

		try {
			const response = isUpdate
				? await assetService.updateRequest(formData.id, formData)
				: await assetService.createRequest(formData);

			if (response.success) {
				const reqRes = await assetService.getRequests();
				await Promise.all([refreshJobs(), refreshNotifications()]);
				if (reqRes.success) setRequests(reqRes.data.requests || []);
			}
		} catch (err) {
			console.error("Submission error:", err);
			// Rollback optimistic update on failure
			fetchInitialData();
		}
	};

	// ── Exposed value ─────────────────────────────────────────────────────────

	const value = {
		// data
		requests,
		admins,
		assets,
		cohorts,

		// state
		loading,
		error,
		isModalOpen,
		setIsModalOpen,

		// actions
		onRefresh: fetchInitialData,
		onSubmit: handleSubmit,
	};

	return (
		<AssetRequestContext.Provider value={value}>
			{children}
		</AssetRequestContext.Provider>
	);
};