import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
    ArrowLeft, Mail, Phone, MapPin, Briefcase, Calendar, Clock, Camera, 
    CheckCircle2, UserCircle, Banknote, FileText, TrendingUp, History 
} from "lucide-react";
import { useAppContext } from "../hooks/useAppContext";
import { toast } from "sonner";
import EmployeeDrawer from "../components/drawers/EmployeeDrawer";

function EmployeeProfile() {
    const { id } = useParams();
    const { 
        employees, currentUser, updateEmployee, 
        getAttendanceHistoryForUser, fetchEmployeeById,
        getPayrollHistoryForUser, getPerformanceForUser, 
        getDocumentsForUser, getTimelineForUser 
    } = useAppContext();
    const [employee, setEmployee] = useState(null);
    const [isSearching, setIsSearching] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [activeTab, setActiveTab] = useState("Overview");
    
    // Dynamic Data States
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);

    const [payrollHistory, setPayrollHistory] = useState([]);
    const [isLoadingPayroll, setIsLoadingPayroll] = useState(false);

    const [performanceHistory, setPerformanceHistory] = useState([]);
    const [isLoadingPerformance, setIsLoadingPerformance] = useState(false);

    const [documentsList, setDocumentsList] = useState([]);
    const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);

    const [timelineEvents, setTimelineEvents] = useState([]);
    const [isLoadingTimeline, setIsLoadingTimeline] = useState(false);

    useEffect(() => {
        const findEmployee = async () => {
            setIsSearching(true);
            // 1. Try local cache
            const local = (employees || []).find((e) => e.id === id || e.uid === id || e.employeeId === id);
            
            if (local) {
                setEmployee(local);
                setIsSearching(false);
            } else if (id === "undefined" || id === currentUser?.uid) {
                // 2. Fallback to current user if it's their own or undefined
                setEmployee(currentUser);
                setIsSearching(false);
            } else {
                // 3. Fetch from server (handles Staff/HR roles)
                const remote = await fetchEmployeeById(id);
                setEmployee(remote);
                setIsSearching(false);
            }
        };
        findEmployee();
    }, [id, employees, currentUser, fetchEmployeeById]);

    const isAdminOrHR = ["Admin", "HR Head", "HR"].includes(currentUser?.role);
    
    // Ownership check happens once employee is loaded
    const isOwnProfile = employee && currentUser && (
        (employee.uid && employee.uid === currentUser.uid) || 
        (employee.id && employee.id === currentUser.id) || 
        (employee.employeeId && employee.employeeId === currentUser.employeeId)
    );

    const targetUid = employee?.uid || employee?.id || id;
    
    const tabs = (isAdminOrHR && !isOwnProfile) 
        ? ["Overview", "Attendance", "Payroll", "Documents", "Performance", "Timeline"] 
        : ["Overview"];
    
    useEffect(() => {
        if (!targetUid || targetUid === "undefined") return;

        const fetchData = async () => {
            switch(activeTab) {
                case "Attendance":
                    setIsLoadingAttendance(true);
                    setAttendanceHistory(await getAttendanceHistoryForUser(targetUid));
                    setIsLoadingAttendance(false);
                    break;
                case "Payroll":
                    setIsLoadingPayroll(true);
                    setPayrollHistory(await getPayrollHistoryForUser(targetUid));
                    setIsLoadingPayroll(false);
                    break;
                case "Performance":
                    setIsLoadingPerformance(true);
                    setPerformanceHistory(await getPerformanceForUser(targetUid));
                    setIsLoadingPerformance(false);
                    break;
                case "Documents":
                    setIsLoadingDocuments(true);
                    setDocumentsList(await getDocumentsForUser(targetUid));
                    setIsLoadingDocuments(false);
                    break;
                case "Timeline":
                    setIsLoadingTimeline(true);
                    setTimelineEvents(await getTimelineForUser(targetUid));
                    setIsLoadingTimeline(false);
                    break;
            }
        };
        fetchData();
    }, [activeTab, targetUid, getAttendanceHistoryForUser, getPayrollHistoryForUser, getPerformanceForUser, getDocumentsForUser, getTimelineForUser]);
    
    if (isSearching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-slate-100 mx-4 mt-8">
               <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
               <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">Establishing Connection...</p>
            </div>
        );
    }
    
    if (!employee) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100 mx-4 mt-8">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <UserCircle size={40} className="text-slate-300" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Employee Not Found</h2>
                <p className="text-slate-500 mb-8 max-w-xs">We couldn't locate the profile you were looking for in our database.</p>
                <Link to="/dashboard/employees" className="px-8 py-3 bg-primary text-white font-bold rounded-full hover:shadow-lg transition-all">Go to Dashboard</Link>
            </div>
        );
    }
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsUploading(true);
            const reader = new FileReader();
            reader.onloadend = async () => {
                // Update profileImage globally. The backend now returns the full object for immediate UI sync.
                const result = await updateEmployee(targetId, { profileImage: reader.result });
                if (result.success) {
                    toast.success("Profile photo updated successfully!");
                } else {
                    toast.error(result.error || "Failed to upload photo");
                }
                setTimeout(() => setIsUploading(false), 600);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
            {/* Minimalist Navigation */}
            <div className="flex items-center justify-between py-6">
                {['Admin', 'HR Head'].includes(currentUser?.role) ? (
                    <Link to="/dashboard/employees" className="group flex items-center gap-3 text-slate-500 hover:text-primary transition-all px-4 py-2 hover:bg-white rounded-full">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold tracking-tight">Back to List</span>
                    </Link>
                ) : (
                    <div /> /* Empty space for layout balance */
                )}
                
                {isOwnProfile && (
                    <button
                        onClick={() => setIsDrawerOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl transition-all hover:-translate-y-0.5"
                    >
                        Update Profile
                    </button>
                )}
            </div>

            {/* Sleek Top Banner Card */}
            <div className="relative bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 mb-8 backdrop-blur-sm">
                {/* Refined Acccent Line */}
                <div className="h-24 sm:h-32 bg-[#0f4184] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-indigo-900/40"></div>
                </div>

                <div className="px-6 sm:px-12 pb-12">
                    <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-10 -mt-12 sm:-mt-16">
                        {/* Avatar Hub */}
                        <div className="relative group z-10">
                            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-[2.5rem] p-1.5 bg-white shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                                <img
                                    src={employee.profileImage || `https://ui-avatars.com/api/?name=${employee.name}&background=F8FAFC&color=0f4184&size=512`}
                                    alt={employee.name}
                                    className={`w-full h-full rounded-[2.2rem] object-cover bg-slate-50 ${isUploading ? 'opacity-40 animate-pulse' : ''} transition-all duration-300`}
                                />
                                
                                {/* Professional Upload Overlay - Owner Only */}
                                {isOwnProfile && (
                                    <label className="absolute inset-1.5 rounded-[2.2rem] bg-slate-900/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-md border-2 border-dashed border-white/30">
                                        <div className="p-3 bg-white/20 rounded-full mb-2">
                                            <Camera size={26} className="text-white" />
                                        </div>
                                        <span className="text-white text-[10px] font-black uppercase tracking-[2px]">Change Avatar</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={isUploading} />
                                    </label>
                                )}
                            </div>
                            
                            {/* Live Badge */}
                            <div className="absolute -bottom-2 -right-2 px-5 py-2 rounded-2xl bg-white shadow-[0_10px_20px_rgba(0,0,0,0.1)] flex items-center gap-2 z-20 border border-slate-50/50">
                                <span className={`w-3 h-3 rounded-full ${employee.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                                <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider">{employee.status}</span>
                            </div>
                        </div>

                        {/* Title Section */}
                        <div className="flex-1 text-center sm:text-left pb-2">
                            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter mb-2">
                                {employee.name}
                            </h1>
                            <div className="flex items-center justify-center sm:justify-start gap-4 flex-wrap">
                                <span className="inline-flex items-center px-4 py-1.5 bg-primary/5 text-primary text-sm font-black rounded-xl border border-primary/10">
                                    {employee.designation}
                                </span>
                                <span className="inline-flex items-center px-4 py-1.5 bg-slate-50 text-slate-400 text-sm font-black rounded-xl border border-slate-100 uppercase tracking-wider">
                                    {employee.department}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Metadata Grid - Repositioned for Full Visibility */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 bg-white/50 p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-4 px-6 py-4 bg-white rounded-2xl border border-slate-50 hover:shadow-md transition-all group">
                            <div className="p-3 bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors">
                                <Briefcase size={20} className="text-primary" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-[1.5px] text-slate-400 mb-0.5">Global ID</span>
                                <span className="text-base font-black text-slate-800 tracking-tight">{employee.id || employee.employeeId || "N/A"}</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4 px-6 py-4 bg-white rounded-2xl border border-slate-50 hover:shadow-md transition-all group overflow-hidden">
                            <div className="p-3 bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors">
                                <Mail size={20} className="text-primary" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[10px] font-black uppercase tracking-[1.5px] text-slate-400 mb-0.5">Corporate Email</span>
                                <span className="text-base font-black text-slate-800 tracking-tight break-all">{employee.email || "No Email Provided"}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 px-6 py-4 bg-white rounded-2xl border border-slate-50 hover:shadow-md transition-all group">
                            <div className="p-3 bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors">
                                <Phone size={20} className="text-primary" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-[1.5px] text-slate-400 mb-0.5">Contact</span>
                                <span className="text-base font-black text-slate-800 tracking-tight">{employee.phone || "No Phone Provided"}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 px-6 py-4 bg-white rounded-2xl border border-slate-50 hover:shadow-md transition-all group">
                            <div className="p-3 bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors">
                                <MapPin size={20} className="text-primary" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-[1.5px] text-slate-400 mb-0.5">Location</span>
                                <span className="text-base font-black text-slate-800 tracking-tight">{employee.address || "Generic / Remote"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation - Globally Visible, but hidden if only 1 tab */}
            {tabs.length > 1 && (
                <div className="flex items-center gap-8 border-b border-slate-100 mb-12 overflow-x-auto scrollbar-hide px-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-sm font-black tracking-tight transition-all relative whitespace-nowrap ${
                                activeTab === tab ? "text-primary" : "text-slate-400 hover:text-slate-500"
                            }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Main Content Area - Premium Elevated Card */}
            <div className={`bg-white rounded-[2.5rem] p-8 sm:p-14 border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.04)] min-h-[500px] ${tabs.length <= 1 ? 'mt-4' : ''}`}>
                {activeTab === "Overview" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Column 1: Employment Details */}
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2.5 bg-slate-50 rounded-xl">
                                    <Briefcase size={18} className="text-slate-400" />
                                </div>
                                <h3 className="text-[11px] font-black uppercase tracking-[2px] text-slate-400">Employment Details</h3>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="flex items-center justify-between py-4 border-b border-slate-50 group">
                                    <span className="text-sm font-bold text-slate-400 group-hover:text-slate-500 transition-colors">Direct Manager</span>
                                    <span className="text-sm font-black text-slate-800">{employee.manager || "Executive Team"}</span>
                                </div>
                                <div className="flex items-center justify-between py-4 border-b border-slate-50 group">
                                    <span className="text-sm font-bold text-slate-400 group-hover:text-slate-500 transition-colors">Date of Joining</span>
                                    <span className="text-sm font-black text-slate-800">{employee.joiningDate || "Processing"}</span>
                                </div>
                                <div className="flex items-center justify-between py-4 group">
                                    <span className="text-sm font-bold text-slate-400 group-hover:text-slate-500 transition-colors">Working Mode</span>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                        <span className="text-xs font-black text-slate-800 tracking-tight">{employee.workMode || "Hybrid"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Current Month Stats */}
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2.5 bg-slate-50 rounded-xl">
                                    <Clock size={18} className="text-slate-400" />
                                </div>
                                <h3 className="text-[11px] font-black uppercase tracking-[2px] text-slate-400">Current Month Status</h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100/50 group hover:border-primary/20 hover:bg-white transition-all duration-300">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                                        <Clock size={24} />
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-black text-slate-900 tracking-tighter">142</span>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">hrs</span>
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-[2px]">Logged Time</p>
                                </div>

                                <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100/50 group hover:border-indigo-200 hover:bg-white transition-all duration-300">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                        <Calendar size={24} />
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-black text-slate-900 tracking-tighter">18</span>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">days</span>
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-[2px]">Days Present</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "Attendance" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">Monthly Attendance</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Period: March 2026</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-emerald-100">95% Consistency</span>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-50">
                                        <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Log Date</th>
                                        <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Check-In</th>
                                        <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Check-Out</th>
                                        <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Hours</th>
                                        <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {isLoadingAttendance ? (
                                        <tr>
                                            <td colSpan="5" className="py-12 text-center text-slate-400 font-bold animate-pulse">Fetching history from server...</td>
                                        </tr>
                                    ) : attendanceHistory.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="py-12 text-center text-slate-400 font-bold italic">No attendance records found for this period.</td>
                                        </tr>
                                    ) : attendanceHistory.map((record, i) => {
                                        const dateObj = new Date(record.date);
                                        const dateStr = dateObj.toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' });
                                        
                                        const formatTime = (isoString) => {
                                            if (!isoString) return "—";
                                            return new Date(isoString).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: true });
                                        };

                                        return (
                                            <tr key={i} className="group hover:bg-slate-50 transition-colors">
                                                <td className="py-5 text-sm font-black text-slate-800">{dateStr}</td>
                                                <td className="py-5 text-sm font-bold text-slate-600">{formatTime(record.checkin)}</td>
                                                <td className="py-5 text-sm font-bold text-slate-600">{formatTime(record.checkout)}</td>
                                                <td className="py-5 text-sm font-black text-slate-900 tabular-nums">{record.totalHours ? `${record.totalHours}h` : "Active"}</td>
                                                <td className="py-5">
                                                    <span className="inline-flex items-center px-3 py-1 bg-[#0f4184]/5 text-[#0b3166] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#0f4184]/10">
                                                        {record.status || "Present"}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "Payroll" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-2 block">Monthly Base</span>
                                <h4 className="text-3xl font-black text-slate-900 tracking-tighter">₹{employee.basicSalary?.toLocaleString() || "0"}</h4>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-2 block">Allowances</span>
                                <h4 className="text-3xl font-black text-slate-900 tracking-tighter">₹{employee.allowances?.toLocaleString() || "0"}</h4>
                            </div>
                            <div className="p-6 bg-[#0f4184] rounded-3xl text-white shadow-xl text-center">
                                <span className="text-[10px] font-black text-white/60 uppercase tracking-[2px] mb-2 block">Total Package</span>
                                <h4 className="text-3xl font-black tracking-tighter">₹{(Number(employee.basicSalary || 0) + Number(employee.allowances || 0)).toLocaleString()}</h4>
                            </div>
                        </div>
                        <h3 className="text-[11px] font-black uppercase tracking-[2px] text-slate-400 mb-6">Payment History</h3>
                        <div className="space-y-4">
                            {isLoadingPayroll ? (
                                <div className="py-12 text-center text-slate-400 font-bold animate-pulse">Syncing Payroll Data...</div>
                            ) : payrollHistory.length === 0 ? (
                                <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                    <p className="text-slate-400 font-bold italic">No payroll records found for this employee.</p>
                                </div>
                            ) : payrollHistory.map((row, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-white border border-slate-50 rounded-[2rem] hover:border-slate-100 hover:shadow-sm transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                            <Banknote size={24} />
                                        </div>
                                        <div>
                                            <p className="text-base font-black text-slate-800">{new Date(0, row.month - 1).toLocaleString('default', { month: 'long' })} {row.year}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Released: {row.createdAt || row.date || "N/A"}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-base font-black text-slate-900">₹{row.netsalary?.toLocaleString()}</p>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${row.status === 'Paid' ? 'text-emerald-500' : 'text-amber-500'}`}>{row.status || "Processed"}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "Documents" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-black text-slate-900">Document Repository</h3>
                            <button className="px-6 py-3 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all border border-slate-100">
                                Upload New
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {isLoadingDocuments ? (
                                <div className="col-span-2 py-12 text-center text-slate-400 font-bold animate-pulse">Accessing Secure Vault...</div>
                            ) : documentsList.length === 0 ? (
                                <div className="col-span-2 p-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                    <p className="text-slate-400 font-bold italic">No documents found for this employee.</p>
                                </div>
                            ) : documentsList.map((doc, i) => (
                                <div key={i} className="p-5 bg-white border border-slate-100 rounded-[1.5rem] flex items-center justify-between hover:shadow-lg hover:shadow-slate-200/20 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                                            <FileText size={24} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-slate-800 truncate max-w-[150px]">{doc.name}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc.type || "General"} · {doc.size || "KB"}</span>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <span className="text-[10px] font-bold text-slate-300 mb-1">{doc.date || doc.createdAt || "N/A"}</span>
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "Performance" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                            <div className="lg:col-span-2">
                                <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Performance Evaluations</h3>
                                <div className="space-y-8">
                                    {isLoadingPerformance ? (
                                        <div className="py-12 text-center text-slate-400 font-bold animate-pulse">Analyzing Performance Data...</div>
                                    ) : performanceHistory.length === 0 ? (
                                        <div className="p-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                            <p className="text-slate-400 font-bold italic">No performance history recorded yet.</p>
                                        </div>
                                    ) : performanceHistory.map((evalItem, i) => (
                                        <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl hover:shadow-md transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="text-base font-black text-slate-800 uppercase tracking-tight">Evaluation Period: {evalItem.date || "Latest"}</h4>
                                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{evalItem.feedback || "General Performance Assessment"}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-2xl font-black text-primary tracking-tighter">{evalItem.rating || 0}/5</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-1.5 overflow-hidden rounded-full h-1.5 bg-slate-50">
                                                <motion.div 
                                                    initial={{ width: 0 }} 
                                                    animate={{ width: `${(evalItem.rating || 0) * 20}%` }} 
                                                    className="h-full bg-primary" 
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center bg-slate-950 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden text-center">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -mr-16 -mt-16" />
                                <TrendingUp className="text-primary mb-6" size={48} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">Aggregate Rating</span>
                                <h4 className="text-6xl font-black tracking-tighter mb-4">
                                    {performanceHistory.length > 0 ? (performanceHistory.reduce((acc, h) => acc + (Number(h.rating) || 0), 0) / performanceHistory.length).toFixed(1) : "0.0" }
                                    <span className="text-xl text-slate-600">/5</span>
                                </h4>
                                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 leading-relaxed">Based on {performanceHistory.length} formal assessments in current cycle.</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "Timeline" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-xl font-black text-slate-900 mb-10">Historical Milestones</h3>
                        <div className="space-y-12 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                            {isLoadingTimeline ? (
                                <div className="py-12 px-16 text-slate-400 font-bold animate-pulse">Reconstructing Timeline Event Feed...</div>
                            ) : timelineEvents.length === 0 ? (
                                <div className="p-12 text-center text-slate-400 font-bold italic">No milestones found.</div>
                            ) : timelineEvents.map((milestone, i) => (
                                <div key={i} className="flex gap-10 relative">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0 z-10 text-slate-400 group-hover:text-primary transition-all">
                                        {milestone.type === 'milestone' ? <CheckCircle2 size={20} /> : <History size={20} />}
                                    </div>
                                    <div className="pt-1">
                                        <h4 className="text-base font-black text-slate-900 mb-1">{milestone.event}</h4>
                                        <p className="text-[11px] font-black text-primary uppercase tracking-widest mb-3">{milestone.date}</p>
                                        <p className="text-sm font-bold text-slate-400 leading-relaxed max-w-lg">{milestone.description || milestone.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <EmployeeDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                employeeToEdit={employee}
                title="Update Profile"
                isProfileView={true}
            />
        </div>
    );
}

export default EmployeeProfile;
