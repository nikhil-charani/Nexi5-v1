import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  CalendarClock,
  CheckCircle2,
  CalendarDays,
  ClipboardList,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  UserPlus,
  FolderPlus,
  UserRoundPlus,
  Phone,
  LogIn,
  Clock3,
  FolderKanban,
  Users2,
  Contact2,
  ShieldCheck,
  Zap,
  Activity,
  Server
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { payrollTrendData, aiInsights, mockActivityFeed } from "../data/mockData";
import { useAppContext } from "../hooks/useAppContext";
import { useNavigate } from "react-router-dom";
const TypewriterText = ({ text, delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    let timeout;
    let interval;
    timeout = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        if (i === text.length) clearInterval(interval);
      }, 25);
    }, delay * 1e3);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, delay]);
  return <span>{displayedText}</span>;
};
const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);
  const numericValue = typeof value === "string" ? parseFloat(value.replace(/[^0-9.]/g, "")) : value;
  const prefix = typeof value === "string" && value.startsWith("\u20B9") ? "\u20B9" : "";
  const suffix = typeof value === "string" && value.endsWith("L") ? "L" : "";
  useEffect(() => {
    if (isNaN(numericValue)) {
      setCount(0);
      return;
    }
    const duration = 1200;
    const steps = 40;
    const stepTime = duration / steps;
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const eased = 1 - Math.pow(1 - currentStep / steps, 3);
      setCount(Math.min(numericValue * eased, numericValue));
      if (currentStep >= steps) clearInterval(interval);
    }, stepTime);
    return () => clearInterval(interval);
  }, [numericValue]);
  if (isNaN(numericValue)) return <span>{value}</span>;
  const displayValue = count % 1 !== 0 || count > 1e3 ? count.toFixed(1) : Math.round(count);
  return <span>{prefix}{displayValue}{suffix}</span>;
};
const iconBgMap = {
  blue: "bg-primary/10 text-primary",
  emerald: "bg-[#0f4184]/10 text-[#0b3166]",
  amber: "bg-orange-100 text-orange-600",
  rose: "bg-red-100 text-red-600",
  primary: "bg-primary/10 text-primary"
};

const StatCard = ({ title, value, icon: Icon, trend, color, delay, onClick }) => <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
  whileHover={{ y: -4, transition: { duration: 0.2 } }}
  onClick={onClick}
  className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 relative overflow-hidden group cursor-pointer shadow-nexi5"
>
  <div className="flex justify-between items-start relative z-10">
    <div className="min-w-0 flex-1">
      <p className="text-xs sm:text-sm font-semibold text-textSecondary uppercase tracking-wider truncate">{title}</p>
      <h3 className="text-2xl sm:text-3xl font-bold text-textPrimary mt-1 sm:mt-2 tabular-nums">
        <AnimatedCounter value={value} />
      </h3>
      <div className="flex items-center gap-1.5 mt-2 sm:mt-3 flex-wrap">
        <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-xs font-bold ${trend >= 0 ? "bg-[#0f4184]/10 text-[#0b3166]" : "bg-red-100 text-red-600"}`}>
          {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(trend)}%
        </span>
        <span className="text-xs text-textSecondary hidden sm:inline">vs last month</span>
      </div>
    </div>
    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl shrink-0 ${iconBgMap[color] || iconBgMap.primary} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ml-2`}>
      <Icon size={20} className="sm:hidden" />
      <Icon size={24} className="hidden sm:block" />
    </div>
  </div>
</motion.div>;
function Dashboard() {
  const { userRole, currentUser, employees, projects, leaves, grievances, attendance, attendanceTrendData } = useAppContext();
  
  const recentAttendance = (attendance || []).slice(0, 5).map(item => ({
    date: new Date(item.date).toLocaleDateString(['en-US'], { weekday: 'short', month: 'short', day: 'numeric' }),
    status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "—",
    hours: item.totalHours || 0
  }));
  const navigate = useNavigate();
  const isAdminOrHR = ["Admin", "HR", "HR Head", "HR Accountant", "HR Recruiter"].includes(userRole);
  const totalEmployees = (employees || []).length;
  const activeProjects = (projects || []).filter((p) => p?.status === "Active").length;
  const pendingLeaves = (leaves || []).filter((l) => l?.status === "Pending").length;
  const openConcerns = (grievances || []).filter((g) => g?.status === "Open").length;
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-3 shadow-xl">
        <p className="text-xs font-bold text-slate-500 mb-1">{label}</p>
        {payload.map((p, i) => <p key={i} className="text-sm font-black" style={{ color: p.color }}>{p.name}: {p.value}</p>)}
      </div>;
    }
    return null;
  };

  const hrMetrics = useMemo(() => ({
    totalEmployees: (employees || []).length,
    activeProjects: (projects || []).filter(p => p?.status === 'Active').length,
    pendingLeaves: (leaves || []).filter(l => l?.status === 'Pending').length,
    openGrievances: (grievances || []).filter(g => g?.status === 'Open').length
  }), [employees, projects, leaves, grievances]);

  const salesMetrics = useMemo(() => ({
    totalLeads: 42,
    activeClients: 12,
    closedDeals: 8,
    revenue: "₹18.5L"
  }), []);

  const recruiterMetrics = useMemo(() => ({
    activeCandidates: 15,
    openPositions: 4,
    interviewsToday: 3,
    shortlisted: 6
  }), []);

  const accountantMetrics = useMemo(() => ({
    monthlyPayroll: "₹12.4L",
    pendingInvoices: 5,
    taxFilings: "Completed",
    expenses: "₹2.1L"
  }), []);

  const managerMetrics = useMemo(() => ({
    teamSize: (employees || []).filter(e => e?.manager === currentUser?.name).length || 5,
    projectDeadlines: 2,
    overdueTasks: 1,
    teamAttendance: "94%"
  }), [employees, currentUser?.name]);

  const renderChartsSection = (type, showFeed = true) => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          {type === 'payroll' && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-nexi5">
              <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-2">
                <div>
                  <h3 className="font-semibold text-textPrimary text-base">Payroll Trend</h3>
                  <p className="text-xs text-textSecondary mt-1">Monthly expenditure in Lakhs (₹)</p>
                </div>
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#0f4184]/10 text-[#0b3166]">Last 6 months</span>
              </div>
              <div className="h-[180px] sm:h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={payrollTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="cost" stroke="#0f4184" fill="#0f418420" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
          {(type === 'attendance' || type === 'recruitment' || type === 'sales') && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-nexi5">
              <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-2">
                <div>
                  <h3 className="font-semibold text-textPrimary text-base">
                    {type === 'attendance' ? 'Team Attendance' : type === 'recruitment' ? 'Candidate Sourcing' : 'Lead Conversion'}
                  </h3>
                  <p className="text-xs text-textSecondary mt-1">Weekly performance overview</p>
                </div>
              </div>
              <div className="h-[180px] sm:h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="present" fill="#0f4184" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="absent" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </div>
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="bg-secondary p-6 rounded-xl border border-secondary overflow-hidden relative shadow-nexi5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sparkles size={16} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">AI Insights</h3>
                <p className="text-[10px] text-white/50 mt-0.5">Auto-generated · just now</p>
              </div>
            </div>
            <div className="space-y-3 relative z-10">
              {aiInsights.map((insight, i) => (
                <div key={i} className={`rounded-xl px-4 py-3 text-xs flex items-start gap-3 ${insight.severity === 'warning' ? 'bg-orange-500/20 text-orange-200' : 'bg-primary/20 text-blue-100'}`}>
                  <span className="shrink-0">{insight.icon}</span>
                  <span className="leading-relaxed">
                    <TypewriterText text={insight.text} delay={0.6 + i * 0.3} />
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {showFeed && renderActivityFeed()}
        </div>
      </div>
    );
  };

  const renderActivityFeed = () => (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-6 rounded-xl border border-gray-200 shadow-nexi5">
      <h3 className="font-semibold text-textPrimary text-sm mb-4">Activity Feed</h3>
      <div className="space-y-5">
        {mockActivityFeed.slice(0, 5).map((event, i) => {
          const icons = {
            checkin: { icon: LogIn, color: "text-[#0f4184]", bg: "bg-[#0f4184]/10" },
            leave_applied: { icon: CalendarClock, color: "text-orange-600", bg: "bg-orange-100" },
            leave_approved: { icon: CheckCircle2, color: "text-[#0b3166]", bg: "bg-[#0f4184]/10" },
            task_update: { icon: ClipboardList, color: "text-primary", bg: "bg-primary/10" },
            new_client: { icon: UserRoundPlus, color: "text-secondary", bg: "bg-secondary/10" },
            new_employee: { icon: UserPlus, color: "text-[#0b3166]", bg: "bg-[#0f4184]/10" }
          };
          const meta = icons[event.type] || icons.task_update;
          const EventIcon = meta.icon;
          return (
            <div key={i} className="flex gap-4">
              <div className={`w-8 h-8 rounded-lg ${meta.bg} flex items-center justify-center shrink-0`}>
                <EventIcon size={14} className={meta.color} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-textPrimary leading-snug">{event.message}</p>
                <p className="text-[11px] text-textSecondary mt-1">{event.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );

  // --- SUB-COMPONENTS ---

  const AdminOverview = () => (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-xl border border-gray-200 shadow-nexi5">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <ShieldCheck size={20} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base tracking-tight">Admin Control Center</h3>
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">System Status & Governance</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100/50">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Systems Nominal</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
        {[
          { label: "Active Sessions", value: "24", icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "System Load", value: "12%", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "API Health", value: "99.9%", icon: Server, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Security Score", value: "A+", icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-50" }
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-xl border border-gray-50 bg-slate-50/30 hover:bg-white hover:border-indigo-100 hover:shadow-sm transition-all group cursor-default">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon size={14} className={stat.color} />
              </div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{stat.label}</span>
            </div>
            <p className="text-xl font-black text-slate-800 leading-none">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
        <div className="flex -space-x-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-7 h-7 rounded-lg border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
              {String.fromCharCode(64 + i)}
            </div>
          ))}
          <div className="w-7 h-7 rounded-lg border-2 border-white bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600">
            +5
          </div>
        </div>
        <button className="text-xs font-bold text-primary hover:underline">View Audit Logs</button>
      </div>
    </motion.div>
  );

  const QuickActions = ({ actions }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-nexi5">
      <h3 className="font-semibold text-textPrimary text-sm mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={action.onClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${action.primary ? 'bg-gradient-to-r from-[#0f4184] to-[#0b3166] text-white hover:opacity-90 shadow-sm' : 'border border-gray-200 text-textSecondary hover:bg-gray-50'}`}
          >
            <action.icon size={18} />
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const AdminHRView = () => {
    const actions = [
      { label: 'Add Employee', icon: UserPlus, onClick: () => navigate('/dashboard/employees'), primary: true },
      { label: 'New Project', icon: FolderKanban, onClick: () => navigate('/dashboard/projects') },
      { label: 'Add Client', icon: Users2, onClick: () => navigate('/dashboard/clients') },
      { label: 'Apply Leave', icon: CalendarClock, onClick: () => navigate('/dashboard/leave') },
      { label: 'Start Call', icon: Contact2, onClick: () => { } }
    ];

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard delay={0} title="Total Employees" value={hrMetrics.totalEmployees} icon={Users} trend={12} color="blue" />
          <StatCard delay={0.08} title="Active Projects" value={hrMetrics.activeProjects} icon={ClipboardList} trend={4} color="emerald" />
          <StatCard delay={0.16} title="Pending Leaves" value={hrMetrics.pendingLeaves} icon={CalendarClock} trend={-2} color="amber" />
          <StatCard delay={0.24} title="Open Concerns" value={hrMetrics.openGrievances} icon={CheckCircle2} trend={20} color="rose" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
          <div className="lg:col-span-2 space-y-6">
            {renderChartsSection('payroll', false)}
            <AdminOverview />
          </div>
          <div className="space-y-5">
            <QuickActions actions={actions} />
            {renderActivityFeed()}
          </div>
        </div>
      </>
    );
  };

  const AccountantView = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard delay={0} title="Monthly Payroll" value={accountantMetrics.monthlyPayroll} icon={TrendingUp} trend={3} color="emerald" />
        <StatCard delay={0.08} title="Monthly Expenses" value={accountantMetrics.expenses} icon={TrendingUp} trend={-5} color="blue" />
        <StatCard delay={0.16} title="Pending Invoices" value={accountantMetrics.pendingInvoices} icon={ClipboardList} trend={0} color="amber" />
        <StatCard delay={0.24} title="Tax Status" value={accountantMetrics.taxFilings} icon={CheckCircle2} trend={100} color="rose" />
      </div>
      {renderChartsSection('payroll')}
    </>
  );

  const RecruiterView = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard delay={0} title="Active Candidates" value={recruiterMetrics.activeCandidates} icon={Users} trend={15} color="blue" />
        <StatCard delay={0.08} title="Open Positions" value={recruiterMetrics.openPositions} icon={ClipboardList} trend={2} color="amber" />
        <StatCard delay={0.16} title="Interviews Today" value={recruiterMetrics.interviewsToday} icon={CalendarDays} trend={50} color="emerald" />
        <StatCard delay={0.24} title="Shortlisted" value={recruiterMetrics.shortlisted} icon={CheckCircle2} trend={5} color="rose" />
      </div>
      {renderChartsSection('recruitment')}
    </>
  );

  const SalesView = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard delay={0} title="Pipeline Revenue" value={salesMetrics.revenue} icon={TrendingUp} trend={18} color="emerald" />
        <StatCard delay={0.08} title="Total Leads" value={salesMetrics.totalLeads} icon={Users} trend={10} color="blue" />
        <StatCard delay={0.16} title="Active Clients" value={salesMetrics.activeClients} icon={UserCheck} trend={2} color="amber" />
        <StatCard delay={0.24} title="Closed Deals" value={salesMetrics.closedDeals} icon={CheckCircle2} trend={25} color="rose" />
      </div>
      <PersonalOverview title="My Sales Activity" />
      {renderChartsSection('sales')}
    </div>
  );

  const ManagerView = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard delay={0} title="Team Size" value={managerMetrics.teamSize} icon={Users} trend={0} color="blue" />
        <StatCard delay={0.08} title="Active Projects" value={hrMetrics.activeProjects} icon={ClipboardList} trend={0} color="emerald" />
        <StatCard delay={0.16} title="Team Attendance" value={managerMetrics.teamAttendance} icon={UserCheck} trend={2} color="amber" />
        <StatCard delay={0.24} title="Overdue Tasks" value={managerMetrics.overdueTasks} icon={CheckCircle2} trend={-10} color="rose" />
      </div>
      <PersonalOverview title="My Management Tasks" />
      {renderChartsSection('attendance')}
    </div>
  );

  const PersonalOverview = ({ title = "Personal Overview" }) => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1.5 h-6 bg-primary rounded-full" />
        <h2 className="text-xl font-bold text-textPrimary">{title}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard delay={0} title="Days Present" value="18" icon={UserCheck} trend={5} color="emerald" onClick={() => navigate("/dashboard/attendance")} />
        <StatCard delay={0.08} title="Leave Balance" value="12" icon={CalendarClock} trend={0} color="amber" onClick={() => navigate("/dashboard/leave")} />
        <StatCard delay={0.16} title="My Tasks" value="3" icon={ClipboardList} trend={-10} color="blue" onClick={() => navigate("/dashboard/tasks")} />
        <StatCard delay={0.24} title="Performance" value="87%" icon={TrendingUp} trend={8} color="primary" onClick={() => navigate("/dashboard/performance")} />
      </div>
    </div>
  );

  const EmployeeView = () => (
    <div className="space-y-8">
      <PersonalOverview title="My Work Summary" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-nexi5">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-textPrimary text-base">Recent Attendance</h3>
                <p className="text-xs text-textSecondary mt-1">Your personal check-in records</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 font-semibold text-gray-500 uppercase text-xs tracking-wider">Date</th>
                    <th className="px-6 py-4 font-semibold text-gray-500 uppercase text-xs tracking-wider">Status</th>
                    <th className="px-6 py-4 font-semibold text-gray-500 uppercase text-xs tracking-wider">Hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentAttendance.map((row, i) => (
                    <tr key={i} className="hover:bg-[#F0F9FF] transition-colors group">
                      <td className="px-6 py-4 font-medium text-textPrimary">{row.date}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#0f4184]/10 text-[#0b3166] text-xs font-bold">
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-textSecondary font-medium">{row.hours}h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          {renderActivityFeed()}
        </div>
      </div>
    </div>
  );

  const renderDashboardContent = () => {
    switch (userRole) {
      case 'Admin':
      case 'HR Head':
        return <AdminHRView />;
      case 'HR Accountant':
        return <AccountantView />;
      case 'HR Recruiter':
        return <RecruiterView />;
      case 'BDE':
        return <SalesView />;
      case 'Manager':
        return <ManagerView />;
      default:
        return <EmployeeView />;
    }
  };

  return (
    <div className="space-y-6">

      {renderDashboardContent()}
    </div>
  );
}
export {
  Dashboard as default
};
