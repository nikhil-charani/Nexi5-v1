const { db } = require("../config/firebase");

/**
 * Get all announcements (authenticated users only)
 */
const getAnnouncements = async (req, res, next) => {
  try {
    if (!db) return res.status(500).json({ success: false, message: "DB not initialized" });
    const snapshot = await db.collection("announcements").orderBy("createdAt", "desc").get();
    const announcements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ success: true, data: announcements });
  } catch (error) { next(error); }
};

/**
 * Create a new announcement (Admin/HR Head only)
 */
const createAnnouncement = async (req, res, next) => {
  try {
    const { title, content, category, pinned } = req.body;
    const role = (req.user?.role || "").toLowerCase().replace(/[_\s]+/g, " ").trim();

    if (role !== "admin" && role !== "hr head") {
      return res.status(403).json({ success: false, message: "Only Admin or HR Head can post" });
    }

    const newAnnouncement = {
      title, content, category: category || "General", pinned: !!pinned,
      author: req.user.name || "HR Admin",
      authorId: req.user.uid,
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString()
    };
    const docRef = await db.collection("announcements").add(newAnnouncement);
    res.status(201).json({ success: true, data: { id: docRef.id, ...newAnnouncement } });
  } catch (error) { next(error); }
};

/**
 * Delete an announcement (Admin/HR Head only)
 */
const deleteAnnouncement = async (req, res, next) => {
  try {
    const role = (req.user?.role || "").toLowerCase().replace(/[_\s]+/g, " ").trim();
    if (role !== "admin" && role !== "hr head") {
      return res.status(403).json({ success: false, message: "Only Admin or HR Head can delete" });
    }
    await db.collection("announcements").doc(req.params.id).delete();
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) { next(error); }
};

module.exports = { getAnnouncements, createAnnouncement, deleteAnnouncement };
