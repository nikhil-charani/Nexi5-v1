import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Calendar, FileText, Download, Clock } from "lucide-react";
import { useAppContext } from "../hooks/useAppContext";
import EmployeeDrawer from "../components/drawers/EmployeeDrawer";
function EmployeeProfile() {
    const { id } = useParams();
    const { employees } = useAppContext();
    const [activeTab, setActiveTab] = useState("Overview");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const employee = (employees || []).find((e) => e.id === id || e.uid === id || e.employeeId === id);
    if (!employee) {
        return <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Employee not found</h2>
            <Link to="/dashboard/employees" className="mt-4 text-primary hover:underline">Return to Employees List</Link>
        </div>;
    }
    const tabs = ["Overview", "Attendance", "Payroll", "Documents", "Performance", "Timeline"];
    return <div className="space-y-6 max-w-5xl mx-auto pb-10">

        {
            /* Header Actions */
        }
        <div className="flex items-center justify-between">
            <Link to="/dashboard/employees" className="flex items-center gap-2 text-textSecondary hover:text-primary transition-colors">
                <ArrowLeft size={20} />
                <span className="text-sm font-semibold">Back to Employees</span>
            </Link>
            <div className="flex items-center gap-3">
                <button className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-textSecondary hover:bg-gray-50 transition-colors">
                    Suspend Employee
                </button>
                <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#0f4184] to-[#0b3166] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
                >
                    Edit Profile
                </button>
            </div>
        </div>

        {
            /* Profile Card */
        }
        <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col md:flex-row gap-8 items-start md:items-center shadow-nexi5">
            <img
                src={employee.avatarUrl}
                alt={employee.name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover ring-4 ring-gray-50 shadow-sm"
            />
            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold text-textPrimary">{employee.name}</h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold
              ${employee.status === "Active" ? "bg-[#0f4184]/10 text-[#0b3166]" : "bg-gray-100 text-gray-600"}
            `}>
                        {employee.status}
                    </span>
                </div>
                <p className="text-lg font-medium text-textSecondary">{employee.designation} • {employee.department}</p>

                <div className="flex flex-wrap gap-6 pt-4">
                    <div className="flex items-center gap-2 text-sm text-textSecondary">
                        <Briefcase size={16} className="text-[#0f4184]" />
                        <span className="font-medium">ID: {employee.id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-textSecondary">
                        <Mail size={16} className="text-[#0f4184]" />
                        <span className="font-medium">{(employee.name || "Employee").toLowerCase().replace(/\s+/g, ".")}@nexi5.com</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-textSecondary">
                        <Phone size={16} className="text-[#0f4184]" />
                        <span className="font-medium">+1 (555) 019-2834</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-textSecondary">
                        <MapPin size={16} className="text-[#0f4184]" />
                        <span className="font-medium">San Francisco, CA</span>
                    </div>
                </div>
            </div>
        </div>

        {
            /* Tabs Layout */
        }
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

                        {activeTab === "Overview" && <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-widest">Employment Details</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between pb-4 border-b border-gray-100">
                                            <span className="text-textSecondary text-sm font-medium">Manager</span>
                                            <span className="font-bold text-textPrimary text-sm">{employee.manager || "N/A"}</span>
                                        </div>
                                        <div className="flex justify-between pb-4 border-b border-gray-100">
                                            <span className="text-textSecondary text-sm font-medium">Date of Joining</span>
                                            <span className="font-bold text-textPrimary text-sm">{employee.joiningDate}</span>
                                        </div>
                                        <div className="flex justify-between pb-4 border-b border-gray-100">
                                            <span className="text-textSecondary text-sm font-medium">Work Model</span>
                                            <span className="font-bold text-textPrimary text-sm">Hybrid</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-widest">Current Month Stats</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
                                            <Clock className="text-primary mb-3" size={24} />
                                            <p className="text-3xl font-bold text-textPrimary">142<span className="text-sm font-semibold text-textSecondary ml-1">hrs</span></p>
                                            <p className="text-xs font-bold text-textSecondary mt-1 uppercase tracking-wider">Logged Time</p>
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
                                            <Calendar className="text-[#0b3166] mb-3" size={24} />
                                            <p className="text-3xl font-bold text-textPrimary">18<span className="text-sm font-semibold text-textSecondary ml-1">days</span></p>
                                            <p className="text-xs font-bold text-textSecondary mt-1 uppercase tracking-wider">Days Present</p>
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
export {
    EmployeeProfile as default
};
