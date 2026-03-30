import { UsersRound, Clock, CalendarDays, Receipt, LineChart, FileText } from 'lucide-react';
import React from 'react';

export const coreFeatures = [
    {
        icon: <UsersRound />,
        title: "Employee Management",
        desc: "Maintain detailed digital records for every employee. Track personal details, job history, skills, and emergency contacts in a secure database."
    },
    {
        icon: <Clock />,
        title: "Attendance & Shift Tracking",
        desc: "Automate time-tracking with digital check-ins, biometric integration support, and customizable shift scheduling tools."
    },
    {
        icon: <CalendarDays />,
        title: "Leave Management",
        desc: "Simplify time-off requests. Employees can check balances, request leave, and managers can approve with a single click."
    },
    {
        icon: <Receipt />,
        title: "Payroll Processing",
        desc: "Generate accurate payslips automatically based on attendance, shifts, leave data, and predefined salary structures without manual calculations."
    },
    {
        icon: <LineChart />,
        title: "Performance Reviews",
        desc: "Set OKRs, track KPIs, and conduct regular 360-degree reviews to foster continuous growth and monitor employee development."
    },
    {
        icon: <FileText />,
        title: "Document Management",
        desc: "Store and organize contracts, policies, and compliance documents securely. Share files globally or with specific departments easily."
    }
];
