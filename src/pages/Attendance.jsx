import { useState, useEffect, useMemo } from "react";
import { Download, CalendarDays, Clock, CheckCircle2, MoreVertical, LogIn, LogOut, TrendingUp, AlertCircle, Timer, User, Zap } from "lucide-react";
import { useAppContext } from "../hooks/useAppContext";
import { motion, AnimatePresence } from "framer-motion";
import { DropdownMenu, DropdownMenuItem } from "../components/ui/dropdown";
import { toast } from "sonner";

const STATUS_CLASS = {
    Present: "bg-blue-50 text-blue-700 border-blue-100",
    "On Leave": "bg-orange-50 text-orange-700 border-orange-100",
    "Half Day": "bg-sky-50 text-sky-700 border-sky-100",
    Absent: "bg-red-50 text-red-700 border-red-100"
};

const STATUS_DOT = {
    Present: "bg-blue-500",
    "On Leave": "bg-orange-500",
    "Half Day": "bg-sky-500",
    Absent: "bg-red-500"
};

function Attendance() {
    const { isCheckedIn, checkInTime, checkIn, checkOut, userRole, attendance, currentUser } = useAppContext();
    const [exporting, setExporting] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [elapsedTime, setElapsedTime] = useState("00:00:00");
    const [progress, setProgress] = useState(0);

    // Dynamic Greeting
    const greeting = useMemo(() => {
        const hour = currentTime.getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    }, [currentTime]);

    // Live Clock & Session Timer & Progress
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now);

            if (isCheckedIn && checkInTime) {
                const diff = now - new Date(checkInTime);
                const h = Math.floor(diff / 3600000);
                const m = Math.floor((diff % 3600000) / 60000);
                const s = Math.floor((diff % 60000) / 1000);
                setElapsedTime(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
                
                // Progress based on 8 hour goal (28800000 ms)
                const currentProgress = Math.min((diff / 28800000) * 100, 100);
                setProgress(currentProgress);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [isCheckedIn, checkInTime]);

    // Format helpers
    const formatTime = (isoString) => {
        if (!isoString) return "—";
        return new Date(isoString).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const formatHours = (hours, isCheckedOut = false) => {
        if (hours === null || hours === undefined) return isCheckedOut ? "0h 0m" : "Active";
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        return `${h}h ${m}m`;
    };

    // Check if user already finished their day (Checked out today)
    const todayStr = new Date().toISOString().split('T')[0];
    const todayRecord = attendance.find(r => r.date === todayStr);
    const hasAlreadyCheckedOutToday = todayRecord && !!todayRecord.checkout;

    // Format backend data for the UI
    const historyData = attendance.map(record => {
        const dateObj = new Date(record.date);
        const dateStr = dateObj.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
        const isToday = record.date === todayStr;
        
        let displayHours = record.totalHours || record.totalhours;
        if (isToday && isCheckedIn && checkInTime) {
            // Live calculation for the table row to match the timer
            const diff = currentTime - new Date(checkInTime);
            displayHours = diff / 3600000;
        }

        return {
            date: dateStr,
            checkIn: formatTime(record.checkin),
            checkOut: formatTime(record.checkout),
            hours: formatHours(displayHours, !!record.checkout),
            status: record.status ? record.status.charAt(0).toUpperCase() + record.status.slice(1) : "Present",
            isLive: isToday && isCheckedIn && !record.checkout
        };
    });

    const isAdminOrHR = ["Admin", "HR", "HR Head", "HR Accountant", "HR Recruiter"].includes(userRole);
    
    // Finished progress calculation if not checked in
    useEffect(() => {
        if (!isCheckedIn && hasAlreadyCheckedOutToday) {
            const h = todayRecord.totalHours || todayRecord.totalhours || 0;
            setProgress(Math.min((h / 8) * 100, 100));
        } else if (!isCheckedIn) {
            setProgress(0);
        }
    }, [isCheckedIn, hasAlreadyCheckedOutToday, todayRecord]);

    const handleCheckInToggle = async () => {
        if (hasAlreadyCheckedOutToday) {
            toast.error("Day Complete", { description: "You have already completed your shift today." });
            return;
        }
        if (isCheckedIn) {
            await checkOut();
        } else {
            await checkIn();
        }
    };

    const handleExport = async () => {
        setExporting(true);
        await new Promise((r) => setTimeout(r, 1200));
        setExporting(false);
        toast.success("Timesheet exported!", { description: "Downloaded as CSV." });
    };

    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const daysInCurrentMonth = getDaysInMonth(currentTime.getMonth(), currentTime.getFullYear());
    const totalDaysPresent = attendance.filter(r => r.checkin).length;
    const totalHoursRaw = attendance.reduce((acc, r) => acc + (r.totalHours || r.totalhours || 0), 0);
    const avgHours = totalDaysPresent > 0 ? (totalHoursRaw / totalDaysPresent).toFixed(1) : 0;
    const avgHoursFormatted = `${Math.floor(avgHours)}h ${Math.round((avgHours % 1) * 60)}m`;
    return <div className="space-y-8 pb-20">
        {/* Professional Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-10">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Attendance Dashboard</h1>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em] mt-2">Manage and track your official work hours</p>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Time</span>
                    <span className="text-xl font-black text-slate-900 tabular-nums">
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                </div>
                <button
                    onClick={handleExport}
                    className="px-8 py-4 bg-[#0f4184] hover:bg-[#0b3166] text-white rounded-2xl text-[10px] font-black uppercase tracking-[2px] transition-all shadow-lg shadow-[#0f4184]/20"
                >
                    Export Daily Log
                </button>
            </div>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Main Session Card */}
            <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
                
                {/* Progress Visualization */}
                <div className="md:w-[40%] p-12 bg-slate-50/50 flex flex-col items-center justify-center border-r border-slate-100">
                    <div className="relative w-52 h-52 flex items-center justify-center mb-8">
                        <svg className="w-full h-full -rotate-90">
                            <circle cx="104" cy="104" r="94" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100" />
                            <motion.circle 
                                cx="104" cy="104" r="94" stroke="currentColor" strokeWidth="12" fill="transparent"
                                initial={{ strokeDasharray: "0 1000" }}
                                animate={{ strokeDasharray: `${(progress * 590) / 100} 1000` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="text-[#0f4184] stroke-linecap-round"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-5xl font-black text-slate-900 tracking-tighter">{Math.round(progress)}%</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] mt-2">Shift Progress</span>
                        </div>
                    </div>
                    <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${isCheckedIn ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-white text-slate-400 border-slate-100"}`}>
                        {isCheckedIn ? "• Active" : "• Offline"}
                    </div>
                </div>

                {/* Session Details & Controls */}
                <div className="flex-1 p-12 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-[#0f4184]" />
                            <p className="text-[11px] font-black text-[#0f4184] uppercase tracking-[4px] leading-none">{greeting}, {currentUser?.name || "User"}</p>
                        </div>
                        <h2 className="text-7xl font-black text-slate-900 tracking-tighter leading-none mb-4 tabular-nums">
                            {isCheckedIn ? elapsedTime : formatHours(todayRecord?.totalHours || todayRecord?.totalhours, true)}
                        </h2>
                        <div className="space-y-4">
                            <p className="text-sm font-bold text-slate-600 max-w-sm leading-relaxed">
                                {isCheckedIn ? "Your work session is being recorded. Log out when your shift ends to finalize the daily record." : hasAlreadyCheckedOutToday ? "Shift completed. You have fulfilled your work requirements for today." : "System is ready for your daily check-in. One tap to start tracking performance."}
                            </p>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic">
                                {isCheckedIn ? `Session established: ${formatTime(checkInTime)}` : hasAlreadyCheckedOutToday ? "Daily target locked" : "Ready to engage"}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleCheckInToggle}
                        disabled={hasAlreadyCheckedOutToday}
                        className={`mt-10 w-full py-5 rounded-2xl font-black uppercase tracking-[4px] text-[11px] transition-all flex items-center justify-center gap-3 ${
                            isCheckedIn 
                            ? "bg-slate-900 text-white shadow-xl" 
                            : hasAlreadyCheckedOutToday 
                                ? "bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed" 
                                : "bg-[#0f4184] text-white shadow-lg shadow-[#0f4184]/20 hover:bg-[#0b3166]"
                        }`}
                    >
                        {isCheckedIn ? <LogOut size={20} /> : <LogIn size={20} />}
                        {isCheckedIn ? "End Session" : hasAlreadyCheckedOutToday ? "Closed" : "Start Shift"}
                    </button>
                </div>
            </div>

            {/* Support Statistics Section */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                {[
                    { label: "Days Present", value: `${totalDaysPresent}/${daysInCurrentMonth}`, note: "Current Month Cycle", icon: CheckCircle2 },
                    { label: "Daily Average", value: avgHoursFormatted, note: "Professional Standard", icon: Clock }
                ].map((s, i) => (
                    <div key={i} className="flex-1 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-[#0f4184]/20 transition-all">
                        <div className="flex justify-between items-start">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 text-[#0f4184] flex items-center justify-center border border-slate-100 group-hover:bg-[#0f4184] group-hover:text-white transition-all">
                                <s.icon size={26} />
                            </div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{s.note}</span>
                        </div>
                        <div className="mt-8">
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none mb-3">{s.label}</p>
                            <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Professional Activity Log Table */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden mt-12">
            <div className="px-12 py-8 border-b border-slate-100 bg-slate-50/20 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0f4184] text-white flex items-center justify-center">
                        <User size={16} />
                    </div>
                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-[11px] leading-none">Official Session Archive</h3>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[3px]">MARCH 2026 LOGS</span>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] bg-white text-left">
                            <th className="px-12 py-6 border-r border-slate-50">Log Date</th>
                            <th className="px-12 py-6 border-r border-slate-50">Checked In</th>
                            <th className="px-12 py-6 border-r border-slate-50">Checked Out</th>
                            <th className="px-12 py-6 border-r border-slate-50">Duration</th>
                            <th className="px-12 py-6 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {historyData.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-12 py-7 font-black text-slate-900">{row.date}</td>
                                <td className="px-12 py-7 text-slate-500 font-bold tabular-nums">{row.checkIn}</td>
                                <td className="px-12 py-7 text-slate-500 font-bold tabular-nums">{row.checkOut}</td>
                                <td className="px-12 py-7">
                                    <div className={`px-4 py-2 rounded-xl inline-flex items-center gap-2 ${row.isLive ? 'bg-emerald-50 border border-emerald-100' : 'bg-slate-100'}`}>
                                        <span className={`font-black tabular-nums tracking-tighter ${row.isLive ? 'text-emerald-600' : 'text-[#0f4184]'}`}>
                                            {row.hours}
                                        </span>
                                        {row.isLive && <span className="text-[9px] font-black uppercase text-emerald-500 animate-pulse">Active</span>}
                                    </div>
                                </td>
                                <td className="px-12 py-7 text-center">
                                    <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${row.status === "Present" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                                        {row.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>;
}

export default Attendance;


