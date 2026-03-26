import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Mail, Phone, Building, Briefcase, Globe, Users, TrendingUp, MoreVertical, ChevronRight, Filter, X } from "lucide-react";
import { useAppContext } from "../hooks/useAppContext";
import ClientDrawer from "../components/drawers/ClientDrawer";
function Clients() {
    const { clients } = useAppContext();
    const [searchTerm, setSearchTerm] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [clientToEdit, setClientToEdit] = useState(null);
    const filteredClients = clients.filter(
        (c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.company.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const handleEdit = (client) => {
        setClientToEdit(client);
        setIsDrawerOpen(true);
    };
    const openAdd = () => {
        setClientToEdit(null);
        setIsDrawerOpen(true);
    };
    return <div className="space-y-5 h-full flex flex-col">
        {
            /* Header */
        }
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <div className="flex items-center gap-3 mb-1 text-primary">
                    <Building size={24} className="shrink-0" />
                    <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Enterprise Clients</h1>
                </div>
                <p className="text-textSecondary text-sm font-medium">Manage established partnerships and account details.</p>
            </div>
            <button
                onClick={openAdd}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold shadow-sm bg-gradient-to-r from-[#0f4184] to-[#0b3166] hover:opacity-90 transition-all font-bold"
            >
                <Plus size={18} /> Add Client
            </button>
        </div>

        {
            /* Stats Summary */
        }
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
                { label: "Active Partners", value: clients.length, icon: Users, color: "text-[#0f4184] bg-[#0f4184]/10" },
                { label: "Industries", value: new Set(clients.map((c) => c.industry)).size, icon: Globe, color: "text-orange-500 bg-orange-50" },
                { label: "Retention", value: "98%", icon: TrendingUp, color: "text-[#0b3166] bg-[#0b3166]/10" },
                { label: "Total Revenue", value: "$2.4M", icon: Building, color: "text-purple-500 bg-purple-50" }
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
                    placeholder="Search clients, industries..."
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
            /* Clients Grid */
        }
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-10">
            {filteredClients.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.map((client, idx) => <motion.div
                    key={client.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleEdit(client)}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer group relative overflow-hidden h-full flex flex-col"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />

                    <div className="flex justify-between items-start mb-6 relative">
                        <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center text-textSecondary font-bold text-xl border border-gray-100 shadow-inner group-hover:scale-110 transition-transform">
                            {client.company.charAt(0)}
                        </div>
                        <div className="flex flex-col items-end gap-2 text-right">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0f4184]/10 text-[#0b3166] text-[10px] font-bold uppercase tracking-wider rounded-full border border-[#0f4184]/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0f4184] shadow-[0_0_8px_rgba(34,193,220,0.5)]" />
                                Partner
                            </span>
                            <button className="p-2 text-gray-300 hover:text-textPrimary transition-colors rounded-lg hover:bg-gray-50">
                                <MoreVertical size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1">
                        <h3 className="text-[17px] font-bold text-textPrimary leading-tight group-hover:text-primary transition-colors">{client.company}</h3>
                        <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-textSecondary mb-6">
                            <Briefcase size={12} className="text-primary" /> {client.industry}
                        </div>

                        <div className="space-y-4 pt-5 border-t border-gray-50">
                            <div>
                                <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mb-2.5">Point of Contact</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold border border-primary/20">
                                        {client.name.charAt(0)}
                                    </div>
                                    <p className="text-[13px] font-bold text-textPrimary">{client.name}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2.5 text-textSecondary text-[12px] font-medium">
                                    <Mail size={14} className="text-gray-400" /> {client.email}
                                </div>
                                <div className="flex items-center gap-2.5 text-textSecondary text-[12px] font-medium">
                                    <Phone size={14} className="text-gray-400" /> {client.phone}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between pt-5 border-t border-gray-100">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => <div key={i} className="w-8 h-8 rounded-lg border-2 border-white bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400">
                                +
                            </div>)}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary uppercase tracking-widest group-hover:gap-2.5 transition-all">
                            Details <ChevronRight size={16} />
                        </div>
                    </div>
                </motion.div>)}
            </div> : <div className="text-center py-24 flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5 border border-gray-100 shadow-inner">
                    <Users size={40} className="text-gray-200" />
                </div>
                <p className="font-bold text-textSecondary uppercase tracking-widest text-sm">No clients match your filter</p>
                <p className="text-xs text-textSecondary/60 mt-1 max-w-xs font-medium">Refine your search parameters or add a new client record to your database.</p>
            </div>}
        </div>

        <ClientDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            clientToEdit={clientToEdit}
        />
    </div>;
}
export {
    Clients as default
};
