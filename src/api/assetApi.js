/**
 * Assets Management API Layer
 * Handles all backend interactions for the Assets and Requests modules.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const ASSETS_PREFIX = `${API_BASE}/assets-mgmt`;

const getAuthHeaders = (token) => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
});

export const lookupEmployee = async (empId, token) => {
    const res = await fetch(`${ASSETS_PREFIX}/employee-lookup/${empId}`, {
        headers: getAuthHeaders(token)
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Employee not found");
    return data.data;
};

/**
 * --- ASSETS ---
 */

export const getAssets = async (token) => {
    const res = await fetch(`${ASSETS_PREFIX}/assets`, {
        headers: getAuthHeaders(token)
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Failed to fetch assets");
    return data.data;
};

export const getMyAssets = async (token) => {
    const res = await fetch(`${ASSETS_PREFIX}/my-assets`, {
        headers: getAuthHeaders(token)
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Failed to fetch your assets");
    return data.data;
};

export const createAssets = async (assetsData, token) => {
    const res = await fetch(`${ASSETS_PREFIX}/assets`, {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify(assetsData)
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Failed to create assets");
    return data.data;
};

export const updateAsset = async (id, updates, token) => {
    const res = await fetch(`${ASSETS_PREFIX}/assets/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(token),
        body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Failed to update asset");
    return data.data;
};

export const deleteAsset = async (id, token) => {
    const res = await fetch(`${ASSETS_PREFIX}/assets/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(token)
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Failed to delete asset");
    return data;
};

/**
 * --- REQUESTS ---
 */

export const getAllRequests = async (token) => {
    const res = await fetch(`${ASSETS_PREFIX}/requests`, {
        headers: getAuthHeaders(token)
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Failed to fetch requests");
    return data.data;
};

export const getMyRequests = async (token) => {
    const res = await fetch(`${ASSETS_PREFIX}/my-requests`, {
        headers: getAuthHeaders(token)
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Failed to fetch your requests");
    return data.data;
};

export const createRequest = async (requestData, token) => {
    const res = await fetch(`${ASSETS_PREFIX}/requests`, {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify(requestData)
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Failed to submit request");
    return data.data;
};

export const updateRequestStatus = async (id, statusData, token) => {
    const res = await fetch(`${ASSETS_PREFIX}/requests/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(token),
        body: JSON.stringify(statusData)
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Failed to update request status");
    return data.data;
};
