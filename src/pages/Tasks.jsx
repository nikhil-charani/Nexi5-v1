import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Calendar, CheckCircle, Clock, X, MoreVertical, LayoutGrid, List as ListIcon } from "lucide-react";
import { mockTasks } from "../data/mockData";
import { useAppContext } from "../hooks/useAppContext";
import { toast } from "sonner";
const PRIORITY_STYLES = {
    Low: { badge: "badge-neutral", dot: "bg-slate-400", bg: "from-slate-500 to-slate-600" },
    Medium: { badge: "badge-info", dot: "bg-blue-500", bg: "from-blue-500 to-cyan-600" },
    High: { badge: "badge-warning", dot: "bg-amber-500", bg: "from-amber-500 to-orange-600" },
    Critical: { badge: "badge-danger", dot: "bg-rose-500", bg: "from-rose-500 to-pink-600" }
};
function Tasks() {
    const { employees } = useAppContext();
    const [tasks, setTasks] = useState(mockTasks);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [isModalOpen, setModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState("kanban");
    const [newTask, setNewTask] = useState({ title: "", description: "", assignedToId: "", priority: "Medium", dueDate: "" });
    const [draggedTaskId, setDraggedTaskId] = useState(null);
    const [dragOverCol, setDragOverCol] = useState(null);
    const filtered = tasks.filter((t) => {
        const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.assignedTo.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === "All" || t.status === filterStatus;
        return matchSearch && matchStatus;
    });
    const updateStatus = (id, status) => {
        setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
        toast.success(`Task moved to ${status}`);
    };
    const handleDragStart = (e, taskId) => {
        setDraggedTaskId(taskId);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", taskId);
    };
    const handleDragOver = (e, col) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setDragOverCol(col);
    };
    const handleDrop = (e, col) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("text/plain") || draggedTaskId;
        if (id) {
            const task = tasks.find((t) => t.id === id);
            if (task && task.status !== col) updateStatus(id, col);
        }
        setDraggedTaskId(null);
        setDragOverCol(null);
    };
    const handleDragEnd = () => {
        setDraggedTaskId(null);
        setDragOverCol(null);
    };
    const addTask = () => {
        if (!newTask.title || !newTask.assignedToId || !newTask.dueDate) {
            toast.error("Please fill all required fields.");
            return;
        }
        const emp = employees.find((e) => e.id === newTask.assignedToId);
        const task = {
            id: `T-${String(tasks.length + 1).padStart(3, "0")}`,
            title: newTask.title,
            description: newTask.description,
            assignedTo: emp?.name || "",
            assignedToId: newTask.assignedToId,
            priority: newTask.priority,
            dueDate: newTask.dueDate,
            status: "Pending",
            createdAt: new Date().toISOString().split("T")[0]
        };
        setTasks((prev) => [task, ...prev]);
        setModalOpen(false);
        setNewTask({ title: "", description: "", assignedToId: "", priority: "Medium", dueDate: "" });
        toast.success("Task created successfully!");
    };
    const colTasks = (s) => filtered.filter((t) => t.status === s);
    return <div className="space-y-5 h-full flex flex-col">
        {
            /* Header */
        }
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            <div>
                <div className="flex items-center gap-2.5 mb-1 text-cyan-600 dark:text-cyan-400">
                    <CheckCircle size={20} className="shrink-0" />
                    <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Task Management</h1>
                </div>
                <p className="text-slate-400 text-sm">Assign and track employee tasks across your team.</p>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                        onClick={() => setViewMode("kanban")}
                        className={`p-1.5 rounded-lg transition-all ${viewMode === "kanban" ? "bg-white dark:bg-slate-700 shadow-sm text-cyan-600 dark:text-cyan-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                    >
                        <LayoutGrid size={16} />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-white dark:bg-slate-700 shadow-sm text-cyan-600 dark:text-cyan-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                    >
                        <ListIcon size={16} />
                    </button>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-black shadow-lg gradient-bg-primary hover:shadow-cyan-500/25 transition-all"
                >
                    <Plus size={16} /> New Task
                </motion.button>
            </div>
        </div>

        {
            /* Toolbar */
        }
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0f4184] transition-colors duration-300" size={18} />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search tasks, assignees..."
                    className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-10 text-[14px] sm:text-[15px] focus:bg-white focus:border-[#0f4184] focus:ring-[4px] focus:ring-[#0f4184]/10 outline-none transition-all duration-300 placeholder:text-gray-400 font-medium text-textPrimary shadow-sm hover:border-gray-300 h-[48px]"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
            </div>
            <div className="flex gap-1 bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-x-auto custom-scrollbar no-scrollbar">
                {["All", "Pending", "In Progress", "Completed"].map((s) => <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-4 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${filterStatus === s ? "bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                >
                    {s}
                </button>)}
            </div>
        </div>

        {
            /* Main View Area */
        }
        {viewMode === "kanban" ? <div className="flex lg:grid lg:grid-cols-3 gap-5 flex-1 min-h-0 overflow-x-auto pb-2 lg:overflow-hidden">
            {["Pending", "In Progress", "Completed"].map((col) => {
                const isOver = dragOverCol === col;
                const colColor = col === "Pending" ? "bg-slate-400" : col === "In Progress" ? "bg-blue-500" : "bg-emerald-500";
                const colRing = col === "Pending" ? "ring-slate-300" : col === "In Progress" ? "ring-blue-400" : "ring-emerald-400";
                return <div
                    key={col}
                    className="flex flex-col h-full min-h-[400px] min-w-[280px] lg:min-w-0 flex-shrink-0 lg:flex-shrink"
                    onDragOver={(e) => handleDragOver(e, col)}
                    onDragLeave={() => setDragOverCol(null)}
                    onDrop={(e) => handleDrop(e, col)}
                >
                    {
                        /* Column header */
                    }
                    <div className={`flex items-center gap-2 mb-3 px-3 py-2.5 rounded-2xl transition-all ${isOver ? "bg-cyan-50 dark:bg-cyan-900/20 ring-2 " + colRing : "bg-slate-50 dark:bg-slate-800/50"}`}>
                        <div className={`w-2 h-2 rounded-full ${colColor}`} />
                        <h3 className="font-black text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">{col}</h3>
                        <span className="ml-auto text-[10px] font-black bg-white dark:bg-slate-700 text-slate-500 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">{colTasks(col).length}</span>
                        {isOver && <span className="text-[10px] font-bold text-cyan-500 animate-pulse">Drop here</span>}
                    </div>

                    {
                        /* Drop zone indicator */
                    }
                    <div className={`flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-3 pb-10 rounded-2xl transition-all duration-200 ${isOver ? "ring-2 ring-dashed " + colRing + " ring-offset-0 bg-cyan-50/30 dark:bg-cyan-900/10 p-2" : ""}`}>
                        {colTasks(col).map((task, i) => {
                            const style = PRIORITY_STYLES[task.priority];
                            const isDragging = draggedTaskId === task.id;
                            return <div
                                key={task.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, task.id)}
                                onDragEnd={handleDragEnd}
                                className="group"
                            >
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: isDragging ? 0.35 : 1, scale: isDragging ? 0.96 : 1, y: 0 }}
                                    transition={{ delay: i * 0.04, type: "spring", stiffness: 260, damping: 20 }}
                                    className={`bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-grab active:cursor-grabbing select-none ${isDragging ? "ring-2 ring-cyan-300 dark:ring-cyan-700" : ""}`}
                                    style={{ boxShadow: isDragging ? "0 20px 40px -8px rgba(8,145,178,0.2)" : "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px -4px rgba(0,0,0,0.04)" }}
                                >
                                    {
                                        /* Drag handle dots + header */
                                    }
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="space-y-1 flex-1 min-w-0">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-black uppercase rounded-lg ${style.badge}`}>
                                                <span className={`w-1 h-1 rounded-full ${style.dot}`} />
                                                {task.priority}
                                            </span>
                                            <h4 className="text-[13px] font-black text-slate-900 dark:text-white leading-tight">{task.title}</h4>
                                        </div>
                                        {
                                            /* Drag handle visual */
                                        }
                                        <div className="flex flex-col gap-0.5 opacity-20 group-hover:opacity-60 transition-opacity shrink-0 mt-1">
                                            {[0, 1, 2].map((d) => <div key={d} className="flex gap-0.5">{[0, 1].map((dd) => <div key={dd} className="w-1 h-1 rounded-full bg-slate-400" />)}</div>)}
                                        </div>
                                    </div>

                                    <p className="text-[12px] text-slate-400 dark:text-slate-500 line-clamp-2 mb-4 leading-relaxed">{task.description}</p>

                                    <div className="pt-3 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-7 h-7 rounded-xl bg-gradient-to-br ${style.bg} flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-sm`}>
                                                {task.assignedTo.charAt(0)}
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{task.assignedTo}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                            <Calendar size={11} />
                                            {task.dueDate}
                                        </div>
                                    </div>

                                    {col !== "Completed" && <div className="mt-3 flex gap-2">
                                        {col === "Pending" && <button onClick={() => updateStatus(task.id, "In Progress")} className="flex-1 text-[11px] font-black py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 rounded-xl transition-all border border-blue-100/50 dark:border-blue-800/50">
                                            Start Work
                                        </button>}
                                        <button onClick={() => updateStatus(task.id, "Completed")} className="flex-1 text-[11px] font-black py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-xl transition-all border border-emerald-100/50 dark:border-emerald-800/50">
                                            Complete
                                        </button>
                                    </div>}
                                </motion.div>
                            </div>;
                        })}
                        {colTasks(col).length === 0 && <div className={`flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-3xl text-slate-300 dark:text-slate-700 transition-all ${isOver ? "border-cyan-300 dark:border-cyan-700 bg-cyan-50/50 dark:bg-cyan-900/10 text-cyan-400 dark:text-cyan-600" : "border-slate-200 dark:border-slate-800"}`}>
                            {col === "Completed" ? <CheckCircle size={32} strokeWidth={1.5} /> : <Clock size={32} strokeWidth={1.5} />}
                            <p className="text-[11px] font-bold mt-2 uppercase tracking-widest">
                                {isOver ? "Release to drop" : "No tasks"}
                            </p>
                        </div>}
                    </div>
                </div>;
            })}
        </div> : <div className="page-card overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50/80 dark:bg-slate-800/40">
                        <tr>
                            <th className="th">Task Details</th>
                            <th className="th">Priority</th>
                            <th className="th">Assignee</th>
                            <th className="th">Due Date</th>
                            <th className="th">Status</th>
                            <th className="th text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/70">
                        {filtered.map((task, i) => {
                            const style = PRIORITY_STYLES[task.priority];
                            return <motion.tr
                                key={task.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.03 }}
                                className="bg-white dark:bg-slate-900 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                            >
                                <td className="td max-w-sm">
                                    <div className="space-y-0.5">
                                        <p className="font-bold text-slate-800 dark:text-white leading-tight">{task.title}</p>
                                        <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1">{task.description}</p>
                                    </div>
                                </td>
                                <td className="td">
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-black uppercase rounded-lg ${style.badge}`}>
                                        <span className={`w-1 h-1 rounded-full ${style.dot}`} />
                                        {task.priority}
                                    </span>
                                </td>
                                <td className="td">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${style.bg} flex items-center justify-center text-white text-[9px] font-black shrink-0`}>
                                            {task.assignedTo.charAt(0)}
                                        </div>
                                        <span className="font-bold text-slate-600 dark:text-slate-400 text-xs">{task.assignedTo}</span>
                                    </div>
                                </td>
                                <td className="td text-slate-500 text-xs">{task.dueDate}</td>
                                <td className="td">
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-black uppercase rounded-lg ${task.status === "Completed" ? "badge-success" : task.status === "In Progress" ? "badge-info" : "badge-neutral"}`}>
                                        <span className={`w-1 h-1 rounded-full ${task.status === "Completed" ? "bg-emerald-500" : task.status === "In Progress" ? "bg-blue-500" : "bg-slate-400"}`} />
                                        {task.status}
                                    </span>
                                </td>
                                <td className="td text-right">
                                    <button className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                        <MoreVertical size={14} />
                                    </button>
                                </td>
                            </motion.tr>;
                        })}
                    </tbody>
                </table>
            </div>
        </div>}

        {
            /* New Task Modal */
        }
        <AnimatePresence>
            {isModalOpen && <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-md" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 24 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    className="relative w-full max-w-lg bg-white dark:bg-slate-950 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-black text-slate-900 dark:text-white">Create New Task</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Assign a goal or objective to your team member</p>
                        </div>
                        <button onClick={() => setModalOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-all"><X size={18} /></button>
                    </div>

                    <div className="p-6 overflow-y-auto custom-scrollbar space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Task Title *</label>
                            <input value={newTask.title} onChange={(e) => setNewTask((p) => ({ ...p, title: e.target.value }))} className="input-base" placeholder="What needs to be done?" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Context / Description</label>
                            <textarea value={newTask.description} onChange={(e) => setNewTask((p) => ({ ...p, description: e.target.value }))} rows={4} className="input-base resize-none" placeholder="Provide more details..." />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Assignee *</label>
                                <select value={newTask.assignedToId} onChange={(e) => setNewTask((p) => ({ ...p, assignedToId: e.target.value }))} className="input-base appearance-none">
                                    <option value="">Select individual</option>
                                    {employees.map((emp) => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority</label>
                                <select value={newTask.priority} onChange={(e) => setNewTask((p) => ({ ...p, priority: e.target.value }))} className="input-base appearance-none">
                                    {["Low", "Medium", "High", "Critical"].map((p) => <option key={p}>{p}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Due Date *</label>
                            <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask((p) => ({ ...p, dueDate: e.target.value }))} className="input-base" />
                        </div>
                    </div>

                    <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                        <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">Cancel</button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={addTask}
                            className="px-8 py-2.5 text-sm font-black text-white rounded-xl shadow-lg gradient-bg-primary hover:shadow-cyan-500/25 transition-all"
                        >
                            Publish Task
                        </motion.button>
                    </div>
                </motion.div>
            </div>}
        </AnimatePresence>
    </div>;
}
export default Tasks;
