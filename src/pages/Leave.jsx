// import { useState, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Plus, Check, X, MoreVertical, CalendarClock, Search } from "lucide-react";
// import { useAppContext } from "../hooks/useAppContext";
// import { toast } from "sonner";
// import { DropdownMenu, DropdownMenuItem } from "../components/ui/dropdown";
// const STATUS_COLORS = {
//     Approved: { bg: "bg-[#0f4184]/10", text: "text-[#0b3166]", dot: "bg-[#0f4184]" },
//     Pending: { bg: "bg-orange-100", text: "text-orange-600", dot: "bg-orange-500" },
//     Rejected: { bg: "bg-red-100", text: "text-red-600", dot: "bg-red-500" }
// };
// function getDays(start, end) {
//     return Math.max(1, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 864e5) + 1);
// }
// function Leave() {
//     const { leaves, addLeave, approveLeave, rejectLeave, currentUser, userRole, employees } = useAppContext();
//     const canApply = userRole !== "Admin";
//     const isHR = ["HR", "HR Head", "HR Accountant", "HR Recruiter"].includes(userRole);
//     const canApprove = userRole === "Admin" || isHR;
//     const isManager = userRole === "Manager";
//     const [isModalOpen, setModalOpen] = useState(false);
//     const [search, setSearch] = useState("");
//     const [statusFilter, setStatusFilter] = useState("All");
//     const [form, setForm] = useState({ type: "Sick Leave", startDate: "", endDate: "", reason: "" });
//     const [processingId, setProcessingId] = useState(null);
//     const baseLeaves = useMemo(() => {
//         let data = leaves;
//         if (userRole === "Employee") {
//             data = leaves.filter((l) => l.employeeId === currentUser?.uid);
//         } else if (isManager) {
//             const teamIds = employees.filter((e) => e.manager === currentUser?.name).map((e) => e.id);
//             data = leaves.filter((l) => teamIds.includes(l.employeeId));
//         }
//         return data;
//     }, [leaves, userRole, currentUser, employees]);

//     const visibleLeaves = useMemo(() => {
//         let data = baseLeaves;
//         if (statusFilter !== "All") data = data.filter((l) => l.status === statusFilter);
//         if (search) data = data.filter(
//             (l) => l.employeeName.toLowerCase().includes(search.toLowerCase()) || l.type.toLowerCase().includes(search.toLowerCase()) || l.reason.toLowerCase().includes(search.toLowerCase())
//         );
//         return data;
//     }, [baseLeaves, statusFilter, search]);
//     const dashboardTitle = userRole === "Employee" ? "My Leave Requests" : isManager ? "Team Leave Requests" : "All Leave Requests";
//     const handleSubmit = () => {
//         if (!form.startDate || !form.endDate || !form.reason.trim()) {
//             toast.error("Please fill in all fields");
//             return;
//         }
//         if (new Date(form.endDate) < new Date(form.startDate)) {
//             toast.error("End date cannot be before start date");
//             return;
//         }
//         addLeave({
//             employeeId: currentUser.uid,
//             employeeName: currentUser.name,
//             department: currentUser.department,
//             type: form.type,
//             startDate: form.startDate,
//             endDate: form.endDate,
//             reason: form.reason,
//             status: "Pending",
//             appliedOn: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
//         });
//         setModalOpen(false);
//         setForm({ type: "Sick Leave", startDate: "", endDate: "", reason: "" });
//         toast.success("Leave Applied!", { description: "Your request is pending approval from HR." });
//     };
//     const counts = {
//         All: baseLeaves.length,
//         Pending: baseLeaves.filter(l => l.status === "Pending").length,
//         Approved: baseLeaves.filter(l => l.status === "Approved").length,
//         Rejected: baseLeaves.filter(l => l.status === "Rejected").length
//     };
//     return <div className="space-y-5">
//         {
//             /* Header */
//         }
//         <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
//             <div>
//                 <div className="flex items-center gap-3 mb-1 text-primary">
//                     <CalendarClock size={24} className="shrink-0" />
//                     <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Leave Management</h1>
//                 </div>
//                 <p className="text-textSecondary text-sm font-medium">{dashboardTitle} ({counts.All})</p>
//             </div>
//             {canApply && (
//                 <button
//                     onClick={() => setModalOpen(true)}
//                     className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-bold bg-gradient-to-r from-[#0f4184] to-[#0b3166] hover:opacity-90 transition-all shadow-sm"
//                 >
//                     <Plus size={18} /> Apply Leave
//                 </button>
//             )}
//         </div>

//         {
//             /* Status filter tabs */
//         }
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
//             {["All", "Pending", "Approved", "Rejected"].map((s) => {
//                 const isActive = statusFilter === s;
//                 const colors = {
//                     All: "text-primary bg-primary/5 border-primary/20",
//                     Pending: "text-orange-600 bg-orange-50 border-orange-100",
//                     Approved: "text-[#0b3166] bg-[#0f4184]/10 border-[#0f4184]/20",
//                     Rejected: "text-red-600 bg-red-50 border-red-100"
//                 };
//                 return <button
//                     key={s}
//                     onClick={() => setStatusFilter(s)}
//                     className={`p-4 sm:p-6 rounded-xl border text-left transition-all relative overflow-hidden shadow-sm ${isActive ? colors[s] : "border-gray-100 bg-white hover:border-gray-200"}`}
//                 >
//                     <p className="text-2xl sm:text-3xl font-bold">{counts[s]}</p>
//                     <p className="text-xs font-bold uppercase tracking-wider mt-1 sm:mt-2 opacity-80">{s}</p>
//                 </button>;
//             })}
//         </div>

//         {
//             /* Search */
//         }
//         <div className="relative w-full sm:max-w-md group">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0f4184] transition-colors duration-300" size={18} />
//             <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search by name, type, or reason..."
//                 className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-10 text-[14px] sm:text-[15px] focus:bg-white focus:border-[#0f4184] focus:ring-[4px] focus:ring-[#0f4184]/10 outline-none transition-all duration-300 placeholder:text-gray-400 font-medium text-textPrimary shadow-sm hover:border-gray-300"
//             />
//             {search && (
//               <button
//                 onClick={() => setSearch("")}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
//               >
//                 <X size={16} />
//               </button>
//             )}
//         </div>

//         {
//             /* Table */
//         }
//         <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-nexi5">
//             <div className="overflow-x-auto custom-scrollbar">
//                 <table className="w-full text-sm whitespace-nowrap">
//                     <thead>
//                         <tr className="bg-gray-50 border-b border-gray-100">
//                             <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-left">Employee</th>
//                             <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-left">Leave Type</th>
//                             <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-left">Start</th>
//                             <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-left">End</th>
//                             <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-left">Days</th>
//                             <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-left">Reason</th>
//                             <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-left">Applied</th>
//                             <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-left">Status</th>
//                             {canApprove && <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-right">Actions</th>}
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100">
//                         {visibleLeaves.length === 0 && <tr>
//                             <td colSpan={9} className="py-16 text-center">
//                                 <CalendarClock size={36} className="mx-auto mb-3 text-slate-200 dark:text-slate-700" />
//                                 <p className="font-semibold text-slate-400">No leave requests found</p>
//                                 <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">Try adjusting your filters</p>
//                             </td>
//                         </tr>}
//                         {visibleLeaves.map((leave, i) => <motion.tr
//                             key={leave.id}
//                             initial={{ opacity: 0, y: 4 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: i * 0.03 }}
//                             className="hover:bg-[#F0F9FF] transition-colors"
//                         >
//                             <td className="px-6 py-4">
//                                 <div className="flex items-center gap-3">
//                                     <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0f4184] to-[#0b3166] text-white flex items-center justify-center text-sm font-bold shadow-sm">
//                                         {leave.employeeName.charAt(0)}
//                                     </div>
//                                     <div>
//                                         <p className="text-[13px] font-bold text-textPrimary">{leave.employeeName}</p>
//                                         <p className="text-[11px] text-textSecondary font-medium">{leave.department}</p>
//                                     </div>
//                                 </div>
//                             </td>
//                             <td className="px-6 py-4">
//                                 <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">{leave.type}</span>
//                             </td>
//                             <td className="px-6 py-4 text-textSecondary font-medium">{leave.startDate}</td>
//                             <td className="px-6 py-4 text-textSecondary font-medium">{leave.endDate}</td>
//                             <td className="px-6 py-4">
//                                 <span className="font-bold text-textPrimary">{getDays(leave.startDate, leave.endDate)}</span>
//                                 <span className="text-textSecondary text-xs ml-0.5">d</span>
//                             </td>
//                             <td className="px-6 py-4 max-w-[200px]">
//                                 <span className="text-textSecondary font-medium truncate block">{leave.reason}</span>
//                             </td>
//                             <td className="px-6 py-4 text-textSecondary text-xs font-medium">{leave.appliedOn}</td>
//                             <td className="px-6 py-4">
//                                 <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[leave.status].bg} ${STATUS_COLORS[leave.status].text}`}>
//                                     <span className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[leave.status].dot}`} />
//                                     {leave.status}
//                                 </span>
//                             </td>
//                             {canApprove && <td className="px-6 py-4 text-right">
//                                 {leave.status === "Pending" ? <DropdownMenu trigger={<button className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors">
//                                     <MoreVertical size={18} />
//                                 </button>}>
//                                     <DropdownMenuItem onClick={async () => {
//                                         setProcessingId(leave.id);
//                                         const result = await approveLeave(leave.id);
//                                         setProcessingId(null);
//                                         if (result?.success) {
//                                             toast.success("Leave Approved", { description: `${leave.employeeName}'s request approved.` });
//                                         } else {
//                                             toast.error("Failed to Approve", { description: result?.error || "Something went wrong." });
//                                         }
//                                     }} className="text-[#0b3166]">
//                                         <Check size={14} /> Approve
//                                     </DropdownMenuItem>
//                                     <DropdownMenuItem onClick={async () => {
//                                         setProcessingId(leave.id);
//                                         const result = await rejectLeave(leave.id);
//                                         setProcessingId(null);
//                                         if (result?.success) {
//                                             toast.success("Leave Rejected", { description: `${leave.employeeName}'s request rejected.` });
//                                         } else {
//                                             toast.error("Failed to Reject", { description: result?.error || "Something went wrong." });
//                                         }
//                                     }} destructive>
//                                         <X size={14} /> Reject
//                                     </DropdownMenuItem>
//                                 </DropdownMenu> : <span className="text-gray-300 text-xs italic px-2">—</span>}
//                             </td>}
//                         </motion.tr>)}
//                     </tbody>
//                 </table>
//             </div>
//         </div>

//         {
//             /* Apply Leave Modal */
//         }
//         <AnimatePresence>
//             {isModalOpen && <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
//                 <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     onClick={() => setModalOpen(false)}
//                     className="absolute inset-0 bg-slate-900/50 backdrop-blur-md"
//                 />
//                 <motion.div
//                     initial={{ opacity: 0, scale: 0.92, y: 24 }}
//                     animate={{ opacity: 1, scale: 1, y: 0 }}
//                     exit={{ opacity: 0, scale: 0.92, y: 24 }}
//                     transition={{ type: "spring", stiffness: 300, damping: 28 }}
//                     className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]"
//                 >
//                     <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
//                         <div>
//                             <h2 className="text-xl font-bold text-textPrimary">Apply for Leave</h2>
//                             <p className="text-xs text-textSecondary mt-1 font-medium">Request will be sent to HR for approval</p>
//                         </div>
//                         <button onClick={() => setModalOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-all">
//                             <X size={20} />
//                         </button>
//                     </div>
//                     <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
//                         <div className="space-y-2">
//                             <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Leave Type</label>
//                             <select
//                                 value={form.type}
//                                 onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
//                                 className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-textPrimary"
//                             >
//                                 {["Sick Leave", "Casual Leave", "Paid Leave", "Work From Home"].map((t) => <option key={t}>{t}</option>)}
//                             </select>
//                         </div>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                             <div className="space-y-2">
//                                 <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Start Date *</label>
//                                 <input type="date" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-textPrimary" />
//                             </div>
//                             <div className="space-y-2">
//                                 <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">End Date *</label>
//                                 <input type="date" value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-textPrimary" />
//                             </div>
//                         </div>
//                         {form.startDate && form.endDate && new Date(form.endDate) >= new Date(form.startDate) && <div className="flex items-center gap-2 px-4 py-3 bg-primary/5 border border-primary/10 rounded-xl text-sm text-primary font-bold">
//                             <CalendarClock size={16} /> {getDays(form.startDate, form.endDate)} day(s) requested
//                         </div>}
//                         <div className="space-y-2">
//                             <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Reason *</label>
//                             <textarea
//                                 rows={4}
//                                 value={form.reason}
//                                 onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
//                                 placeholder="Please provide a reason for your leave..."
//                                 className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-textPrimary resize-none"
//                             />
//                         </div>
//                     </div>
//                     <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
//                         <button onClick={() => setModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-textSecondary hover:bg-gray-100 rounded-lg transition-all">
//                             Cancel
//                         </button>
//                         <button
//                             onClick={handleSubmit}
//                             className="px-8 py-2.5 text-sm font-bold text-white rounded-lg shadow-sm bg-gradient-to-r from-[#0f4184] to-[#0b3166] hover:opacity-90 transition-all"
//                         >
//                             Submit Request
//                         </button>
//                     </div>
//                 </motion.div>
//             </div>}
//         </AnimatePresence>
//     </div>;
// }
// export {
//     Leave as default
// };


import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, X, MoreVertical, CalendarClock, Search } from "lucide-react";
import { useAppContext } from "../hooks/useAppContext";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuItem } from "../components/ui/dropdown";
const STATUS_COLORS = {
    Approved: { bg: "bg-[#0f4184]/10", text: "text-[#0b3166]", dot: "bg-[#0f4184]" },
    Pending: { bg: "bg-orange-100", text: "text-orange-600", dot: "bg-orange-500" },
    Rejected: { bg: "bg-red-100", text: "text-red-600", dot: "bg-red-500" }
};
function getDays(start, end) {
    return Math.max(1, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 864e5) + 1);
}
function Leave() {
    const { leaves, addLeave, approveLeave, rejectLeave, currentUser, userRole, employees } = useAppContext();
    const canApply = userRole !== "Admin";
    const isHR = ["HR", "HR Head", "HR Accountant", "HR Recruiter"].includes(userRole);
    const canApprove = userRole === "Admin" || isHR;
    const isManager = userRole === "Manager";
    const [isModalOpen, setModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [form, setForm] = useState({ type: "Sick Leave", startDate: "", endDate: "", reason: "" });
    const [processingId, setProcessingId] = useState(null);
    const baseLeaves = useMemo(() => {
        let data = leaves;
        if (userRole === "Employee") {
            data = leaves.filter((l) => l.employeeId === currentUser?.uid);
        } else if (isManager) {
            const teamIds = employees.filter((e) => e.manager === currentUser?.name).map((e) => e.id);
            data = leaves.filter((l) => teamIds.includes(l.employeeId));
        }
        return data;
    }, [leaves, userRole, currentUser, employees]);

    const visibleLeaves = useMemo(() => {
        let data = baseLeaves;
        if (statusFilter !== "All") data = data.filter((l) => l.status === statusFilter);
        if (search) data = data.filter(
            (l) => (l.employeeName || "").toLowerCase().includes(search.toLowerCase()) || 
                   (l.type || "").toLowerCase().includes(search.toLowerCase()) || 
                   (l.reason || "").toLowerCase().includes(search.toLowerCase())
        );
        return data;
    }, [baseLeaves, statusFilter, search]);
    const dashboardTitle = userRole === "Employee" ? "My Leave Requests" : isManager ? "Team Leave Requests" : "All Leave Requests";
    const handleSubmit = () => {
        if (!form.startDate || !form.endDate || !form.reason.trim()) {
            toast.error("Please fill in all fields");
            return;
        }
        if (new Date(form.endDate) < new Date(form.startDate)) {
            toast.error("End date cannot be before start date");
            return;
        }
        addLeave({
            employeeId: currentUser.uid,
            employeeName: currentUser.name,
            department: currentUser.department,
            type: form.type,
            startDate: form.startDate,
            endDate: form.endDate,
            reason: form.reason,
            status: "Pending",
            appliedOn: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
        });
        setModalOpen(false);
        setForm({ type: "Sick Leave", startDate: "", endDate: "", reason: "" });
        toast.success("Leave Applied!", { description: "Your request is pending approval from HR." });
    };
    const counts = {
        All: baseLeaves.length,
        Pending: baseLeaves.filter(l => l.status === "Pending").length,
        Approved: baseLeaves.filter(l => l.status === "Approved").length,
        Rejected: baseLeaves.filter(l => l.status === "Rejected").length
    };
    return <div className="space-y-5">
        {
            /* Header */
        }
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
                <div className="flex items-center gap-3 mb-1 text-primary">
                    <CalendarClock size={24} className="shrink-0" />
                    <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Leave Management</h1>
                </div>
                <p className="text-textSecondary text-sm font-medium">{dashboardTitle} ({counts.All})</p>
            </div>
            {canApply && (
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-bold bg-gradient-to-r from-[#0f4184] to-[#0b3166] hover:opacity-90 transition-all shadow-sm"
                >
                    <Plus size={18} /> Apply Leave
                </button>
            )}
        </div>

        {
            /* Status filter tabs */
        }
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
            {["All", "Pending", "Approved", "Rejected"].map((s) => {
                const isActive = statusFilter === s;
                const colors = {
                    All: "text-primary bg-primary/5 border-primary/20",
                    Pending: "text-orange-600 bg-orange-50 border-orange-100",
                    Approved: "text-[#0b3166] bg-[#0f4184]/10 border-[#0f4184]/20",
                    Rejected: "text-red-600 bg-red-50 border-red-100"
                };
                return <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`p-4 sm:p-6 rounded-xl border text-left transition-all relative overflow-hidden shadow-sm ${isActive ? colors[s] : "border-gray-100 bg-white hover:border-gray-200"}`}
                >
                    <p className="text-2xl sm:text-3xl font-bold">{counts[s]}</p>
                    <p className="text-xs font-bold uppercase tracking-wider mt-1 sm:mt-2 opacity-80">{s}</p>
                </button>;
            })}
        </div>

        {
            /* Search */
        }
        <div className="relative w-full sm:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0f4184] transition-colors duration-300" size={18} />
            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, type, or reason..."
                className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-10 text-[14px] sm:text-[15px] focus:bg-white focus:border-[#0f4184] focus:ring-[4px] focus:ring-[#0f4184]/10 outline-none transition-all duration-300 placeholder:text-gray-400 font-medium text-textPrimary shadow-sm hover:border-gray-300"
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

        {
            /* Table */
        }
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-nexi5">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm whitespace-nowrap">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-left">Employee</th>
                            <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-left">Leave Type</th>
                            <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-left">Start</th>
                            <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-left">End</th>
                            <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-left">Days</th>
                            <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-left">Reason</th>
                            <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-left">Applied</th>
                            <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-left">Status</th>
                            {canApprove && <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {visibleLeaves.length === 0 && <tr>
                            <td colSpan={9} className="py-16 text-center">
                                <CalendarClock size={36} className="mx-auto mb-3 text-slate-200 dark:text-slate-700" />
                                <p className="font-semibold text-slate-400">No leave requests found</p>
                                <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">Try adjusting your filters</p>
                            </td>
                        </tr>}
                        {visibleLeaves.map((leave, i) => <motion.tr
                            key={leave.id}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="hover:bg-[#F0F9FF] transition-colors"
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0f4184] to-[#0b3166] text-white flex items-center justify-center text-sm font-bold shadow-sm">
                                        {String(leave?.employeeName || "Unknown").charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-bold text-textPrimary">{leave.employeeName || "Unknown Employee"}</p>
                                        <p className="text-[11px] text-textSecondary font-medium">{leave.department || "No Department"}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">{leave.type || "Sick Leave"}</span>
                            </td>
                            <td className="px-6 py-4 text-textSecondary font-medium">{leave.startDate}</td>
                            <td className="px-6 py-4 text-textSecondary font-medium">{leave.endDate}</td>
                            <td className="px-6 py-4">
                                <span className="font-bold text-textPrimary">{getDays(leave.startDate, leave.endDate)}</span>
                                <span className="text-textSecondary text-xs ml-0.5">d</span>
                            </td>
                            <td className="px-6 py-4 max-w-[200px]">
                                <span className="text-textSecondary font-medium truncate block">{leave.reason}</span>
                            </td>
                            <td className="px-6 py-4 text-textSecondary text-xs font-medium">{leave.appliedOn}</td>
                            <td className="px-6 py-4">
                                {(() => {
                                    const statusVal = leave.status ? (leave.status.charAt(0).toUpperCase() + leave.status.slice(1).toLowerCase()) : "Pending";
                                    const colors = STATUS_COLORS[statusVal] || STATUS_COLORS.Pending;
                                    return (
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                                            {statusVal}
                                        </span>
                                    );
                                })()}
                            </td>
                            {canApprove && <td className="px-6 py-4 text-right">
                                {leave.status === "Pending" ? <DropdownMenu trigger={<button className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors">
                                    <MoreVertical size={18} />
                                </button>}>
                                    <DropdownMenuItem onClick={async () => {
                                        setProcessingId(leave.id);
                                        const result = await approveLeave(leave.id);
                                        setProcessingId(null);
                                        if (result?.success) {
                                            toast.success("Leave Approved", { description: `${leave.employeeName}'s request approved.` });
                                        } else {
                                            toast.error("Failed to Approve", { description: result?.error || "Something went wrong." });
                                        }
                                    }} className="text-[#0b3166]">
                                        <Check size={14} /> Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={async () => {
                                        setProcessingId(leave.id);
                                        const result = await rejectLeave(leave.id);
                                        setProcessingId(null);
                                        if (result?.success) {
                                            toast.success("Leave Rejected", { description: `${leave.employeeName}'s request rejected.` });
                                        } else {
                                            toast.error("Failed to Reject", { description: result?.error || "Something went wrong." });
                                        }
                                    }} destructive>
                                        <X size={14} /> Reject
                                    </DropdownMenuItem>
                                </DropdownMenu> : <span className="text-gray-300 text-xs italic px-2">—</span>}
                            </td>}
                        </motion.tr>)}
                    </tbody>
                </table>
            </div>
        </div>

        {
            /* Apply Leave Modal */
        }
        <AnimatePresence>
            {isModalOpen && <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setModalOpen(false)}
                    className="absolute inset-0 bg-slate-900/50 backdrop-blur-md"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 24 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div>
                            <h2 className="text-xl font-bold text-textPrimary">Apply for Leave</h2>
                            <p className="text-xs text-textSecondary mt-1 font-medium">Request will be sent to HR for approval</p>
                        </div>
                        <button onClick={() => setModalOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-all">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Leave Type</label>
                            <select
                                value={form.type}
                                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                                className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-textPrimary"
                            >
                                {["Sick Leave", "Casual Leave", "Paid Leave", "Work From Home"].map((t) => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Start Date *</label>
                                <input type="date" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-textPrimary" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">End Date *</label>
                                <input type="date" value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-textPrimary" />
                            </div>
                        </div>
                        {form.startDate && form.endDate && new Date(form.endDate) >= new Date(form.startDate) && <div className="flex items-center gap-2 px-4 py-3 bg-primary/5 border border-primary/10 rounded-xl text-sm text-primary font-bold">
                            <CalendarClock size={16} /> {getDays(form.startDate, form.endDate)} day(s) requested
                        </div>}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Reason *</label>
                            <textarea
                                rows={4}
                                value={form.reason}
                                onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
                                placeholder="Please provide a reason for your leave..."
                                className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-textPrimary resize-none"
                            />
                        </div>
                    </div>
                    <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                        <button onClick={() => setModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-textSecondary hover:bg-gray-100 rounded-lg transition-all">
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-8 py-2.5 text-sm font-bold text-white rounded-lg shadow-sm bg-gradient-to-r from-[#0f4184] to-[#0b3166] hover:opacity-90 transition-all"
                        >
                            Submit Request
                        </button>
                    </div>
                </motion.div>
            </div>}
        </AnimatePresence>
    </div>;
}
export {
    Leave as default
};