import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, X, Calendar as CalendarIcon, Clock, Bell, Edit2, Trash2 } from "lucide-react";
import { useAppContext } from "../hooks/useAppContext";
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const eventTypeStyles = {
  leave: { badge: "badge-warning", dot: "bg-amber-500", bg: "bg-amber-500", iconColor: "text-amber-500" },
  holiday: { badge: "badge-danger", dot: "bg-rose-500", bg: "bg-rose-500", iconColor: "text-rose-500" },
  event: { badge: "badge-info", dot: "bg-cyan-500", bg: "bg-cyan-500", iconColor: "text-cyan-500" },
  meeting: { badge: "badge-secondary", dot: "bg-purple-500", bg: "bg-purple-500", iconColor: "text-purple-500" }
};
function CalendarView() {
  const { calendarEvents, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent, userRole, currentUser } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", type: "event", description: "" });
  const [isDeleting, setIsDeleting] = useState(null); // to hold ID of event being deleted for confirmation
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEmployee = userRole === "Employee";
  const canAddEvent = ["Admin", "HR Head", "HR Recruiter", "Employee"].includes(userRole || "");
  
  const currentUserId = currentUser?.id || currentUser?.uid;
  // Leave events are PRIVATE — only visible to their creator
  // We match against all possible identifiers (uid, name, email) since old events may store different values
  const myIdentifiers = new Set([
    currentUserId,
    currentUser?.name,
    currentUser?.email,
  ].filter(Boolean).map(String));

  const visibleEvents = calendarEvents.filter(ev => {
    if (ev.type !== "leave") return true; // non-leave events stay public
    const isMyLeave = myIdentifiers.has(String(ev.createdBy || ""));
    if (!isMyLeave) return false; // never show someone else's leave
    // Strict role-perspective match: leave is only visible in the same role it was created in
    if (!ev.creatorRole) return false; // old events without creatorRole are hidden
    return ev.creatorRole === userRole;
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const formatDateKey = (d) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  
  const getWeekday = (day) => {
    let d = new Date(year, month, day);
    if (d.getDay() === 0) d.setDate(d.getDate() + 1); // Sunday -> Monday
    if (d.getDay() === 6) d.setDate(d.getDate() - 1); // Saturday -> Friday
    return d.getDate();
  };

  const today = new Date().getDate();

  const SAMPLE_EVENTS = [
    { id: "s1", title: "Independence Day", type: "holiday", date: `${year}-08-15`, description: "National Holiday" },
    { id: "s2", title: "Christmas", type: "holiday", date: `${year}-12-25`, description: "Company Holiday" },
    { id: "s3", title: "New Year", type: "holiday", date: `${year}-01-01`, description: "Company Holiday" },
    { id: "s6", title: "Annual Day", type: "event", date: formatDateKey(getWeekday(15)), description: "Company annual celebration", time: "5:00 PM" },
    { id: "s7", title: "HR Workshop", type: "event", date: formatDateKey(getWeekday(20)), description: "Policy updates", time: "10:00 AM" },
    { id: "s8", title: "Team Sync", type: "meeting", date: formatDateKey(getWeekday(10)), description: "Weekly sync up", time: "11:00 AM" },
    { id: "s9", title: "Project Review", type: "meeting", date: formatDateKey(getWeekday(12)), description: "Q3 Project milestones", time: "2:00 PM" }
  ];

  let allEvents = [...calendarEvents, ...SAMPLE_EVENTS].filter(e => e.type !== "leave");

  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    const dayOfWeek = dateObj.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      allEvents.push({
        id: `weekend-${year}-${month}-${d}`,
        title: "Weekend",
        type: "weekend",
        date: formatDateKey(d),
        description: "Weekly off"
      });
    }
  }

  const eventsForDate = (d) => {
    const key = formatDateKey(d);
    return visibleEvents.filter((e) => e.date === key);
  };
  const selectedEvents = selectedDate ? visibleEvents.filter((e) => e.date === selectedDate) : [];
  
  const openModal = (ev = null) => {
    if (ev) {
      setNewEvent(ev);
    } else {
      setNewEvent({ title: "", date: selectedDate || "", type: isEmployee ? "leave" : "event", description: "" });
    }
    setIsModalOpen(true);
  };

  const handleSaveEvent = async () => {
    if (!newEvent.title || !newEvent.date) return;
    setIsSubmitting(true);
    try {
      let res;
      if (newEvent.id) {
        res = await updateCalendarEvent(newEvent.id, newEvent);
      } else {
        res = await addCalendarEvent(newEvent);
      }
      
      if (!res?.success) {
        alert("Save failed: " + (res?.error || "Unknown error"));
        return;
      }
      
      setIsModalOpen(false);
      setNewEvent({ title: "", date: "", type: "event", description: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const res = await deleteCalendarEvent(id);
      if (res.success) {
        // Optional: Manual filter fallback if socket is slow
        // setCalendarEvents(prev => prev.filter(e => e.id !== id));
      } else {
        alert("Delete failed: " + (res.error || "Unknown error"));
      }
    }
  };

  return <div className="space-y-5 h-full flex flex-col">
    {
      /* Header */
    }
    <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
      <div>
        <div className="flex items-center gap-2.5 mb-1 text-cyan-600 dark:text-cyan-400">
          <CalendarIcon size={20} className="shrink-0" />
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">HR Calendar</h1>
        </div>
        <p className="text-slate-400 text-sm">Synchronize leaves, holidays, and company events.</p>
      </div>
      {canAddEvent && <motion.button
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => openModal()}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-black shadow-lg gradient-bg-primary hover:shadow-cyan-500/25 transition-all"
      >
        <Plus size={16} /> Add Event
      </motion.button>}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 flex-1 min-h-0">
      {
        /* Calendar Core */
      }
      <div className="lg:col-span-3 flex flex-col min-h-0">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full">
          {
            /* Calendar Toolbar */
          }
          <div className="p-5 border-b border-slate-50 dark:border-slate-800/60 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-800 dark:text-white leading-tight">
                {MONTHS[month]} <span className="text-cyan-500">{year}</span>
              </h2>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl">
              <button
                onClick={prevMonth}
                className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-500 transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg bg-white dark:bg-slate-700 text-cyan-600 dark:text-white shadow-sm"
              >
                Today
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-500 transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {
            /* Days Headings */
          }
          <div className="grid grid-cols-7 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-50 dark:border-slate-800/60">
            {DAYS.map((d) => <div key={d} className="py-2.5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{d}</div>)}
          </div>

          {
            /* Calendar Days */
          }
          <div className="grid grid-cols-7 flex-1 overflow-y-auto custom-scrollbar">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="min-h-[100px] border-b border-r border-slate-50 dark:border-slate-800/30 bg-slate-50/20 dark:bg-slate-950/10" />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateObj = new Date(year, month, day);
              const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
              const dateKey = formatDateKey(day);
              const dayEvents = eventsForDate(day);
              const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
              const isSelected = selectedDate === dateKey;
              const cellBgClass = dayEvents.length > 0 
                ? (eventTypeStyles[dayEvents[0].type]?.badge || eventTypeStyles.event.badge)
                : (isWeekend ? eventTypeStyles.holiday.badge : (isSelected ? "bg-cyan-50/30 dark:bg-cyan-900/10" : "bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-800/30"));
              
              return <motion.div
                key={day}
                onClick={() => setSelectedDate(isSelected ? null : dateKey)}
                className={`min-h-[100px] border-b border-r border-slate-50 dark:border-slate-800/60 p-2 cursor-pointer transition-all relative group ${cellBgClass}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black transition-all ${isToday ? "bg-cyan-600 text-white shadow-md" : isSelected ? "text-cyan-600 font-black" : "text-slate-500 dark:text-slate-400 font-bold group-hover:text-slate-900 dark:group-hover:text-white"}`}>
                    {day}
                  </span>
                  {dayEvents.length > 0 && <span className={`w-1.5 h-1.5 rounded-full ${eventTypeStyles[dayEvents[0].type]?.dot || eventTypeStyles.event.dot} shadow-sm`} />}
                </div>

                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((ev) => {
                    const style = eventTypeStyles[ev.type] || eventTypeStyles.event;
                    return <div key={ev.id} className={`text-[9px] px-2 py-0.5 rounded-md truncate font-black flex items-center gap-1 border border-transparent hover:border-white/50 dark:hover:border-slate-700/50 transition-all ${style.badge}`} title={ev.title}>
                      <div className={`w-1 h-1 rounded-full shrink-0 ${style.dot}`} />
                      <span className="truncate uppercase tracking-tight">{ev.title}</span>
                    </div>;
                  })}
                  {dayEvents.length > 2 && <div className="text-[9px] font-black text-slate-400 px-1 mt-0.5 tracking-widest">+{dayEvents.length - 2} MORE</div>}
                </div>
              </motion.div>;
            })}
            {
              /* Fill remaining empty cells */
            }
            {Array.from({ length: (7 - (firstDay + daysInMonth) % 7) % 7 }).map((_, i) => <div key={`empty-end-${i}`} className="min-h-[100px] border-b border-r border-slate-50 dark:border-slate-800/30 bg-slate-50/20 dark:bg-slate-950/10" />)}
          </div>
        </div>
      </div>

      {
        /* Info Side Rail */
      }
      <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1 pb-10">
        {
          /* Detailed Info for Selected Date */
        }
        <div className="page-card p-5 relative overflow-hidden">
          {
            /* Background glow */
          }
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-3xl rounded-full -mr-12 -mt-12" />

          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <CalendarIcon size={12} className="text-cyan-500" />
            Selected Date
          </h3>
          <div className="mb-4">
            <p className="text-lg font-black text-slate-800 dark:text-white leading-tight">
              {selectedDate ? (/* @__PURE__ */ new Date(selectedDate + "T00:00:00")).toLocaleDateString("en-US", { weekday: "long" }) : "Pick any"}
            </p>
            <p className="text-xs font-bold text-slate-400">
              {selectedDate ? (/* @__PURE__ */ new Date(selectedDate + "T00:00:00")).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Day on calendar"}
            </p>
          </div>

          <div className="space-y-3">
            {selectedEvents.length > 0 ? selectedEvents.map((ev) => {
              const style = eventTypeStyles[ev.type] || eventTypeStyles.event;
              
              const userRoleStr = (userRole || "").toString().toLowerCase();
              const isAdmin = userRoleStr.includes("admin") || userRoleStr.includes("hr");
              const userId = currentUser?.id || currentUser?.uid;
              const isCreator = String(ev.createdBy) === String(userId);
              const canEditDelete = isAdmin || (userRoleStr === "employee" && ev.type === "leave" && isCreator);

              return <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={ev.id}
                className={`rounded-2xl p-4 border transition-all ${style.badge} bg-opacity-40 border-slate-100 dark:border-slate-800`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{ev.type}</span>
                  </div>
                  {canEditDelete && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => openModal(ev)} className="p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800 transition-colors text-slate-500 hover:text-cyan-600">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => handleDelete(ev.id)} className="p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800 transition-colors text-slate-500 hover:text-rose-600">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-start">
                  <p className="font-black text-slate-800 dark:text-white text-sm leading-tight">{ev.title}</p>
                  {ev.time && <span className="text-[10px] font-bold text-slate-500 bg-white/50 dark:bg-slate-900/50 px-2 py-0.5 rounded-md">{ev.time}</span>}
                </div>
                {ev.description && <p className="text-xs mt-2 text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{ev.description}</p>}
              </motion.div>;
            }) : <div className="py-8 text-center bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              <Clock size={24} className="mx-auto mb-2 text-slate-200 dark:text-slate-700" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No plans found</p>
            </div>}
          </div>
        </div>

        {
          /* Upcoming Snapshot */
        }
        <div className="page-card p-5">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Bell size={12} className="text-rose-500" />
            Coming Up
          </h3>
          <div className="space-y-4">
            {visibleEvents
              .filter((ev) => {
                const today = new Date();
                const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                return ev.date >= todayStr;
              })
              .sort((a, b) => a.date.localeCompare(b.date))
              .slice(0, 4)
              .map((ev) => {
              const style = eventTypeStyles[ev.type] || eventTypeStyles.event;
              return <div key={ev.id} className="flex gap-3 group cursor-pointer">
                <div className={`w-1 rounded-full ${style.dot} opacity-40 group-hover:opacity-100 transition-opacity`} />
                <div>
                  <p className="text-xs font-black text-slate-800 dark:text-white leading-tight group-hover:text-cyan-500 transition-colors">{ev.title}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">{ev.date}</p>
                </div>
              </div>;
            })}
          </div>
        </div>

        {
          /* Legend Table */
        }
        <div className="page-card p-5 bg-gradient-to-br from-cyan-50 dark:from-slate-900 to-transparent">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Color Map</h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {Object.entries(eventTypeStyles).map(([type, style]) => (
              <div key={type} className={`flex items-center gap-2 p-2 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-sm transition-all ${style.badge} bg-opacity-20`}>
                <div className={`w-1.5 h-1.5 rounded-full shadow-sm ${style.dot}`} />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-90">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {
      /* Add Event Modal */
    }
    <AnimatePresence>
      {isModalOpen && <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsModalOpen(false)}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-950 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">{newEvent.id ? 'Edit Event' : 'Create Event'}</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Define new timeline activity</p>
            </div>
            <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 text-slate-400 transition-all"><X size={20} /></button>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Title *</label>
              <input
                value={newEvent.title}
                onChange={(e) => setNewEvent((p) => ({ ...p, title: e.target.value }))}
                placeholder="E.g. Team Annual Outing"
                className="input-base"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Date *</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent((p) => ({ ...p, date: e.target.value }))}
                  className="input-base"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                <div className="relative">
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent((p) => ({ ...p, type: e.target.value }))}
                    className={`input-base appearance-none ${isEmployee ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={isEmployee}
                  >
                    {!isEmployee && (
                      <>
                        <option value="event">Event</option>
                        <option value="meeting">Meeting</option>
                        <option value="holiday">Holiday</option>
                      </>
                    )}
                    <option value="leave">Leave</option>
                  </select>
                  <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
              <textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent((p) => ({ ...p, description: e.target.value }))}
                placeholder="Brief objective or agenda..."
                className="input-base h-24 resize-none"
              />
            </div>
          </div>

          <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50/30 dark:bg-slate-900/30">
            <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all">Cancel</button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              disabled={isSubmitting}
              onClick={handleSaveEvent}
              className={`px-8 py-2.5 text-sm font-black text-white rounded-xl shadow-lg transition-all ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'gradient-bg-primary hover:shadow-cyan-500/25'}`}
            >
              {isSubmitting ? 'Saving...' : (newEvent.id ? 'Update Event' : 'Add to Calendar')}
            </motion.button>
          </div>
        </motion.div>
      </div>}
    </AnimatePresence>
  </div>;
}
export default CalendarView;
