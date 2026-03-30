import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, DollarSign, Calendar, TrendingUp, Edit2, Briefcase, BriefcaseBusiness, Target, Zap, Filter, ChevronRight, MoreVertical, X } from "lucide-react";
import { useAppContext } from "../hooks/useAppContext";
import DealDrawer from "../components/drawers/DealDrawer";
const STAGE_CONFIG = {
    Discovery: { bg: "bg-blue-100", text: "text-blue-600", dot: "bg-blue-500" },
    Proposal: { bg: "bg-[#0f4184]/10", text: "text-[#0b3166]", dot: "bg-[#0f4184]" },
    Negotiation: { bg: "bg-purple-100", text: "text-purple-600", dot: "bg-purple-500" },
    "Closed Won": { bg: "bg-emerald-100", text: "text-emerald-600", dot: "bg-emerald-500" },
    "Closed Lost": { bg: "bg-red-100", text: "text-red-600", dot: "bg-red-500" }
};
function Deals() {
    const { deals } = useAppContext();
    const [searchTerm, setSearchTerm] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [dealToEdit, setDealToEdit] = useState(null);
    const filteredDeals = deals.filter(
        (d) => d.title.toLowerCase().includes(searchTerm.toLowerCase()) || d.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const handleEdit = (deal) => {
        setDealToEdit(deal);
        setIsDrawerOpen(true);
    };
    const openAdd = () => {
        setDealToEdit(null);
        setIsDrawerOpen(true);
    };
    const totalValue = deals.reduce((acc, d) => acc + d.amount, 0);
    return <div className="space-y-5 h-full flex flex-col">
        {
            /* Header */
        }
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
                <div className="flex items-center gap-3 mb-1 text-primary">
                    <DollarSign size={24} className="shrink-0" />
                    <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Sales Pipeline</h1>
                </div>
                <p className="text-textSecondary text-sm font-medium">Track revenue progression and deal velocity.</p>
            </div>
            <button
                onClick={openAdd}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold shadow-sm bg-gradient-to-r from-[#0f4184] to-[#0b3166] hover:opacity-90 transition-all"
            >
                <Plus size={18} /> Add Deal
            </button>
        </div>

        {
            /* Stats Summary */
        }
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
                { label: "Pipeline Value", value: `$${(totalValue / 1e3).toFixed(0)}k`, icon: BriefcaseBusiness, color: "text-[#0f4184] bg-[#0f4184]/10" },
                { label: "Active Deals", value: deals.length, icon: Target, color: "text-[#0b3166] bg-[#0b3166]/10" },
                { label: "Win Rate", value: "42%", icon: TrendingUp, color: "text-emerald-500 bg-emerald-50" },
                { label: "Avg Size", value: `$${(totalValue / deals.length / 1e3).toFixed(1)}k`, icon: DollarSign, color: "text-purple-500 bg-purple-50" }
            ].map((stat, i) => <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-100 p-5 rounded-xl flex items-center gap-4 shadow-sm hover:border-gray-200 transition-all cursor-default"
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search deals, clients..."
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-3 pl-12 pr-10 text-[14px] sm:text-[15px] focus:bg-white focus:border-[#0f4184] focus:ring-[4px] focus:ring-[#0f4184]/10 outline-none transition-all duration-300 placeholder:text-gray-400 font-medium text-textPrimary shadow-sm hover:border-gray-300"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
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
            /* Table */
        }
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex-1 flex flex-col min-h-[400px]">
            <div className="overflow-x-auto flex-1 custom-scrollbar">
                <table className="w-full text-sm whitespace-nowrap">
                    <thead className="bg-gray-50/80 sticky top-0 z-10 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Deal Opportunity</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Contract Value</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Pipeline Stage</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Est. Closure</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Deal Lead</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredDeals.map((deal, i) => {
                            const stage = STAGE_CONFIG[deal.stage] || STAGE_CONFIG["Discovery"];
                            return <motion.tr
                                key={deal.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.03 }}
                                className="hover:bg-[#F0F9FF] transition-colors group cursor-default"
                            >
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl ${stage.bg} ${stage.text} flex items-center justify-center text-xs font-bold shrink-0 shadow-sm transition-transform group-hover:scale-105`}>
                                            <Zap size={16} fill="currentColor" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-textPrimary text-sm">{deal.title}</div>
                                            <div className="flex items-center gap-1.5 mt-1 text-textSecondary text-[11px] font-bold">
                                                <Briefcase size={12} className="text-primary" /> {deal.clientName}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-textPrimary text-[15px] tracking-tight">
                                            ${deal.amount.toLocaleString()}
                                        </span>
                                        <span className="text-[10px] text-textSecondary font-bold uppercase tracking-widest mt-0.5">USD</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`inline-flex items-center gap-2 px-3 py-1 text-[11px] font-bold uppercase rounded-full ${stage.bg} ${stage.text} shadow-sm`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${stage.dot} ${deal.stage === "Negotiation" ? "animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.5)]" : ""}`} />
                                        {deal.stage}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2 text-textSecondary text-[13px] font-medium">
                                        <Calendar size={14} className="text-gray-400" />
                                        {deal.expectedCloseDate}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold border border-primary/20">
                                            {deal.owner.charAt(0)}
                                        </div>
                                        <span className="font-bold text-textPrimary text-[13px]">{deal.owner}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                        <button
                                            onClick={() => handleEdit(deal)}
                                            className="p-2 text-gray-400 hover:bg-white hover:text-primary hover:shadow-sm rounded-lg transition-all border border-transparent hover:border-gray-100"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:bg-white hover:text-primary hover:shadow-sm rounded-lg transition-all border border-transparent hover:border-gray-100">
                                            <MoreVertical size={16} />
                                        </button>
                                        <ChevronRight size={18} className="text-gray-300 ml-1" />
                                    </div>
                                </td>
                            </motion.tr>;
                        })}
                        {filteredDeals.length === 0 && <tr>
                            <td colSpan={6} className="py-24 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                                    <DollarSign size={32} className="text-gray-200" />
                                </div>
                                <p className="font-bold text-textSecondary uppercase tracking-widest text-sm">No deals found</p>
                                <p className="text-xs text-textSecondary/60 mt-1 font-medium">Refine your search parameters to find specific opportunities.</p>
                            </td>
                        </tr>}
                    </tbody>
                </table>
            </div>
            {
                /* Progress Funnel Visualization (Subtle) */
            }
            <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
                <div className="flex gap-6">
                    {Object.keys(STAGE_CONFIG).map((s) => <div key={s} className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${STAGE_CONFIG[s].dot} shadow-sm`} />
                        <span className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">{s}</span>
                    </div>)}
                </div>
                <div className="p-2 bg-primary/10 rounded-lg shadow-inner">
                    <TrendingUp size={16} className="text-primary" />
                </div>
            </div>
        </div>

        <DealDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            dealToEdit={dealToEdit}
        />
    </div>;
}
export {
    Deals as default
};
