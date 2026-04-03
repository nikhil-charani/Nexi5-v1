import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Megaphone, Pin, Calendar, Tag, X, Trash2, Pencil } from "lucide-react";
import { useAppContext } from "../hooks/useAppContext";
import { toast } from "sonner";
const CATEGORY_STYLES = {
    "Holiday": { bg: "bg-[#0f4184]/10", text: "text-[#0b3166]", dot: "bg-[#0f4184]" },
    "Company Update": { bg: "bg-[#0b3166]/10", text: "text-[#0b3166]", dot: "bg-[#0b3166]" },
    "HR Announcement": { bg: "bg-cyan-50", text: "text-cyan-600", dot: "bg-cyan-500" },
    "General": { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" }
};

function Announcements() {
    const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement, userRole } = useAppContext();
    const [filterCat, setFilterCat] = useState("All");
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newAnn, setNewAnn] = useState({ title: "", content: "", category: "General" });
    
    const isAdmin = userRole?.toLowerCase().replace(/[_\s]+/g, " ") === "admin" || 
                    userRole?.toLowerCase().replace(/[_\s]+/g, " ") === "hr head";
    const filtered = filterCat === "All" ? announcements : announcements.filter((a) => a.category === filterCat);
    const pinned = filtered.filter((a) => a.pinned);
    const rest = filtered.filter((a) => !a.pinned);
    
    const postAnnouncement = async () => {
        if (!newAnn.title || !newAnn.content) {
            toast.error("Please fill all fields.");
            return;
        }
        
        if (editingId) {
            const res = await updateAnnouncement(editingId, { ...newAnn });
            if (res.success) {
                closeModal();
                toast.success("Announcement updated!");
            } else {
                toast.error(res.error || "Failed to update announcement");
            }
        } else {
            const res = await addAnnouncement({ ...newAnn, pinned: false });
            if (res.success) {
                closeModal();
                toast.success("Announcement posted!");
            } else {
                toast.error(res.error || "Failed to post announcement");
            }
        }
    };
    
    const closeModal = () => {
        setModalOpen(false);
        setEditingId(null);
        setNewAnn({ title: "", content: "", category: "General" });
    };

    const handleEditClick = (ann) => {
        setNewAnn({ title: ann.title, content: ann.content, category: ann.category, pinned: ann.pinned });
        setEditingId(ann.id);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this announcement?")) {
            const res = await deleteAnnouncement(id);
            if (res?.success !== false) {
                toast.success("Announcement deleted!");
            } else {
                toast.error(res?.error || "Failed to delete announcement");
            }
        }
    };
    const AnnouncementCard = ({ ann, index }) => {
        const style = CATEGORY_STYLES[ann.category];
        return <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`bg-white rounded-xl border group cursor-default transition-all ${ann.pinned ? "border-primary/30 shadow-md" : "border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200"}`}
        >
            {ann.pinned && <div className="h-1 bg-gradient-to-r from-primary via-accent to-secondary w-full" />}
            <div className="p-6">
                <div className="flex items-start gap-5">
                    <div className={`w-12 h-12 rounded-2xl ${ann.pinned ? "bg-primary text-white" : style.bg + " " + style.text} flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110`}>
                        {ann.pinned ? <Pin size={20} /> : <Megaphone size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap mb-2 justify-between">
                            <div>
                                <h3 className="font-bold text-textPrimary text-base tracking-tight">{ann.title}</h3>
                                {ann.pinned && <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 rounded-full px-2.5 py-0.5 uppercase tracking-widest shadow-sm">
                                    Pinned
                                </span>}
                            </div>
                            {isAdmin && (
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleEditClick(ann)}
                                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-all"
                                        title="Edit Announcement"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(ann.id)}
                                        className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-all"
                                        title="Delete Announcement"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                        <p className="text-textSecondary text-[13px] leading-relaxed font-medium">{ann.content}</p>
                        <div className="flex items-center gap-4 mt-5 flex-wrap pt-4 border-t border-gray-50">
                            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full ${style.bg} ${style.text} shadow-sm`}>
                                <Tag size={12} /> {ann.category}
                            </span>
                            <span className="flex items-center gap-1.5 text-[11px] text-gray-400 font-bold">
                                <Calendar size={13} /> {ann.date || new Date().toISOString().split("T")[0]}
                            </span>
                            <span className="text-[11px] text-gray-400 font-bold">
                                By <span className="text-textPrimary">{ann.author || "HR Admin"}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>;
    };
    return <div className="space-y-5">
        {
            /* Header */
        }
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
                <div className="flex items-center gap-3 mb-1 text-primary">
                    <Megaphone size={24} className="shrink-0" />
                    <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Announcements</h1>
                </div>
                <p className="text-textSecondary text-sm font-medium">Company-wide news, holidays, and HR updates.</p>
            </div>
            {isAdmin && (
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold shadow-sm bg-gradient-to-r from-[#0f4184] to-[#0b3166] hover:opacity-90 transition-all"
                >
                    <Plus size={18} /> Post Announcement
                </button>
            )}
        </div>

        {
            /* Category Filters */
        }
        <div className="flex gap-2.5 flex-wrap p-1.5 bg-gray-100/50 rounded-2xl w-fit">
            {["All", "Holiday", "Company Update", "HR Announcement", "General"].map((cat) => <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${filterCat === cat ? "bg-white text-primary shadow-sm border border-gray-100" : "text-textSecondary hover:text-textPrimary hover:bg-gray-200/50"}`}
            >
                {cat}
            </button>)}
        </div>

        {pinned.length > 0 && <div className="space-y-3">
            <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2.5 px-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Pinned Announcements
            </h2>
            {pinned.map((ann, i) => <AnnouncementCard key={ann.id} ann={ann} index={i} />)}
        </div>}

        {rest.length > 0 && <div className="space-y-3">
            <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2.5 px-1">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300" /> Recent Updates
            </h2>
            {rest.map((ann, i) => <AnnouncementCard key={ann.id} ann={ann} index={i} />)}
        </div>}

        {
            /* Post Modal */
        }
        <AnimatePresence>
            {isModalOpen && isAdmin && <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 30 }}
                    className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-textPrimary">{editingId ? "Edit Announcement" : "Post Announcement"}</h2>
                            <p className="text-xs text-textSecondary mt-1 font-medium">{editingId ? "Modify the existing announcement." : "Visible to all employees immediately."}</p>
                        </div>
                        <button onClick={closeModal} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-all">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Title *</label>
                            <input
                                value={newAnn.title}
                                onChange={(e) => setNewAnn((p) => ({ ...p, title: e.target.value }))}
                                className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3.5 px-4 text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-textPrimary"
                                placeholder="e.g. Diwali Holiday Notice"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Message *</label>
                            <textarea
                                value={newAnn.content}
                                onChange={(e) => setNewAnn((p) => ({ ...p, content: e.target.value }))}
                                rows={5}
                                className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3.5 px-4 text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-textPrimary resize-none"
                                placeholder="Write your announcement message here..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Category</label>
                            <select
                                value={newAnn.category}
                                onChange={(e) => setNewAnn((p) => ({ ...p, category: e.target.value }))}
                                className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3.5 px-4 text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-textPrimary appearance-none"
                            >
                                {["Holiday", "Company Update", "HR Announcement", "General"].map((c) => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                        <button onClick={closeModal} className="px-6 py-2.5 text-sm font-bold text-textSecondary hover:bg-gray-100 rounded-lg transition-all">Cancel</button>
                        <button
                            onClick={postAnnouncement}
                            className="px-8 py-2.5 text-sm font-bold text-white rounded-lg shadow-sm bg-gradient-to-r from-[#0f4184] to-[#0b3166] hover:opacity-90 transition-all"
                        >
                            {editingId ? "Save Changes" : "Publish Announcement"}
                        </button>
                    </div>
                </motion.div>
            </div>}
        </AnimatePresence>
    </div>;
}
export default Announcements;
