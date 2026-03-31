import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  CalendarClock,
  Banknote,
  FileText,
  Settings,
  Menu,
  X,
  UserCheck,
  Briefcase,
  Contact2,
  GitBranch,
  ClipboardList,
  Megaphone,
  CalendarDays,
  ShieldAlert,
  FolderKanban,
  Target,
  Users2,
  BadgeDollarSign,
  ChevronDown,
  ChevronRight,
  LogOut,
  User,
  MoreVertical,
  Activity
} from "lucide-react";
import { getInitials } from "../lib/stringUtils";
import Topbar from "../components/Topbar";
import { useAppContext } from "../hooks/useAppContext";
import brandLogo from "../assets/Nexi5Logo-1.png";
// import CommunicationPanel from "../components/CommunicationPanel"; // Uncomment when ready to use
const navGroups = [
  {
    name: "Core",
    color: "#0f4184",
    items: [
      { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, roles: ["Admin", "HR", "HR Head", "HR Recruiter", "HR Accountant", "Manager", "Employee", "BDE"] },
      { name: "Calendar", path: "/dashboard/calendar", icon: CalendarDays, roles: ["Admin", "HR", "HR Head", "HR Recruiter", "Manager", "Employee", "BDE"] },
      { name: "Announcements", path: "/dashboard/announcements", icon: Megaphone, roles: ["Admin", "HR", "HR Head", "Manager", "Employee", "BDE"] }
    ]
  },
  {
    name: "Human Resources",
    color: "#0f4184",
    items: [
      { name: "Employees", path: "/dashboard/employees", icon: Users, roles: ["Admin", "HR Head", "HR Recruiter", "HR Accountant"] },
      { name: "Directory", path: "/dashboard/directory", icon: Contact2, roles: ["Admin", "HR Head", "HR Recruiter", "HR Accountant", "Manager", "Employee", "BDE"] },
      { name: "Org Chart", path: "/dashboard/org-chart", icon: GitBranch, roles: ["Admin", "HR Head", "HR Recruiter", "HR Accountant", "Manager", "Employee", "BDE"] },
      { name: "Candidates", path: "/dashboard/candidates", icon: Briefcase, roles: ["Admin", "HR Head", "HR Recruiter"] }
    ]
  },
  {
    name: "Work & Operations",
    color: "#0f4184",
    items: [
      { name: "Projects & Modules", path: "/dashboard/projects", icon: FolderKanban, roles: ["Admin", "Manager", "Employee", "HR Head", "HR Accountant", "HR Recruiter"] },
      { name: "Tasks", path: "/dashboard/tasks", icon: ClipboardList, roles: ["Admin", "Manager", "Employee", "HR Recruiter", "HR Accountant"] },
      { name: "Documents", path: "/dashboard/documents", icon: FileText, roles: ["Admin", "HR Head", "HR Recruiter", "HR Accountant", "Manager", "Employee", "BDE"] },
      { name: "Attendance", path: "/dashboard/attendance", icon: UserCheck, roles: ["Admin", "HR Head", "HR Recruiter", "HR Accountant", "Manager", "Employee", "BDE"] },
      { name: "Attendance Analytics", path: "/dashboard/attendance-analytics", icon: Activity, roles: ["Admin", "HR Head", "HR Recruiter", "HR Accountant", "Manager"] },
      { name: "Leave", path: "/dashboard/leave", icon: CalendarClock, roles: ["Admin", "HR Head", "HR Recruiter", "HR Accountant", "Manager", "Employee", "BDE"] },
      { name: "Payroll", path: "/dashboard/payroll", icon: Banknote, roles: ["Admin", "HR Head", "HR Accountant"] },
      { name: "Performance", path: "/dashboard/performance", icon: CheckSquare, roles: ["Admin", "HR Head", "HR Recruiter", "Manager", "Employee"] }
    ]
  },
  {
    name: "Business & CRM",
    color: "#0f4184",
    items: [
      { name: "Leads", path: "/dashboard/leads", icon: Target, roles: ["Admin", "BDE", "Manager"] },
      { name: "Clients", path: "/dashboard/clients", icon: Users2, roles: ["Admin", "BDE", "Manager"] },
      { name: "Deals", path: "/dashboard/deals", icon: BadgeDollarSign, roles: ["Admin", "BDE", "Manager"] }
    ]
  },
  {
    name: "Administration",
    color: "#0f4184",
    items: [
      { name: "Grievances", path: "/dashboard/grievances", icon: ShieldAlert, roles: ["Admin", "HR Head", "HR Recruiter", "HR Accountant", "Manager", "Employee"] },
      { name: "Settings", path: "/dashboard/settings", icon: Settings, roles: ["Admin"] }
    ]
  }
];

function DashboardLayout() {
  const { userRole, currentUser, logout } = useAppContext();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState(["Core", "Human Resources", "Work & Operations", "Business & CRM", "Administration"]);

  const toggleGroup = (groupName) => {
    setExpandedGroups(
      (prev) => prev.includes(groupName) ? prev.filter((name) => name !== groupName) : [...prev, groupName]
    );
  };

  const SidebarContent = ({
    isSidebarOpen,
    setSidebarOpen,
    mobile = false,
    setMobileSidebarOpen,
    expandedGroups,
    toggleGroup,
    userRole,
    currentUser,
    handleLogout
  }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const activeRef = useRef(null);
    const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);

    useEffect(() => {
      if (activeRef.current) {
        activeRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, [location.pathname]);

    return (
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className={`h-[140px] flex items-center justify-center shrink-0 border-b border-gray-100/50 transition-all duration-300 relative ${isSidebarOpen || mobile ? "px-6" : "px-2"}`}>
          <div className="flex items-center justify-start h-full w-full overflow-hidden">
            <img
              src={brandLogo}
              alt="Nexi5 Logo"
              className={`${isSidebarOpen || mobile ? "h-[120px]" : "h-[45px]"} w-auto object-contain transition-all duration-500 hover:scale-105 logo-glow`}
              onClick={() => navigate('/dashboard')}
              style={{ cursor: 'pointer' }}
            />
          </div>
          {mobile ? (
            <button onClick={() => setMobileSidebarOpen(false)} className="absolute right-4 p-2 rounded-xl bg-gray-50 text-slate-400 hover:text-primary transition-all">
              <X size={20} />
            </button>
          ) : (
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className={`absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/20 transition-all z-50`}
            >
              {isSidebarOpen ? <ChevronDown size={14} className="rotate-90" /> : <ChevronRight size={14} />}
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto pt-8 pb-4 px-4 flex flex-col gap-8 custom-scrollbar">
          {navGroups.map((group) => {
            const filteredItems = group.items.filter((item) => item.roles.includes(userRole || "Employee"));
            if (filteredItems.length === 0) return null;
            const isExpanded = expandedGroups.includes(group.name);
            return (
              <div key={group.name} className="flex flex-col gap-3">
                {isSidebarOpen || mobile ? (
                  <button
                    onClick={() => toggleGroup(group.name)}
                    className="flex items-center justify-between px-3 py-1 mb-1 group/btn rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover/btn:text-primary transition-colors">
                      {group.name}
                    </span>
                    <div className="text-slate-300 group-hover/btn:text-slate-500">
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </div>
                  </button>
                ) : (
                  <div className="h-px bg-gray-100 mx-3 mb-2 opacity-50" />
                )}

                <AnimatePresence initial={false}>
                  {(isExpanded || !isSidebarOpen) && (
                    <motion.div
                      initial={isSidebarOpen || mobile ? { height: 0, opacity: 0 } : undefined}
                      animate={isSidebarOpen || mobile ? { height: "auto", opacity: 1 } : undefined}
                      exit={isSidebarOpen || mobile ? { height: 0, opacity: 0 } : undefined}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="flex flex-col gap-1.5 overflow-hidden"
                    >
                      {filteredItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            ref={location.pathname === item.path ? activeRef : null}
                            end={item.path === "/dashboard"}
                            onClick={() => mobile && setMobileSidebarOpen(false)}
                            title={!isSidebarOpen && !mobile ? item.name : undefined}
                            className={({ isActive }) => `
                            relative flex items-center ${isSidebarOpen || mobile ? "gap-4 px-4" : "justify-center px-0"} py-3.5 rounded-[16px] transition-all duration-300 group/nav
                            ${isActive
                                ? "bg-gradient-to-r from-[#0f4184] to-[#0b3166] text-white shadow-lg shadow-[#0f4184]/30 font-extrabold"
                                : "text-slate-500 hover:bg-slate-50 hover:text-primary border border-transparent hover:border-gray-100"}
                          `}
                          >
                            {({ isActive }) => (
                              <>
                                <Icon
                                  size={18}
                                  className={`shrink-0 transition-transform duration-300 group-hover/nav:scale-110`}
                                />

                                {(mobile || isSidebarOpen) && (
                                  <span className="text-[13px] font-bold truncate flex-1 leading-none tracking-tight">
                                    {item.name}
                                  </span>
                                )}

                                {isActive && (mobile || isSidebarOpen) && (
                                  <motion.div
                                    layoutId="activeNav"
                                    className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                                  />
                                )}
                                {!isActive && (mobile || isSidebarOpen) && (
                                  <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#0f4184] opacity-0 transition-all duration-300 transform scale-50 group-hover/nav:opacity-100 group-hover/nav:scale-100 shadow-[0_0_8px_rgba(15,65,132,0.5)]" />
                                )}
                              </>
                            )}
                          </NavLink>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* User Profile Section at Bottom */}
        <div className="mt-auto p-3 bg-transparent relative z-[60]">
          <AnimatePresence>
            {isProfilePopupOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-[calc(100%+8px)] left-3 right-3 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-[60] overflow-hidden"
              >
                {[
                  { label: "Profile", icon: User, onClick: () => navigate(`/dashboard/employees/${currentUser?.id}`) },
                  { label: "Settings", icon: Settings, onClick: () => navigate('/dashboard/settings') },
                  { label: "Logout", icon: LogOut, onClick: handleLogout, danger: true }
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      item.onClick();
                      setIsProfilePopupOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-all ${item.danger ? 'text-rose-500 hover:bg-rose-50' : 'text-slate-600 hover:bg-slate-50 hover:text-primary'}`}
                  >
                    <item.icon size={14} />
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}
            className={`w-full flex items-center ${isSidebarOpen || mobile ? "gap-2.5 px-2.5" : "justify-center px-0"} py-2 rounded-xl transition-all bg-[#0F4184] hover:bg-[#0b3166] shadow-md group/profile`}
          >
            <div className={`shrink-0 w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center font-bold text-xs uppercase overflow-hidden shadow-inner group-hover/profile:scale-105 transition-all`}>
              {getInitials(currentUser?.name)}
            </div>

            {(isSidebarOpen || mobile) && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[13px] font-bold text-white truncate leading-none mb-0.5 uppercase tracking-tight">
                  {currentUser?.name?.split(" ")[0] || "User"}
                </p>
                <p className="text-[9px] font-black text-blue-200 uppercase tracking-[0.1em] opacity-80 truncate">
                  {userRole || "Core "}
                </p>
              </div>
            )}

            {(isSidebarOpen || mobile) && (
              <MoreVertical size={14} className={`text-white/60 group-hover/profile:text-white transition-all ${isProfilePopupOpen ? 'rotate-90 text-white' : ''}`} />
            )}
          </button>
        </div>
      </div>
    );
  };

  return <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/20">

    {
      /* Mobile Sidebar Overlay */
    }
    <AnimatePresence>
      {isMobileSidebarOpen && <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-40 lg:hidden"
        />
        <motion.aside
          initial={{ x: -230 }}
          animate={{ x: 0 }}
          exit={{ x: -230 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed left-0 top-0 h-full w-[230px] glass border-r border-gray-100/50 flex flex-col z-50 lg:hidden sidebar-shadow"
        >
          <SidebarContent
            mobile
            isSidebarOpen={isSidebarOpen}
            setSidebarOpen={setSidebarOpen}
            setMobileSidebarOpen={setMobileSidebarOpen}
            toggleGroup={toggleGroup}
            expandedGroups={expandedGroups}
            userRole={userRole}
            currentUser={currentUser}
            handleLogout={logout}
          />
        </motion.aside>
      </>}
    </AnimatePresence>

    {
      /* Desktop Sidebar */
    }
    <motion.aside
      initial={{ width: 230 }}
      animate={{ width: isSidebarOpen ? 230 : 92 }}
      transition={{ type: "spring", stiffness: 280, damping: 30 }}
      className="hidden lg:flex h-full glass border-r border-gray-100/50 flex-col z-20 relative overflow-visible group sidebar-shadow"
    >
      <SidebarContent
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
        toggleGroup={toggleGroup}
        expandedGroups={expandedGroups}
        userRole={userRole}
        currentUser={currentUser}
        handleLogout={logout}
      />
    </motion.aside>

    {
      /* Main Content */
    }
    <div className="flex-1 flex flex-col min-w-0">
      <Topbar onMenuToggle={() => setMobileSidebarOpen(true)} />

      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/80 dark:bg-slate-950 custom-scrollbar">
        <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>

    {
      /* Communication Panel - visible on all authenticated pages */
    }
    {/* <CommunicationPanel /> */}{/* Uncomment when ready to use */}
  </div>;
}
export {
  DashboardLayout as default
};
