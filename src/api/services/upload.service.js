import { API_BASE_URL, FINAL_API_BASE_URL, USE_MOCK_API } from "../config";

// Upload APIs
export const uploadService = {
    // Upload file (general purpose)
    uploadFile: (file, type) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);

        return fetch(`${API_BASE_URL}/upload/file`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });
    },

    // Upload profile picture (specific endpoint)

    uploadProfilePicture: (file) => {
        if (USE_MOCK_API) {
            return Promise.resolve({
                ok: true,
                json: async () => ({ path: `avatars/mock_${file.name}` }),
            });
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "0");
        return fetch(`${FINAL_API_BASE_URL}/upload/file`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });
    },
};