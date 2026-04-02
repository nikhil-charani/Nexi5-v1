/**
 * Grievances & Concerns API Layer
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const CONCERNS_PREFIX = `${API_BASE}/concerns`;

const getAuthHeaders = (token) => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
});

/**
 * Fetch all concerns visible to the current user (based on role)
 */
export const fetchConcerns = async (token) => {
    const res = await fetch(`${CONCERNS_PREFIX}`, {
        headers: getAuthHeaders(token)
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Failed to fetch concerns");
    return data.data;
};

/**
 * Create a new concern
 */
export const createConcern = async (concernData, token) => {
    const res = await fetch(`${CONCERNS_PREFIX}`, {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify(concernData)
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Failed to submit concern");
    return data.data;
};

/**
 * Update the status of a concern (HR/Admin only)
 */
export const updateConcernStatus = async (id, status, token) => {
    const res = await fetch(`${CONCERNS_PREFIX}/${id}/status`, {
        method: "PUT",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Failed to update status");
    return data.data;
};

/**
 * Cancel a concern (Creator only)
 */
export const cancelConcern = async (id, token) => {
    const res = await fetch(`${CONCERNS_PREFIX}/${id}/cancel`, {
        method: "PUT",
        headers: getAuthHeaders(token)
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Failed to cancel concern");
    return data.data;
};
