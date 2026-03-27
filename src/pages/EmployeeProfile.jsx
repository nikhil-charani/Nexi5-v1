// import { useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Calendar, FileText, Download, Clock, ShieldCheck, Monitor, GraduationCap, Heart, MessageSquare, Video, CheckCircle, Smartphone, Laptop } from "lucide-react";
// import { useAppContext } from "../hooks/useAppContext";
// import EmployeeDrawer from "../components/drawers/EmployeeDrawer";
// function EmployeeProfile() {
//     const { id } = useParams();
//     const { employees, userRole, currentUser } = useAppContext();
//     const [activeTab, setActiveTab] = useState("Overview");
//     const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//     const isAdminOrHRHead = ["Admin", "HR Head", "HR"].includes(userRole);
//     const isSelf = currentUser?.uid === id || currentUser?.id === id;
//     const employee = (employees || []).find((e) => e.id === id || e.uid === id || e.employeeId === id);
//     if (!employee) {
//         return <div className="flex flex-col items-center justify-center h-full">
//             <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Employee not found</h2>
//             <Link to="/dashboard/employees" className="mt-4 text-primary hover:underline">Return to Employees List</Link>
//         </div>;
//     }
//     const tabs = ["Overview", "Attendance", "Payroll", "Documents", "Performance", "Timeline"];
//     return <div className="space-y-6 max-w-5xl mx-auto pb-10">

//         {
//             /* Header Actions */
//         }
//         <div className="flex items-center justify-between">
//             <Link to="/dashboard/employees" className="flex items-center gap-2 text-textSecondary hover:text-primary transition-colors">
//                 <ArrowLeft size={20} />
//                 <span className="text-sm font-semibold">Back to Employees</span>
//             </Link>
//             <div className="flex items-center gap-3">
//                 {isAdminOrHRHead && (
//                     <button className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-textSecondary hover:bg-gray-50 transition-colors">
//                         Suspend Employee
//                     </button>
//                 )}
//                 {(isAdminOrHRHead || isSelf) && (
//                     <button
//                         onClick={() => setIsDrawerOpen(true)}
//                         className="px-5 py-2.5 bg-gradient-to-r from-[#0f4184] to-[#0b3166] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
//                     >
//                         Edit Profile
//                     </button>
//                 )}
//             </div>
//         </div>

//         {
//             /* Profile Card */
//         }
//         <div className="bg-white rounded-[32px] border border-gray-100 p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-start lg:items-center shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex flex-col md:flex-row gap-8 items-start md:items-center w-full">
//                 <img
//                     src={employee.avatarUrl}
//                     alt={employee.name}
//                     className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover ring-4 ring-gray-50 shadow-sm shrink-0"
//                 />
//                 <div className="flex-1 space-y-3">
//                     <div className="flex items-center gap-4 flex-wrap">
//                         <h1 className="text-3xl font-bold text-textPrimary">{employee.name}</h1>
//                         <span className={`px-4 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-widest
//                   ${employee.status === "Active" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-gray-50 text-gray-500 border border-gray-200"}
//                 `}>
//                             {employee.status}
//                         </span>
//                     </div>
//                     <p className="text-lg font-bold text-textSecondary mb-2">{employee.designation} <span className="text-gray-300 mx-2">•</span> <span className="text-primary">{employee.department}</span></p>

//                     <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
//                         <div className="flex items-center gap-2 text-sm text-textSecondary bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
//                             <Briefcase size={14} className="text-secondary" />
//                             <span className="font-bold">ID: {employee.employeeId || employee.uid || employee.id}</span>
//                         </div>
//                         <div className="flex items-center gap-2 text-sm text-textSecondary group cursor-pointer hover:text-primary transition-colors">
//                             <Mail size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
//                             <span className="font-bold">{employee.email || `${(employee.name || "Employee").toLowerCase().replace(/\s+/g, ".")}@nexi5.com`}</span>
//                         </div>
//                         <div className="flex items-center gap-2 text-sm text-textSecondary group cursor-pointer hover:text-primary transition-colors">
//                             <Phone size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
//                             <span className="font-bold">+1 (555) 019-2834</span>
//                         </div>
//                         <div className="flex items-center gap-2 text-sm text-textSecondary group cursor-pointer hover:text-primary transition-colors">
//                             <MapPin size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
//                             <span className="font-bold">San Francisco, CA</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Quick Actions Side */}
//             <div className="flex flex-row lg:flex-col items-center justify-center gap-3 w-full lg:w-48 shrink-0 mt-2 lg:mt-0 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-8">
//                 <button className="w-full py-3 bg-gradient-to-r from-[#0f4184] to-[#0b3166] text-white rounded-2xl text-[13px] font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:opacity-95">
//                     <MessageSquare size={16} /> Message
//                 </button>
//                 <button className="w-full py-3 bg-white text-textPrimary text-[13px] font-bold border border-gray-200 hover:bg-gray-50 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm">
//                     <Video size={16} /> Quick Call
//                 </button>
//             </div>
//         </div>

//         {
//             /* Tabs Layout */
//         }
//         <div className="space-y-6">
//             <div className="flex overflow-x-auto border-b border-gray-100 w-full px-2 custom-scrollbar">
//                 {tabs.map((tab) => <button
//                     key={tab}
//                     onClick={() => setActiveTab(tab)}
//                     className={`
//                 px-8 py-4 text-sm font-bold transition-all whitespace-nowrap border-b-2
//                 ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-textSecondary hover:text-textPrimary hover:border-gray-300"}
//               `}
//                 >
//                     {tab}
//                 </button>)}
//             </div>

//             <div className="bg-white rounded-xl border border-gray-200 p-8 min-h-[400px] shadow-nexi5">
//                 <AnimatePresence mode="wait">
//                     <motion.div
//                         key={activeTab}
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -10 }}
//                         transition={{ duration: 0.2 }}
//                     >

//                         {activeTab === "Overview" && <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                             {/* Left Column (Employment & Skills) */}
//                             <div className="lg:col-span-2 space-y-8">
//                                 {/* Employment Stats Row */}
//                                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//                                     <div className="bg-gray-50 p-6 rounded-[24px] border border-gray-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow group">
//                                         <Clock className="text-secondary mb-4 group-hover:scale-110 transition-transform" size={28} />
//                                         <p className="text-2xl font-bold text-textPrimary leading-none">142</p>
//                                         <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mt-2">Hours Logged</p>
//                                     </div>
//                                     <div className="bg-gray-50 p-6 rounded-[24px] border border-gray-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow group">
//                                         <Calendar className="text-[#0f4184] mb-4 group-hover:scale-110 transition-transform" size={28} />
//                                         <p className="text-2xl font-bold text-textPrimary leading-none">18</p>
//                                         <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mt-2">Days Present</p>
//                                     </div>
//                                     <div className="bg-gray-50 p-6 rounded-[24px] border border-gray-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow group">
//                                         <CheckCircle className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform" size={28} />
//                                         <p className="text-2xl font-bold text-textPrimary leading-none">24</p>
//                                         <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mt-2">Tasks Done</p>
//                                     </div>
//                                     <div className="bg-gray-50 p-6 rounded-[24px] border border-gray-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow group">
//                                         <ShieldCheck className="text-amber-500 mb-4 group-hover:scale-110 transition-transform" size={28} />
//                                         <p className="text-2xl font-bold text-textPrimary leading-none">4.8</p>
//                                         <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mt-2">Rating</p>
//                                     </div>
//                                 </div>

//                                 {/* Skills & Certifications */}
//                                 <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
//                                     <h3 className="text-[11px] font-bold text-gray-400 mb-6 uppercase tracking-widest flex items-center gap-2">
//                                         <GraduationCap size={16} className="text-primary"/> Skills & Expertise
//                                     </h3>
//                                     <div className="flex flex-wrap gap-3">
//                                         {["React.js", "Node.js", "System Architecture", "TypeScript", "Performance Tuning", "Agile Leadership", "UI/UX Dynamics"].map((skill, i) => (
//                                             <span key={i} className="px-5 py-2.5 bg-gray-50 border border-gray-100 text-textSecondary text-[13px] font-bold rounded-2xl hover:-translate-y-1 hover:text-primary hover:border-primary/30 transition-all cursor-default shadow-sm">
//                                                 {skill}
//                                             </span>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Right Column (Leave & Assets) */}
//                             <div className="space-y-8">
//                                 {/* Leave Balance Visuals */}
//                                 <div className="bg-gradient-to-br from-[#0f4184] to-[#0b3166] rounded-[32px] p-8 text-white shadow-lg relative overflow-hidden">
//                                     <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 blur-[50px] rounded-full -mr-16 -mt-16 pointer-events-none" />
//                                     <h3 className="text-[11px] font-black text-white/50 mb-8 uppercase tracking-[0.2em] flex items-center gap-2 relative z-10">
//                                         <Heart size={14} className="text-rose-400" /> Leave Balances
//                                     </h3>
//                                     <div className="space-y-6 relative z-10">
//                                         {[
//                                             { label: "Sick Leave", used: 3, total: 10, color: "bg-rose-400" },
//                                             { label: "Casual Leave", used: 2, total: 8, color: "bg-amber-400" },
//                                             { label: "Paid Leave", used: 5, total: 15, color: "bg-emerald-400" }
//                                         ].map((leave) => (
//                                             <div key={leave.label}>
//                                                 <div className="flex justify-between text-[11px] font-bold mb-2 uppercase tracking-wide">
//                                                     <span className="text-white/80">{leave.label}</span>
//                                                     <span className="text-white bg-white/10 px-2 py-0.5 rounded-md">{leave.total - leave.used} Left</span>
//                                                 </div>
//                                                 <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5">
//                                                     <motion.div initial={{ width: 0 }} animate={{ width: `${(leave.used / leave.total) * 100}%` }} className={`h-full ${leave.color} rounded-full`} transition={{ duration: 1, ease: "easeOut" }} />
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>

//                                 {/* Assigned Assets */}
//                                 <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
//                                     <h3 className="text-[11px] font-bold text-gray-400 mb-6 uppercase tracking-widest flex items-center gap-2">
//                                         <Monitor size={16} className="text-secondary" /> Assigned Equipment
//                                     </h3>
//                                     <div className="space-y-4">
//                                         <div className="flex items-center gap-4 p-4 rounded-[20px] bg-gray-50 border border-transparent hover:border-gray-100 transition-colors group">
//                                             <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-textSecondary shrink-0 group-hover:text-primary transition-colors">
//                                                 <Laptop size={20} />
//                                             </div>
//                                             <div>
//                                                 <p className="text-sm font-bold text-textPrimary leading-tight">MacBook Pro 16"</p>
//                                                 <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mt-1.5">SN: ASDF-9283-QW</p>
//                                             </div>
//                                         </div>
//                                         <div className="flex items-center gap-4 p-4 rounded-[20px] bg-gray-50 border border-transparent hover:border-gray-100 transition-colors group">
//                                             <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-textSecondary shrink-0 group-hover:text-primary transition-colors">
//                                                 <Smartphone size={20} />
//                                             </div>
//                                             <div>
//                                                 <p className="text-sm font-bold text-textPrimary leading-tight">iPhone 14 Pro Max</p>
//                                                 <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mt-1.5">SN: ZXCV-1039-UI</p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>}

//                         {activeTab === "Attendance" && <div className="space-y-8">
//                             <div className="flex justify-between items-center mb-2">
//                                 <h3 className="text-lg font-bold text-textPrimary">Attendance Summary</h3>
//                             </div>
//                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                                 <div className="bg-[#0f4184]/10 p-6 rounded-xl border border-[#0f4184]/20">
//                                     <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Present</p>
//                                     <p className="text-3xl font-bold text-[#0b3166]">18 days</p>
//                                 </div>
//                                 <div className="bg-red-50 p-6 rounded-xl border border-red-100">
//                                     <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Absent</p>
//                                     <p className="text-3xl font-bold text-red-600">2 days</p>
//                                 </div>
//                                 <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
//                                     <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">Late Entries</p>
//                                     <p className="text-3xl font-bold text-orange-600">1 day</p>
//                                 </div>
//                                 <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
//                                     <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Total Hours</p>
//                                     <p className="text-3xl font-bold text-primary">142 hrs</p>
//                                 </div>
//                             </div>
//                             <div className="overflow-hidden rounded-xl border border-gray-100">
//                                 <table className="w-full text-left text-sm">
//                                     <thead>
//                                         <tr className="bg-gray-50 border-b border-gray-100">
//                                             <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider">Date</th>
//                                             <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider">Check In</th>
//                                             <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider">Check Out</th>
//                                             <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider">Status</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y divide-gray-100">
//                                         {[
//                                             { date: "Oct 25, 2024", in: "09:05 AM", out: "06:10 PM", status: "Present", color: "text-[#0b3166] bg-[#0f4184]/10" },
//                                             { date: "Oct 24, 2024", in: "09:00 AM", out: "06:00 PM", status: "Present", color: "text-[#0b3166] bg-[#0f4184]/10" },
//                                             { date: "Oct 23, 2024", in: "10:30 AM", out: "06:15 PM", status: "Late", color: "text-orange-500 bg-orange-100" },
//                                             { date: "Oct 22, 2024", in: "--", out: "--", status: "Absent", color: "text-red-500 bg-red-100" }
//                                         ].map((record, i) => <tr key={i} className="hover:bg-[#F0F9FF] transition-colors">
//                                             <td className="px-6 py-4 font-bold text-textPrimary">{record.date}</td>
//                                             <td className="px-6 py-4 text-textSecondary font-medium">{record.in}</td>
//                                             <td className="px-6 py-4 text-textSecondary font-medium">{record.out}</td>
//                                             <td className="px-6 py-4">
//                                                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${record.color}`}>{record.status}</span>
//                                             </td>
//                                         </tr>)}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>}

//                         {activeTab === "Payroll" && <div className="space-y-8">
//                             <div className="flex justify-between items-center mb-2">
//                                 <h3 className="text-lg font-bold text-textPrimary">Recent Payslips</h3>
//                             </div>
//                             <div className="overflow-hidden rounded-xl border border-gray-100">
//                                 <table className="w-full text-left text-sm">
//                                     <thead>
//                                         <tr className="bg-gray-50 border-b border-gray-100">
//                                             <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider">Month</th>
//                                             <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider">Net Salary</th>
//                                             <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider">Status</th>
//                                             <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-right">Action</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y divide-gray-100">
//                                         <tr className="hover:bg-[#F0F9FF] transition-colors">
//                                             <td className="px-6 py-4 font-bold text-textPrimary">October 2024</td>
//                                             <td className="px-6 py-4 text-textSecondary font-bold">$9,000</td>
//                                             <td className="px-6 py-4">
//                                                 <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#0f4184]/10 text-[#0b3166]">Paid</span>
//                                             </td>
//                                             <td className="px-6 py-4 text-right">
//                                                 <button className="text-primary hover:text-primaryDark font-bold flex items-center justify-end gap-2 ml-auto transition-colors">
//                                                     <Download size={16} /> PDF
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>}

//                         {activeTab === "Documents" && <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//                             {[
//                                 { name: "Offer Letter.pdf", date: "Jan 10, 2022", size: "245 KB" },
//                                 { name: "ID Proof.jpg", date: "Jan 12, 2022", size: "1.2 MB" },
//                                 { name: "Non-Disclosure.pdf", date: "Jan 15, 2022", size: "400 KB" }
//                             ].map((doc, idx) => <div key={idx} className="border border-gray-100 p-6 rounded-xl hover:border-primary hover:bg-[#F0F9FF] transition-all cursor-pointer group shadow-sm">
//                                 <FileText className="text-primary mb-4" size={32} />
//                                 <p className="font-bold text-textPrimary text-sm truncate mb-1">{doc.name}</p>
//                                 <div className="flex justify-between text-xs text-textSecondary font-medium">
//                                     <span>{doc.date}</span>
//                                     <span>{doc.size}</span>
//                                 </div>
//                             </div>)}
//                         </div>}
//                         {activeTab === "Performance" && <div className="space-y-8">
//                             <div className="flex justify-between items-center">
//                                 <h3 className="text-lg font-bold text-textPrimary">Performance Insights</h3>
//                             </div>

//                             <div className="flex flex-col md:flex-row gap-12">
//                                 <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-2xl border border-gray-100 w-full md:w-1/3 shadow-sm">
//                                     <div className="w-40 h-40 rounded-full border-8 border-primary flex flex-col items-center justify-center bg-white shadow-inner">
//                                         <span className="text-5xl font-extrabold text-textPrimary">{employee.performanceScore || "N/A"}</span>
//                                         <span className="text-xs text-textSecondary font-bold uppercase tracking-wider mt-2">out of 5.0</span>
//                                     </div>
//                                     <p className="mt-6 font-bold text-textPrimary text-lg">Overall Rating</p>
//                                 </div>

//                                 <div className="flex-1 space-y-6">
//                                     <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Performance Metrics</h4>
//                                     {[
//                                         { label: "Technical Skills", score: 4.8, color: "bg-[#0f4184]" },
//                                         { label: "Communication", score: 4.2, color: "bg-[#0b3166]" },
//                                         { label: "Problem Solving", score: 4.5, color: "bg-primary" },
//                                         { label: "Teamwork", score: 4.9, color: "bg-[#0b3166]" }
//                                     ].map((criteria) => <div key={criteria.label} className="space-y-3">
//                                         <div className="flex justify-between text-sm">
//                                             <span className="font-bold text-textPrimary">{criteria.label}</span>
//                                             <span className="font-bold text-primary">{criteria.score}</span>
//                                         </div>
//                                         <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
//                                             <motion.div
//                                                 initial={{ width: 0 }}
//                                                 animate={{ width: `${criteria.score / 5 * 100}%` }}
//                                                 className={`h-full ${criteria.color} rounded-full`}
//                                                 transition={{ duration: 1, ease: "easeOut" }}
//                                             />
//                                         </div>
//                                     </div>)}
//                                 </div>
//                             </div>
//                         </div>}

//                         {activeTab === "Timeline" && <div className="space-y-8 max-w-2xl py-4">
//                             {[
//                                 { title: "Promotion to Senior", date: "January 2024", desc: "Promoted to Senior level after excellent performance review by the management team." },
//                                 { title: "Completed Security Training", date: "November 2023", desc: "Mandatory annual infosec training completed with 100% score." },
//                                 { title: "Joined Company", date: "January 2022", desc: "Started as Frontend Developer in the Product Engineering team." }
//                             ].map((event, i) => <div key={i} className="flex gap-6">
//                                 <div className="flex flex-col items-center">
//                                     <div className="w-4 h-4 bg-primary rounded-full mt-1 border-4 border-white shadow-sm shadow-primary/40 ring-1 ring-gray-100" />
//                                     {i !== 2 && <div className="w-px h-full bg-gray-100 my-2" />}
//                                 </div>
//                                 <div className="pb-8">
//                                     <p className="text-base font-bold text-textPrimary">{event.title}</p>
//                                     <span className="text-xs text-primary font-bold uppercase tracking-wider">{event.date}</span>
//                                     <p className="text-sm text-textSecondary mt-2 leading-relaxed">{event.desc}</p>
//                                 </div>
//                             </div>)}
//                         </div>}

//                     </motion.div>
//                 </AnimatePresence>
//             </div>
//         </div>

//         <EmployeeDrawer
//             isOpen={isDrawerOpen}
//             onClose={() => setIsDrawerOpen(false)}
//             employeeToEdit={employee}
//         />
//     </div>;
// }
// export {
//     EmployeeProfile as default
// };
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Calendar, FileText, Download, Clock, ShieldCheck, Monitor, GraduationCap, Heart, MessageSquare, Video, CheckCircle, Smartphone, Laptop, UserCheck, Camera } from "lucide-react";
import { useAppContext } from "../hooks/useAppContext";
import EmployeeDrawer from "../components/drawers/EmployeeDrawer";

function EmployeeProfile() {
    const { id } = useParams();
    const { employees, userRole, currentUser, updateEmployee } = useAppContext();
    const [activeTab, setActiveTab] = useState("Overview");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const isAdminOrHRHead = ["Admin", "HR Head", "HR"].includes(userRole);
    const isSelf = currentUser?.uid === id || currentUser?.id === id;
    const employee = (employees || []).find((e) => e.id === id || e.uid === id || e.employeeId === id);

    // Resolve manager from the employees list using manager field set by HR Head
    const managerNameFromHR = employee?.manager || employee?.managerName; 
    let manager = (employees || []).find((e) => 
        (employee?.managerId && (e.id === employee.managerId || e.uid === employee.managerId)) || 
        (managerNameFromHR && e.name?.toLowerCase() === managerNameFromHR.toLowerCase())
    );

    if (!manager && managerNameFromHR) {
        manager = { name: managerNameFromHR, designation: employee?.managerDesignation || "Manager", department: employee?.managerDepartment || employee?.department || "Operations", avatarUrl: employee?.managerAvatarUrl || null, email: employee?.managerEmail || null, id: null };
    }

    if (!employee) {
        return <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Employee not found</h2>
            <Link to="/dashboard/employees" className="mt-4 text-primary hover:underline">Return to Employees List</Link>
        </div>;
    }

    const tabs = ["Overview", "Attendance", "Payroll", "Documents", "Performance", "Timeline"];

    return <div className="space-y-6 max-w-5xl mx-auto pb-10">

        {/* Header Actions */}
        <div className="flex items-center justify-between">
            <Link to="/dashboard/employees" className="flex items-center gap-2 text-textSecondary hover:text-primary transition-colors">
                <ArrowLeft size={20} />
                <span className="text-sm font-semibold">Back to Employees</span>
            </Link>
            <div className="flex items-center gap-3">
                {isAdminOrHRHead && (
                    <button className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-textSecondary hover:bg-gray-50 transition-colors">
                        Suspend Employee
                    </button>
                )}
                {(isAdminOrHRHead || isSelf) && (
                    <button
                        onClick={() => setIsDrawerOpen(true)}
                        className="px-5 py-2.5 bg-gradient-to-r from-[#0f4184] to-[#0b3166] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
                    >
                        Edit Profile
                    </button>
                )}
            </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-[32px] border border-gray-100 p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-start lg:items-center shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center w-full">
                <div className="relative group shrink-0">
                    <img
                        src={employee.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name || "User")}&background=0f4184&color=fff`}
                        alt={employee.name}
                        className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover ring-4 ring-gray-50 shadow-sm transition-opacity group-hover:opacity-80"
                    />
                    {(isAdminOrHRHead || isSelf) && (
                        <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl cursor-pointer backdrop-blur-sm">
                            <Camera size={24} className="mb-1" />
                            <span className="text-[10px] uppercase font-bold tracking-widest leading-tight text-center px-2">Update<br/>Photo</span>
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if(file) {
                                        const reader = new FileReader();
                                        reader.onloadend = async () => {
                                            const base64Str = reader.result;
                                            await updateEmployee(employee.uid || employee.id, { avatarUrl: base64Str });
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }} 
                            />
                        </label>
                    )}
                </div>
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-4 flex-wrap">
                        <h1 className="text-3xl font-bold text-textPrimary">{employee.name}</h1>
                        <span className={`px-4 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-widest
                  ${employee.status === "Active" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-gray-50 text-gray-500 border border-gray-200"}
                `}>
                            {employee.status}
                        </span>
                    </div>
                    <p className="text-lg font-bold text-textSecondary mb-2">{employee.designation} <span className="text-gray-300 mx-2">•</span> <span className="text-primary">{employee.department}</span></p>

                    <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
                        <div className="flex items-center gap-2 text-sm text-textSecondary bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                            <Briefcase size={14} className="text-secondary" />
                            <span className="font-bold">ID: {employee.employeeId || employee.uid || employee.id}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-textSecondary group cursor-pointer hover:text-primary transition-colors">
                            <Mail size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                            <span className="font-bold">{employee.email || `${(employee.name || "Employee").toLowerCase().replace(/\s+/g, ".")}@nexi5.com`}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-textSecondary group cursor-pointer hover:text-primary transition-colors">
                            <Phone size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                            <span className="font-bold">+1 (555) 019-2834</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-textSecondary group cursor-pointer hover:text-primary transition-colors">
                            <MapPin size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                            <span className="font-bold">San Francisco, CA</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Side */}
            <div className="flex flex-row lg:flex-col items-center justify-center gap-3 w-full lg:w-48 shrink-0 mt-2 lg:mt-0 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-8">
                <button className="w-full py-3 bg-gradient-to-r from-[#0f4184] to-[#0b3166] text-white rounded-2xl text-[13px] font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:opacity-95">
                    <MessageSquare size={16} /> Message
                </button>
                <button className="w-full py-3 bg-white text-textPrimary text-[13px] font-bold border border-gray-200 hover:bg-gray-50 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm">
                    <Video size={16} /> Quick Call
                </button>
            </div>
        </div>

        {/* Tabs Layout */}
        <div className="space-y-6">
            <div className="flex overflow-x-auto border-b border-gray-100 w-full px-2 custom-scrollbar">
                {tabs.map((tab) => <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                px-8 py-4 text-sm font-bold transition-all whitespace-nowrap border-b-2
                ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-textSecondary hover:text-textPrimary hover:border-gray-300"}
              `}
                >
                    {tab}
                </button>)}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 min-h-[400px] shadow-nexi5">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >

                        {activeTab === "Overview" && <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column (Employment & Skills) */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Employment Stats Row */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="bg-gray-50 p-6 rounded-[24px] border border-gray-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow group">
                                        <Clock className="text-secondary mb-4 group-hover:scale-110 transition-transform" size={28} />
                                        <p className="text-2xl font-bold text-textPrimary leading-none">142</p>
                                        <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mt-2">Hours Logged</p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-[24px] border border-gray-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow group">
                                        <Calendar className="text-[#0f4184] mb-4 group-hover:scale-110 transition-transform" size={28} />
                                        <p className="text-2xl font-bold text-textPrimary leading-none">18</p>
                                        <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mt-2">Days Present</p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-[24px] border border-gray-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow group">
                                        <CheckCircle className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform" size={28} />
                                        <p className="text-2xl font-bold text-textPrimary leading-none">24</p>
                                        <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mt-2">Tasks Done</p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-[24px] border border-gray-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow group">
                                        <ShieldCheck className="text-amber-500 mb-4 group-hover:scale-110 transition-transform" size={28} />
                                        <p className="text-2xl font-bold text-textPrimary leading-none">4.8</p>
                                        <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mt-2">Rating</p>
                                    </div>
                                </div>

                                {/* Skills & Certifications */}
                                <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
                                    <h3 className="text-[11px] font-bold text-gray-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                                        <GraduationCap size={16} className="text-primary"/> Skills & Expertise
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {["React.js", "Node.js", "System Architecture", "TypeScript", "Performance Tuning", "Agile Leadership", "UI/UX Dynamics"].map((skill, i) => (
                                            <span key={i} className="px-5 py-2.5 bg-gray-50 border border-gray-100 text-textSecondary text-[13px] font-bold rounded-2xl hover:-translate-y-1 hover:text-primary hover:border-primary/30 transition-all cursor-default shadow-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column (Manager, Leave & Assets) */}
                            <div className="space-y-8">

                                {/* Manager Details Card */}
                                <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
                                    <h3 className="text-[11px] font-bold text-gray-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                                        <UserCheck size={16} className="text-primary" /> Reporting Manager
                                    </h3>

                                    {manager ? (
                                        <Link
                                            to={manager.id ? `/dashboard/employees/${manager.id}` : "#"}
                                            className="flex items-center gap-4 p-4 rounded-[20px] bg-gray-50 border border-transparent hover:border-primary/20 hover:bg-[#F0F9FF] transition-all group cursor-pointer"
                                        >
                                            {/* Avatar */}
                                            {manager.avatarUrl ? (
                                                <img
                                                    src={manager.avatarUrl}
                                                    alt={manager.name}
                                                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-gray-100 group-hover:ring-primary/20 transition-all shrink-0"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0f4184] to-[#0b3166] flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-sm">
                                                    {(manager.name || "M").charAt(0).toUpperCase()}
                                                </div>
                                            )}

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-textPrimary truncate group-hover:text-primary transition-colors">
                                                    {manager.name}
                                                </p>
                                                <p className="text-[11px] font-bold text-textSecondary truncate mt-0.5">
                                                    {manager.designation || "Manager"}
                                                </p>
                                                {manager.department && (
                                                    <span className="inline-block mt-2 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-md uppercase tracking-wide">
                                                        {manager.department}
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-6 text-center">
                                            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                                                <UserCheck size={20} className="text-gray-300" />
                                            </div>
                                            <p className="text-sm font-bold text-gray-400">No manager assigned</p>
                                            {isAdminOrHRHead && (
                                                <p className="text-[11px] text-gray-300 mt-1">Assign one via Edit Profile</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Manager contact shortcut — only if email available */}
                                    {manager?.email && (
                                        <a
                                            href={`mailto:${manager.email}`}
                                            className="mt-4 flex items-center gap-2 text-[12px] font-bold text-textSecondary hover:text-primary transition-colors group"
                                        >
                                            <Mail size={13} className="text-gray-400 group-hover:text-primary transition-colors" />
                                            <span className="truncate">{manager.email}</span>
                                        </a>
                                    )}
                                </div>

                                {/* Leave Balance Visuals */}
                                <div className="bg-gradient-to-br from-[#0f4184] to-[#0b3166] rounded-[32px] p-8 text-white shadow-lg relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 blur-[50px] rounded-full -mr-16 -mt-16 pointer-events-none" />
                                    <h3 className="text-[11px] font-black text-white/50 mb-8 uppercase tracking-[0.2em] flex items-center gap-2 relative z-10">
                                        <Heart size={14} className="text-rose-400" /> Leave Balances
                                    </h3>
                                    <div className="space-y-6 relative z-10">
                                        {[
                                            { label: "Sick Leave", used: 3, total: 10, color: "bg-rose-400" },
                                            { label: "Casual Leave", used: 2, total: 8, color: "bg-amber-400" },
                                            { label: "Paid Leave", used: 5, total: 15, color: "bg-emerald-400" }
                                        ].map((leave) => (
                                            <div key={leave.label}>
                                                <div className="flex justify-between text-[11px] font-bold mb-2 uppercase tracking-wide">
                                                    <span className="text-white/80">{leave.label}</span>
                                                    <span className="text-white bg-white/10 px-2 py-0.5 rounded-md">{leave.total - leave.used} Left</span>
                                                </div>
                                                <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${(leave.used / leave.total) * 100}%` }} className={`h-full ${leave.color} rounded-full`} transition={{ duration: 1, ease: "easeOut" }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Assigned Assets */}
                                <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
                                    <h3 className="text-[11px] font-bold text-gray-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                                        <Monitor size={16} className="text-secondary" /> Assigned Equipment
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 p-4 rounded-[20px] bg-gray-50 border border-transparent hover:border-gray-100 transition-colors group">
                                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-textSecondary shrink-0 group-hover:text-primary transition-colors">
                                                <Laptop size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-textPrimary leading-tight">MacBook Pro 16"</p>
                                                <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mt-1.5">SN: ASDF-9283-QW</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 rounded-[20px] bg-gray-50 border border-transparent hover:border-gray-100 transition-colors group">
                                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-textSecondary shrink-0 group-hover:text-primary transition-colors">
                                                <Smartphone size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-textPrimary leading-tight">iPhone 14 Pro Max</p>
                                                <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mt-1.5">SN: ZXCV-1039-UI</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>}

                        {activeTab === "Attendance" && <div className="space-y-8">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-bold text-textPrimary">Attendance Summary</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="bg-[#0f4184]/10 p-6 rounded-xl border border-[#0f4184]/20">
                                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Present</p>
                                    <p className="text-3xl font-bold text-[#0b3166]">18 days</p>
                                </div>
                                <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                                    <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Absent</p>
                                    <p className="text-3xl font-bold text-red-600">2 days</p>
                                </div>
                                <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                                    <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">Late Entries</p>
                                    <p className="text-3xl font-bold text-orange-600">1 day</p>
                                </div>
                                <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Total Hours</p>
                                    <p className="text-3xl font-bold text-primary">142 hrs</p>
                                </div>
                            </div>
                            <div className="overflow-hidden rounded-xl border border-gray-100">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider">Date</th>
                                            <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider">Check In</th>
                                            <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider">Check Out</th>
                                            <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {[
                                            { date: "Oct 25, 2024", in: "09:05 AM", out: "06:10 PM", status: "Present", color: "text-[#0b3166] bg-[#0f4184]/10" },
                                            { date: "Oct 24, 2024", in: "09:00 AM", out: "06:00 PM", status: "Present", color: "text-[#0b3166] bg-[#0f4184]/10" },
                                            { date: "Oct 23, 2024", in: "10:30 AM", out: "06:15 PM", status: "Late", color: "text-orange-500 bg-orange-100" },
                                            { date: "Oct 22, 2024", in: "--", out: "--", status: "Absent", color: "text-red-500 bg-red-100" }
                                        ].map((record, i) => <tr key={i} className="hover:bg-[#F0F9FF] transition-colors">
                                            <td className="px-6 py-4 font-bold text-textPrimary">{record.date}</td>
                                            <td className="px-6 py-4 text-textSecondary font-medium">{record.in}</td>
                                            <td className="px-6 py-4 text-textSecondary font-medium">{record.out}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${record.color}`}>{record.status}</span>
                                            </td>
                                        </tr>)}
                                    </tbody>
                                </table>
                            </div>
                        </div>}

                        {activeTab === "Payroll" && <div className="space-y-8">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-bold text-textPrimary">Recent Payslips</h3>
                            </div>
                            <div className="overflow-hidden rounded-xl border border-gray-100">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider">Month</th>
                                            <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider">Net Salary</th>
                                            <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-gray-500 font-bold uppercase text-xs tracking-wider text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        <tr className="hover:bg-[#F0F9FF] transition-colors">
                                            <td className="px-6 py-4 font-bold text-textPrimary">October 2024</td>
                                            <td className="px-6 py-4 text-textSecondary font-bold">$9,000</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#0f4184]/10 text-[#0b3166]">Paid</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-primary hover:text-primaryDark font-bold flex items-center justify-end gap-2 ml-auto transition-colors">
                                                    <Download size={16} /> PDF
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>}

                        {activeTab === "Documents" && <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {[
                                { name: "Offer Letter.pdf", date: "Jan 10, 2022", size: "245 KB" },
                                { name: "ID Proof.jpg", date: "Jan 12, 2022", size: "1.2 MB" },
                                { name: "Non-Disclosure.pdf", date: "Jan 15, 2022", size: "400 KB" }
                            ].map((doc, idx) => <div key={idx} className="border border-gray-100 p-6 rounded-xl hover:border-primary hover:bg-[#F0F9FF] transition-all cursor-pointer group shadow-sm">
                                <FileText className="text-primary mb-4" size={32} />
                                <p className="font-bold text-textPrimary text-sm truncate mb-1">{doc.name}</p>
                                <div className="flex justify-between text-xs text-textSecondary font-medium">
                                    <span>{doc.date}</span>
                                    <span>{doc.size}</span>
                                </div>
                            </div>)}
                        </div>}

                        {activeTab === "Performance" && <div className="space-y-8">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-textPrimary">Performance Insights</h3>
                            </div>

                            <div className="flex flex-col md:flex-row gap-12">
                                <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-2xl border border-gray-100 w-full md:w-1/3 shadow-sm">
                                    <div className="w-40 h-40 rounded-full border-8 border-primary flex flex-col items-center justify-center bg-white shadow-inner">
                                        <span className="text-5xl font-extrabold text-textPrimary">{employee.performanceScore || "N/A"}</span>
                                        <span className="text-xs text-textSecondary font-bold uppercase tracking-wider mt-2">out of 5.0</span>
                                    </div>
                                    <p className="mt-6 font-bold text-textPrimary text-lg">Overall Rating</p>
                                </div>

                                <div className="flex-1 space-y-6">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Performance Metrics</h4>
                                    {[
                                        { label: "Technical Skills", score: 4.8, color: "bg-[#0f4184]" },
                                        { label: "Communication", score: 4.2, color: "bg-[#0b3166]" },
                                        { label: "Problem Solving", score: 4.5, color: "bg-primary" },
                                        { label: "Teamwork", score: 4.9, color: "bg-[#0b3166]" }
                                    ].map((criteria) => <div key={criteria.label} className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-bold text-textPrimary">{criteria.label}</span>
                                            <span className="font-bold text-primary">{criteria.score}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${criteria.score / 5 * 100}%` }}
                                                className={`h-full ${criteria.color} rounded-full`}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                            />
                                        </div>
                                    </div>)}
                                </div>
                            </div>
                        </div>}

                        {activeTab === "Timeline" && <div className="space-y-8 max-w-2xl py-4">
                            {[
                                { title: "Promotion to Senior", date: "January 2024", desc: "Promoted to Senior level after excellent performance review by the management team." },
                                { title: "Completed Security Training", date: "November 2023", desc: "Mandatory annual infosec training completed with 100% score." },
                                { title: "Joined Company", date: "January 2022", desc: "Started as Frontend Developer in the Product Engineering team." }
                            ].map((event, i) => <div key={i} className="flex gap-6">
                                <div className="flex flex-col items-center">
                                    <div className="w-4 h-4 bg-primary rounded-full mt-1 border-4 border-white shadow-sm shadow-primary/40 ring-1 ring-gray-100" />
                                    {i !== 2 && <div className="w-px h-full bg-gray-100 my-2" />}
                                </div>
                                <div className="pb-8">
                                    <p className="text-base font-bold text-textPrimary">{event.title}</p>
                                    <span className="text-xs text-primary font-bold uppercase tracking-wider">{event.date}</span>
                                    <p className="text-sm text-textSecondary mt-2 leading-relaxed">{event.desc}</p>
                                </div>
                            </div>)}
                        </div>}

                    </motion.div>
                </AnimatePresence>
            </div>
        </div>

        <EmployeeDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            employeeToEdit={employee}
        />
    </div>;
}

export { EmployeeProfile as default };