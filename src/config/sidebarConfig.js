import { 
    LayoutDashboard, Building2, UserCheck, ClipboardCheck, CalendarOff, 
    CalendarDays, CalendarCheck, CreditCard, Wallet, FileText, FolderKanban,
    Users, Shield, Briefcase, FileSearch, ClipboardList, PenTool, FilePlus,
    UserPlus, CheckCircle, FileCheck, ShieldAlert, HeartHandshake, UserPlus2,
    BarChart3, Settings, Bell, LogOut, FileBarChart, PieChart, Landmark,
    TrendingUp, FileSignature, Receipt, Calculator, Banknote, ShieldCheck,
    Package, MessageSquare, FileQuestion, Bot
} from 'lucide-react';

export const sidebarConfig = {
  admin: [
    {
      category: "Core Dashboard",
      items: [
        { label: "Dashboard", path: "/dashboard/admin", icon: LayoutDashboard },
        { label: "Organization Overview", path: "/dashboard/org-overview", icon: Building2 },
      ]
    },
    {
      category: "User Management",
      items: [
        { label: "User Management", path: "/dashboard/users", icon: Users },
        { label: "Manage Roles", path: "/dashboard/manage-roles", icon: Shield },
        { label: "Permissions", path: "/dashboard/permissions", icon: ShieldAlert },
      ]
    },
    {
      category: "HR Operations",
      items: [
        { label: "HR Management", path: "/dashboard/hr-management", icon: UserCheck },
        { label: "Recruitment Overview", path: "/dashboard/recruitment-overview", icon: Briefcase },
        { label: "Client & Business Overview", path: "/dashboard/client-business-overview", icon: TrendingUp },
        { label: "Attendance Monitoring", path: "/dashboard/attendance", icon: ClipboardCheck },
        { label: "Employee Management", path: "/dashboard/employees", icon: UserCheck },
        { label: "Leave Management", path: "/dashboard/leaves", icon: CalendarCheck },
      ]
    },
    {
      category: "Finance & Analytics",
      items: [
        { label: "Payroll Overview", path: "/dashboard/payroll", icon: CreditCard },
        { label: "Reports & Analytics", path: "/dashboard/reports", icon: BarChart3 },
        { label: "AI Assistant", path: "/dashboard/ai-assistant", icon: Bot },
      ]
    },
    {
      category: "System Administration",
      items: [
        { label: "System Settings", path: "/dashboard/system-settings", icon: Settings },
        { label: "Audit Logs", path: "/dashboard/audit-logs", icon: FileSearch },
      ]
    },
    {
      category: "Communication",
      items: [
        { label: "Notifications", path: "/dashboard/notifications", icon: Bell }
      ]
    }
  ],

  'hr-head': [
    {
      category: "Core Dashboard",
      items: [
        { label: "Dashboard", path: "/dashboard/hr-head", icon: LayoutDashboard },
      ]
    },
    {
      category: "Recruitment & Hiring",
      items: [
        { label: "Recruitment Management", path: "/dashboard/hr-head/recruitment-management", icon: Briefcase },
        { label: "Job Approvals", path: "/dashboard/hr-head/job-approvals", icon: FileCheck },
        { label: "Hiring Requests", path: "/dashboard/hr-head/hiring-requests", icon: FilePlus },
        { label: "Candidate Management", path: "/dashboard/hr-head/candidate-management", icon: Users },
        { label: "Interview Panel Overview", path: "/dashboard/hr-head/interview-panel", icon: ClipboardList },
      ]
    },
    {
      category: "Workforce & Operations",
      items: [
        { label: "Workforce Planning", path: "/dashboard/hr-head/workforce-planning", icon: PenTool },
        { label: "Employee Management", path: "/dashboard/employees", icon: UserCheck },
        { label: "Project Allocation", path: "/dashboard/project", icon: FolderKanban },
      ]
    },
    {
      category: "Compliance & Finance",
      items: [
        { label: "HR Policies & Compliance", path: "/dashboard/hr-head/hr-policies-compliance", icon: ShieldCheck },
        { label: "Payroll Approval", path: "/dashboard/hr-head/payroll-approval", icon: Receipt },
      ]
    },
    {
      category: "Reports & Communication",
      items: [
        { label: "Reports & Analytics", path: "/dashboard/reports", icon: BarChart3 },
        { label: "HR Chat / Notifications", path: "/dashboard/hr-head/hr-chat", icon: Bell },
        { label: "AI Assistant", path: "/dashboard/ai-assistant", icon: Bot }
      ]
    }
  ],

  'hr-executive': [
    {
      category: "Core Dashboard",
      items: [
        { label: "Dashboard", path: "/dashboard/hr-executive", icon: LayoutDashboard },
      ]
    },
    {
      category: "Employee Operations",
      items: [
        { label: "Employee Details", path: "/dashboard/employees", icon: Users },
        { label: "Add Employee", path: "/dashboard/employee/add", icon: UserPlus },
        { label: "Asset Management", path: "/dashboard/hr-executive/assets", icon: Package },
      ]
    },
    {
      category: "Attendance & Leave",
      items: [
        { label: "Attendance Overview", path: "/dashboard/attendance", icon: ClipboardCheck },
        { label: "Leave Requests", path: "/dashboard/leaves", icon: CalendarCheck },
      ]
    },
    {
      category: "Reports & Communication",
      items: [
        { label: "Reports", path: "/dashboard/hr-executive/reports", icon: BarChart3 },
        { label: "Notifications", path: "/dashboard/notifications", icon: Bell },
        { label: "HR Chat", path: "/dashboard/hr-chat", icon: MessageSquare },
        { label: "AI Assistant", path: "/dashboard/ai-assistant", icon: Bot }
      ]
    }
  ],

  'hr-accountant': [
    {
      category: "Core Dashboard",
      items: [
        { label: "Dashboard", path: "/dashboard/hr-accountant", icon: LayoutDashboard },
      ]
    },
    {
      category: "Payroll Processing",
      items: [
        { label: "Payroll Management", path: "/dashboard/payroll", icon: CreditCard },
        { label: "Process Payroll", path: "/dashboard/hr-accountant/process-payroll", icon: Calculator },
        { label: "Salary Components", path: "/dashboard/hr-accountant/salary-components", icon: Banknote },
        { label: "Attendance & Leave Data", path: "/dashboard/hr-accountant/attendance-leave-data", icon: ClipboardList },
      ]
    },
    {
      category: "Payments & Benefits",
      items: [
        { label: "Salary Slips", path: "/dashboard/hr-accountant/salary-slips", icon: Receipt },
        { label: "Reimbursements", path: "/dashboard/hr-accountant/reimbursements", icon: Wallet },
        { label: "Bonus Management", path: "/dashboard/hr-accountant/bonus-management", icon: TrendingUp },
      ]
    },
    {
      category: "Statutory & Taxation",
      items: [
        { label: "Statutory Compliance", path: "/dashboard/hr-accountant/statutory-compliance", icon: ShieldCheck },
        { label: "PF", path: "/dashboard/hr-accountant/pf", icon: Landmark },
        { label: "ESI", path: "/dashboard/hr-accountant/esi", icon: HeartHandshake },
        { label: "TDS", path: "/dashboard/hr-accountant/tds", icon: Calculator },
        { label: "Tax Documents", path: "/dashboard/hr-accountant/tax-documents", icon: FileBarChart },
        { label: "Form 16 / 16A / 16B", path: "/dashboard/hr-accountant/form16", icon: FileCheck },
      ]
    },
    {
      category: "Reports & Communication",
      items: [
        { label: "Payroll Reports", path: "/dashboard/hr-accountant/payroll-reports", icon: PieChart },
        { label: "Financial Reports", path: "/dashboard/hr-accountant/financial-reports", icon: Calculator },
        { label: "Notifications", path: "/dashboard/notifications", icon: Bell },
        { label: "AI Assistant", path: "/dashboard/ai-assistant", icon: Bot }
      ]
    }
  ],
  
  bde: [
    {
      category: "Core Dashboard",
      items: [
        { label: "BDE Dashboard", path: "/dashboard/bde", icon: LayoutDashboard },
      ]
    },
    {
      category: "Sales & Clients",
      items: [
        { label: "Client Management", path: "/dashboard/bde/client-management", icon: Building2 },
        { label: "Deal Pipeline", path: "/dashboard/bde/deal-pipeline", icon: TrendingUp },
        { label: "Proposal Management", path: "/dashboard/bde/proposal-management", icon: FileText },
        { label: "Client Requirements", path: "/dashboard/bde/client-requirements", icon: ClipboardList },
        { label: "Meetings", path: "/dashboard/bde/meetings", icon: CalendarDays },
      ]
    },
    {
      category: "Revenue & Analytics",
      items: [
        { label: "Revenue Tracking", path: "/dashboard/bde/revenue-tracking", icon: BarChart3 },
        { label: "Notifications", path: "/dashboard/notifications", icon: Bell },
        { label: "AI Assistant", path: "/dashboard/ai-assistant", icon: Bot }
      ]
    }
  ],

  manager: [
    {
      category: "Core Dashboard",
      items: [
        { label: "Dashboard", path: "/dashboard/manager", icon: LayoutDashboard },
      ]
    },
    {
      category: "Team Management",
      items: [
        { label: "My Team", path: "/dashboard/team", icon: Users },
        { label: "Team Attendance", path: "/dashboard/manager/team-attendance", icon: ClipboardCheck },
        { label: "Leave Approvals", path: "/dashboard/manager/leave-approvals", icon: CalendarCheck },
      ]
    },
    {
      category: "Projects & Performance",
      items: [
        { label: "Project Monitoring", path: "/dashboard/manager/monitoring", icon: FolderKanban },
        { label: "Performance Reviews", path: "/dashboard/manager/performance-reviews", icon: BarChart3 },
      ]
    },
    {
      category: "Communication",
      items: [
        { label: "Notifications", path: "/dashboard/notifications", icon: Bell },
        { label: "AI Assistant", path: "/dashboard/ai-assistant", icon: Bot }
      ]
    }
  ],

  employee: [
    {
      category: "Core Dashboard",
      items: [
        { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      ]
    },
    {
      category: "Personnel Tools",
      items: [
        { label: "Attendance", path: "/dashboard/attendance", icon: ClipboardCheck },
        { label: "Leave Management", path: "/dashboard/leaves", icon: CalendarCheck },
      ]
    },
    {
      category: "Company Info",
      items: [
        { label: "Holidays", path: "/dashboard/holidays", icon: CalendarOff },
        { label: "Events", path: "/dashboard/events", icon: CalendarDays },
      ]
    },
    {
      category: "Communication",
      items: [
        { label: "Notifications", path: "/dashboard/notifications", icon: Bell },
        { label: "AI Assistant", path: "/dashboard/ai-assistant", icon: Bot }
      ]
    }
  ]
};

export const globalMenuItems = [
    { label: "Profile", path: "/dashboard/profile", icon: UserCheck },
    { label: "Settings", path: "/dashboard/settings", icon: Settings }
];
