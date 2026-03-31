/**
 * Company Project API Layer
 * Handles all CRUD operations for the company_projects collection.
 * Uses fetch (no axios dependency) to stay consistent with the existing codebase.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const getAuthHeaders = (token) => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
});

/**
 * Fetch all company projects.
 * @param {string} token - Bearer token from currentUser
 */
export const getProjects = async (token) => {
    const res = await fetch(`${API_BASE}/company-projects`, {
        headers: getAuthHeaders(token)
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Failed to fetch projects");
    return data.data;
};

/**
 * Create a new company project.
 * @param {object} projectData - { projectName, clientName, description, startDate, endDate, status }
 * @param {string} token - Bearer token from currentUser
 */
export const createProject = async (projectData, token) => {
    const res = await fetch(`${API_BASE}/company-projects`, {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify(projectData)
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Failed to create project");
    return data.data;
};

/**
 * Update an existing company project.
 * @param {string} id - Project document ID
 * @param {object} updates - Fields to update
 * @param {string} token - Bearer token from currentUser
 */
export const updateProject = async (id, updates, token) => {
    const res = await fetch(`${API_BASE}/company-projects/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(token),
        body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Failed to update project");
    return data.data;
};

/**
 * Delete a company project.
 * @param {string} id - Project document ID
 * @param {string} token - Bearer token from currentUser
 */
export const deleteProject = async (id, token) => {
    const res = await fetch(`${API_BASE}/company-projects/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(token)
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Failed to delete project");
    return data;
};
