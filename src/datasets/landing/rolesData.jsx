import { Shield, Building, Users, UserCircle } from 'lucide-react';
import React from 'react';

export const rolesAccessData = [
    {
        icon: <Shield size={24} />,
        title: "Admin / CEO",
        color: "from-purple-500 to-cyan-500",
        bg: "bg-purple-50 dark:bg-purple-500/10",
        iconColor: "text-purple-600 dark:text-purple-400",
        features: [
            "Strategic dashboards",
            "Organization management",
            "Analytics and reporting"
        ]
    },
    {
        icon: <Building size={24} />,
        title: "HR Department",
        color: "from-primary to-secondary",
        bg: "bg-blue-50 dark:bg-blue-500/10",
        iconColor: "text-primary dark:text-[#3ec3ff]",
        features: [
            "Employee lifecycle management",
            "Payroll processing",
            "Leave approvals",
            "Training management"
        ]
    },
    {
        icon: <Users size={24} />,
        title: "Managers",
        color: "from-amber-500 to-orange-500",
        bg: "bg-amber-50 dark:bg-amber-500/10",
        iconColor: "text-amber-600 dark:text-amber-400",
        features: [
            "Team dashboards",
            "Performance reviews",
            "Leave approvals"
        ]
    },
    {
        icon: <UserCircle size={24} />,
        title: "Employees",
        color: "from-emerald-500 to-teal-500",
        bg: "bg-emerald-50 dark:bg-emerald-500/10",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        features: [
            "Self service portal",
            "Attendance tracking",
            "Payslip viewing",
            "Leave requests"
        ]
    }
];
