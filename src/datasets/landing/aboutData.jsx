import { Users, Calendar, DollarSign, Target, FileText, BookOpen, Briefcase, UserCheck, ShieldCheck } from 'lucide-react';
import React from 'react';

export const aboutFeatures = [
    { icon: <Users size={20} />, title: "Employee Lifecycle Management" },
    { icon: <Calendar size={20} />, title: "Attendance & Leave Tracking" },
    { icon: <DollarSign size={20} />, title: "Payroll Processing" },
    { icon: <Target size={20} />, title: "Performance Management" },
    { icon: <FileText size={20} />, title: "Document Management" },
    { icon: <BookOpen size={20} />, title: "Training & Development" },
];

export const aboutFloatingNodes = [
    { top: '10%', left: '50%', color: 'bg-green-400', delay: 0, icon: <UserCheck size={20} /> },
    { top: '30%', left: '85%', color: 'bg-blue-400', delay: 1, icon: <Briefcase size={20} /> },
    { top: '75%', left: '80%', color: 'bg-cyan-400', delay: 2, icon: <DollarSign size={20} /> },
    { top: '90%', left: '45%', color: 'bg-amber-400', delay: 3, icon: <Calendar size={20} /> },
    { top: '70%', left: '15%', color: 'bg-rose-400', delay: 4, icon: <Target size={20} /> },
    { top: '25%', left: '20%', color: 'bg-teal-400', delay: 5, icon: <ShieldCheck size={20} /> },
];
