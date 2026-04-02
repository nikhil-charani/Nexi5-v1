import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Briefcase, Calendar, ShieldCheck, Clock, Medal, BookOpen, Star, Activity, CheckCircle, ChevronRight, Award, Camera } from "lucide-react";
import { useAppContext } from "../hooks/useAppContext";

export default function MyProfile() {
    const { currentUser, employees, userRole, updateEmployee } = useAppContext();
    const myData = (employees || []).find((e) => 
        (e.id && e.id === currentUser?.id) || 
        (e.uid && e.uid === currentUser?.uid) || 
        (e.employeeId && e.employeeId === currentUser?.employeeId) || 
        (e.email && currentUser?.email && e.email === currentUser?.email) || 
        (e.name && currentUser?.name && e.name === currentUser?.name && e.email === currentUser?.email)
    ) || currentUser;

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-12">

            {/* Unique Self-Profile Header Component */}
            <div className="relative w-full h-64 rounded-t-[40px] bg-gradient-to-r from-[#0f4184] via-[#0b3166] to-[#0a2040] overflow-hidden shadow-lg border-b border-[#0f4184]/50">
                <div className="absolute inset-0 bg-white/5 opacity-50" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            <div className="bg-white rounded-[40px] -mt-20 relative px-8 pb-12 pt-6 shadow-sm border border-gray-100 flex flex-col items-center text-center max-w-4xl mx-auto z-10 box-decoration-clone transition-all hover:shadow-md">
                {/* Floating Avatar */}
                <div className="relative -mt-24 mb-6 group">
                    <div className="w-40 h-40 rounded-[40px] border-[6px] border-white bg-gradient-to-br from-[#0f4184] to-primary flex items-center justify-center text-white text-5xl font-black shadow-2xl overflow-hidden uppercase transition-all group-hover:opacity-80">
                        {myData?.avatarUrl ? <img src={myData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : (myData?.name || "U").charAt(0)}
                    </div>
                    
                    <label className="absolute inset-0 m-1.5 rounded-[34px] flex flex-col items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm z-20">
                        <Camera size={28} className="mb-2" />
                        <span className="text-xs uppercase font-bold tracking-widest leading-tight text-center px-2">Update<br/>Photo</span>
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
                                        await updateEmployee(myData.uid || myData.id || myData.employeeId || currentUser?.uid, { avatarUrl: base64Str });
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }} 
                        />
                    </label>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-emerald-500 border-[3px] border-white shadow-xl flex items-center justify-center text-white">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <h1 className="text-4xl font-extrabold text-textPrimary tracking-tight hover:text-[#0f4184] transition-colors">{myData?.name || "Anonymous User"}</h1>
                    <p className="text-sm font-bold text-primary mt-2 uppercase tracking-[0.2em] bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">{myData?.designation || userRole || "Employee"}</p>

                    <div className="flex items-center gap-1.5 mt-4 px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-full cursor-help group">
                        <ShieldCheck size={14} className="text-secondary group-hover:text-primary transition-colors" />
                        <span className="text-[11px] font-bold text-textSecondary group-hover:text-primary transition-colors uppercase tracking-widest">{myData?.employeeId || myData?.uid || myData?.id || "N/A"}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-12 border-t border-gray-50 pt-10">
                    <div className="flex items-center justify-center gap-3 group">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-sm">
                            <Mail size={18} />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest leading-none">Primary Email</p>
                            <p className="text-[13px] font-bold text-textPrimary mt-1.5 truncate max-w-[150px]">{myData?.email || `${(myData?.name || "user").replace(/\s+/g, ".")}@nexi5.com`.toLowerCase()}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-3 group">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-sm">
                            <Briefcase size={18} />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest leading-none">Department</p>
                            <p className="text-[13px] font-bold text-textPrimary mt-1.5">{myData?.department || "Core Operations"}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-3 group">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-sm">
                            <MapPin size={18} />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest leading-none">Location</p>
                            <p className="text-[13px] font-bold text-textPrimary mt-1.5">{myData?.location || "San Francisco HQ"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Unique Self-Profile Interactive Modules */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto pt-4">
                <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-shadow cursor-default">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#0f4184]/5 blur-2xl rounded-full -mr-16 -mt-16 group-hover:bg-[#0f4184]/10 transition-colors pointer-events-none" />
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-8">
                        <Activity size={16} className="text-primary" /> Employment Details
                    </h3>

                    <div className="space-y-6">
                        <div className="flex justify-between items-end border-b border-gray-50 pb-5">
                            <div>
                                <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">Manager</p>
                                <p className="text-2xl font-bold text-textPrimary leading-none mt-2">{myData?.manager || "Unassigned"}</p>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full"><User size={14} /> Active Report</div>
                        </div>

                        <div className="flex justify-between items-end border-b border-gray-50 pb-5">
                            <div>
                                <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">Joining Date</p>
                                <p className="text-2xl font-bold text-textPrimary leading-none mt-2">{myData?.joiningDate || "N/A"}</p>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-full"><Calendar size={14} /> Official Start</div>
                        </div>

                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">Employment Status</p>
                                <p className="text-2xl font-bold text-textPrimary leading-none mt-2">{myData?.status || "Active"}</p>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-50 px-3 py-1.5 rounded-full"><ShieldCheck size={14} /> Monitored</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-shadow cursor-default">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-2xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors pointer-events-none" />
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-8">
                        <Award size={16} className="text-[#0b3166]" /> Payroll & Compensation
                    </h3>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100 flex flex-col items-center text-center shadow-sm hover:-translate-y-1 transition-transform cursor-pointer">
                            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-500 flex items-center justify-center mb-4 shadow-inner">
                                <Activity size={24} />
                            </div>
                            <p className="text-[11px] font-black text-textPrimary uppercase tracking-widest">Basic Salary</p>
                            <p className="text-[16px] text-textSecondary font-bold mt-1.5">${parseFloat(myData?.basicSalary || 0).toLocaleString()}</p>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100 flex flex-col items-center text-center shadow-sm hover:-translate-y-1 transition-transform cursor-pointer">
                            <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 text-blue-500 flex items-center justify-center mb-4 shadow-inner">
                                <Medal size={24} />
                            </div>
                            <p className="text-[11px] font-black text-textPrimary uppercase tracking-widest">Allowances</p>
                            <p className="text-[16px] text-textSecondary font-bold mt-1.5">${parseFloat(myData?.allowances || 0).toLocaleString()}</p>
                        </div>
                    </div>

                    <button className="w-full mt-8 py-4 rounded-2xl bg-gray-50 hover:bg-gray-100 hover:text-primary transition-colors text-[11px] font-black text-textSecondary uppercase tracking-widest flex items-center justify-center gap-2 border border-transparent hover:border-gray-200">
                        Total Compensation: ${(parseFloat(myData?.basicSalary || 0) + parseFloat(myData?.allowances || 0)).toLocaleString()} <ChevronRight size={14} />
                    </button>
                </div>
            </div>
            

            {/* Company Policies & Guidelines */}
            <div className="max-w-4xl mx-auto mt-8">
                <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-shadow cursor-default">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-2xl rounded-full -mr-16 -mt-16 group-hover:bg-secondary/10 transition-colors pointer-events-none" />
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-8">
                        <BookOpen size={16} className="text-[#0f4184]" /> Company Rules & Policies
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: "Code of Conduct", desc: "Workplace ethics and professional behavior guidelines.", icon: ShieldCheck, color: "text-emerald-500" },
                            { title: "Leave Policy", desc: "Annual holiday allocations and time-off rules.", icon: Calendar, color: "text-blue-500" },
                            { title: "IT Asset Rules", desc: "Hardware usage and cybersecurity protocols.", icon: Activity, color: "text-amber-500" }
                        ].map((policy, i) => (
                            <div key={i} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col items-start shadow-sm hover:-translate-y-1 transition-transform cursor-pointer group/card">
                                <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-sm border border-gray-100 transition-colors ${policy.color}`}>
                                    <policy.icon size={20} />
                                </div>
                                <p className="text-[11px] font-black text-textPrimary uppercase tracking-widest">{policy.title}</p>
                                <p className="text-[10px] text-textSecondary font-bold mt-2 leading-relaxed">{policy.desc}</p>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-8 py-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 hover:to-gray-200 transition-colors text-[11px] font-black text-textPrimary uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm border border-gray-200">
                        Access Full Employee Handbook <ChevronRight size={14} />
                    </button>
                </div>
            </div>

        </div>
    );
}
