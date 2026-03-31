const { db } = require('../config/firebase');

exports.addEvent = async (req, res) => {
    try {
        const { title, date, type, description, createdBy, creatorRole } = req.body;
        
        if (!title || !date) {
            return res.status(400).json({ success: false, message: "Title and date are required" });
        }

        const newEvent = {
            title,
            date,
            type: type || "event",
            description: description || "",
            createdBy: createdBy || req.user?.id || req.user?.uid || req.user?.name || "Unknown",
            creatorRole: creatorRole || req.user?.role || "Unknown",
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection("calendarEvents").add(newEvent);
        const savedEvent = { id: docRef.id, ...newEvent };

        const io = req.app.get('io');
        if (io) {
            io.emit('calendarEventAdded', savedEvent);
        }

        return res.status(201).json({ success: true, data: savedEvent });
    } catch (error) {
        console.error("Error adding calendar event:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getEvents = async (req, res) => {
    try {
        const snapshot = await db.collection("calendarEvents").orderBy("date", "asc").get();
        const events = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return res.status(200).json({ success: true, data: events });
    } catch (error) {
        console.error("Error fetching calendar events:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, date, type, description } = req.body;
        
        const docRef = db.collection("calendarEvents").doc(id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }
        
        const eventData = docSnap.data();
        let userRole = req.user?.role || "";
        // Dev fallback: Trust the header if the token has no role claim
        if (userRole === "Employee" && req.headers['x-user-role']) {
            userRole = req.headers['x-user-role'];
        }
        const userId = req.user?.id || req.user?.uid;

        const userRoleStr = (userRole || "").toString().toLowerCase();
        const isAdmin = userRoleStr.includes("admin") || userRoleStr.includes("hr");
        if (!isAdmin) {
            if (userRoleStr === "manager") {
                 console.log("Update denied: Manager role");
                 return res.status(403).json({ success: false, message: "Managers cannot edit events" });
            }
            if (eventData.type !== "leave" || String(eventData.createdBy) !== String(userId)) {
                 console.log("Update denied: Not owner of leave event");
                 return res.status(403).json({ success: false, message: "Unauthorized to edit this event" });
            }
        }

        const updatedData = {
            title: title || eventData.title,
            date: date || eventData.date,
            type: type || eventData.type,
            description: description !== undefined ? description : eventData.description,
            updatedAt: new Date().toISOString()
        };

        await docRef.update(updatedData);
        const savedEvent = { id, ...eventData, ...updatedData };

        const io = req.app.get('io');
        if (io) {
            io.emit('calendarEventUpdated', savedEvent);
        }

        return res.status(200).json({ success: true, data: savedEvent });
    } catch (error) {
        console.error("Error updating event:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Attempting to delete event with ID: ${id}`);
        const docRef = db.collection("calendarEvents").doc(id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
            console.log(`Event not found: ${id}`);
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        const eventData = docSnap.data();
        console.log(`Full req.user object:`, JSON.stringify(req.user));
        console.log(`X-User-Role header:`, req.headers['x-user-role']);
        
        // Always trust X-User-Role header when present (overrides token claim)
        let userRole = req.headers['x-user-role'] || req.user?.role || "";
        const userId = req.user?.id || req.user?.uid;
        
        console.log(`Final role used: [${userRole}]`);

        const userRoleStr = (userRole || "").toString().toLowerCase();
        const isAdmin = userRoleStr.includes("admin") || userRoleStr.includes("hr");
        if (!isAdmin) {
            if (userRoleStr === "manager") {
                console.log("Delete denied: Manager role");
                return res.status(403).json({ success: false, message: "Managers cannot delete events" });
            }
            if (eventData.type !== "leave" || String(eventData.createdBy) !== String(userId)) {
                 console.log("Delete denied: Not owner of leave event");
                 return res.status(403).json({ success: false, message: "Unauthorized to delete this event" });
            }
        }

        await docRef.delete();
        console.log(`Event deleted successfully: ${id}`);

        const io = req.app.get('io');
        if (io) {
            io.emit('calendarEventDeleted', { id });
        }

        return res.status(200).json({ success: true, message: "Event deleted successfully" });
    } catch (error) {
        console.error("Error deleting event:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
