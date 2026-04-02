const { db } = require("../config/firebase");

const COLLECTION = "company_projects";
const ALLOWED_MANAGE_ROLES = ["admin", "hr head", "hr accountant", "hr recruiter", "hr", "manager"];

/**
 * Helper: Check if the requesting user can manage (create/update/delete) projects.
 * Case-insensitive comparison to handle Firestore role vs UI role inconsistencies.
 */
const canManage = (role) => {
    const r = (role || "").toLowerCase().trim();
    // Allow any HR variant, Admin, or Manager
    return ALLOWED_MANAGE_ROLES.includes(r) || r.startsWith("hr");
};


/**
 * POST /api/company-projects
 * Create a new company project.
 */
const createProject = async (req, res, next) => {
    try {
        const { role, uid } = req.user;

        if (!canManage(role)) {
            return res.status(403).json({
                success: false,
                error: "Access denied. Only Admin, HR Head, or Manager can create projects."
            });
        }

        const { projectName, clientName, description = "", startDate, endDate, status = "active" } = req.body;

        // Validation
        if (!projectName || !projectName.trim()) {
            return res.status(400).json({ success: false, error: "Project name is required." });
        }
        if (!clientName || !clientName.trim()) {
            return res.status(400).json({ success: false, error: "Client name is required." });
        }
        if (!startDate || !endDate) {
            return res.status(400).json({ success: false, error: "Start date and end date are required." });
        }
        if (new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({ success: false, error: "Start date cannot be after end date." });
        }

        // Duplicate name check (case-insensitive)
        const existing = await db.collection(COLLECTION)
            .where("projectNameLower", "==", projectName.trim().toLowerCase())
            .limit(1)
            .get();

        if (!existing.empty) {
            return res.status(409).json({
                success: false,
                error: `A project named "${projectName.trim()}" already exists.`
            });
        }

        const now = new Date().toISOString();
        const docData = {
            projectName: projectName.trim(),
            projectNameLower: projectName.trim().toLowerCase(),
            clientName: clientName.trim(),
            description: description.trim(),
            startDate,
            endDate,
            status,
            modules: [],
            createdBy: uid,
            createdByRole: role,
            createdAt: now,
            updatedAt: now
        };

        const docRef = await db.collection(COLLECTION).add(docData);

        const created = { id: docRef.id, ...docData };

        // Emit socket event if available
        const io = req.app.get("io");
        if (io) io.emit("project_created", created);

        return res.status(201).json({ success: true, message: "Project created successfully.", data: created });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/company-projects
 * Fetch all company projects. All authenticated users can read.
 */
const getAllProjects = async (req, res, next) => {
    try {
        const snap = await db.collection(COLLECTION).orderBy("createdAt", "desc").get();

        const projects = snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            projectNameLower: undefined // hide internal field
        }));

        return res.json({ success: true, count: projects.length, data: projects });
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/company-projects/:id
 * Update an existing project.
 */
const updateProject = async (req, res, next) => {
    try {
        const { role } = req.user;

        if (!canManage(role)) {
            return res.status(403).json({
                success: false,
                error: "Access denied. Only Admin, HR Head, or Manager can update projects."
            });
        }

        const { id } = req.params;
        const docRef = db.collection(COLLECTION).doc(id);
        const snap = await docRef.get();

        if (!snap.exists) {
            return res.status(404).json({ success: false, error: "Project not found." });
        }

        const { projectName, clientName, description, startDate, endDate, status, modules } = req.body;

        // Date validation if both provided
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({ success: false, error: "Start date cannot be after end date." });
        }

        // Duplicate name check if name is being changed
        if (projectName && projectName.trim().toLowerCase() !== snap.data().projectNameLower) {
            const dup = await db.collection(COLLECTION)
                .where("projectNameLower", "==", projectName.trim().toLowerCase())
                .limit(1)
                .get();
            if (!dup.empty) {
                return res.status(409).json({
                    success: false,
                    error: `A project named "${projectName.trim()}" already exists.`
                });
            }
        }

        const updates = { updatedAt: new Date().toISOString() };
        if (projectName !== undefined) { updates.projectName = projectName.trim(); updates.projectNameLower = projectName.trim().toLowerCase(); }
        if (clientName !== undefined) updates.clientName = clientName.trim();
        if (description !== undefined) updates.description = description.trim();
        if (startDate !== undefined) updates.startDate = startDate;
        if (endDate !== undefined) updates.endDate = endDate;
        if (status !== undefined) updates.status = status;
        if (modules !== undefined) updates.modules = modules;

        await docRef.update(updates);
        const updated = { id, ...snap.data(), ...updates, projectNameLower: undefined };

        const io = req.app.get("io");
        if (io) io.emit("project_updated", updated);

        return res.json({ success: true, message: "Project updated successfully.", data: updated });
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /api/company-projects/:id
 * Delete a company project.
 */
const deleteProject = async (req, res, next) => {
    try {
        const { role } = req.user;

        if (!canManage(role)) {
            return res.status(403).json({
                success: false,
                error: "Access denied. Only Admin, HR Head, or Manager can delete projects."
            });
        }

        const { id } = req.params;
        const docRef = db.collection(COLLECTION).doc(id);
        const snap = await docRef.get();

        if (!snap.exists) {
            return res.status(404).json({ success: false, error: "Project not found." });
        }

        const projectData = snap.data();
        await docRef.delete();

        const io = req.app.get("io");
        if (io) io.emit("project_deleted", { id });

        return res.json({ success: true, message: `Project "${projectData.projectName}" deleted successfully.` });
    } catch (error) {
        next(error);
    }
};

module.exports = { createProject, getAllProjects, updateProject, deleteProject };
