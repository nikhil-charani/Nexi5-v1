import { useEffect, useState } from "react";
import { Bell, Search, LogOut, CheckCircle, ClipboardList, Calendar, Megaphone, Menu, Moon, Sun, Phone, ShieldAlert, X } from "lucide-react";
import { useAppContext } from "../hooks/useAppContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuItem } from "./ui/dropdown";
import { mockNotifications } from "../data/mockData";
import { useNavigate } from "react-router-dom";
const notifIcon = {
  leave: Calendar,
  task: ClipboardList,
  payroll: CheckCircle,
  announcement: Megaphone,
  call: Phone,
  concern: ShieldAlert
};
const notifColors = {
  leave: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
  task: "text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20",
  payroll: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
  announcement: "text-purple-600 bg-purple-50 dark:bg-purple-900/20",
  call: "text-rose-600 bg-rose-50 dark:bg-rose-900/20",
  concern: "text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20"
};
function Topbar({ onMenuToggle }) {
  const {
    currentUser,
    isCheckedIn,
    checkInTime,
    checkIn,
    checkOut,
    logout,
    employees,
  } = useAppContext();
  const navigate = useNavigate();
  const [elapsed, setElapsed] = useState("00:00:00");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [notifFilter, setNotifFilter] = useState("all");
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markOneRead = (id) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const displayedNotifs = notifFilter === "unread" ? notifications.filter((n) => !n.read) : notifications;
  const handleSearchChange = (q) => {
    setSearchQuery(q);
    if (q.length > 1) {
      const matches = employees.filter((e) => e.name.toLowerCase().includes(q.toLowerCase()) || e.designation.toLowerCase().includes(q.toLowerCase())).map((e) => e.name);
      setSearchSuggestions(matches.slice(0, 5));
    } else {
      setSearchSuggestions([]);
    }
  };
  const handleCheckInToggle = () => {
    if (isCheckedIn) {
      checkOut();
    } else {
      checkIn();
    }
  };
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };
  useEffect(() => {
    let interval;
    if (isCheckedIn && checkInTime) {
      interval = window.setInterval(() => {
        const diff = new Date().getTime() - checkInTime.getTime();
        const hours = Math.floor(diff / (1e3 * 60 * 60));
        const mins = Math.floor(diff / (1e3 * 60) % 60);
        const secs = Math.floor(diff / 1e3 % 60);
        const format = (n) => n.toString().padStart(2, "0");
        setElapsed(`${format(hours)}:${format(mins)}:${format(secs)}`);
      }, 1e3);
    } else {
      setElapsed("00:00:00");
    }
    return () => clearInterval(interval);
  }, [isCheckedIn, checkInTime]);
  return <header className="h-[70px] md:h-[85px] lg:h-[100px] glass border-b border-gray-100/50 px-4 sm:px-6 lg:px-10 flex items-center justify-between sticky top-0 z-30 gap-3 sm:gap-6 lg:gap-10 flex-shrink-0 topbar-shadow">

    {
      /* Left: Mobile menu + Page Title */
    }
    <div className="flex items-center gap-4">
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-50 text-slate-500 transition-all"
      >
        <Menu size={20} />
      </button>
      <div className="flex flex-col">
        <h1 className="text-[14px] md:text-[16px] lg:text-[18px] font-black text-[#0f4184] tracking-tight uppercase leading-none">
          Welcome, {currentUser?.name?.split(" ")[0] || "User"}
        </h1>
        <p className="hidden sm:block text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-1.5 opacity-60">
          {currentUser?.role || "Core Node"} Perspective
        </p>
      </div>
    </div>

    {
      /* Center: Search bar */
    }
    <div
      className={`relative hidden md:block flex-1 transition-all duration-300 ${isSearchFocused ? "max-w-xl" : "max-w-md"
        }`}
    >
      <div
        className={`flex items-center relative rounded-[24px] transition-all duration-300 ${isSearchFocused ? "min-h-[64px]" : "min-h-[52px]"
          }`}
      >
        <Search
          className="absolute text-slate-400 left-4 z-10 pointer-events-none"
          size={16}
        />

        <input
          type="text"
          value={searchQuery}
          placeholder="Search for employees, tasks, or documents..."
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() =>
            setTimeout(() => {
              setIsSearchFocused(false);
              setSearchSuggestions([]);
            }, 200)
          }
          className={`w-full bg-gray-50/50 border border-gray-200/50 focus:border-primary/20 focus:bg-white rounded-[24px] pl-16 pr-12 text-[13px] font-black tracking-tight transition-all duration-300 outline-none placeholder:text-gray-400 text-textPrimary focus:ring-[12px] focus:ring-primary/5 uppercase soft-shadow focus:shadow-nexi5 ${isSearchFocused ? "py-5" : "py-4"
            }`}
        />
      </div>

      <AnimatePresence>
        {searchSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl border border-gray-100 shadow-nexi5 overflow-hidden z-50"
          >
            {searchSuggestions.map((s) => (
              <button
                key={s}
                onMouseDown={() => {
                  navigate("/dashboard/directory");
                  setSearchSuggestions([]);
                  setSearchQuery("");
                }}
                className="w-full text-left px-4 py-3 text-sm text-textSecondary hover:bg-[#F0F9FF] hover:text-primary transition-colors flex items-center gap-3"
              >
                <Search size={14} className="text-slate-400 shrink-0" />
                <span className="truncate">{s}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    {
      /* Right Actions */
    }
    <div className="flex items-center gap-4 ml-auto">
      {/* Attendance Toggle */}
      {currentUser?.role?.toLowerCase() !== "admin" && (
        <div className="flex items-center gap-4 pr-6 border-r border-gray-100/50">
          <div className="hidden sm:flex flex-col items-end">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isCheckedIn ? "text-primary" : "text-slate-400"} transition-colors`}>
              {isCheckedIn ? "Checked In" : "Checked Out"}
            </span>
            {isCheckedIn && (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-mono font-black text-primary mt-0.5"
              >
                {elapsed}
              </motion.span>
            )}
          </div>
          <button
            onClick={handleCheckInToggle}
            className={`relative w-14 h-7 rounded-full transition-all duration-500 flex items-center px-1 group/toggle shadow-inner ${isCheckedIn ? "bg-primary" : "bg-gray-200"}`}
            title={isCheckedIn ? "Click to Check Out" : "Click to Check In"}
          >
            <motion.div
              animate={{ x: isCheckedIn ? 28 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center relative z-10"
            >
              <div className={`w-1.5 h-1.5 rounded-full ${isCheckedIn ? "bg-primary" : "bg-gray-300"} transition-colors duration-300`} />
            </motion.div>

            {/* Subtle Glow when checked in */}
            {isCheckedIn && (
              <motion.div
                layoutId="toggleGlow"
                className="absolute inset-0 rounded-full bg-primary/20 blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
          </button>
        </div>
      )}

      {/* Notification Bell */}
      <div className="relative">
        <button
          onClick={() => setIsNotifOpen(!isNotifOpen)}
          className={`relative p-4 rounded-[20px] transition-all duration-500 active:scale-90 border border-transparent ${isNotifOpen ? "bg-primary/5 text-primary border-primary/10 glow-shadow" : "text-gray-400 hover:bg-gray-50 hover:text-primary hover:border-gray-100"}`}
        >
          <Bell size={20} />
          {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />}
        </button>

        <AnimatePresence>
          {isNotifOpen && <>
            <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              className="absolute right-0 top-full mt-3 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl border border-gray-100 shadow-nexi5 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                <h3 className="font-semibold text-textPrimary">Notifications</h3>
                <button onClick={markAllRead} className="text-xs font-medium text-primary hover:text-primaryDark">Mark all read</button>
              </div>

              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {displayedNotifs.length === 0 ? (
                  <div className="py-12 text-center">
                    <Bell size={32} className="mx-auto mb-3 text-gray-200" />
                    <p className="text-sm text-slate-400">No new notifications</p>
                  </div>
                ) : displayedNotifs.map((notif) => {
                  const Icon = notifIcon[notif.type] || Bell;
                  return (
                    <div
                      key={notif.id}
                      onClick={() => markOneRead(notif.id)}
                      className={`p-4 flex gap-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0 ${!notif.read ? "bg-[#F0F9FF]/30" : ""}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notif.read ? "bg-gray-100 text-slate-400" : "bg-primary/10 text-primary"}`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-semibold text-textPrimary truncate">{notif.title}</p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{notif.time}</span>
                        </div>
                        <p className="text-xs text-textSecondary line-clamp-2 mb-2">{notif.message}</p>
                        {!notif.read && <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-gray-50 text-center">
                <button onClick={() => setIsNotifOpen(false)} className="text-xs font-semibold text-primary hover:text-primaryDark">View All Notifications</button>
              </div>
            </motion.div>
          </>}
        </AnimatePresence>
      </div>

    </div>
  </header>;
}
export default Topbar;
