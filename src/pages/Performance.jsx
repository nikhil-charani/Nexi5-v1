import { TrendingUp, Award, MessageSquare, Loader2, Eye, X, Star, Target, Zap } from "lucide-react";
import { useAppContext } from "../hooks/useAppContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
function Performance() {
    const { employees, userRole, updateEmployee } = useAppContext();
    const [loadingCycle, setLoadingCycle] = useState(false);
    const [viewingId, setViewingId] = useState(null);
    const [selectedEmpId, setSelectedEmpId] = useState(null);
    const [editScore, setEditScore] = useState(0);
    const canEditScore = ["Admin", "Manager", "HR", "HR Head", "HR Recruiter"].includes(userRole || "");
    const handleStartCycle = async () => {
        setLoadingCycle(true);
        await new Promise((r) => setTimeout(r, 1200));
        setLoadingCycle(false);
        toast.success("New Cycle Started", { description: "Performance review cycle Q1 2025 has been initialized." });
    };
    const handleViewResult = async (empId, currentScore) => {
        setViewingId(empId);
        await new Promise((r) => setTimeout(r, 600));
        setViewingId(null);
        setSelectedEmpId(empId);
        setEditScore(currentScore);
    };
    const handleSaveScore = () => {
        if (selectedEmpId) {
            updateEmployee(selectedEmpId, { performanceScore: editScore });
            toast.success("Performance Score Updated", { description: `Score updated to ${editScore.toFixed(1)}.` });
            setSelectedEmpId(null);
        }
    };
    const activeEmployee = employees.find((e) => e.id === selectedEmpId);
    return <div className="space-y-5">
        {
            /* Header */
        }
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
                <div className="flex items-center gap-3 mb-1 text-primary">
                    <Award size={24} className="shrink-0" />
                    <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Performance Appraisals</h1>
                </div>
                <p className="text-textSecondary text-sm font-medium">Track OKRs and employee feedback scores.</p>
            </div>
            <button
                onClick={handleStartCycle}
                disabled={loadingCycle}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold shadow-sm disabled:opacity-70 bg-gradient-to-r from-[#0f4184] to-[#0b3166] hover:opacity-90 transition-all"
            >
                {loadingCycle ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                {loadingCycle ? "Initializing Cycle..." : "New Review Cycle"}
            </button>
        </div>

        {
            /* Stats Grid */
        }
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
                { label: "Company Avg Score", value: "4.2", sub: "/5.0", icon: TrendingUp, gradient: "from-[#0f4184] to-[#0b3166]" },
                { label: "Top Performers", value: "12%", sub: "of staff", icon: Star, gradient: "from-orange-400 to-rose-500" },
                { label: "Pending Reviews", value: "24", sub: "due this week", icon: MessageSquare, gradient: "from-blue-500 to-indigo-600" }
            ].map((stat, i) => <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-5 cursor-default shadow-sm hover:shadow-md transition-all"
            >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                    <stat.icon size={24} className="text-white" />
                </div>
                <div>
                    <p className="text-[11px] font-bold text-textSecondary uppercase tracking-widest leading-none">{stat.label}</p>
                    <div className="flex items-baseline gap-1.5 mt-2 leading-none">
                        <span className="text-2xl font-bold text-textPrimary">{stat.value}</span>
                        <span className="text-[11px] font-bold text-textSecondary">{stat.sub}</span>
                    </div>
                </div>
            </motion.div>)}
        </div>

        {
            /* Main Table Card */
        }
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                <div className="flex items-center gap-2.5">
                    <Target size={18} className="text-primary" />
                    <h3 className="font-bold text-textPrimary text-sm">Current Cycle: Q4 2024</h3>
                </div>
                <span className="text-[10px] font-bold bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/10 uppercase tracking-widest shadow-sm">
                    In Progress
                </span>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest border-b border-gray-100">Employee</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest border-b border-gray-100">Role / Team</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest border-b border-gray-100">Manager</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest border-b border-gray-100">Rating</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-textSecondary uppercase tracking-widest border-b border-gray-100 w-1/4">Evaluation Progress</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {employees.slice(0, 10).map((emp, i) => {
                            const score = emp.performanceScore || [4.8, 4.2, 3.5, 4.5, 3.8][i % 5];
                            const percentage = score / 5 * 100;
                            const statusColor = score >= 4.5 ? "text-emerald-500" : score >= 4 ? "text-blue-500" : "text-amber-500";
                            return <motion.tr
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.04 }}
                                key={emp.id}
                                className="bg-white hover:bg-gray-50/50 transition-colors group"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0 border border-primary/10 group-hover:scale-110 transition-transform`}>
                                            {emp.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-textPrimary text-[14px] leading-none">{emp.name}</div>
                                            <div className="text-[10px] text-textSecondary font-medium mt-1.5 uppercase tracking-wider leading-none">{emp.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-[12px] font-bold text-textPrimary leading-none">{emp.designation}</div>
                                    <div className="text-[10px] text-textSecondary mt-1.5 font-medium uppercase tracking-widest leading-none">{emp.department}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-textSecondary text-xs font-bold uppercase tracking-wider leading-none">{emp.manager || "N/A"}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className={`inline-flex items-center gap-1.5 font-bold text-[14px] ${statusColor} leading-none`}>
                                        <Star size={14} fill="currentColor" />
                                        {score.toFixed(1)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-6">
                                        <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle cx="22" cy="22" r="18" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-100" />
                                                <motion.circle
                                                    initial={{ strokeDashoffset: 113.1 }}
                                                    animate={{ strokeDashoffset: 113.1 - (percentage / 100 * 113.1) }}
                                                    transition={{ duration: 1.2, ease: "circOut" }}
                                                    cx="22"
                                                    cy="22"
                                                    r="18"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    strokeLinecap="round"
                                                    fill="transparent"
                                                    strokeDasharray="113.1 113.1"
                                                    className={statusColor}
                                                />
                                            </svg>
                                            <span className={`absolute text-[10px] font-bold ${statusColor}`}>{Math.round(percentage)}%</span>
                                        </div>
                                        <button
                                            onClick={() => handleViewResult(emp.id, score)}
                                            disabled={viewingId === emp.id}
                                            className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold text-primary hover:bg-primary/5 rounded-xl transition-all border border-transparent hover:border-primary/10 disabled:opacity-50 uppercase tracking-widest"
                                        >
                                            {viewingId === emp.id ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
                                            Details
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>;
                        })}
                    </tbody>
                </table>
                {employees.length === 0 && <div className="py-24 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
                        <Target size={40} className="text-gray-200" />
                    </div>
                    <p className="text-textSecondary font-bold text-sm uppercase tracking-widest">No data available</p>
                    <p className="text-xs text-textSecondary/60 mt-2 font-medium">Add employees to start tracking performance metrics.</p>
                </div>}
            </div>
        </div>

        {
            /* Performance Details Modal */
        }
        <AnimatePresence>
            {selectedEmpId && activeEmployee && <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedEmpId(null)} className="absolute inset-0 bg-secondary/40 backdrop-blur-sm" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0f4184] to-[#0b3166] flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-lg group-hover:rotate-3 transition-transform">
                                {activeEmployee.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-textPrimary leading-none">{activeEmployee.name}</h2>
                                <p className="text-[11px] text-textSecondary font-bold uppercase tracking-widest mt-2">{activeEmployee.designation}</p>
                            </div>
                        </div>
                        <button onClick={() => setSelectedEmpId(null)} className="p-2.5 rounded-xl hover:bg-white hover:shadow-sm text-gray-400 hover:text-textPrimary transition-all border border-transparent hover:border-gray-100"><X size={22} /></button>
                    </div>

                    <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
                        <div>
                            <h3 className="text-[11px] font-bold text-textSecondary uppercase tracking-widest mb-4 flex items-center gap-2">
                                <TrendingUp size={14} className="text-primary" /> Competency Metrics
                            </h3>
                            <div className="grid grid-cols-1 gap-5">
                                {["Technical Excellence", "Problem Resolution", "Leadership & Teams", "Client Communication"].map((metric, idx) => {
                                    const randScore = [editScore * 0.9, editScore * 1.05, editScore * 0.95, editScore * 1.1][idx % 4];
                                    const cappedScore = Math.min(5, Math.max(1, randScore));
                                    const percent = cappedScore / 5 * 100;
                                    return <div key={metric} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary group-hover:shadow-[0_0_12px_rgba(34,193,220,0.5)] transition-all" />
                                        <div className="flex justify-between items-center text-[12px] mb-3">
                                            <span className="text-textPrimary font-bold">{metric}</span>
                                            <span className="font-bold text-primary text-[14px] bg-white px-2 py-1 rounded-lg border border-gray-100 shadow-sm">{cappedScore.toFixed(1)} <span className="text-[10px] text-textSecondary font-medium">/ 5.0</span></span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percent}%` }}
                                                className="bg-gradient-to-r from-[#0f4184] to-[#0b3166] h-full rounded-full shadow-lg"
                                            />
                                        </div>
                                    </div>;
                                })}
                            </div>
                        </div>

                        {canEditScore && <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Target size={60} className="text-primary" />
                            </div>
                            <label className="text-[11px] font-bold text-primary uppercase tracking-widest mb-5 block">Manager's Performance Review</label>
                            <div className="flex items-center gap-6">
                                <div className="flex-1">
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        step="0.1"
                                        value={editScore}
                                        onChange={(e) => setEditScore(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary mt-2"
                                    />
                                    <div className="flex justify-between mt-3 px-1">
                                        <span className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">1.0</span>
                                        <span className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">5.0</span>
                                    </div>
                                </div>
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0f4184] to-[#0b3166] flex flex-col items-center justify-center text-white shadow-xl border border-white/20">
                                    <span className="text-2xl font-bold leading-none">{editScore.toFixed(1)}</span>
                                    <span className="text-[8px] font-bold uppercase tracking-widest mt-1 opacity-80">Rating</span>
                                </div>
                            </div>
                        </div>}
                    </div>

                    <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/30">
                        <button onClick={() => setSelectedEmpId(null)} className="px-6 py-3 text-sm font-bold text-textSecondary hover:bg-white hover:text-textPrimary rounded-xl transition-all hover:shadow-sm border border-transparent hover:border-gray-100">Cancel</button>
                        {canEditScore && <button
                            onClick={handleSaveScore}
                            className="px-10 py-3 text-sm font-bold text-white rounded-xl shadow-md bg-gradient-to-r from-[#0f4184] to-[#0b3166] hover:opacity-90 transition-all border border-white/10"
                        >
                            Commit Final Review
                        </button>}
                    </div>
                </motion.div>
            </div>}
        </AnimatePresence>
    </div>;
}
export {
    Performance as default
};
