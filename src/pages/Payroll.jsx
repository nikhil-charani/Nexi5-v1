import { useState } from "react";
import { IndianRupee, Download, CreditCard, Award, PlayCircle, Loader2, Banknote } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAppContext } from "../hooks/useAppContext";
const formatINR = (amount) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
function Payroll() {
    const { employees } = useAppContext();
    const [running, setRunning] = useState(false);
    const [downloading, setDownloading] = useState(null);
    const getEmployee = (id) => employees.find((e) => e.id === id);
    const handleRunPayroll = async () => {
        setRunning(true);
        await new Promise((r) => setTimeout(r, 1500));
        setRunning(false);
        toast.success("Payroll processed!", { description: "All salaries for the current cycle have been disbursed." });
    };
    const handleDownloadPayslip = async (id, empId) => {
        setDownloading(id);
        await new Promise((r) => setTimeout(r, 800));
        setDownloading(null);
        const emp = getEmployee(empId);
        toast.success("Payslip ready!", { description: `Payslip for ${emp?.name || empId} downloaded.` });
    };
    const currentPayrollData = employees.map((emp) => {
        const basic = emp.basicSalary || 0;
        const allow = emp.allowances || 0;
        const ded = emp.deductions || 0;
        return {
            id: `PR-${(/* @__PURE__ */ new Date()).getFullYear()}-${(/* @__PURE__ */ new Date()).getMonth() + 1}-${emp.id}`,
            employeeId: emp.id,
            month: "October 2024",
            basicSalary: basic,
            allowances: allow,
            deductions: ded,
            netSalary: basic + allow - ded,
            status: "Paid"
        };
    }).filter((p) => p.basicSalary > 0);
    const totalPayout = currentPayrollData.reduce((s, p) => s + p.netSalary, 0);
    const totalDeductions = currentPayrollData.reduce((s, p) => s + p.deductions, 0);
    return <div className="space-y-5">
        {
            /* Header */
        }
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
                <div className="flex items-center gap-3 mb-1 text-primary">
                    <Banknote size={24} className="shrink-0" />
                    <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Payroll Management</h1>
                </div>
                <p className="text-textSecondary text-sm font-medium">Manage salaries, payslips, and compensation (INR).</p>
            </div>
            <button
                onClick={handleRunPayroll}
                disabled={running}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold shadow-sm disabled:opacity-70 bg-gradient-to-r from-[#0f4184] to-[#0b3166] hover:opacity-90 transition-all"
            >
                {running ? <Loader2 size={18} className="animate-spin" /> : <PlayCircle size={18} />}
                {running ? "Processing Payroll..." : "Run Payroll"}
            </button>
        </div>

        {
            /* Summary Cards */
        }
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
                { label: "Processing Month", value: "October 2024", icon: IndianRupee, gradient: "from-[#0f4184] to-[#0b3166]" },
                { label: "Total Payout", value: formatINR(totalPayout), icon: CreditCard, gradient: "from-blue-500 to-indigo-600" },
                { label: "TDS + PF Deductions", value: formatINR(totalDeductions), icon: Award, gradient: "from-orange-400 to-rose-500" }
            ].map((card, i) => <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 flex gap-5 items-center shadow-sm hover:shadow-md transition-all"
            >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                    <card.icon size={24} className="text-white" />
                </div>
                <div>
                    <p className="text-[11px] font-bold text-textSecondary uppercase tracking-widest leading-none">{card.label}</p>
                    <h3 className="text-xl font-bold text-textPrimary mt-2 leading-none">{card.value}</h3>
                </div>
            </motion.div>)}
        </div>

        {
            /* Payroll Table */
        }
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                <div>
                    <h3 className="font-bold text-textPrimary text-sm">October 2024 — Salary Register</h3>
                    <p className="text-[11px] text-textSecondary mt-1 font-medium">All amounts in Indian Rupees (₹)</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-primary px-3 py-1 bg-primary/5 rounded-full border border-primary/10 uppercase tracking-widest">
                    <Award size={12} /> FY 2024-25
                </div>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-textSecondary uppercase tracking-widest border-b border-gray-100">Employee</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-textSecondary uppercase tracking-widest border-b border-gray-100">Month</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-textSecondary uppercase tracking-widest border-b border-gray-100">Basic (₹)</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-textSecondary uppercase tracking-widest border-b border-gray-100">Allowances (₹)</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-textSecondary uppercase tracking-widest border-b border-gray-100">TDS + PF (₹)</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-textSecondary uppercase tracking-widest border-b border-gray-100">Net Salary (₹)</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-textSecondary uppercase tracking-widest border-b border-gray-100">Status</th>
                            <th className="px-6 py-4 text-right text-[10px] font-bold text-textSecondary uppercase tracking-widest border-b border-gray-100">Payslip</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {currentPayrollData.map((pr, i) => {
                            const emp = getEmployee(pr.employeeId);
                            return <motion.tr
                                key={pr.id}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.04 * i }}
                                className="bg-white dark:bg-slate-900 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 border border-primary/10 group-hover:scale-110 transition-transform">
                                            {emp?.name?.charAt(0) || pr.employeeId.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[14px] text-textPrimary leading-none">{emp?.name || pr.employeeId}</p>
                                            <p className="text-[10px] text-textSecondary font-medium mt-1.5 uppercase tracking-wider leading-none">{pr.employeeId}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-textSecondary font-medium leading-none">{pr.month}</td>
                                <td className="px-6 py-4 whitespace-nowrap font-bold text-textPrimary leading-none">{formatINR(pr.basicSalary)}</td>
                                <td className="px-6 py-4 whitespace-nowrap font-bold text-emerald-600 leading-none">+{formatINR(pr.allowances)}</td>
                                <td className="px-6 py-4 whitespace-nowrap font-bold text-rose-600 leading-none">-{formatINR(pr.deductions)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="font-black text-textPrimary text-[15px] leading-none">{formatINR(pr.netSalary)}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-sm border border-black/5 ${pr.status === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${pr.status === "Paid" ? "bg-emerald-500" : "bg-orange-500"}`} />
                                        {pr.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <button
                                        onClick={() => handleDownloadPayslip(pr.id, pr.employeeId)}
                                        disabled={downloading === pr.id}
                                        className="inline-flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-primary hover:bg-primary/5 rounded-xl transition-all border border-transparent hover:border-primary/10 disabled:opacity-50"
                                    >
                                        {downloading === pr.id ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                                        Payslip
                                    </button>
                                </td>
                            </motion.tr>;
                        })}
                        {currentPayrollData.length === 0 && <tr>
                            <td colSpan={8} className="py-24 text-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
                                    <Banknote size={40} className="text-gray-200" />
                                </div>
                                <p className="font-bold text-textSecondary uppercase tracking-widest text-sm">No payroll data available</p>
                                <p className="text-xs text-textSecondary/60 mt-2 font-medium max-w-xs mx-auto leading-relaxed">Assign Basic Salary in employee profiles to generate the monthly payroll register.</p>
                            </td>
                        </tr>}
                    </tbody>
                </table>
            </div>
        </div>
    </div>;
}
export {
    Payroll as default
};
