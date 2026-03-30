import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Search, FolderKanban, ChevronDown, ChevronRight, BarChart3, Calendar, Briefcase, LayoutGrid, List as ListIcon } from "lucide-react";
import { useAppContext } from "../hooks/useAppContext";
import { toast } from "sonner";
const PROJECT_STATUS_BADGE = {
    Active: { bg: "bg-[#0f4184]/10", text: "text-[#0b3166]", dot: "bg-[#0f4184]" },
    "On Hold": { bg: "bg-orange-100", text: "text-orange-600", dot: "bg-orange-500" },
    Completed: { bg: "bg-emerald-100", text: "text-emerald-600", dot: "bg-emerald-500" },
    Cancelled: { bg: "bg-red-100", text: "text-red-600", dot: "bg-red-500" }
};
const MODULE_STATUS_BADGE = {
    "Not Started": { bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400" },
    "In Progress": { bg: "bg-blue-100", text: "text-blue-600", dot: "bg-blue-500" },
    Completed: { bg: "bg-emerald-100", text: "text-emerald-600", dot: "bg-emerald-500" },
    Blocked: { bg: "bg-red-100", text: "text-red-600", dot: "bg-red-500" }
};
function ProgressBar({ value }) {
    const color = value >= 80 ? "bg-[#0b3166]" : value >= 50 ? "bg-[#0f4184]" : value >= 25 ? "bg-orange-400" : "bg-red-400";
    return <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${color}`}
            />
        </div>
        <span className="text-xs font-bold text-textSecondary w-8 text-right">{value}%</span>
    </div>;
}
function Projects() {
    const { projects, addProject, addModule, employees, currentUser, userRole } = useAppContext();
    const isAdminOrHR = ["Admin", "HR", "HR Head", "HR Accountant", "HR Recruiter"].includes(userRole);
    const isManager = userRole === "Manager";
    const canManage = isAdminOrHR || isManager;
    const [search, setSearch] = useState("");
    const [expandedProjects, setExpandedProjects] = useState(/* @__PURE__ */ new Set(["PRJ-001"]));
    const [addProjectModal, setAddProjectModal] = useState(false);
    const [addModuleModal, setAddModuleModal] = useState(null);
    const [activeTab, setActiveTab] = useState("projects");
    const [viewMode, setViewMode] = useState("list");
    const [projectForm, setProjectForm] = useState({ name: "", client: "", startDate: "", endDate: "", description: "", status: "Active" });
    const [moduleForm, setModuleForm] = useState({ name: "", assignedToId: "", dueDate: "", status: "In Progress" });
    const visibleProjects = useMemo(() => {
        let data = projects;
        if (userRole === "Employee") {
            data = projects.filter((p) => p.modules.some((m) => m.assignedToId === currentUser?.id));
        }
        if (search) data = data.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase()));
        return data;
    }, [projects, userRole, currentUser, search]);
    const allModules = useMemo(() => {
        let mods = visibleProjects.flatMap((p) => p.modules.map((m) => ({ ...m, projectName: p.name })));
        if (userRole === "Employee") mods = mods.filter((m) => m.assignedToId === currentUser?.id);
        return mods;
    }, [visibleProjects, userRole, currentUser]);
    const toggleExpand = (id) => setExpandedProjects((prev) => {
        const s = new Set(prev);
        s.has(id) ? s.delete(id) : s.add(id);
        return s;
    });
    const handleAddProject = () => {
        if (!projectForm.name || !projectForm.client || !projectForm.startDate || !projectForm.endDate) {
            toast.error("Fill in all required fields");
            return;
        }
        addProject({ ...projectForm });
        setAddProjectModal(false);
        setProjectForm({ name: "", client: "", startDate: "", endDate: "", description: "", status: "Active" });
        toast.success("Project created!");
    };
    const handleAddModule = (projectId) => {
        const emp = employees.find((e) => e.id === moduleForm.assignedToId);
        if (!moduleForm.name || !emp || !moduleForm.dueDate) {
            toast.error("Fill in all required fields");
            return;
        }
        addModule(projectId, { name: moduleForm.name, assignedTo: emp.name, assignedToId: emp.id, department: emp.department, progress: 0, status: moduleForm.status, dueDate: moduleForm.dueDate });
        setAddModuleModal(null);
        setModuleForm({ name: "", assignedToId: "", dueDate: "", status: "In Progress" });
        toast.success("Module added!");
    };
    const totalModules = projects.flatMap((p) => p.modules).length;
    const avgProgress = totalModules ? Math.round(projects.flatMap((p) => p.modules).reduce((s, m) => s + m.progress, 0) / totalModules) : 0;
    return <div className="space-y-5">
        {
            /* Header */
        }
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
                <div className="flex items-center gap-3 mb-1 text-primary">
                    <FolderKanban size={24} className="shrink-0" />
                    <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Projects & Modules</h1>
                </div>
                <p className="text-textSecondary text-sm font-medium">Track projects, modules, and employee assignments.</p>
            </div>
            {canManage && (
                <button
                    onClick={() => setAddProjectModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-bold bg-gradient-to-r from-[#0f4184] to-[#0b3166] hover:opacity-90 transition-all shadow-sm"
                >
                    <Plus size={18} /> New Project
                </button>
            )}
        </div>

        {
            /* Summary cards */
        }
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
            {[
                { label: "Total Projects", value: visibleProjects.length, icon: Briefcase, color: "text-[#0f4184] bg-[#0f4184]/10" },
                { label: "Active", value: visibleProjects.filter((p) => p.status === "Active").length, icon: FolderKanban, color: "text-[#0b3166] bg-[#0b3166]/10" },
                { label: "Total Modules", value: allModules.length, icon: BarChart3, color: "text-[#0b3166] bg-[#0b3166]/10" },
                { label: "Avg Progress", value: `${avgProgress}%`, icon: Calendar, color: "text-orange-500 bg-orange-50" }
            ].map((stat, i) => <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-white p-3 sm:p-6 rounded-xl border border-gray-100 flex items-center gap-2 sm:gap-4 cursor-default shadow-sm"
            >
                <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl ${stat.color} flex items-center justify-center shrink-0 shadow-sm`}><stat.icon size={18} className="sm:hidden" /><stat.icon size={22} className="hidden sm:block" /></div>
                <div className="min-w-0">
                    <p className="text-[10px] sm:text-[11px] font-bold text-textSecondary uppercase tracking-widest truncate">{stat.label}</p>
                    <p className="text-xl sm:text-2xl font-bold text-textPrimary mt-0.5">{stat.value}</p>
                </div>
            </motion.div>)}
        </div>

        {
            /* Tabs */
        }
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl">
                {[{ id: "projects", label: "Projects & Modules" }, { id: "tracking", label: "Work Tracking" }].map((tab) => <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab.id ? "bg-white text-primary shadow-sm" : "text-textSecondary hover:text-textPrimary"}`}
                >
                    {tab.label}
                </button>)}
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
                {activeTab === "projects" && <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => setViewMode("kanban")}
                        className={`p-2 rounded-lg transition-all ${viewMode === "kanban" ? "bg-white shadow-sm text-primary" : "text-textSecondary hover:text-textPrimary"}`}
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-primary" : "text-textSecondary hover:text-textPrimary"}`}
                    >
                        <ListIcon size={18} />
                    </button>
                </div>}
                <div className="relative flex-1 sm:flex-initial w-full sm:w-[300px] md:w-[400px] group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0f4184] transition-colors duration-300" size={18} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search projects..."
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-3 pl-12 pr-10 text-[14px] sm:text-[15px] focus:bg-white focus:border-[#0f4184] focus:ring-[4px] focus:ring-[#0f4184]/10 outline-none transition-all duration-300 placeholder:text-gray-400 font-medium text-textPrimary shadow-sm hover:border-gray-300"
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
            </div>
        </div>

        {
            /* PROJECTS TAB */
        }
        {activeTab === "projects" && viewMode === "list" && <div className="space-y-4">
            {visibleProjects.length === 0 && <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                <FolderKanban size={48} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">No projects found</p>
            </div>}
            {visibleProjects.map((project, pi) => <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: pi * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:border-gray-300 transition-all group"
            >
                {
                    /* Project Header */
                }
                <div className="p-4 sm:p-5 flex items-start sm:items-center gap-3 sm:gap-5 cursor-pointer hover:bg-gray-50/50 transition-colors flex-wrap" onClick={() => toggleExpand(project.id)}>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center shrink-0 font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">
                        {project.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-bold text-textPrimary text-[17px] tracking-tight">{project.name}</h3>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-full ${PROJECT_STATUS_BADGE[project.status].bg} ${PROJECT_STATUS_BADGE[project.status].text}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${PROJECT_STATUS_BADGE[project.status].dot} shadow-[0_0_8px_rgba(34,193,220,0.5)]`} />
                                {project.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-textSecondary text-[13px] font-medium">
                            <span className="flex items-center gap-1"><Briefcase size={14} className="text-gray-400" /> {project.client}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span className="flex items-center gap-1"><Calendar size={14} className="text-gray-400" /> {project.endDate}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span className="text-primary font-bold">{project.modules.length} Modules</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {canManage && <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setAddModuleModal(project.id);
                            }}
                            className="px-4 py-2 text-[13px] font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-all flex items-center gap-2 shadow-sm"
                        >
                            <Plus size={16} /> Add Module
                        </button>}
                        <div className={`p-2 rounded-lg bg-gray-50 text-gray-400 transform transition-transform duration-300 ${expandedProjects.has(project.id) ? "rotate-180" : ""}`}>
                            <ChevronDown size={20} />
                        </div>
                    </div>
                </div>

                {
                    /* Modules */
                }
                <AnimatePresence>
                    {expandedProjects.has(project.id) && project.modules.length > 0 && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <div className="border-t border-slate-100 dark:border-slate-800 overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50/50 dark:bg-slate-800/30">
                                    <tr>
                                        <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Module</th>
                                        <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Assigned To</th>
                                        <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Department</th>
                                        <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Due Date</th>
                                        <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Progress</th>
                                        <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                    {project.modules.map((mod) => <tr key={mod.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                        <td className="px-5 py-3 font-semibold text-slate-800 dark:text-slate-200">{mod.name}</td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-black flex items-center justify-center">{mod.assignedTo.charAt(0)}</div>
                                                <span className="text-slate-700 dark:text-slate-300 text-xs">{mod.assignedTo}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-slate-500 text-xs">{mod.department}</td>
                                        <td className="px-5 py-3 text-slate-500 text-xs">{mod.dueDate}</td>
                                        <td className="px-5 py-3 min-w-[140px]"><ProgressBar value={mod.progress} /></td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg ${MODULE_STATUS_BADGE[mod.status].badge}`}>
                                                <span className={`w-1 h-1 rounded-full ${MODULE_STATUS_BADGE[mod.status].dot}`} />{mod.status}</span>
                                        </td>
                                    </tr>)}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>}
                    {expandedProjects.has(project.id) && project.modules.length === 0 && <div className="border-t border-slate-100 dark:border-slate-800 py-8 text-center text-slate-400 text-sm">
                        No modules yet. {canManage && 'Click "+ Module" to add one.'}
                    </div>}
                </AnimatePresence>
            </motion.div>)}
        </div>}
        {
            /* KANBAN VIEW */
        }
        {activeTab === "projects" && viewMode === "kanban" && <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar items-start">
            {["Active", "On Hold", "Completed", "Cancelled"].map((status) => {
                const statusProjects = visibleProjects.filter((p) => p.status === status);
                return <div key={status} className="bg-gray-50/50 rounded-2xl p-5 min-w-[320px] w-[320px] border border-gray-100 flex flex-col shrink-0">
                    <div className="flex items-center justify-between mb-5 px-1">
                        <div className="flex items-center gap-2.5">
                            <span className={`w-2 h-2 rounded-full ${PROJECT_STATUS_BADGE[status].dot}`} />
                            <h3 className="font-bold text-textPrimary text-sm">{status}</h3>
                        </div>
                        <span className="text-xs font-bold text-textSecondary bg-white border border-gray-100 px-2.5 py-0.5 rounded-full shadow-sm">{statusProjects.length}</span>
                    </div>
                    <div className="flex flex-col gap-4 flex-1 min-h-[100px]">
                        {statusProjects.length === 0 && <div className="flex-1 flex items-center justify-center p-10 border-2 border-dashed border-gray-100 rounded-xl bg-white/50">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">No projects in {status}</p>
                        </div>}
                        {statusProjects.map((project) => {
                            const progress = project.modules.length > 0 ? Math.round(project.modules.reduce((s, m) => s + m.progress, 0) / project.modules.length) : 0;
                            return <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all relative group"
                                onClick={() => {
                                    setViewMode("list");
                                    setExpandedProjects(new Set([project.id]));
                                }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0f4184] to-[#0b3166] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                            {project.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-textPrimary text-sm leading-tight">{project.name}</h4>
                                            <p className="text-[11px] text-textSecondary mt-1 font-medium">{project.client}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Progress</span>
                                        <span className="text-[10px] font-bold text-textPrimary">{progress}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${PROJECT_STATUS_BADGE[project.status].dot}`} style={{ width: `${progress}%` }} />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-5 flex-wrap gap-2 border-t border-gray-50 pt-4">
                                    <div className="flex items-center gap-1.5 text-[10px] text-textSecondary font-bold">
                                        <Calendar size={13} />
                                        {project.endDate}
                                    </div>
                                    <div className="flex -space-x-2">
                                        {project.modules.slice(0, 3).map((m, i) => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-primary/10 text-primary flex items-center justify-center text-[9px] font-bold shrink-0 relative z-30 shadow-sm" title={m.assignedTo}>
                                            {m.assignedTo.charAt(0)}
                                        </div>)}
                                        {project.modules.length > 3 && <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 text-gray-500 flex items-center justify-center text-[9px] font-bold shrink-0 relative z-20 shadow-sm">
                                            +{project.modules.length - 3}
                                        </div>}
                                    </div>
                                </div>
                            </motion.div>;
                        })}
                    </div>
                </div>;
            })}
        </div>}

        {
            /* EMPLOYEE WORK TRACKING TAB */
        }
        {activeTab === "tracking" && <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-lg font-bold text-textPrimary">Employee Work Tracking</h3>
                <p className="text-xs text-textSecondary mt-1 font-medium">Overview of which employee is working on which module.</p>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Employee</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Project</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Module</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Progress</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Due Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {allModules.length === 0 && <tr><td colSpan={6} className="py-16 text-center text-textSecondary font-medium">No modules assigned yet.</td></tr>}
                        {allModules.map((mod, i) => <motion.tr
                            key={mod.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.03 }}
                            className="hover:bg-[#F0F9FF] transition-colors"
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold border border-primary/20 shadow-sm">{mod.assignedTo.charAt(0)}</div>
                                    <div>
                                        <p className="font-bold text-textPrimary text-xs">{mod.assignedTo}</p>
                                        <p className="text-[11px] text-textSecondary font-medium">{mod.department}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-textSecondary font-medium">{mod.projectName}</td>
                            <td className="px-6 py-4 font-bold text-textPrimary">{mod.name}</td>
                            <td className="px-6 py-4 min-w-[160px]"><ProgressBar value={mod.progress} /></td>
                            <td className="px-6 py-4"><span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${MODULE_STATUS_BADGE[mod.status].bg} ${MODULE_STATUS_BADGE[mod.status].text}`}><span className={`w-1.5 h-1.5 rounded-full ${MODULE_STATUS_BADGE[mod.status].dot}`} />{mod.status}</span></td>
                            <td className="px-6 py-4 text-textSecondary text-xs font-medium">{mod.dueDate}</td>
                        </motion.tr>)}
                    </tbody>
                </table>
            </div>
        </div>}

        {
            /* Add Project Modal */
        }
        <AnimatePresence>
            {addProjectModal && <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAddProjectModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-textPrimary">New Project</h2>
                            <p className="text-xs text-textSecondary mt-1 font-medium">Create a new project and assign modules.</p>
                        </div>
                        <button onClick={() => setAddProjectModal(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-all">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                        {[
                            { label: "Project Name *", key: "name", type: "text", placeholder: "e.g. FinTrack ERP v2" },
                            { label: "Client *", key: "client", type: "text", placeholder: "Client company name" },
                            { label: "Description", key: "description", type: "text", placeholder: "Brief description" }
                        ].map((f) => <div key={f.key} className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">{f.label}</label>
                            <input
                                type={f.type}
                                value={projectForm[f.key]}
                                onChange={(e) => setProjectForm((p) => ({ ...p, [f.key]: e.target.value }))}
                                placeholder={f.placeholder}
                                className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-textPrimary"
                            />
                        </div>)}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Start Date *</label>
                                <input
                                    type="date"
                                    value={projectForm.startDate}
                                    onChange={(e) => setProjectForm((p) => ({ ...p, startDate: e.target.value }))}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-textPrimary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">End Date *</label>
                                <input
                                    type="date"
                                    value={projectForm.endDate}
                                    onChange={(e) => setProjectForm((p) => ({ ...p, endDate: e.target.value }))}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-textPrimary"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                        <button onClick={() => setAddProjectModal(false)} className="px-6 py-2.5 text-sm font-bold text-textSecondary hover:bg-gray-100 rounded-lg transition-all">Cancel</button>
                        <button
                            onClick={handleAddProject}
                            className="px-8 py-2.5 text-sm font-bold text-white rounded-lg shadow-sm bg-gradient-to-r from-[#0f4184] to-[#0b3166] hover:opacity-90 transition-all"
                        >
                            Create Project
                        </button>
                    </div>
                </motion.div>
            </div>}
        </AnimatePresence>

        {
            /* Add Module Modal */
        }
        <AnimatePresence>
            {addModuleModal && <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAddModuleModal(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
                >
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-textPrimary">Add Module</h2>
                            <p className="text-xs text-textSecondary mt-1 font-medium">Assign a module to an employee.</p>
                        </div>
                        <button onClick={() => setAddModuleModal(null)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-all">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Module Name *</label>
                            <input
                                value={moduleForm.name}
                                onChange={(e) => setModuleForm((p) => ({ ...p, name: e.target.value }))}
                                placeholder="e.g. Authentication Flow"
                                className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-textPrimary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Assign To *</label>
                            <select
                                value={moduleForm.assignedToId}
                                onChange={(e) => setModuleForm((p) => ({ ...p, assignedToId: e.target.value }))}
                                className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-textPrimary appearance-none"
                            >
                                <option value="">Select employee</option>
                                {employees.filter((e) => e.status === "Active").map((e) => <option key={e.id} value={e.id}>{e.name} ({e.department})</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Due Date *</label>
                                <input
                                    type="date"
                                    value={moduleForm.dueDate}
                                    onChange={(e) => setModuleForm((p) => ({ ...p, dueDate: e.target.value }))}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-textPrimary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Status</label>
                                <select
                                    value={moduleForm.status}
                                    onChange={(e) => setModuleForm((p) => ({ ...p, status: e.target.value }))}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-textPrimary appearance-none"
                                >
                                    {["Not Started", "In Progress", "Completed", "Blocked"].map((s) => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                        <button onClick={() => setAddModuleModal(null)} className="px-6 py-2.5 text-sm font-bold text-textSecondary hover:bg-gray-100 rounded-lg transition-all">Cancel</button>
                        <button
                            onClick={() => handleAddModule(addModuleModal)}
                            className="px-8 py-2.5 text-sm font-bold text-white rounded-lg shadow-sm bg-gradient-to-r from-[#0f4184] to-[#0b3166] hover:opacity-90 transition-all"
                        >
                            Add Module
                        </button>
                    </div>
                </motion.div>
            </div>}
        </AnimatePresence>
    </div>;
}
export {
    Projects as default
};
