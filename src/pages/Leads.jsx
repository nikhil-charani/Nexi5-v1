import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, MoreVertical, Edit2, Mail, Phone, Building, Target, Zap, TrendingUp, Filter, ChevronRight, Globe, X } from "lucide-react";
import { useAppContext } from "../hooks/useAppContext";
import LeadDrawer from "../components/drawers/LeadDrawer";
const STATUS_CONFIG = {
    New: { text: "text-blue-600", bg: "bg-blue-100", dot: "bg-blue-500" },
    Contacted: { text: "text-orange-600", bg: "bg-orange-100", dot: "bg-orange-500" },
    Qualified: { text: "text-purple-600", bg: "bg-purple-100", dot: "bg-purple-500" },
    "Proposal Sent": { text: "text-cyan-600", bg: "bg-cyan-100", dot: "bg-cyan-500" },
    Converted: { text: "text-emerald-600", bg: "bg-emerald-100", dot: "bg-emerald-500" },
    Lost: { text: "text-rose-600", bg: "bg-rose-100", dot: "bg-rose-500" }
};
function Leads() {
    const { leads } = useAppContext();
    const [searchTerm, setSearchTerm] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [leadToEdit, setLeadToEdit] = useState(null);
    const filteredLeads = leads.filter(
        (l) => l.name.toLowerCase().includes(searchTerm.toLowerCase()) || l.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const handleEdit = (lead) => {
        setLeadToEdit(lead);
        setIsDrawerOpen(true);
    };
    const openAdd = () => {
        setLeadToEdit(null);
        setIsDrawerOpen(true);
    };
    return <div className="space-y-5 h-full flex flex-col">
        {
            /* Header */
        }
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
                <div className="flex items-center gap-3 mb-1 text-primary">
                    <Target size={24} className="shrink-0" />
                    <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Leads Pipeline</h1>
                </div>
                <p className="text-textSecondary text-sm font-medium">Manage business inquiries and track prospect movement.</p>
            </div>
            <button
                onClick={openAdd}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold shadow-sm bg-gradient-to-r from-[#0f4184] to-[#0b3166] hover:opacity-90 transition-all"
            >
                <Plus size={18} /> New Lead
            </button>
        </div>

        {
            /* Stats Summary */
        }
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
                { label: "Total Leads", value: leads.length, icon: TrendingUp, gradient: "from-[#0f4184] to-[#0b3166]" },
                { label: "Fresh Inquiry", value: leads.filter((l) => l.status === "New").length, icon: Zap, gradient: "from-orange-400 to-rose-500" },
                { label: "Qualified", value: leads.filter((l) => l.status === "Qualified").length, icon: Target, gradient: "from-blue-500 to-indigo-600" },
                { label: "Converted", value: leads.filter((l) => l.status === "Converted").length, icon: Globe, gradient: "from-emerald-400 to-teal-500" }
            ].map((s, i) => <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white border border-gray-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all cursor-default"
            >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white shrink-0 shadow-lg`}><s.icon size={22} /></div>
                <div>
                    <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest leading-none">{s.label}</p>
                    <p className="text-2xl font-bold text-textPrimary leading-none mt-2">{s.value}</p>
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
                    placeholder="Search leads, companies..."
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
            <button className="flex items-center gap-2 px-5 py-2 border border-gray-200 rounded-xl text-[11px] font-bold uppercase tracking-widest text-textSecondary bg-white hover:bg-gray-50 hover:border-primary/30 transition-all shadow-sm">
                <Filter size={18} className="text-primary" /> Filters
            </button>
        </div>

        {
            /* Table */
        }
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-1 flex flex-col min-h-[400px]">
            <div className="overflow-x-auto flex-1 custom-scrollbar">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-textSecondary uppercase tracking-widest border-b border-gray-100">Lead Detail</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-textSecondary uppercase tracking-widest border-b border-gray-100">Contact Information</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-textSecondary uppercase tracking-widest border-b border-gray-100">Channel Source</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-textSecondary uppercase tracking-widest border-b border-gray-100">Funnel Status</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-textSecondary uppercase tracking-widest border-b border-gray-100">Added Date</th>
                            <th className="px-6 py-4 text-right text-[10px] font-bold text-textSecondary uppercase tracking-widest border-b border-gray-100">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredLeads.map((lead, i) => {
                            const status = STATUS_CONFIG[lead.status] || STATUS_CONFIG["New"];
                            return <motion.tr
                                key={lead.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.03 }}
                                className="hover:bg-gray-50/80 transition-all group cursor-default"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0 border border-primary/10 group-hover:scale-110 transition-transform`}>
                                            {lead.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-textPrimary text-[14px] leading-none">{lead.name}</div>
                                            <div className="flex items-center gap-1.5 mt-1.5 text-textSecondary text-[11px] font-medium leading-none">
                                                <Building size={12} className="text-primary/60" /> {lead.company}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-textPrimary text-[12px] font-medium">
                                            <Mail size={14} className="text-gray-400 group-hover:text-primary transition-colors" /> {lead.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-textSecondary text-[11px] font-medium">
                                            <Phone size={14} className="text-gray-400" /> {lead.phone}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-[10px] font-bold text-textSecondary border border-gray-200 uppercase tracking-widest">
                                        {lead.source}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-sm border border-black/5 ${status.bg} ${status.text}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${lead.status === "New" ? "animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" : ""}`} />
                                        {lead.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-textSecondary text-[12px] font-bold tracking-tight">{lead.createdAt}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                        <button
                                            onClick={() => handleEdit(lead)}
                                            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-textPrimary hover:bg-gray-100 rounded-lg transition-all">
                                            <MoreVertical size={16} />
                                        </button>
                                        <div className="w-6 flex justify-center">
                                            <ChevronRight size={18} className="text-gray-200 group-hover:text-primary transition-colors" />
                                        </div>
                                    </div>
                                </td>
                            </motion.tr>;
                        })}
                        {filteredLeads.length === 0 && <tr>
                            <td colSpan={6} className="py-24 text-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
                                    <Search size={40} className="text-gray-200" />
                                </div>
                                <p className="font-bold text-textSecondary uppercase tracking-widest text-sm">No leads match your search</p>
                                <p className="text-xs text-textSecondary/60 mt-2 font-medium max-w-xs mx-auto text-center leading-relaxed">Try clarifying your terms or search for something else to find the right prospect.</p>
                            </td>
                        </tr>}
                    </tbody>
                </table>
            </div>
        </div>

        <LeadDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            leadToEdit={leadToEdit}
        />
    </div>;
}
export {
    Leads as default
};
