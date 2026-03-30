export const roleBasedSuggestions = {
    admin: [
        "Show system usage overview",
        "List pending recruitment approvals",
        "What is the total workforce count?",
        "Show last month's payroll summary",
        "Are there any pending audit logs?"
    ],
    manager: [
        "Show my team's attendance",
        "List pending leave approvals",
        "Show project monitoring status",
        "Who is on leave today?",
        "How is my team's performance review progress?"
    ],
    employee: [
        "How many leave days do I have left?",
        "Show my attendance for this month",
        "What is my latest payslip?",
        "List upcoming company holidays",
        "Show my profile details"
    ],
    default: [
        "How can I help you today?",
        "What can this AI assistant do?",
        "Show company holidays",
        "Show HR policies"
    ]
};

export const roleBasedTips = {
    admin: "You can ask for workforce analytics, review pending recruitment requests, or check system audit logs. Ensure you follow organizational data privacy policies when accessing sensitive information.",
    manager: "Try asking about your team's current attendance, pending leave approvals, or overall project milestones. Use these insights for effective resource planning and team performance management.",
    employee: "You can ask about your remaining leave balance, view your latest payslip, or check the company holiday calendar. For your security, never share passwords or sensitive personal data in this chat.",
    default: "You can ask about leave balances, payroll summaries, upcoming holidays, or employee details. For security, never share passwords in this chat."
};

const roleBasedResponses = {
    admin: {
        "employees": "The organization currently has 614 employees. 124 employees joined this year and the overall attendance rate is 92%.",
        "payroll": "The total payroll expense for March is ₹4.5M with ₹320K in deductions across all departments.",
        "recruitment": "There are currently 15 pending recruitment approvals in the pipeline, with 8 candidates in the final interview stage.",
        "usage": "System usage statistics show an 18% increase in mobile portal logins this month, with peak activity between 9:00 AM and 11:00 AM.",
        "audit": "The last 24 hours show 342 successful login events and 0 critical system alerts in the audit logs."
    },
    manager: {
        "attendance": "Your team’s attendance for this month is 94%. 12 members were present today and 2 are currently on leave.",
        "leave": "You currently have 3 leave requests pending approval from your team members.",
        "performance": "Your team's performance review progress is at 85%. You have 4 reviews still pending final submission.",
        "projects": "Project monitoring shows 2 milestones completed ahead of schedule this week, while the 'Alpha' project is awaiting budget approval."
    },
    employee: {
        "leave": "You currently have 8 annual leave days remaining.",
        "payroll": "Your latest payslip for March shows a net salary of ₹45,000 after deductions.",
        "attendance": "Your attendance for March is 95%. You have been present for 20 out of 21 working days.",
        "holidays": "The next company holiday is Holi on March 25th, followed by Good Friday on March 29th.",
        "profile": "Your profile shows you are in the Engineering department with the title of Senior Developer. Your direct manager is Suresh Rajan."
    }
};

const RESTRICTED_MESSAGE = "I’m sorry, but that information is restricted based on your role permissions.";

export const getAIResponse = (message, userRole = 'employee') => {
    const msg = message.toLowerCase();
    const roleResponses = roleBasedResponses[userRole] || roleBasedResponses.employee;

    // Direct User Example Matches
    if (msg.includes("workforce statistics") || msg.includes("employee statistics")) {
        return userRole === 'admin' ? roleBasedResponses.admin.employees : RESTRICTED_MESSAGE;
    }
    if (msg.includes("payroll overview")) {
        return userRole === 'admin' ? roleBasedResponses.admin.payroll : RESTRICTED_MESSAGE;
    }
    if (msg.includes("team attendance")) {
        return userRole === 'manager' ? roleBasedResponses.manager.attendance : RESTRICTED_MESSAGE;
    }
    if (msg.includes("pending leave approvals") || msg.includes("leave approvals")) {
        return userRole === 'manager' ? roleBasedResponses.manager.leave : RESTRICTED_MESSAGE;
    }
    if (msg.includes("leave days") || msg.includes("leave balance")) {
        return roleBasedResponses.employee.leave;
    }
    if (msg.includes("payslip")) {
        return roleBasedResponses.employee.payroll;
    }

    // Keyword Logic
    if (msg.includes("leave")) {
        return roleResponses.leave || (userRole === 'admin' ? "There are 18 employees currently on leave across all departments." : roleBasedResponses.employee.leave);
    }
    
    if (msg.includes("payroll") || msg.includes("salary")) {
        return roleResponses.payroll || (userRole === 'manager' ? "Your team payroll is within budget for Q1." : RESTRICTED_MESSAGE);
    }
    
    if (msg.includes("attendance")) {
        return roleResponses.attendance || roleBasedResponses.employee.attendance;
    }

    if (msg.includes("employee") || msg.includes("workforce") || msg.includes("stats")) {
        return roleResponses.employees || (userRole === 'manager' ? "Your department currently has 28 employees." : roleBasedResponses.admin.employees);
    }

    if (msg.includes("holiday")) {
        return roleBasedResponses.employee.holidays; 
    }

    if (msg.includes("recruitment") || msg.includes("hiring")) {
        return userRole === 'admin' ? roleBasedResponses.admin.recruitment : RESTRICTED_MESSAGE;
    }

    if (msg.includes("usage") || msg.includes("audit") || msg.includes("system")) {
        return userRole === 'admin' ? (roleBasedResponses.admin.usage || roleBasedResponses.admin.audit) : RESTRICTED_MESSAGE;
    }

    if (msg.includes("project")) {
        return userRole === 'manager' ? roleBasedResponses.manager.projects : RESTRICTED_MESSAGE;
    }

    if (msg.includes("help") || msg.includes("can you do") || msg.includes("what can")) {
        return `I can help you with ${userRole === 'admin' ? 'workforce analytics, payroll summaries, and system logs' : userRole === 'manager' ? 'team attendance, leave approvals, and project status' : 'your leave balance, payslips, and holiday calendar'}. What would you like to know?`;
    }

    return "I'm here to help with your HR queries. You can ask about " + 
           (userRole === 'admin' ? "workforce stats, payroll, or audit logs." : 
            userRole === 'manager' ? "team attendance, leaves, or project status." : 
            "your leave balance, payslips, or holidays.");
};
