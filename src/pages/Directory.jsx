import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Mail, Building, Briefcase, UserCircle, Globe, Users, TrendingUp, ChevronRight, Phone, MapPin, MoreVertical, Clock, CheckCircle2, Filter, X } from "lucide-react";
import { useAppContext } from "../hooks/useAppContext";
import { getInitials } from "../lib/stringUtils";
import { useNavigate } from "react-router-dom";
const DEPARTMENTS = ["All", "Engineering", "Marketing", "HR", "Finance", "Operations"];
const STATUS_CONFIG = {
    Active: { bg: "bg-emerald-100", text: "text-emerald-600", dot: "bg-emerald-500" },
    "On Leave": { bg: "bg-orange-100", text: "text-orange-600", dot: "bg-orange-500" },
    Suspended: { bg: "bg-red-100", text: "text-red-600", dot: "bg-red-500" }
};
function Directory() {
    const { employees } = useAppContext();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [dept, setDept] = useState("All");
    const filtered = (employees || []).filter((emp) => {
        if (!emp) return false;
        const term = search.toLowerCase();
        const nameMatch = (emp.name || "").toLowerCase().includes(term);
        const designMatch = (emp.designation || "").toLowerCase().includes(term);
        const matchSearch = nameMatch || designMatch;
        const matchDept = dept === "All" || emp.department === dept;
        return matchSearch && matchDept;
    });
    return <div className="space-y-5 h-full flex flex-col">
        {
            /* Header */
        }
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
                <div className="flex items-center gap-3 mb-1 text-primary">
                    <Users size={24} className="shrink-0" />
                    <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Employee Directory</h1>
                </div>
                <p className="text-textSecondary text-sm font-medium">Explore and connect with team members across the organization.</p>
            </div>
            <div className="flex items-center gap-6 bg-white p-3 px-5 rounded-xl border border-gray-100 shadow-sm">
                <div className="text-right">
                    <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest leading-none">Total Force</p>
                    <p className="text-2xl font-bold text-primary leading-tight mt-1.5">{employees.length}</p>
                </div>
                <div className="w-[1px] h-10 bg-gray-100" />
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 cursor-pointer shadow-sm transition-all"
                >
                    <Globe size={20} />
                </motion.div>
            </div>
        </div>

        {
            /* Stats Summary */
        }
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
                { label: "Engineering", value: employees.filter((e) => e.department === "Engineering").length, icon: Briefcase, color: "text-[#0f4184] bg-[#0f4184]/10" },
                { label: "Marketing", value: employees.filter((e) => e.department === "Marketing").length, icon: TrendingUp, color: "text-orange-500 bg-orange-50" },
                { label: "Active Now", value: employees.filter((e) => e.status === "Active").length, icon: CheckCircle2, color: "text-emerald-500 bg-emerald-50" },
                { label: "On Leave", value: employees.filter((e) => e.status === "On Leave").length, icon: Clock, color: "text-blue-500 bg-blue-50" }
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
            /* Advanced Filters */
        }
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0f4184] transition-colors duration-300" size={18} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, role or expertise..."
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-3 pl-12 pr-10 text-[14px] sm:text-[15px] focus:bg-white focus:border-[#0f4184] focus:ring-[4px] focus:ring-[#0f4184]/10 outline-none transition-all duration-300 placeholder:text-gray-400 font-medium text-textPrimary shadow-sm hover:border-gray-300"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl text-textSecondary border border-gray-100">
                        <Filter size={16} className="text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Filter By</span>
                    </div>
                    {DEPARTMENTS.slice(0, 4).map((d) => <button
                        key={d}
                        onClick={() => setDept(d)}
                        className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all border ${dept === d ? "bg-primary text-white border-primary shadow-md shadow-primary/20" : "bg-white text-textSecondary border-gray-200 hover:border-primary/30 hover:text-textPrimary"}`}
                    >
                        {d}
                    </button>)}
                    <select
                        value={dept}
                        onChange={(e) => setDept(e.target.value)}
                        className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-textPrimary outline-none focus:border-primary transition-all min-w-[140px]"
                    >
                        <option value="All">More Departments</option>
                        {DEPARTMENTS.slice(4).map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
            </div>
        </div>

        {
            /* Cards Grid */
        }
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((emp, i) => {
                    const status = STATUS_CONFIG[emp.status] || STATUS_CONFIG.Active;
                    return <motion.div
                        key={emp.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => navigate(`/dashboard/employees/${emp.id}`)}
                        className="bg-white rounded-[24px] p-6 border border-gray-100 cursor-pointer group relative overflow-hidden h-full flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform origin-left`} />

                        <div className="flex flex-col items-center text-center relative mb-6">
                            <div className="relative mb-4">
                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-125 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0f4184] to-primary flex items-center justify-center text-white text-xl font-bold border-2 border-white shadow-lg relative z-10 transition-transform group-hover:scale-105 uppercase tracking-tighter">
                                    {getInitials(emp.name)}
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white z-20 ${status.dot} ${emp.status === "Active" ? "shadow-[0_0_8px_rgba(16,185,129,0.5)]" : ""}`} />
                            </div>

                            <h3 className="font-bold text-textPrimary text-[16px] group-hover:text-primary transition-colors leading-tight">{emp.name}</h3>
                            <p className="text-[11px] font-bold text-textSecondary uppercase tracking-widest mt-1.5">{emp.designation}</p>

                            <span className={`mt-4 px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm border ${status.bg} ${status.text}`}>
                                {emp.status}
                            </span>
                        </div>

                        <div className="mt-auto space-y-4 pt-6 border-t border-gray-50 w-full">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[11px] font-bold text-textSecondary group-hover:text-textPrimary transition-colors">
                                    <Building size={12} className="text-primary" />
                                    {emp.department}
                                </div>
                                <div className="flex items-center gap-2 text-[11px] font-bold text-textSecondary group-hover:text-textPrimary transition-colors">
                                    <MapPin size={12} className="text-primary" />
                                    HQ Office
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 pt-1">
                                <div className="flex items-center gap-2.5 text-[12px] font-medium text-textSecondary group-hover:text-textPrimary transition-colors">
                                    <Mail size={14} className="shrink-0 text-gray-400" />
                                    <span className="truncate">{(emp.id || emp.uid || "user")?.toLowerCase()}@nexi5.com</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-[12px] font-medium text-textSecondary group-hover:text-textPrimary transition-colors">
                                    <Phone size={14} className="shrink-0 text-gray-400" />
                                    <span className="truncate">+91 9876 543 210</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between pt-5 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                            <div className="flex gap-2">
                                <button className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 transition-all"><Mail size={16} /></button>
                                <button className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 transition-all"><Phone size={16} /></button>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary uppercase tracking-widest group-hover:gap-2.5 transition-all">
                                View Profile <ChevronRight size={16} />
                            </div>
                        </div>

                        <button className="absolute top-4 right-4 p-2 text-gray-300 hover:text-textPrimary transition-colors hover:bg-gray-50 rounded-lg">
                            <MoreVertical size={18} />
                        </button>
                    </motion.div>;
                })}
            </div>


            {filtered.length === 0 && <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-inner">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
                    <Users size={40} className="text-gray-200" />
                </div>
                <p className="font-bold text-textSecondary uppercase tracking-widest text-sm">No employees match your search</p>
                <p className="text-xs text-textSecondary/60 mt-2 max-w-xs text-center font-medium">Try adjusting your filters or department selection to find the right team member.</p>
            </div>}
        </div>
    </div>;
}
export {
    Directory as default
};
