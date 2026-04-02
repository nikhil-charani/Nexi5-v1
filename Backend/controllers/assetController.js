const { db } = require("../config/firebase");

/**
 * Utility: Lookup employee by custom Employee ID (e.g. EMP-123)
 */
const getEmployeeByEmpId = async (req, res, next) => {
    try {
        const { empId } = req.params;
        const snapshot = await db.collection("employees")
            .where("employeeData.employeeId", "==", empId)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return res.status(404).json({ success: false, error: "Employee not found. Please check the ID." });
        }

        const data = snapshot.docs[0].data();
        const profile = data.employeeData || {};
        
        res.json({ 
            success: true, 
            data: { 
                name: profile.name, 
                department: profile.department || "General" 
            } 
        });
    } catch (error) {
        next(error);
    }
};

/**
 * ASSETS (HR/Admin only)
 * createAsset: Add single or multiple assets
 */
const createAsset = async (req, res, next) => {
    try {
        const assetsData = Array.isArray(req.body) ? req.body : [req.body];
        const batch = db.batch();
        const createdAssets = [];

        for (const data of assetsData) {
            const { type, brand, serialNumber, employeeId, employeeName, department, status, condition } = data;
            
            if (!type || !serialNumber) {
                return res.status(400).json({ success: false, error: "Missing required fields (type, serialNumber)" });
            }

            const assetId = `AST-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            const assetRef = db.collection("assets").doc(assetId);
            
            // Name is automatically derived from Brand + Type
            const generatedName = brand ? `${brand} ${type}` : type;

            const newAsset = {
                id: assetId,
                name: generatedName,
                type,
                brand: brand || "",
                serialNumber,
                employeeId: employeeId || null,
                employeeName: employeeName || null,
                department: department || null,
                status: status || "Returned",
                condition: condition || "Good",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            batch.set(assetRef, newAsset);
            createdAssets.push(newAsset);
        }

        await batch.commit();
        res.status(201).json({ success: true, message: "Assets created successfully", data: createdAssets });
    } catch (error) {
        next(error);
    }
};

/**
 * getAllAssets (HR/Admin view all)
 */
const getAllAssets = async (req, res, next) => {
    try {
        const userRole = req.user ? req.user.role : "Public/System";
        console.log(`[DEBUG] Fetching all assets for role: ${userRole}`);
        const snapshot = await db.collection("assets").get();
        let assets = snapshot.docs.map(doc => doc.data());

        // Populating department dynamically for records that don't have it
        const employeeIds = [...new Set(assets.filter(a => a.employeeId && !a.department).map(a => a.employeeId))];
        if (employeeIds.length > 0) {
            try {
                // Batch fetch employees (Firestore "in" limit is 30, but for now assuming low volume or single batch)
                // If more than 30 unique employees, we'd need to chunk this.
                const empSnap = await db.collection("employees")
                    .where("employeeData.employeeId", "in", employeeIds.slice(0, 30))
                    .get();
                
                const empMap = {};
                empSnap.docs.forEach(doc => {
                    const d = doc.data()?.employeeData;
                    if (d) empMap[d.employeeId] = d.department;
                });

                assets = assets.map(a => {
                    if (a.employeeId && !a.department && empMap[a.employeeId]) {
                        return { ...a, department: empMap[a.employeeId] };
                    }
                    return a;
                });
            } catch (e) {
                console.warn("[WARN] Failed to batch populate departments:", e.message);
            }
        }

        console.log(`[DEBUG] Found ${assets.length} assets.`);
        res.json({ success: true, data: assets });
    } catch (error) {
        console.error(`[ERROR] getAllAssets:`, error.message);
        next(error);
    }
};

/**
 * getMyAssets (Employee view)
 */
const getMyAssets = async (req, res, next) => {
    try {
        const { uid } = req.user;

        // Assets are stored with custom employeeId (e.g. CHA-73803), not Firebase uid.
        // We need to find the employee's custom ID first.
        let customEmpId = uid; // fallback
        try {
            const empDoc = await db.collection("employees").doc(uid).get();
            if (empDoc.exists) {
                customEmpId = empDoc.data()?.employeeData?.employeeId || uid;
            }
        } catch (e) {
            console.warn("[WARN] Could not resolve custom employeeId:", e.message);
        }

        console.log(`[DEBUG] getMyAssets: uid=${uid}, customEmpId=${customEmpId}`);

        const snapshot = await db.collection("assets")
            .where("employeeId", "==", customEmpId)
            .get();
        
        let assets = snapshot.docs.map(doc => doc.data());

        // Ensure department is populated even for personal view if missing
        if (assets.length > 0 && assets.some(a => !a.department)) {
            try {
                const empDoc = await db.collection("employees").doc(uid).get();
                const dept = empDoc.data()?.employeeData?.department;
                if (dept) {
                    assets = assets.map(a => (!a.department ? { ...a, department: dept } : a));
                }
            } catch (e) {}
        }

        console.log(`[DEBUG] My assets found: ${assets.length}`);
        res.json({ success: true, data: assets });
    } catch (error) {
        console.error(`[ERROR] getMyAssets:`, error.message);
        next(error);
    }
};

/**
 * updateAsset (HR/Admin only)
 */
const updateAsset = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const assetRef = db.collection("assets").doc(id);
        const doc = await assetRef.get();

        if (!doc.exists) {
            return res.status(404).json({ success: false, error: "Asset not found" });
        }

        const dataToUpdate = {
            ...updateData,
            updatedAt: new Date().toISOString()
        };

        await assetRef.update(dataToUpdate);
        res.json({ success: true, message: "Asset updated successfully" });
    } catch (error) {
        next(error);
    }
};

/**
 * deleteAsset (HR/Admin only)
 */
const deleteAsset = async (req, res, next) => {
    try {
        const { id } = req.params;
        const assetRef = db.collection("assets").doc(id);
        const doc = await assetRef.get();

        if (!doc.exists) {
            return res.status(404).json({ success: false, error: "Asset not found" });
        }

        await assetRef.delete();
        res.json({ success: true, message: "Asset deleted successfully" });
    } catch (error) {
        next(error);
    }
};

/**
 * REQUESTS - createRequest (Employee/HR/Admin)
 */
const createRequest = async (req, res, next) => {
    try {
        const { employeeId, employeeName, department, requestType, assetId, assetType, priority, reason } = req.body;
        
        if (!requestType || !assetType || !priority) {
            return res.status(400).json({ success: false, error: "Missing required fields (requestType, assetType, priority)" });
        }

        const requestId = `REQ-${Date.now()}`;
        const requestRef = db.collection("asset_requests").doc(requestId);

        const newRequest = {
            id: requestId,
            employeeId: employeeId || req.user.uid,
            employeeName: employeeName || req.user.name || "Anonymous",
            department: department || null,
            requestType, // Damage | New | Return
            assetId: assetId || null,
            assetType,
            priority, // High | Medium | Low
            status: "Pending",
            reason: reason || "",
            remarks: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await requestRef.set(newRequest);
        res.status(201).json({ success: true, message: "Request created successfully", data: newRequest });
    } catch (error) {
        next(error);
    }
};

/**
 * getMyRequests (Employee view)
 */
const getMyRequests = async (req, res, next) => {
    try {
        const { uid } = req.user;
        // Requests may be stored with custom employeeId or uid. Query both.
        let customEmpId = uid;
        try {
            const empDoc = await db.collection("employees").doc(uid).get();
            if (empDoc.exists) {
                customEmpId = empDoc.data()?.employeeData?.employeeId || uid;
            }
        } catch (e) {}

        // Fetch by customEmpId (no orderBy to avoid missing index errors)
        const snapshot = await db.collection("asset_requests")
            .where("employeeId", "==", customEmpId)
            .get();
        
        const requests = snapshot.docs.map(doc => doc.data());
        res.json({ success: true, data: requests });
    } catch (error) {
        console.error(`[ERROR] getMyRequests:`, error.message);
        next(error);
    }
};

/**
 * getAllRequests (HR/Admin only)
 */
const getAllRequests = async (req, res, next) => {
    try {
        const userRole = req.user ? req.user.role : "Public/System";
        console.log(`[DEBUG] Fetching all requests for role: ${userRole}`);
        const snapshot = await db.collection("asset_requests").get();
        let requests = snapshot.docs.map(doc => doc.data());

        // Populating department dynamically for requests that don't have it
        const employeeIds = [...new Set(requests.filter(r => r.employeeId && !r.department).map(r => r.employeeId))];
        if (employeeIds.length > 0) {
            try {
                const empSnap = await db.collection("employees")
                    .where("employeeData.employeeId", "in", employeeIds.slice(0, 30))
                    .get();
                
                const empMap = {};
                empSnap.docs.forEach(doc => {
                    const d = doc.data()?.employeeData;
                    if (d) empMap[d.employeeId] = d.department;
                });

                requests = requests.map(r => {
                    if (r.employeeId && !r.department && empMap[r.employeeId]) {
                        return { ...r, department: empMap[r.employeeId] };
                    }
                    return r;
                });
            } catch (e) {
                console.warn("[WARN] Failed to batch populate departments for requests:", e.message);
            }
        }

        console.log(`[DEBUG] Found ${requests.length} requests.`);
        res.json({ success: true, data: requests });
    } catch (error) {
        console.error(`[ERROR] getAllRequests:`, error.message);
        next(error);
    }
};

/**
 * updateRequestStatus (HR/Admin only)
 */
const updateRequestStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, remarks } = req.body;

        if (!status) {
            return res.status(400).json({ success: false, error: "Status is required" });
        }

        const requestRef = db.collection("asset_requests").doc(id);
        const doc = await requestRef.get();

        if (!doc.exists) {
            return res.status(404).json({ success: false, error: "Request not found" });
        }

        const updateData = {
            status,
            remarks: remarks || doc.data().remarks || "",
            updatedAt: new Date().toISOString()
        };

        await requestRef.update(updateData);
        res.json({ success: true, message: `Request status updated to ${status}` });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getEmployeeByEmpId,
    createAsset,
    getAllAssets,
    updateAsset,
    deleteAsset,
    getMyAssets,
    createRequest,
    getMyRequests,
    getAllRequests,
    updateRequestStatus
};
