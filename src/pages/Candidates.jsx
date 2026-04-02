import { useState } from "react";
import { motion } from "framer-motion";
import { Filter, Search, UserPlus, MoreHorizontal, Edit2, Calendar, Briefcase, GraduationCap, ChevronRight, Star, TrendingUp, Users, X } from "lucide-react";
import { useAppContext } from "../hooks/useAppContext";
import CandidateDrawer from "../components/drawers/CandidateDrawer";
const STATUS_CONFIG = {
    New: { bg: "bg-blue-100", text: "text-blue-600", dot: "bg-blue-500" },
    Interviewing: { bg: "bg-orange-100", text: "text-orange-600", dot: "bg-orange-500" },
    Offered: { bg: "bg-[#0f4184]/10", text: "text-[#0b3166]", dot: "bg-[#0f4184]" },
    Rejected: { bg: "bg-red-100", text: "text-red-600", dot: "bg-red-500" }
};
function Candidates() {
    const { candidates } = useAppContext();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const handleOpenDrawer = (candidate) => {
        setSelectedCandidate(candidate || null);
        setIsDrawerOpen(true);
    };
    const filteredCandidates = candidates.filter(
        (can) => can.name.toLowerCase().includes(searchQuery.toLowerCase()) || can.position.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return <div className="space-y-5 h-full flex flex-col">
        {
            /* Header */
        }
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
                <div className="flex items-center gap-3 mb-1 text-primary">
                    <UserPlus size={24} className="shrink-0" />
                    <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Candidate Pipeline</h1>
                </div>
                <p className="text-textSecondary text-sm font-medium">Manage recruitment processes and talent acquisition.</p>
            </div>
            <button
                onClick={() => handleOpenDrawer()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold shadow-sm bg-gradient-to-r from-[#0f4184] to-[#0b3166] hover:opacity-90 transition-all"
            >
                <UserPlus size={18} /> Add Candidate
            </button>
        </div>

        {
            /* Stats Summary */
        }
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
                { label: "Total Applicants", value: candidates.length, icon: Users, color: "text-[#0f4184] bg-[#0f4184]/10" },
                { label: "Interviewing", value: candidates.filter((c) => c.status === "Interviewing").length, icon: Calendar, color: "text-orange-500 bg-orange-50" },
                { label: "Offers Sent", value: candidates.filter((c) => c.status === "Offered").length, icon: Star, color: "text-[#0b3166] bg-[#0b3166]/10" },
                { label: "Hire Rate", value: "18%", icon: TrendingUp, color: "text-purple-500 bg-purple-50" }
            ].map((stat, i) => <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-100 p-5 rounded-xl flex items-center gap-4 shadow-sm hover:border-gray-200 transition-all"
            >
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center shrink-0 shadow-sm`}><stat.icon size={22} /></div>
                <div>
                    <p className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">{stat.label}</p>
                    <p className="text-2xl font-bold text-textPrimary mt-0.5">{stat.value}</p>
                </div>
            </motion.div>)}
        </div>

        {
            /* Toolbar */
        }
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 w-full sm:max-w-md group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0f4184] transition-colors duration-300" size={18} />
                <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, position or skill..."
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-3 pl-12 pr-10 text-[14px] sm:text-[15px] focus:bg-white focus:border-[#0f4184] focus:ring-[4px] focus:ring-[#0f4184]/10 outline-none transition-all duration-300 placeholder:text-gray-400 font-medium text-textPrimary shadow-sm hover:border-gray-300"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
            </div>
            <button className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-xs font-bold text-textSecondary bg-white hover:bg-gray-50 hover:text-textPrimary transition-all shadow-sm">
                <Filter size={18} /> Filters
            </button>
        </div>

        {
            /* Pipeline Table */
        }
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex-1 flex flex-col min-h-[400px]">
            <div className="overflow-x-auto flex-1 custom-scrollbar">
                <table className="w-full text-sm whitespace-nowrap">
                    <thead className="bg-gray-50/80 sticky top-0 z-10 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Candidate</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Role Details</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Exp.</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Applied Date</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredCandidates.map((can, i) => {
                            const status = STATUS_CONFIG[can.status] || STATUS_CONFIG["New"];
                            return <motion.tr
                                key={can.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.03 }}
                                onClick={() => handleOpenDrawer(can)}
                                className="hover:bg-[#F0F9FF] transition-colors group cursor-pointer"
                            >
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl ${status.bg} ${status.text} flex items-center justify-center text-xs font-bold shrink-0 shadow-sm transition-transform group-hover:scale-105`}>
                                            {can.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-textPrimary text-sm">{can.name}</div>
                                            <div className="text-[11px] text-textSecondary font-bold mt-0.5 tracking-wider">{can.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2 font-bold text-textSecondary text-[13px]">
                                        <Briefcase size={14} className="text-gray-400" />
                                        {can.position}
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-50 text-[11px] font-bold text-textSecondary border border-gray-100">
                                        <GraduationCap size={13} />
                                        {can.experience}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-textSecondary text-[13px] font-medium">{can.appliedDate}</td>
                                <td className="px-6 py-5">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold uppercase rounded-full ${status.bg} ${status.text} shadow-sm`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot} shadow-[0_0_8px_rgba(0,0,0,0.1)]`} />
                                        {can.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                        <button className="p-2 text-gray-400 hover:bg-white hover:text-primary hover:shadow-sm rounded-lg transition-all border border-transparent hover:border-gray-100">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:bg-white hover:text-primary hover:shadow-sm rounded-lg transition-all border border-transparent hover:border-gray-100">
                                            <MoreHorizontal size={16} />
                                        </button>
                                        <ChevronRight size={18} className="text-gray-300 ml-1" />
                                    </div>
                                </td>
                            </motion.tr>;
                        })}
                        {filteredCandidates.length === 0 && <tr>
                            <td colSpan={6} className="py-24 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                                    <Search size={32} className="text-gray-200" />
                                </div>
                                <p className="font-bold text-textSecondary uppercase tracking-widest text-sm">No candidates found</p>
                                <p className="text-xs text-textSecondary/60 mt-1 font-medium">Try adjusting your search or filters</p>
                            </td>
                        </tr>}
                    </tbody>
                </table>
            </div>
            {
                /* Pagination Header */
            }
            <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
                <p className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">Showing <span className="text-primary font-black">{filteredCandidates.length}</span> Applicants</p>
                <div className="flex gap-2">
                    <button className="p-2 rounded-lg border border-gray-200 text-gray-300 bg-white cursor-not-allowed" disabled><ChevronRight size={16} className="rotate-180" /></button>
                    <button className="p-2 rounded-lg border border-gray-200 text-gray-300 bg-white cursor-not-allowed" disabled><ChevronRight size={16} /></button>
                </div>
            </div>
        </div>

        <CandidateDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            candidateToEdit={selectedCandidate}
        />
    </div>;
}
export {
    Candidates as default
};
