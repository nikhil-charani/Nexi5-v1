import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, AlertTriangle, Clock, CheckCircle2, X, ChevronRight, ShieldAlert, Info, Trash2, Loader2 } from "lucide-react";
import { useAppContext } from "../hooks/useAppContext";
import { toast } from "sonner";
import * as concernsApi from "../api/concernsApi";

const PRIORITY_STYLES = {
    High: { text: "text-rose-600", dot: "bg-rose-500", bg: "bg-rose-100" },
    Medium: { text: "text-orange-600", dot: "bg-orange-500", bg: "bg-orange-100" },
    Low: { text: "text-gray-600", dot: "bg-gray-400", bg: "bg-gray-100" }
};
const STATUS_CONFIG = {
    Open: { text: "text-orange-600", bg: "bg-orange-100", icon: Clock, dot: "bg-orange-500" },
    "In Progress": { text: "text-blue-600", bg: "bg-blue-100", icon: AlertTriangle, dot: "bg-blue-500" },
    Resolved: { text: "text-emerald-600", bg: "bg-emerald-100", icon: CheckCircle2, dot: "bg-emerald-500" },
    Cancelled: { text: "text-rose-600", bg: "bg-rose-100", icon: X, dot: "bg-rose-500" }
};

export default function Grievances() {
    const { currentUser, userRole } = useAppContext();
    const token = currentUser?.token;

    const currentRole = userRole?.toLowerCase()?.trim() || "";
    const isAdmin = currentRole === "admin" || currentRole === "super-admin";
    const isHR = ["hr", "hr head", "hr recruiter", "hr accountant"].some(r => currentRole.includes(r));
    const isEmployee = !isAdmin && !isHR;

    const [isModalOpen, setModalOpen] = useState(false);
    const [viewGrievance, setViewGrievance] = useState(null);
    const [concerns, setConcerns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({ 
        title: "", 
        category: "Team Issues", 
        priority: "Medium", 
        description: "", 
        anonymous: false,
        againstHr: false
    });

    const currentUserId = currentUser?.id || currentUser?.uid;

    const loadConcerns = async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const data = await concernsApi.fetchConcerns(token);
            setConcerns(data || []);
        } catch (error) {
            console.error("Failed to fetch concerns:", error);
            toast.error(error.message || "Failed to load concerns");
            setConcerns([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadConcerns();
    }, [token]);

    const handleSubmit = async () => {
        if (!form.title || !form.description) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            setSubmitting(true);
            await concernsApi.createConcern(form, token);
            toast.success("Concern Submitted Successfully");
            setModalOpen(false);
            setForm({ title: "", category: "Team Issues", priority: "Medium", description: "", anonymous: false, againstHr: false });
            loadConcerns(); // Refresh list
        } catch (error) {
            toast.error(error.message || "Failed to submit concern");
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await concernsApi.updateConcernStatus(id, status, token);
            toast.success(`Concern marked as ${status}`);
            loadConcerns(); // Refresh list
            if (viewGrievance?.id === id) setViewGrievance(prev => ({ ...prev, status }));
        } catch (error) {
            toast.error(error.message || "Failed to update status");
        }
    };

    const handleCancelConcern = async (id, event) => {
        if (event) event.stopPropagation();
        if (window.confirm("Are you sure you want to cancel this concern?")) {
            try {
                await concernsApi.cancelConcern(id, token);
                toast.success("Concern Cancelled");
                loadConcerns(); // Refresh list
                if (viewGrievance?.id === id) setViewGrievance(null);
            } catch (error) {
                toast.error(error.message || "Failed to cancel concern");
            }
        }
    };

    return <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
                <div className="flex items-center gap-3 mb-1 text-primary">
                    <ShieldAlert size={24} className="shrink-0" />
                    <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Grievances & Concerns</h1>
                </div>
                <p className="text-textSecondary text-sm font-medium">
                    {isAdmin || isHR ? "Review and resolve employee concerns confidentially." : "Raise a concern with HR or Admin — confidentially if needed."}
                </p>
            </div>
            {!isAdmin && (
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold shadow-sm bg-primary hover:bg-primary/90 transition-all"
                >
                    <Plus size={18} /> Raise a Concern
                </button>
            )}
        </div>

        {/* Info Banner for Employees */}
        {isEmployee && <div className="flex items-start gap-4 p-5 bg-primary/5 border border-primary/10 rounded-2xl shadow-sm">
            <div className="p-2.5 bg-white text-primary rounded-xl shrink-0 shadow-sm border border-primary/5">
                <Info size={22} />
            </div>
            <div>
                <p className="font-bold text-textPrimary text-[14px]">Your privacy is protected</p>
                <p className="text-xs text-textSecondary mt-1 font-medium leading-relaxed">All concerns are reviewed directly by HR and the Admin team. You can choose to submit anonymously to protect your identity.</p>
            </div>
        </div>}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
                { label: "Open", count: concerns.filter((g) => g.status === "Open").length, icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-50", gradient: "from-orange-500 to-orange-600" },
                { label: "In Progress", count: concerns.filter((g) => g.status === "In Progress").length, icon: Clock, color: "text-blue-500", bg: "bg-blue-50", gradient: "from-blue-500 to-indigo-600" },
                { label: "Resolved", count: concerns.filter((g) => g.status === "Resolved").length, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50", gradient: "from-emerald-500 to-teal-600" }
            ].map((s, i) => <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-5 cursor-default shadow-sm hover:shadow-md transition-all"
            >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                    <s.icon size={26} className="text-white" />
                </div>
                <div>
                    <p className="text-[11px] font-bold text-textSecondary uppercase tracking-widest leading-none">{s.label}</p>
                    <p className="text-2xl font-bold text-textPrimary mt-2 leading-none">{s.count}</p>
                </div>
            </motion.div>)}
        </div>

        {/* Grievance Cards List */}
        <div className="space-y-4">
            {loading ? (
                <div className="py-24 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100">
                    <Loader2 size={40} className="text-primary animate-spin mb-4" />
                    <p className="text-sm font-bold text-textSecondary uppercase tracking-widest">Loading concerns...</p>
                </div>
            ) : concerns.length === 0 ? (
                <div className="py-24 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-50">
                        <ShieldAlert size={40} className="text-gray-200" />
                    </div>
                    <p className="font-bold text-textSecondary uppercase tracking-widest text-sm">No concerns raised yet</p>
                    <p className="text-[12px] text-textSecondary/60 mt-2 max-w-xs mx-auto font-medium">Raise a concern to submit a new confidential feedback to the HR team.</p>
                </div>
            ) : (
                concerns.map((g, i) => {
                    const status = STATUS_CONFIG[g.status] || STATUS_CONFIG.Open;
                    const priority = PRIORITY_STYLES[g.priority] || PRIORITY_STYLES.Medium;
                    return <motion.div
                        key={g.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.01, x: 5 }}
                        onClick={() => setViewGrievance(g)}
                        className="bg-white rounded-2xl border border-gray-100 p-6 cursor-pointer hover:shadow-xl transition-all group relative overflow-hidden"
                    >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-gray-100 to-transparent group-hover:via-primary transition-all" />
                        <div className="flex items-start justify-between gap-6">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 flex-wrap mb-3.5">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${priority.bg} ${priority.text}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                                        {g.priority}
                                    </span>
                                    <span className="text-[11px] font-bold text-textSecondary bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100 uppercase tracking-widest">{g.category}</span>
                                    {g.anonymous && <span className="text-[10px] font-bold px-2.5 py-1 bg-primary/10 text-primary rounded-lg border border-primary/10 uppercase tracking-widest">Anonymous Submission</span>}
                                    {g.targetRole === "ADMIN" && <span className="text-[10px] font-bold px-2.5 py-1 bg-rose-50 text-rose-600 rounded-lg border border-rose-100 uppercase tracking-widest">{g.againstHr ? "Against HR (To Admin)" : "To Admin"}</span>}
                                </div>
                                <h3 className="font-bold text-textPrimary text-[16px] group-hover:text-primary transition-colors leading-tight mb-2 tracking-tight">{g.title}</h3>
                                <p className="text-[13px] text-textSecondary line-clamp-2 md:line-clamp-1 mb-5 font-medium leading-relaxed">{g.description}</p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-5 flex-wrap">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold rounded-xl uppercase tracking-widest ${status.bg} ${status.text} shadow-sm border border-black/5`}>
                                            <status.icon size={12} className={status.text} />
                                            <span className={`w-1 h-1 rounded-full ${status.dot}`} />
                                            {g.status}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-textSecondary uppercase tracking-widest">
                                            <Clock size={12} className="text-gray-400" /> {new Date(g.createdAt).toLocaleDateString()}
                                        </span>
                                        {(isAdmin || isHR) && g.submittedById !== currentUserId && <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-bold text-textSecondary uppercase tracking-widest leading-none">Submitted by</span>
                                            <div className="flex items-center gap-2 bg-gray-50 px-2.5 py-1 rounded-xl border border-gray-100 shadow-sm">
                                                <div className="w-5 h-5 rounded-lg bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center">
                                                    {g.submittedBy.charAt(0)}
                                                </div>
                                                <span className="text-[11px] font-bold text-textPrimary">{g.submittedBy}</span>
                                            </div>
                                        </div>}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {g.submittedById === currentUserId && g.status !== "Cancelled" && (
                                            <button 
                                                onClick={(e) => handleCancelConcern(g.id, e)}
                                                className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors"
                                                title="Cancel Concern"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-gray-50 group-hover:bg-primary/5 text-gray-400 group-hover:text-primary transition-all translate-x-1 group-hover:translate-x-0 border border-gray-100 mt-2">
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    </motion.div>;
                })
            )}
        </div>

        {/* Raise Concern Modal */}
        <AnimatePresence>
            {isModalOpen && <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="absolute inset-0 bg-secondary/40 backdrop-blur-sm" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <div>
                            <h2 className="text-lg font-bold text-textPrimary leading-none">Raise a Concern</h2>
                            <p className="text-[11px] text-textSecondary font-bold uppercase tracking-widest mt-2">{isHR ? "Directly route your concern to the Admin dashboard" : "Confidentially send feedback to HR or Admin"}</p>
                        </div>
                        <button onClick={() => setModalOpen(false)} className="p-2 rounded-xl hover:bg-white hover:shadow-sm text-gray-400 hover:text-textPrimary transition-all border border-transparent hover:border-gray-100"><X size={20} /></button>
                    </div>

                    <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest ml-1">Title *</label>
                            <input
                                value={form.title}
                                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                                placeholder="Brief summary of your concern"
                                className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-gray-400 font-medium text-textPrimary"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest ml-1">Category</label>
                                <div className="relative">
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                                        className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-textPrimary appearance-none cursor-pointer"
                                    >
                                        {["Team Issues", "Workplace Harassment", "Manager Conflict", "Policy Concern", "Compensation", "Other"].map((c) => <option key={c}>{c}</option>)}
                                    </select>
                                    <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest ml-1">Priority</label>
                                <div className="relative">
                                    <select
                                        value={form.priority}
                                        onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
                                        className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-textPrimary appearance-none cursor-pointer"
                                    >
                                        {["High", "Medium", "Low"].map((p) => <option key={p}>{p}</option>)}
                                    </select>
                                    <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest ml-1">Detailed Description *</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                                rows={5}
                                placeholder="Please describe the issue in detail..."
                                className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-gray-400 font-medium text-textPrimary resize-none"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div
                                onClick={() => setForm((p) => ({ ...p, anonymous: !p.anonymous }))}
                                className={`flex-1 p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${form.anonymous ? "bg-primary/5 border-primary shadow-sm" : "bg-gray-50 border-gray-100 hover:border-gray-200"}`}
                            >
                                <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${form.anonymous ? "bg-primary text-white" : "bg-white border-2 border-gray-200 text-transparent"}`}>
                                    <CheckCircle2 size={12} strokeWidth={3} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[13px] font-bold text-textPrimary leading-none">Submit Anonymously</p>
                                </div>
                            </div>
                            
                            {isEmployee && (
                                <div
                                    onClick={() => setForm((p) => ({ ...p, againstHr: !p.againstHr }))}
                                    className={`flex-1 p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${form.againstHr ? "bg-rose-50 border-rose-500 shadow-sm" : "bg-gray-50 border-gray-100 hover:border-gray-200"}`}
                                >
                                    <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${form.againstHr ? "bg-rose-500 text-white" : "bg-white border-2 border-gray-200 text-transparent"}`}>
                                        <CheckCircle2 size={12} strokeWidth={3} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[13px] font-bold text-textPrimary leading-none">Issue is with HR</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        {isEmployee && form.againstHr && (
                            <p className="text-xs text-rose-600 font-medium bg-rose-50 p-3 rounded-xl border border-rose-100 mt-2">
                                Checking this box will directly route your concern to the Admin dashboard, bypassing the HR team entirely.
                            </p>
                        )}
                        {isHR && (
                             <p className="text-xs text-rose-600 font-medium bg-rose-50 p-3 rounded-xl border border-rose-100 mt-2">
                             As an HR professional, your concerns are securely routed directly to the Admin dashboard.
                         </p>
                        )}
                    </div>

                    <div className="p-6 border-t border-gray-50 flex justify-end gap-3 bg-gray-50/30">
                        <button onClick={() => setModalOpen(false)} className="px-6 py-3 text-sm font-bold text-textSecondary hover:bg-white hover:text-textPrimary rounded-xl transition-all hover:shadow-sm border border-transparent hover:border-gray-100">Cancel</button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className={`px-8 py-3 text-sm font-bold text-white rounded-xl shadow-md bg-primary hover:bg-primary/90 transition-all flex items-center gap-2 ${submitting ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {submitting && <Loader2 size={16} className="animate-spin" />}
                            {submitting ? "Submitting..." : "Submit Concern"}
                        </button>
                    </div>
                </motion.div>
            </div>}
        </AnimatePresence>

        {/* View Detail Modal */}
        <AnimatePresence>
            {viewGrievance && <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewGrievance(null)} className="absolute inset-0 bg-secondary/40 backdrop-blur-sm" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
                >
                    <div className="p-6 border-b border-gray-50 flex justify-between items-start bg-gray-50/50">
                        <div className="flex items-start gap-4">
                            <div className={`w-14 h-14 rounded-2xl ${PRIORITY_STYLES[viewGrievance.priority]?.bg || "bg-gray-100"} flex items-center justify-center shadow-lg transform -rotate-3`}>
                                <AlertTriangle size={28} className={PRIORITY_STYLES[viewGrievance.priority]?.text || "text-gray-500"} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-textPrimary leading-tight">{viewGrievance.title}</h2>
                                <p className="text-[10px] text-textSecondary font-bold uppercase tracking-widest mt-2">{viewGrievance.category} • {new Date(viewGrievance.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <button onClick={() => setViewGrievance(null)} className="p-2 rounded-xl hover:bg-white hover:shadow-sm text-gray-400 hover:text-textPrimary transition-all border border-transparent hover:border-gray-100"><X size={20} /></button>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 shadow-inner">
                            <p className="text-[14px] text-textPrimary leading-relaxed font-medium">{viewGrievance.description}</p>
                        </div>

                        <div className="flex items-center gap-4 flex-wrap">
                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold rounded-xl uppercase tracking-widest ${STATUS_CONFIG[viewGrievance.status]?.bg || "bg-gray-100"} ${STATUS_CONFIG[viewGrievance.status]?.text || "text-gray-600"} border border-black/5 shadow-sm`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[viewGrievance.status]?.dot || "bg-gray-400"}`} />
                                {viewGrievance.status}
                            </span>
                            {!viewGrievance.anonymous && <div className="flex items-center gap-3 ml-auto">
                                <span className="text-[10px] font-bold text-textSecondary uppercase tracking-widest leading-none">Submitted by</span>
                                <div className="flex items-center gap-2.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="w-6 h-6 rounded-lg bg-primary/20 text-primary text-[11px] font-bold flex items-center justify-center">
                                        {viewGrievance.submittedBy.charAt(0)}
                                    </div>
                                    <span className="text-xs font-bold text-textPrimary">{viewGrievance.submittedBy}</span>
                                </div>
                            </div>}
                        </div>

                        {/* Admin/HR Actions */}
                        {(isAdmin || isHR) && viewGrievance.status !== "Resolved" && viewGrievance.submittedById !== currentUserId && <div className="pt-6 border-t border-gray-100 flex gap-3">
                            {viewGrievance.status === "Open" && <button onClick={() => handleUpdateStatus(viewGrievance.id, "In Progress")} className="flex-1 py-3 text-[11px] font-bold bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all border border-blue-100 shadow-sm uppercase tracking-widest">
                                Start Review
                            </button>}
                            <button onClick={() => handleUpdateStatus(viewGrievance.id, "Resolved")} className="flex-1 py-3 text-[11px] font-bold bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all border border-emerald-100 shadow-sm uppercase tracking-widest">
                                Mark Resolved
                            </button>
                        </div>}
                        
                        {/* Submitter Cancel Action */}
                        {viewGrievance.submittedById === currentUserId && viewGrievance.status !== "Cancelled" && (
                            <div className="pt-6 border-t border-gray-100 flex gap-3">
                                <button onClick={() => handleCancelConcern(viewGrievance.id)} className="flex-1 py-3 text-[11px] font-bold bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all border border-rose-100 shadow-sm uppercase tracking-widest flex items-center justify-center gap-2">
                                    <Trash2 size={14} /> Cancel Concern
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>}
        </AnimatePresence>
    </div>;
}
