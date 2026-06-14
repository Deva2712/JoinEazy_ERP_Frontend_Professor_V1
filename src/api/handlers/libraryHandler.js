// src/api/handlers/libraryHandler.js
// Covers: /library/dashboard, /library/request, /library/requests/:id,
//         /library/extend, /library/approve-extension

import * as Mocks from "../mock";

export function handleLibrary(endpoint, options = {}) {
	if (!endpoint.match(/^\/library\/.+/)) return null;

	const method = options?.method || "GET";

	// ── GET /library/dashboard ───────────────────────────────────────────────
	if (endpoint.match(/^\/library\/dashboard$/) && method === "GET") {
		return {
			success: true,
			data: {
				admins: Mocks.MOCK_LIBRARY_DATA.admins,
				requests: Mocks.MOCK_LIBRARY_DATA.requests.filter(
					(r) => r.status !== "approved",
				),
				borrowed: [
					...Mocks.MOCK_LIBRARY_DATA.borrowed,
					...Mocks.MOCK_LIBRARY_DATA.requests
						.filter((r) => r.status === "approved")
						.map((r) => ({
							id: r.id,
							bookTitle: r.bookTitle,
							author: r.author,
							isbn: r.isbn,
							category: r.category,
							borrowedDate: r.approvedDate,
							dueDate: r.dueDate,
							physicalCopyPickedUp: r.physicalCopyPickedUp,
						})),
				],
				inventory: Mocks.MOCK_LIBRARY_DATA.inventory,
			},
		};
	}

	// ── POST /library/request ────────────────────────────────────────────────
	if (endpoint.match(/^\/library\/request$/) && method === "POST") {
		const { bookId, durationDays } = JSON.parse(options.body);
		const book = Mocks.MOCK_LIBRARY_DATA.inventory.find((b) => b.id === bookId);
		if (book) {
			const newRequest = {
				id: `REQ${Date.now()}`,
				bookTitle: book.title,
				author: book.author,
				isbn: book.isbn,
				category: book.category,
				status: "pending",
				durationDays,
				requestDate: new Date().toISOString().split("T")[0],
			};
			Mocks.MOCK_LIBRARY_DATA.requests.unshift(newRequest);
			return { success: true, data: newRequest };
		}
		return { success: false, message: "Book not found" };
	}

	// ── DELETE /library/requests/:id ─────────────────────────────────────────
	if (endpoint.match(/^\/library\/requests\/[^/]+$/) && method === "DELETE") {
		const id = endpoint.split("/").pop();
		const index = Mocks.MOCK_LIBRARY_DATA.requests.findIndex((r) => r.id === id);
		if (index !== -1) {
			Mocks.MOCK_LIBRARY_DATA.requests.splice(index, 1);
			return { success: true, message: "Cancelled" };
		}
		return { success: false, message: "Request not found" };
	}

	// ── POST /library/extend ─────────────────────────────────────────────────
	if (endpoint.match(/^\/library\/extend$/) && method === "POST") {
		const { bookId, additionalDays } = JSON.parse(options.body);
		const book =
			Mocks.MOCK_LIBRARY_DATA.borrowed.find((b) => b.id === bookId) ||
			Mocks.MOCK_LIBRARY_DATA.requests.find(
				(r) => r.id === bookId && r.status === "approved",
			);
		if (book) {
			const extensionRequest = {
				id: `EXT${Date.now()}`,
				bookTitle: book.bookTitle,
				author: book.author,
				isbn: book.isbn,
				category: book.category,
				status: "extension-pending",
				originalBorrowedId: book.id,
				additionalDays,
				dueDate: book.dueDate,
				requestDate: new Date().toISOString().split("T")[0],
			};
			Mocks.MOCK_LIBRARY_DATA.requests.unshift(extensionRequest);
			return { success: true, data: extensionRequest };
		}
		return { success: false, message: "Book not found or cannot be extended" };
	}

	// ── POST /library/approve-extension ──────────────────────────────────────
	if (endpoint.match(/^\/library\/approve-extension$/) && method === "POST") {
		const { requestId, bookId, additionalDays } = JSON.parse(options.body);
		const borrowedBook = Mocks.MOCK_LIBRARY_DATA.borrowed.find((b) => b.id === bookId);
		if (borrowedBook) {
			const currentDueDate = new Date(borrowedBook.dueDate);
			currentDueDate.setDate(currentDueDate.getDate() + parseInt(additionalDays));
			const newDate = currentDueDate.toISOString().split("T")[0];
			borrowedBook.dueDate = newDate;
			const requestIndex = Mocks.MOCK_LIBRARY_DATA.requests.findIndex(
				(r) => r.id === requestId,
			);
			if (requestIndex !== -1) {
				Mocks.MOCK_LIBRARY_DATA.requests.splice(requestIndex, 1);
			}
			return { success: true, newDueDate: newDate };
		}
		return { success: false, message: "Could not process extension approval" };
	}

	return null; // matched prefix but no sub-route matched
}