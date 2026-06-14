// src/context/ResearchContext.jsx

import React, {
	createContext,
	useContext,
	useReducer,
	useMemo,
	useCallback,
} from "react";

/* =========================================================
   CONTEXT
========================================================= */

const ResearchContext = createContext();

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
	myProjects: [],
	myPublications: [],
	availableProjects: [],
	availablePublications: [],
	myApplications: [],
	allUsers: [],

	selectedItem: null,
	selectedUser: null,
	viewMode: "my-projects",
	loading: false,
	error: null,

	filters: {},
	personalSearchQuery: "",
	exploreSearchQuery: "",
};

/* =========================================================
   HELPERS
========================================================= */

const updateItem = (list, id, updater) =>
	list.map((item) =>
		item.id === id ? { ...item, ...updater } : item,
	);

const removeItem = (list, id) =>
	list.filter((item) => item.id !== id);

/* =========================================================
   REDUCER
========================================================= */

function reducer(state, action) {
	switch (action.type) {
		case "SET_LOADING":
			return { ...state, loading: action.payload };

		case "SET_ERROR":
			return { ...state, error: action.payload };

		case "SET_SELECTED_ITEM":
			return { ...state, selectedItem: action.payload };

		case "SET_SELECTED_USER":
			return { ...state, selectedUser: action.payload };

		case "SET_VIEW_MODE":
			return { ...state, viewMode: action.payload };

		case "SET_FILTERS":
			return { ...state, filters: action.payload };

		case "SET_PERSONAL_SEARCH":
			return { ...state, personalSearchQuery: action.payload };

		case "SET_EXPLORE_SEARCH":
			return { ...state, exploreSearchQuery: action.payload };

		case "ADD_PROJECT":
			return {
				...state,
				myProjects: [action.payload, ...state.myProjects],
			};

		case "UPDATE_PROJECT":
			return {
				...state,
				myProjects: updateItem(
					state.myProjects,
					action.payload.id,
					action.payload,
				),
			};

		case "ADD_PUBLICATION":
			return {
				...state,
				myPublications: [
					action.payload,
					...state.myPublications,
				],
			};

		case "UPDATE_PUBLICATION":
			return {
				...state,
				myPublications: updateItem(
					state.myPublications,
					action.payload.id,
					action.payload,
				),
			};

		case "ADD_APPLICATION":
			return {
				...state,
				myApplications: [
					action.payload,
					...state.myApplications,
				],
			};

		case "UPDATE_APPLICATION":
			return {
				...state,
				myApplications: updateItem(
					state.myApplications,
					action.payload.id,
					action.payload,
				),
			};

		default:
			return state;
	}
}

/* =========================================================
   PROVIDER
========================================================= */

export const ResearchProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	/* =========================================================
	   ACTIONS
	========================================================= */

	const onRefresh = useCallback(() => {
		dispatch({ type: "SET_LOADING", payload: true });

		setTimeout(() => {
			dispatch({ type: "SET_LOADING", payload: false });
		}, 800);
	}, []);

	const setSelectedItem = useCallback(
		(item) =>
			dispatch({ type: "SET_SELECTED_ITEM", payload: item }),
		[],
	);

	const setFilters = useCallback(
		(filters) =>
			dispatch({ type: "SET_FILTERS", payload: filters }),
		[],
	);

	const onTabChange = useCallback(
		(tab) => dispatch({ type: "SET_VIEW_MODE", payload: tab }),
		[],
	);

	const onPersonalSearchChange = useCallback(
		(value) =>
			dispatch({ type: "SET_PERSONAL_SEARCH", payload: value }),
		[],
	);

	const onExploreSearchChange = useCallback(
		(value) =>
			dispatch({ type: "SET_EXPLORE_SEARCH", payload: value }),
		[],
	);

	const onCreateSubmit = useCallback((data) => {
		const item = { ...data, id: Date.now() };

		if (data.type === "Project") {
			dispatch({ type: "ADD_PROJECT", payload: item });
		} else {
			dispatch({ type: "ADD_PUBLICATION", payload: item });
		}
	}, []);

	const onUpdateSubmit = useCallback((data) => {
		if (data.type === "Project") {
			dispatch({ type: "UPDATE_PROJECT", payload: data });
		} else {
			dispatch({ type: "UPDATE_PUBLICATION", payload: data });
		}
	}, []);

	const onApply = useCallback((id, formData, type) => {
		dispatch({
			type: "ADD_APPLICATION",
			payload: {
				id: Date.now(),
				targetId: id,
				type,
				status: "pending",
				...formData,
			},
		});
	}, []);

	const onApplicationAction = useCallback((id, status) => {
		dispatch({
			type: "UPDATE_APPLICATION",
			payload: { id, status },
		});
	}, []);

	const onStar = useCallback(() => {
		// optional toggle logic
	}, []);

	/* ---------- ROLE ACTIONS ---------- */

	const onCreateRole = useCallback((researchId, role) => {
		dispatch({
			type: "SET_SELECTED_ITEM",
			payload: (prev) => {
				const updated = {
					...prev,
					data: {
						...prev.data,
						openRoles: [
							...(prev.data.openRoles || []),
							{ ...role, id: Date.now() },
						],
					},
				};
				return updated;
			},
		});
	}, []);

	const onUpdateRole = useCallback(
		(researchId, roleId, updatedData) => {
			dispatch({
				type: "SET_SELECTED_ITEM",
				payload: (prev) => {
					const roles = prev.data.openRoles.map((r) =>
						r.id === roleId ? { ...r, ...updatedData } : r,
					);

					return {
						...prev,
						data: { ...prev.data, openRoles: roles },
					};
				},
			});
		},
		[],
	);

	const onDeleteRole = useCallback((researchId, roleId) => {
		dispatch({
			type: "SET_SELECTED_ITEM",
			payload: (prev) => ({
				...prev,
				data: {
					...prev.data,
					openRoles: prev.data.openRoles.filter(
						(r) => r.id !== roleId,
					),
				},
			}),
		});
	}, []);

	/* ---------- TIMELINE ---------- */

	const onAddTimelineEvent = useCallback((id, event) => {
		dispatch({
			type: "SET_SELECTED_ITEM",
			payload: (prev) => ({
				...prev,
				data: {
					...prev.data,
					timeline: [
						...(prev.data.timeline || []),
						{ ...event, id: Date.now() },
					],
				},
			}),
		});
	}, []);

	const onUpdateTimelineEvent = useCallback(
		(id, eventId, data) => {
			dispatch({
				type: "SET_SELECTED_ITEM",
				payload: (prev) => ({
					...prev,
					data: {
						...prev.data,
						timeline: prev.data.timeline.map((e) =>
							e.id === eventId ? { ...e, ...data } : e,
						),
					},
				}),
			});
		},
		[],
	);

	const onDeleteTimelineEvent = useCallback((id, eventId) => {
		dispatch({
			type: "SET_SELECTED_ITEM",
			payload: (prev) => ({
				...prev,
				data: {
					...prev.data,
					timeline: prev.data.timeline.filter(
						(e) => e.id !== eventId,
					),
				},
			}),
		});
	}, []);

	/* ---------- USER ---------- */

	const onViewUser = useCallback((userId) => {
		dispatch({ type: "SET_SELECTED_USER", payload: userId });
	}, []);

	const onClearUser = useCallback(() => {
		dispatch({ type: "SET_SELECTED_USER", payload: null });
	}, []);

	const onUpdateUser = useCallback((userData) => {
		dispatch({
			type: "SET_SELECTED_USER",
			payload: userData,
		});
	}, []);

	/* =========================================================
	   DERIVED DATA
	========================================================= */

	const derived = useMemo(() => {
		const totalMyProjects = state.myProjects.length;
		const totalMyPublications =
			state.myPublications.length;

		return {
			totalMyProjects,
			totalMyPublications,
		};
	}, [state]);

	/* =========================================================
	   FINAL VALUE
	========================================================= */

	const value = useMemo(
		() => ({
			data: {
				...state,
				...derived,
				timelineEvents:
					state.selectedItem?.data?.timeline || [],
			},
			view: state,
			actions: {
				onRefresh,
				onApply,
				onStar,
				setSelectedItem,
				setFilters,
				onPersonalSearchChange,
				onExploreSearchChange,
				onCreateSubmit,
				onUpdateSubmit,
				onCreateRole,
				onUpdateRole,
				onDeleteRole,
				onAddTimelineEvent,
				onUpdateTimelineEvent,
				onDeleteTimelineEvent,
				onViewUser,
				onClearUser,
				onUpdateUser,
				onApplicationAction,
				onTabChange,
			},
		}),
		[state, derived],
	);

	return (
		<ResearchContext.Provider value={value}>
			{children}
		</ResearchContext.Provider>
	);
};

/* =========================================================
   HOOKS
========================================================= */

export const useResearchData = () =>
	useContext(ResearchContext).data;

export const useResearchUI = () =>
	useContext(ResearchContext).view;

export const useResearchActions = () =>
	useContext(ResearchContext).actions;