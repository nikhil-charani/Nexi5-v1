const mockProjects = [
  {
    id: "PRJ-001",
    name: "FinTrack ERP Upgrade",
    client: "National Payments Corp",
    startDate: "2024-08-01",
    endDate: "2025-02-28",
    status: "Active",
    description: "Upgrading legacy ERP to cloud-based FinTrack 3.0.",
    modules: [
      { id: "M-001", projectId: "PRJ-001", name: "Frontend Dashboard", assignedTo: "Ananya Iyer", assignedToId: "EMP-1001", department: "Engineering", progress: 75, status: "In Progress", dueDate: "2024-12-15" },
      { id: "M-002", projectId: "PRJ-001", name: "API Integration", assignedTo: "Suresh Raina", assignedToId: "EMP-1005", department: "Engineering", progress: 50, status: "In Progress", dueDate: "2024-12-31" },
      { id: "M-003", projectId: "PRJ-001", name: "Payroll Module", assignedTo: "Vikram Sethi", assignedToId: "EMP-1004", department: "Finance", progress: 90, status: "In Progress", dueDate: "2024-12-01" }
    ]
  },
  {
    id: "PRJ-002",
    name: "HR Self-Service Portal",
    client: "Internal",
    startDate: "2024-10-01",
    endDate: "2025-03-31",
    status: "Active",
    description: "Employee self-service portal for leave, payslips and docs.",
    modules: [
      { id: "M-004", projectId: "PRJ-002", name: "Leave Management UI", assignedTo: "Priya Sharma", assignedToId: "EMP-1003", department: "HR", progress: 60, status: "In Progress", dueDate: "2024-12-20" },
      { id: "M-005", projectId: "PRJ-002", name: "Notification Engine", assignedTo: "Suresh Raina", assignedToId: "EMP-1005", department: "Engineering", progress: 20, status: "In Progress", dueDate: "2025-01-15" }
    ]
  },
  {
    id: "PRJ-003",
    name: "Brand Revamp 2025",
    client: "IndiaMart Solutions",
    startDate: "2024-11-01",
    endDate: "2025-04-30",
    status: "Active",
    description: "Full brand relaunch including web, collateral, and social.",
    modules: [
      { id: "M-006", projectId: "PRJ-003", name: "Branding Strategy", assignedTo: "Rajesh Pillai", assignedToId: "EMP-1002", department: "Marketing", progress: 35, status: "In Progress", dueDate: "2025-01-31" }
    ]
  }
];
const initialEmployees = [
  {
    id: "EMP-1001",
    name: "Ananya Iyer",
    department: "Engineering",
    designation: "Senior Frontend Developer",
    role: "Admin",
    manager: "Arjun Mehta",
    joiningDate: "2022-01-15",
    status: "Active",
    email: "admin@hrm.com",
    avatarUrl: "https://ui.shadcn.com/avatars/01.png",
    basicSalary: 12e4,
    allowances: 25e3,
    deductions: 1e4,
    performanceScore: 4.8
  },
  {
    id: "EMP-1002",
    name: "Rajesh Pillai",
    department: "HR",
    designation: "HR Head",
    role: "HR Head",
    manager: "Arjun Mehta",
    joiningDate: "2021-06-01",
    status: "Active",
    email: "hrhead@hrm.com",
    avatarUrl: "https://ui.shadcn.com/avatars/02.png",
    basicSalary: 95e3,
    allowances: 15e3,
    deductions: 8e3,
    performanceScore: 4.2
  },
  {
    id: "EMP-1006",
    name: "Karan Malhotra",
    department: "Engineering",
    designation: "Engineering Manager",
    role: "Manager",
    manager: "Ananya Iyer",
    joiningDate: "2020-03-15",
    status: "Active",
    email: "manager@hrm.com",
    avatarUrl: "https://ui.shadcn.com/avatars/06.png",
    basicSalary: 11e4,
    allowances: 2e4,
    deductions: 9e3,
    performanceScore: 3.5
  },
  {
    id: "EMP-1003",
    name: "Priya Sharma",
    department: "HR",
    designation: "HR Recruiter",
    role: "HR Recruiter",
    manager: "Rajesh Pillai",
    joiningDate: "2023-03-10",
    status: "On Leave",
    email: "hrrecruiter@hrm.com",
    avatarUrl: "https://ui.shadcn.com/avatars/03.png",
    basicSalary: 6e4,
    allowances: 8e3,
    deductions: 5e3,
    performanceScore: 4.5
  },
  {
    id: "EMP-1004",
    name: "Vikram Sethi",
    department: "Finance",
    designation: "HR Accountant",
    role: "HR Accountant",
    manager: "Rajesh Pillai",
    joiningDate: "2020-11-20",
    status: "Active",
    email: "hraccountant@hrm.com",
    avatarUrl: "https://ui.shadcn.com/avatars/04.png",
    basicSalary: 8e4,
    allowances: 12e3,
    deductions: 7e3,
    performanceScore: 3.8
  },
  {
    id: "EMP-1005",
    name: "Suresh Raina",
    department: "Engineering",
    designation: "Backend Developer",
    role: "Employee",
    manager: "Karan Malhotra",
    joiningDate: "2023-08-05",
    status: "Active",
    email: "employee@hrm.com",
    avatarUrl: "https://ui.shadcn.com/avatars/05.png",
    basicSalary: 7e4,
    allowances: 1e4,
    deductions: 6e3,
    performanceScore: 4
  },
  {
    id: "EMP-1007",
    name: "Rohit Sharma",
    department: "Sales",
    designation: "Business Development Exec",
    role: "BDE",
    manager: "Arjun Mehta",
    joiningDate: "2023-01-10",
    status: "Active",
    email: "bde@hrm.com",
    avatarUrl: "https://ui.shadcn.com/avatars/01.png",
    basicSalary: 65e3,
    allowances: 15e3,
    deductions: 5e3,
    performanceScore: 4.6
  }
];
const mockLeaves = [
  {
    id: "LV-001",
    employeeId: "EMP-1003",
    employeeName: "Priya Sharma",
    department: "HR",
    type: "Sick Leave",
    startDate: "2024-10-15",
    endDate: "2024-10-17",
    reason: "Fever and Flu",
    status: "Approved",
    appliedOn: "2024-10-14"
  },
  {
    id: "LV-002",
    employeeId: "EMP-1002",
    employeeName: "Rajesh Pillai",
    department: "Marketing",
    type: "Paid Leave",
    startDate: "2024-11-20",
    endDate: "2024-11-25",
    reason: "Family Trip to Kerala",
    status: "Pending",
    appliedOn: "2024-10-25"
  },
  {
    id: "LV-003",
    employeeId: "EMP-1005",
    employeeName: "Suresh Raina",
    department: "Engineering",
    type: "Casual Leave",
    startDate: "2024-12-02",
    endDate: "2024-12-03",
    reason: "Personal Work",
    status: "Pending",
    appliedOn: "2024-11-25"
  },
  {
    id: "LV-004",
    employeeId: "EMP-1004",
    employeeName: "Vikram Sethi",
    department: "Finance",
    type: "Work From Home",
    startDate: "2024-11-28",
    endDate: "2024-11-29",
    reason: "Home repairs",
    status: "Approved",
    appliedOn: "2024-11-20"
  }
];
const mockCandidates = [
  { id: "CAN-001", name: "Aditya Birla", position: "UX Designer", experience: "4 Years", status: "Interviewing", appliedDate: "2024-10-20" },
  { id: "CAN-002", name: "Ishita Goyal", position: "Product Manager", experience: "7 Years", status: "New", appliedDate: "2024-10-26" }
];
const mockPayroll = [
  { id: "PR-102024-1001", employeeId: "EMP-1001", month: "October 2024", basicSalary: 12e4, allowances: 25e3, deductions: 1e4, netSalary: 135e3, status: "Paid" },
  { id: "PR-102024-1002", employeeId: "EMP-1002", month: "October 2024", basicSalary: 95e3, allowances: 15e3, deductions: 8e3, netSalary: 102e3, status: "Paid" },
  { id: "PR-102024-1003", employeeId: "EMP-1004", month: "October 2024", basicSalary: 8e4, allowances: 12e3, deductions: 7e3, netSalary: 85e3, status: "Paid" },
  { id: "PR-102024-1005", employeeId: "EMP-1005", month: "October 2024", basicSalary: 7e4, allowances: 1e4, deductions: 6e3, netSalary: 74e3, status: "Paid" }
];
const payrollTrendData = [
  { name: "Jan", cost: 85e4 },
  { name: "Feb", cost: 86e4 },
  { name: "Mar", cost: 86e4 },
  { name: "Apr", cost: 88e4 },
  { name: "May", cost: 885e3 },
  { name: "Jun", cost: 92e4 }
];
const employeeGrowthData = [
  { name: "Q1", employees: 120 },
  { name: "Q2", employees: 135 },
  { name: "Q3", employees: 150 },
  { name: "Q4", employees: 180 }
];
const mockTasks = [
  { id: "T-001", title: "Finalize Q4 payroll report", description: "Complete final payroll for Mumbai office.", assignedTo: "Vikram Sethi", assignedToId: "EMP-1004", priority: "High", dueDate: "2024-11-30", status: "In Progress", createdAt: "2024-11-01" },
  { id: "T-002", title: "Onboard Bangalore hire", description: "Prepare kit for new engineering hire.", assignedTo: "Priya Sharma", assignedToId: "EMP-1003", priority: "Medium", dueDate: "2024-12-05", status: "Pending", createdAt: "2024-11-10" },
  { id: "T-003", title: "Update HR policy 2025", description: "Include new Indian holiday list.", assignedTo: "Ananya Iyer", assignedToId: "EMP-1001", priority: "Low", dueDate: "2024-12-15", status: "Pending", createdAt: "2024-11-12" }
];
const mockAnnouncements = [
  { id: "ANN-001", title: "Diwali Holiday Notice", content: "Office will be closed for Diwali from Oct 31 to Nov 2.", author: "HR Team", category: "Holiday", date: "2024-10-20", pinned: true },
  { id: "ANN-002", title: "Bangalore Town Hall", content: "In-person town hall at the Bangalore hub next Monday.", author: "CEO Office", category: "Company Update", date: "2024-11-18", pinned: true }
];
const mockLeads = [
  { id: "LD-001", name: "Alok Nath", company: "TechNova", email: "alok@technova.in", phone: "+91 9876543210", status: "New", source: "Website", createdAt: "2024-11-20" },
  { id: "LD-002", name: "Simran Kaur", company: "Logix Solutions", email: "simran@logix.com", phone: "+91 9123456780", status: "Qualified", source: "Referral", createdAt: "2024-11-18" }
];
const mockClients = [
  { id: "CLI-001", name: "Ravi Kumar", company: "National Payments Corp", email: "ravi@npc.in", phone: "+91 8888888888", industry: "Finance", onboardedDate: "2024-01-15" },
  { id: "CLI-002", name: "Sunita Rao", company: "IndiaMart Solutions", email: "sunita@indiamart.in", phone: "+91 7777777777", industry: "E-commerce", onboardedDate: "2023-11-05" }
];
const mockDeals = [
  { id: "DL-001", title: "FinTrack Custom Module Phase 2", clientName: "National Payments Corp", amount: 45e4, stage: "Negotiation", expectedCloseDate: "2024-12-15", owner: "Rohit Sharma" },
  { id: "DL-002", title: "Annual Retainer 2025", clientName: "IndiaMart Solutions", amount: 12e5, stage: "Proposal", expectedCloseDate: "2024-12-31", owner: "Rohit Sharma" }
];
const mockNotifications = [
  { id: "N-001", title: "Leave Approved", message: "Your Diwali leave (Oct 31\u2013Nov 2) has been approved.", type: "leave", read: false, time: "2 min ago" },
  { id: "N-002", title: "Missed Call", message: "You missed a call from Karan Malhotra.", type: "call", read: false, time: "15 min ago" },
  { id: "N-003", title: "Task Assigned", message: "Ananya Iyer assigned you: Finalize Q4 Payroll Report.", type: "task", read: false, time: "1 hr ago" },
  { id: "N-004", title: "Concern Resolved", message: "Your concern #GRV-003 has been marked as Resolved by HR.", type: "concern", read: false, time: "2 hrs ago" },
  { id: "N-005", title: "Salary Credited", message: "October salary of \u20B91,35,000 has been credited to your account.", type: "payroll", read: true, time: "3 hrs ago" },
  { id: "N-006", title: "New Announcement", message: "Bangalore Town Hall all-hands meeting on Monday at 10 AM.", type: "announcement", read: true, time: "5 hrs ago" },
  { id: "N-007", title: "Leave Pending", message: "Suresh Raina has applied for Casual Leave \u2014 awaiting your approval.", type: "leave", read: true, time: "Yesterday" }
];
const orgChartData = {
  id: "CEO",
  name: "Arjun Mehta",
  title: "Chief Executive Officer",
  department: "Executive",
  children: [
    {
      id: "CTO",
      name: "Ananya Iyer",
      title: "CTO",
      department: "Engineering",
      avatarUrl: "https://ui.shadcn.com/avatars/01.png",
      children: [
        {
          id: "EMP-1006",
          name: "Karan Malhotra",
          title: "Engineering Manager",
          department: "Engineering",
          avatarUrl: "https://ui.shadcn.com/avatars/06.png",
          children: [
            { id: "EMP-1005", name: "Suresh Raina", title: "Backend Developer", department: "Engineering", avatarUrl: "https://ui.shadcn.com/avatars/05.png" },
            { id: "EMP-1004", name: "Vikram Sethi", title: "Financial Analyst", department: "Finance", avatarUrl: "https://ui.shadcn.com/avatars/04.png" }
          ]
        }
      ]
    },
    {
      id: "HRD",
      name: "Rajesh Pillai",
      title: "HR Manager",
      department: "HR",
      avatarUrl: "https://ui.shadcn.com/avatars/02.png",
      children: [
        { id: "EMP-1003", name: "Priya Sharma", title: "HR Specialist", department: "HR", avatarUrl: "https://ui.shadcn.com/avatars/03.png" }
      ]
    }
  ]
};
const mockCalendarEvents = [
  { id: "EV-001", title: "Diwali", date: "2024-10-31", type: "holiday" },
  { id: "EV-002", title: "Priya Sharma - Leave", date: "2024-12-05", type: "leave" }
];
const aiInsights = [
  { id: 1, icon: "\u{1F4C9}", text: "Engineering attendance down 5% this week.", severity: "warning" },
  { id: 2, icon: "\u{1F3C6}", text: "Top performer: Ananya Iyer rated 5/5 this quarter.", severity: "success" },
  { id: 3, icon: "\u26A0\uFE0F", text: "2 open grievances need HR attention.", severity: "danger" },
  { id: 4, icon: "\u{1F4A1}", text: "FinTrack ERP 75% complete \u2014 on schedule.", severity: "info" }
];
const departmentDistribution = [
  { name: "Engineering", value: 45 },
  { name: "Marketing", value: 15 },
  { name: "HR", value: 12 },
  { name: "Finance", value: 18 },
  { name: "Operations", value: 10 }
];
const attendanceTrendData = [
  { name: "Mon", present: 42, absent: 3 },
  { name: "Tue", present: 44, absent: 1 },
  { name: "Wed", present: 40, absent: 5 },
  { name: "Thu", present: 43, absent: 2 },
  { name: "Fri", present: 38, absent: 7 }
];
const mockChats = [
  {
    id: "EMP-1003",
    name: "Priya Sharma",
    role: "HR Recruiter",
    department: "HR",
    online: true,
    lastSeen: "now",
    unread: 2,
    messages: [
      { id: "m1", senderId: "EMP-1003", text: "Hey, can you approve the Q4 bonus?", time: "10:15 AM", read: true },
      { id: "m2", senderId: "me", text: "Sure, sending it over in 10 minutes.", time: "10:18 AM", read: true },
      { id: "m3", senderId: "EMP-1003", text: "Great! Also the onboarding doc needs review.", time: "10:30 AM", read: false },
      { id: "m4", senderId: "EMP-1003", text: "I uploaded it to the Documents vault.", time: "10:31 AM", read: false }
    ]
  },
  {
    id: "EMP-1006",
    name: "Karan Malhotra",
    role: "Engineering Manager",
    department: "Engineering",
    online: true,
    lastSeen: "now",
    unread: 0,
    messages: [
      { id: "m5", senderId: "EMP-1006", text: "Sprint 12 planning starts tomorrow at 9 AM.", time: "9:05 AM", read: true },
      { id: "m6", senderId: "me", text: "Got it, will prepare the backlog.", time: "9:10 AM", read: true },
      { id: "m7", senderId: "EMP-1006", text: "Perfect. Feel free to call if needed.", time: "9:12 AM", read: true }
    ]
  },
  {
    id: "EMP-1005",
    name: "Suresh Raina",
    role: "Backend Developer",
    department: "Engineering",
    online: false,
    lastSeen: "2 hrs ago",
    unread: 0,
    messages: [
      { id: "m8", senderId: "me", text: "How is the API integration going?", time: "Yesterday", read: true },
      { id: "m9", senderId: "EMP-1005", text: "50% done. Should be complete by Friday.", time: "Yesterday", read: true }
    ]
  },
  {
    id: "EMP-1004",
    name: "Vikram Sethi",
    role: "HR Accountant",
    department: "Finance",
    online: false,
    lastSeen: "1 day ago",
    unread: 1,
    messages: [
      { id: "m10", senderId: "EMP-1004", text: "October payroll is ready for your sign-off.", time: "Mon", read: false }
    ]
  }
];
const mockActivityFeed = [
  { id: "A1", type: "checkin", message: "Ananya Iyer checked in", time: "9:02 AM", user: "Ananya Iyer" },
  { id: "A2", type: "leave_applied", message: "Suresh Raina applied for Casual Leave", time: "9:45 AM", user: "Suresh Raina" },
  { id: "A3", type: "task_update", message: "Q4 Payroll Report moved to In Progress", time: "10:15 AM", user: "Vikram Sethi" },
  { id: "A4", type: "leave_approved", message: "Vikram Sethi Work From Home approved", time: "11:00 AM", user: "Priya Sharma" },
  { id: "A5", type: "new_client", message: "New client: Sunita Rao from IndiaMart added", time: "11:30 AM", user: "Rohit Sharma" },
  { id: "A6", type: "new_employee", message: "Aditya Birla joined as UX Designer", time: "2:00 PM", user: "Priya Sharma" },
  { id: "A7", type: "checkin", message: "Karan Malhotra checked out", time: "6:30 PM", user: "Karan Malhotra" }
];
export {
  aiInsights,
  attendanceTrendData,
  departmentDistribution,
  employeeGrowthData,
  initialEmployees,
  mockActivityFeed,
  mockAnnouncements,
  mockCalendarEvents,
  mockCandidates,
  mockChats,
  mockClients,
  mockDeals,
  mockLeads,
  mockLeaves,
  mockNotifications,
  mockPayroll,
  mockProjects,
  mockTasks,
  orgChartData,
  payrollTrendData
};
