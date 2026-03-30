import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, X, Calendar as CalendarIcon, Clock, Bell } from "lucide-react";
import { useAppContext } from "../hooks/useAppContext";
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const eventTypeStyles = {
  leave: { badge: "badge-warning", dot: "bg-amber-500", bg: "bg-cyan-600", iconColor: "text-amber-500" },
  holiday: { badge: "badge-danger", dot: "bg-rose-500", bg: "bg-cyan-600", iconColor: "text-rose-500" },
  event: { badge: "badge-info", dot: "bg-cyan-500", bg: "bg-cyan-600", iconColor: "text-cyan-500" },
  meeting: { badge: "badge-secondary", dot: "bg-purple-500", bg: "bg-cyan-600", iconColor: "text-purple-500" }
};
function CalendarView() {
  const { calendarEvents, addCalendarEvent, userRole } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date(2024, 11, 1));
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", type: "event", description: "" });
  const canAddEvent = ["Admin", "HR Head", "HR Recruiter"].includes(userRole || "");
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const formatDateKey = (d) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const eventsForDate = (d) => {
    const key = formatDateKey(d);
    return calendarEvents.filter((e) => e.date === key);
  };
  const selectedEvents = selectedDate ? calendarEvents.filter((e) => e.date === selectedDate) : [];
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    addCalendarEvent(newEvent);
    setIsModalOpen(false);
    setNewEvent({ title: "", date: "", type: "event", description: "" });
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
        onClick={() => setIsModalOpen(true)}
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
              const dateKey = formatDateKey(day);
              const dayEvents = eventsForDate(day);
              const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
              const isSelected = selectedDate === dateKey;
              return <motion.div
                key={day}
                onClick={() => setSelectedDate(isSelected ? null : dateKey)}
                className={`min-h-[100px] border-b border-r border-slate-50 dark:border-slate-800/60 p-2 cursor-pointer transition-all relative group ${isSelected ? "bg-cyan-50/30 dark:bg-cyan-900/10" : "hover:bg-slate-50/50 dark:hover:bg-slate-800/30"}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black transition-all ${isToday ? "bg-cyan-600 text-white shadow-md" : isSelected ? "text-cyan-600 font-black" : "text-slate-500 dark:text-slate-400 font-bold group-hover:text-slate-900 dark:group-hover:text-white"}`}>
                    {day}
                  </span>
                  {dayEvents.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />}
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
              return <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={ev.id}
                className={`rounded-2xl p-4 border transition-all ${style.badge} bg-opacity-40 border-slate-100 dark:border-slate-800`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{ev.type}</span>
                </div>
                <p className="font-black text-slate-800 dark:text-white text-sm leading-tight">{ev.title}</p>
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
            {calendarEvents.slice(-4).map((ev) => {
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
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(eventTypeStyles).map(([type, style]) => <div key={type} className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-50 dark:border-slate-800 bg-white/50 dark:bg-slate-800/30 shadow-sm">
              <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
              <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter truncate">{type}</span>
            </div>)}
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
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Create Event</h2>
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
                    className="input-base appearance-none"
                  >
                    <option value="event">Event</option>
                    <option value="meeting">Meeting</option>
                    <option value="holiday">Holiday</option>
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
              onClick={handleAddEvent}
              className="px-8 py-2.5 text-sm font-black text-white rounded-xl shadow-lg gradient-bg-primary hover:shadow-cyan-500/25 transition-all"
            >
              Add to Calendar
            </motion.button>
          </div>
        </motion.div>
      </div>}
    </AnimatePresence>
  </div>;
}
export default CalendarView;
