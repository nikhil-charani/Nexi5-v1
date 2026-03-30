import { useState } from "react";
import { Download, CalendarDays, Clock, CheckCircle2, MoreVertical, LogIn, LogOut, TrendingUp } from "lucide-react";
import { useAppContext } from "../hooks/useAppContext";
import { motion } from "framer-motion";
import { DropdownMenu, DropdownMenuItem } from "../components/ui/dropdown";
import { toast } from "sonner";
const historyData = [
    { date: "Mon, Nov 4", checkIn: "09:05 AM", checkOut: "06:18 PM", hours: "9h 13m", status: "Present" },
    { date: "Tue, Nov 5", checkIn: "09:42 AM", checkOut: "06:00 PM", hours: "8h 18m", status: "Present" },
    { date: "Wed, Nov 6", checkIn: "\u2014", checkOut: "\u2014", hours: "0h", status: "On Leave" },
    { date: "Thu, Nov 7", checkIn: "09:00 AM", checkOut: "07:05 PM", hours: "10h 5m", status: "Present" },
    { date: "Fri, Nov 8", checkIn: "10:30 AM", checkOut: "02:00 PM", hours: "3h 30m", status: "Half Day" },
    { date: "Mon, Nov 11", checkIn: "08:55 AM", checkOut: "06:05 PM", hours: "9h 10m", status: "Present" }
];
const STATUS_CLASS = {
    Present: "bg-[#0f4184]/10 text-[#0b3166]",
    "On Leave": "bg-orange-100 text-orange-600",
    "Half Day": "bg-blue-100 text-blue-600",
    Absent: "bg-red-100 text-red-600"
};
const STATUS_DOT = {
    Present: "bg-[#0f4184]",
    "On Leave": "bg-orange-500",
    "Half Day": "bg-blue-500",
    Absent: "bg-red-500"
};
function Attendance() {
    const { isCheckedIn, checkIn, checkOut, userRole } = useAppContext();
    const [exporting, setExporting] = useState(false);
    const isAdminOrHR = ["Admin", "HR", "HR Head", "HR Accountant", "HR Recruiter"].includes(userRole);
    const handleCheckInToggle = () => {
        if (isCheckedIn) {
            checkOut();
            toast.success("Checked Out", { description: `Session ended at ${new Date().toLocaleTimeString()}` });
        } else {
            checkIn();
            toast.success("Checked In", { description: `Session started at ${new Date().toLocaleTimeString()}` });
        }
    };
    const handleExport = async () => {
        setExporting(true);
        await new Promise((r) => setTimeout(r, 1200));
        setExporting(false);
        toast.success("Timesheet exported!", { description: "Downloaded as CSV." });
    };
    return <div className="space-y-5">
        {
            /* Header */
        }
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
                <div className="flex items-center gap-3 mb-1 text-primary">
                    <CheckCircle2 size={24} className="shrink-0" />
                    <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Attendance</h1>
                </div>
                <p className="text-textSecondary text-sm font-medium">
                    {isAdminOrHR ? "Monitor team attendance, timesheets, and daily logs." : "Track your daily check-in, check-out, and working hours."}
                </p>
            </div>
            <button
                onClick={handleExport}
                disabled={exporting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-textPrimary hover:bg-gray-50 text-sm font-bold transition-all shadow-sm disabled:opacity-50"
            >
                <Download size={18} className={exporting ? "animate-bounce" : ""} />
                {exporting ? "Exporting..." : "Export Timesheet"}
            </button>
        </div>

        {
            /* Stats */
        }
        {isAdminOrHR ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { label: "Present Today", value: "165", icon: CheckCircle2, color: "text-[#0b3166] bg-[#0f4184]/10" },
                { label: "On Leave", value: "15", icon: CalendarDays, color: "text-orange-500 bg-orange-50" },
                { label: "Avg Check-in", value: "09:12 AM", icon: Clock, color: "text-blue-500 bg-blue-50" },
                { label: "Avg Hours/Day", value: "8h 24m", icon: TrendingUp, color: "text-purple-500 bg-purple-50" }
            ].map((stat, i) => <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-white p-6 rounded-xl border border-gray-100 flex items-center gap-4 cursor-default shadow-sm hover:border-gray-200 transition-all"
            >
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center shrink-0 shadow-sm`}>
                    <stat.icon size={22} />
                </div>
                <div>
                    <p className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">{stat.label}</p>
                    <p className="text-2xl font-bold text-textPrimary mt-0.5">{stat.value}</p>
                </div>
            </motion.div>)}
        </div> : <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {
                /* Check-in card */
            }
            <div className="bg-gradient-to-br from-[#0b3166] to-[#0F172A] rounded-2xl p-6 relative overflow-hidden border border-[#0b3166]/20 flex items-center gap-6 shadow-xl group">
                <div className={`absolute inset-0 opacity-30 bg-gradient-to-br ${isCheckedIn ? "from-red-500 to-transparent" : "from-primary to-transparent"} blur-3xl`} />
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCheckInToggle}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg z-10 relative transition-colors ${isCheckedIn ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primaryDark"}`}
                >
                    {isCheckedIn ? <LogOut size={28} /> : <LogIn size={28} />}
                    {isCheckedIn && <motion.div
                        initial={{ opacity: 0.6, scale: 1 }}
                        animate={{ opacity: 0, scale: 1.8 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 rounded-2xl border-4 border-red-400/50"
                    />}
                </motion.button>
                <div className="z-10 relative">
                    <p className={`text-base font-bold tracking-tight ${isCheckedIn ? "text-red-400" : "text-white"}`}>
                        {isCheckedIn ? "Currently Clocked In" : "Ready to Start?"}
                    </p>
                    <button
                        onClick={handleCheckInToggle}
                        className={`mt-2 text-xs font-bold px-4 py-1.5 rounded-lg transition-all shadow-sm ${isCheckedIn ? "bg-red-500/20 text-red-200 hover:bg-red-500/30 border border-red-500/30" : "bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30"}`}
                    >
                        {isCheckedIn ? "Check Out Now" : "Check In Now"}
                    </button>
                </div>
            </div>
            {[
                { label: "Days Present", value: "18 / 22", icon: CheckCircle2, color: "text-[#0b3166] bg-[#0f4184]/10" },
                { label: "Avg Hours/Day", value: "8h 15m", icon: Clock, color: "text-blue-500 bg-blue-50" }
            ].map((stat, i) => <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm"
            >
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center shrink-0 shadow-sm`}>
                    <stat.icon size={22} />
                </div>
                <div>
                    <p className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">{stat.label}</p>
                    <p className="text-2xl font-bold text-textPrimary mt-0.5">{stat.value}</p>
                </div>
            </div>)}
        </div>}

        {
            /* Attendance History Table */
        }
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-textPrimary text-[15px]">Attendance History</h3>
                    <p className="text-xs text-textSecondary mt-1 font-medium">{isAdminOrHR ? "Team records for this month" : "Your personal check-in/out log"}</p>
                </div>
                <DropdownMenu trigger={<button className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><MoreVertical size={18} className="text-gray-400" /></button>}>
                    <DropdownMenuItem onClick={handleExport}>Export as CSV</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info("Monthly summary coming soon!")}>Monthly Summary</DropdownMenuItem>
                </DropdownMenu>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm whitespace-nowrap">
                    <thead>
                        <tr className="bg-gray-50/80 border-b border-gray-100">
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Check In</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Check Out</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Total Hours</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {historyData.map((row, i) => <motion.tr
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="hover:bg-[#F0F9FF] transition-colors"
                        >
                            <td className="px-6 py-4 font-bold text-textPrimary">{row.date}</td>
                            <td className="px-6 py-4 text-textSecondary font-medium">{row.checkIn}</td>
                            <td className="px-6 py-4 text-textSecondary font-medium">{row.checkOut}</td>
                            <td className="px-6 py-4 font-bold text-primary">{row.hours}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${STATUS_CLASS[row.status] || ""}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[row.status] || "bg-gray-400"}`} />
                                    {row.status}
                                </span>
                            </td>
                        </motion.tr>)}
                    </tbody>
                </table>
            </div>
        </div>
    </div>;
}
export default Attendance;
