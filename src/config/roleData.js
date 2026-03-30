/**
 * roleData.js
 * Per-role user profile, notifications, and settings for the NEXI5 HRM Portal.
 * All data is keyed by the role value stored in localStorage ('userRole').
 */

import {
    Shield, Users, Briefcase, UserCheck, CreditCard,
    FileSearch, Bell, ShieldCheck, BarChart3, Target,
    ClipboardList, TrendingUp, CheckCircle2, AlertTriangle,
    FileText, MessageSquare, Key, Activity
} from 'lucide-react';

// ─── Per-role user profile data ────────────────────────────────────────────────
export const ROLE_USER_DATA = {
    admin: {
        name: 'Lokesh Kagitha',
        avatarInitial: 'L',
        avatarColor: 'bg-primary',
        email: 'admin@nexi5.com',
        phone: '+91-9876543210',
        empId: 'ADM-001',
        role: 'Admin / CEO',
        department: 'Administration',
        location: 'Hyderabad, India',
        joiningDate: 'Jan 15, 2023',
        empType: 'Full Time',
        office: 'Hyderabad HQ',
        reportingTo: 'Board of Directors',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        recentActivity: [
            { text: 'Admin logged into system', time: '2 hours ago', icon: Key, color: 'text-blue-500' },
            { text: 'User role permissions updated: Manager', time: 'Yesterday', icon: Shield, color: 'text-violet-500' },
            { text: 'New employee onboarding initiated', time: '3 days ago', icon: Users, color: 'text-emerald-500' },
            { text: 'Payroll settings updated for March', time: '4 days ago', icon: CreditCard, color: 'text-amber-500' },
            { text: 'Audit logs reviewed for Feb 2026', time: 'Last week', icon: FileSearch, color: 'text-gray-500' },
        ],
        quickActions: [
            { label: 'Edit Profile Details', icon: UserCheck, color: 'bg-blue-500' },
            { label: 'Change Account Password', icon: Key, color: 'bg-red-500' },
            { label: 'View System Audit Logs', icon: FileSearch, color: 'bg-violet-500' },
            { label: 'Open System Settings', icon: ShieldCheck, color: 'bg-emerald-500' },
        ],
    },

    'hr-head': {
        name: 'Priya Mehta',
        avatarInitial: 'P',
        avatarColor: 'bg-violet-500',
        email: 'hrhead@nexi5.com',
        phone: '+91-8765432109',
        empId: 'HRH-001',
        role: 'HR Head',
        department: 'Human Resources',
        location: 'Bangalore, India',
        joiningDate: 'Mar 10, 2022',
        empType: 'Full Time',
        office: 'Bangalore HQ',
        reportingTo: 'CEO / Admin',
        avatar: null,
        recentActivity: [
            { text: 'Reviewed payroll approval batch — March', time: '1 hour ago', icon: CreditCard, color: 'text-blue-500' },
            { text: 'Approved 3 hiring requests for Engineering', time: 'Yesterday', icon: CheckCircle2, color: 'text-emerald-500' },
            { text: 'Conducted HR interview for Sales Manager', time: '2 days ago', icon: Users, color: 'text-violet-500' },
            { text: 'Updated Remote Work Policy guidelines', time: '3 days ago', icon: FileText, color: 'text-amber-500' },
            { text: 'Reviewed compliance report for Q1 2025', time: 'Last week', icon: ShieldCheck, color: 'text-gray-500' },
        ],
        quickActions: [
            { label: 'Edit Profile Details', icon: UserCheck, color: 'bg-blue-500' },
            { label: 'Change Account Password', icon: Key, color: 'bg-red-500' },
            { label: 'View Recruitment Pipeline', icon: TrendingUp, color: 'bg-violet-500' },
            { label: 'Open HR Compliance Audit', icon: ShieldCheck, color: 'bg-emerald-500' },
        ],
    },


    'hr-accountant': {
        name: 'Deepa Sharma',
        avatarInitial: 'D',
        avatarColor: 'bg-emerald-500',
        email: 'hraccount@nexi5.com',
        phone: '+91-6543210987',
        empId: 'HRA-001',
        role: 'HR Accountant',
        department: 'Finance / HR',
        location: 'Delhi, India',
        joiningDate: 'Sep 20, 2022',
        empType: 'Full Time',
        office: 'Delhi Office',
        reportingTo: 'HR Head',
        avatar: null,
        recentActivity: [
            { text: 'Processed March payroll — 48 employees', time: '2 hours ago', icon: CreditCard, color: 'text-blue-500' },
            { text: 'Submitted Q1 salary reconciliation report', time: 'Yesterday', icon: BarChart3, color: 'text-emerald-500' },
            { text: 'Verified bonus allocations for Marketing', time: '2 days ago', icon: CheckCircle2, color: 'text-violet-500' },
            { text: 'Updated tax deduction entries — Feb cycle', time: '3 days ago', icon: FileText, color: 'text-amber-500' },
            { text: 'Salary slip generated for all departments', time: 'Last week', icon: FileSearch, color: 'text-gray-500' },
        ],
        quickActions: [
            { label: 'Edit Profile Details', icon: UserCheck, color: 'bg-blue-500' },
            { label: 'Change Account Password', icon: Key, color: 'bg-red-500' },
            { label: 'Open Payroll Dashboard', icon: CreditCard, color: 'bg-emerald-500' },
            { label: 'Generate Salary Report', icon: BarChart3, color: 'bg-violet-500' },
        ],
    },

    bde: {
        name: 'Aditya Nair',
        avatarInitial: 'A',
        avatarColor: 'bg-amber-500',
        email: 'bde@nexi5.com',
        phone: '+91-5432109876',
        empId: 'BDE-001',
        role: 'Business Development Executive',
        department: 'Sales & BD',
        location: 'Chennai, India',
        joiningDate: 'Feb 14, 2023',
        empType: 'Full Time',
        office: 'Chennai Office',
        reportingTo: 'Sales Manager',
        avatar: null,
        recentActivity: [
            { text: 'Closed new client deal — TechStartup Ltd', time: '3 hours ago', icon: Target, color: 'text-blue-500' },
            { text: 'Submitted Q1 sales performance report', time: 'Yesterday', icon: BarChart3, color: 'text-amber-500' },
            { text: 'Conducted product demo for 2 prospects', time: '2 days ago', icon: Briefcase, color: 'text-violet-500' },
            { text: 'Updated CRM with 15 new leads', time: '3 days ago', icon: TrendingUp, color: 'text-emerald-500' },
            { text: 'Attended regional partner meetup', time: 'Last week', icon: Users, color: 'text-gray-500' },
        ],
        quickActions: [
            { label: 'Edit Profile Details', icon: UserCheck, color: 'bg-blue-500' },
            { label: 'Change Account Password', icon: Key, color: 'bg-red-500' },
            { label: 'View Client Overview', icon: Briefcase, color: 'bg-amber-500' },
            { label: 'Generate Sales Report', icon: BarChart3, color: 'bg-emerald-500' },
        ],
    },

    manager: {
        name: 'Suresh Rajan',
        avatarInitial: 'S',
        avatarColor: 'bg-cyan-500',
        email: 'manager@nexi5.com',
        phone: '+91-4321098765',
        empId: 'MGR-001',
        role: 'Department Manager',
        department: 'Engineering',
        location: 'Hyderabad, India',
        joiningDate: 'May 18, 2021',
        empType: 'Full Time',
        office: 'Hyderabad HQ',
        reportingTo: 'CEO / Admin',
        avatar: null,
        recentActivity: [
            { text: 'Submitted Q2 workforce expansion request', time: '1 hour ago', icon: Users, color: 'text-blue-500' },
            { text: 'Approved leave request for 4 team members', time: 'Yesterday', icon: CheckCircle2, color: 'text-emerald-500' },
            { text: 'Reviewed sprint deliverables — Backend team', time: '2 days ago', icon: ClipboardList, color: 'text-violet-500' },
            { text: 'Conducted 1:1 performance reviews', time: '3 days ago', icon: Activity, color: 'text-amber-500' },
            { text: 'Submitted project timeline for Q2 plan', time: 'Last week', icon: FileText, color: 'text-gray-500' },
        ],
        quickActions: [
            { label: 'Edit Profile Details', icon: UserCheck, color: 'bg-blue-500' },
            { label: 'Change Account Password', icon: Key, color: 'bg-red-500' },
            { label: 'View Team Overview', icon: Users, color: 'bg-cyan-500' },
            { label: 'Submit Project Report', icon: BarChart3, color: 'bg-emerald-500' },
        ],
    },

    employee: {
        name: 'Neha Kapoor',
        avatarInitial: 'N',
        avatarColor: 'bg-pink-500',
        email: 'employee@nexi5.com',
        phone: '+91-3210987654',
        empId: 'EMP-001',
        role: 'Software Engineer',
        department: 'Engineering',
        location: 'Pune, India',
        joiningDate: 'Jan 8, 2024',
        empType: 'Full Time',
        office: 'Pune Office',
        reportingTo: 'Engineering Manager',
        avatar: null,
        recentActivity: [
            { text: 'Applied for 2-day leave in March', time: '2 hours ago', icon: ClipboardList, color: 'text-blue-500' },
            { text: 'Submitted daily work report', time: 'Yesterday', icon: FileText, color: 'text-violet-500' },
            { text: 'Completed React training module', time: '2 days ago', icon: CheckCircle2, color: 'text-emerald-500' },
            { text: 'Attended team standup meeting', time: '3 days ago', icon: Users, color: 'text-amber-500' },
            { text: 'Updated skills profile in portal', time: 'Last week', icon: UserCheck, color: 'text-gray-500' },
        ],
        quickActions: [
            { label: 'Edit Profile Details', icon: UserCheck, color: 'bg-blue-500' },
            { label: 'Change Account Password', icon: Key, color: 'bg-red-500' },
            { label: 'Apply for Leave', icon: ClipboardList, color: 'bg-pink-500' },
            { label: 'View Payslip', icon: CreditCard, color: 'bg-emerald-500' },
        ],
    },
};

// ─── Per-role notifications ────────────────────────────────────────────────────
export const ROLE_NOTIFICATIONS = {
    admin: [
        { id: 'n1', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10', title: 'System Alert', desc: 'Audit log detected unusual login pattern from new device.', time: '5 min ago', read: false },
        { id: 'n2', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', title: 'New Employee Registered', desc: '3 new employees joined Engineering and Marketing teams.', time: '1 hour ago', read: false },
        { id: 'n3', icon: CreditCard, color: 'text-violet-500', bg: 'bg-violet-500/10', title: 'Payroll Batch Ready', desc: 'March payroll batch for 48 employees is ready for sign-off.', time: '2 hours ago', read: false },
        { id: 'n4', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10', title: 'Compliance Report', desc: 'Q1 HR compliance report has been submitted for review.', time: 'Yesterday', read: true },
        { id: 'n5', icon: BarChart3, color: 'text-amber-500', bg: 'bg-amber-500/10', title: 'Monthly Analytics Ready', desc: 'March HR analytics dashboard report is now available.', time: '2 days ago', read: true },
    ],

    'hr-head': [
        { id: 'n1', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', title: 'Payroll Batch Pending', desc: 'March payroll batch is pending your approval — 48 employees.', time: '2 min ago', read: false },
        { id: 'n2', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10', title: 'Compliance Issue', desc: 'Policy violation flagged in PR-1106 — Finance dept.', time: '1 hour ago', read: false },
        { id: 'n3', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', title: 'New Hiring Request', desc: 'Engineering team submitted Q3 expansion request (30 positions).', time: '3 hours ago', read: false },
        { id: 'n4', icon: FileText, color: 'text-violet-500', bg: 'bg-violet-500/10', title: 'Policy Review Due', desc: 'Remote Work Guidelines are due for quarterly review.', time: 'Yesterday', read: true },
        { id: 'n5', icon: Briefcase, color: 'text-amber-500', bg: 'bg-amber-500/10', title: 'Interview Scheduled', desc: 'Final round for Sales Manager confirmed — Mar 20, 10:00 AM.', time: 'Yesterday', read: true },
    ],


    'hr-accountant': [
        { id: 'n1', icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-500/10', title: 'Payroll Approved', desc: 'HR Head approved March payroll batch — ready for processing.', time: '10 min ago', read: false },
        { id: 'n2', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10', title: 'Tax Calculation Error', desc: 'TDS mismatch found in PR-1106 Finance record — review needed.', time: '1 hour ago', read: false },
        { id: 'n3', icon: FileText, color: 'text-violet-500', bg: 'bg-violet-500/10', title: 'Bonus Sheet Ready', desc: 'Q1 bonus allocation sheet uploaded for review.', time: '3 hours ago', read: false },
        { id: 'n4', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', title: 'Salary Slips Generated', desc: 'February salary slips ready for all 48 employees.', time: 'Yesterday', read: true },
        { id: 'n5', icon: BarChart3, color: 'text-amber-500', bg: 'bg-amber-500/10', title: 'Audit Report Due', desc: 'Q1 payroll audit report deadline — March 20.', time: '2 days ago', read: true },
    ],

    bde: [
        { id: 'n1', icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10', title: 'Lead Assigned', desc: 'New high-priority lead assigned to you — TechStartup Ltd.', time: '5 min ago', read: false },
        { id: 'n2', icon: Briefcase, color: 'text-amber-500', bg: 'bg-amber-500/10', title: 'Demo Scheduled', desc: 'Product demo confirmed with CloudNine Corp — Mar 18, 2:00 PM.', time: '1 hour ago', read: false },
        { id: 'n3', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10', title: 'Target Achieved', desc: 'You have hit 80% of Q1 sales target — keep it up!', time: '2 hours ago', read: false },
        { id: 'n4', icon: Users, color: 'text-violet-500', bg: 'bg-violet-500/10', title: 'Team Meeting', desc: 'Weekly BD team meeting — Mar 13, 10:00 AM.', time: 'Yesterday', read: true },
        { id: 'n5', icon: FileText, color: 'text-gray-500', bg: 'bg-gray-500/10', title: 'Report Submitted', desc: 'Q1 pipeline progress report submitted to Manager.', time: '2 days ago', read: true },
    ],

    manager: [
        { id: 'n1', icon: ClipboardList, color: 'text-blue-500', bg: 'bg-blue-500/10', title: 'Leave Approval Needed', desc: '4 team members have applied for leave — awaiting approval.', time: '20 min ago', read: false },
        { id: 'n2', icon: Users, color: 'text-violet-500', bg: 'bg-violet-500/10', title: 'New Team Member', desc: 'Rahul Sharma joins Engineering team on Mar 15 — setup required.', time: '1 hour ago', read: false },
        { id: 'n3', icon: BarChart3, color: 'text-amber-500', bg: 'bg-amber-500/10', title: 'Performance Review Due', desc: 'Q1 performance reviews deadline — March 20.', time: '2 hours ago', read: false },
        { id: 'n4', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', title: 'Sprint Completed', desc: 'Backend team completed Sprint 12 — all deliverables met.', time: 'Yesterday', read: true },
        { id: 'n5', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10', title: 'Deadline Alert', desc: 'Project Alpha milestone due in 3 days — review progress.', time: '2 days ago', read: true },
    ],

    employee: [
        { id: 'n1', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', title: 'Leave Approved', desc: 'Your leave request for Mar 18–19 has been approved.', time: '1 hour ago', read: false },
        { id: 'n2', icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-500/10', title: 'Salary Credited', desc: 'February salary has been credited to your account.', time: '2 hours ago', read: false },
        { id: 'n3', icon: Bell, color: 'text-amber-500', bg: 'bg-amber-500/10', title: 'Policy Update', desc: 'Remote Work Policy has been updated — please acknowledge.', time: 'Yesterday', read: false },
        { id: 'n4', icon: ClipboardList, color: 'text-violet-500', bg: 'bg-violet-500/10', title: 'Task Assigned', desc: 'Manager assigned you to Sprint 13 frontend module.', time: 'Yesterday', read: true },
        { id: 'n5', icon: FileText, color: 'text-gray-500', bg: 'bg-gray-500/10', title: 'Appraisal Reminder', desc: 'Your Q1 self-appraisal form is due by March 20.', time: '2 days ago', read: true },
    ],
};

// ─── Notification unread counts ───────────────────────────────────────────────
export const getUnreadCount = (role) =>
    (ROLE_NOTIFICATIONS[role] || ROLE_NOTIFICATIONS.employee).filter(n => !n.read).length;

// ─── Helper to get current user data ─────────────────────────────────────────
export const getCurrentUserData = () => {
    const role = localStorage.getItem('userRole') || 'employee';
    const stored = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const base = ROLE_USER_DATA[role] || ROLE_USER_DATA.employee;
    // Override name if the user registered with a name
    return {
        ...base,
        role,
        ...(stored.name && { name: stored.name, avatarInitial: stored.name.charAt(0).toUpperCase() }),
        ...(stored.email && { email: stored.email }),
    };
};
