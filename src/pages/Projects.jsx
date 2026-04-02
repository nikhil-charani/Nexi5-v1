import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Search, FolderKanban, ChevronDown, BarChart3, Calendar, Briefcase, LayoutGrid, List as ListIcon, Edit2, Trash2, Loader2 } from "lucide-react";
import { useAppContext } from "../hooks/useAppContext";
import { toast } from "sonner";
import { getProjects, createProject, updateProject, deleteProject } from "../api/companyProjectApi";

// ─── Status Badge Configs ──────────────────────────────────────────
const PROJECT_STATUS_BADGE = {
    active:     { bg: "bg-[#0f4184]/10", text: "text-[#0b3166]", dot: "bg-[#0f4184]",    label: "Active"    },
    "on-hold":  { bg: "bg-orange-100",   text: "text-orange-600", dot: "bg-orange-500",    label: "On Hold"   },
    completed:  { bg: "bg-emerald-100",  text: "text-emerald-600", dot: "bg-emerald-500",  label: "Completed" },
    cancelled:  { bg: "bg-red-100",      text: "text-red-600",    dot: "bg-red-500",       label: "Cancelled" }
};

const MODULE_STATUS_BADGE = {
    "Not Started": { bg: "bg-gray-100",    text: "text-gray-500",    dot: "bg-gray-400"    },
    "In Progress":  { bg: "bg-blue-100",   text: "text-blue-600",    dot: "bg-blue-500"    },
    Completed:      { bg: "bg-emerald-100",text: "text-emerald-600", dot: "bg-emerald-500" },
    Blocked:        { bg: "bg-red-100",    text: "text-red-600",     dot: "bg-red-500"     }
};

// ─── Status config helper (case-insensitive) ───────────────────────
const getStatusConfig = (status = "") => {
    return PROJECT_STATUS_BADGE[status.toLowerCase()] || PROJECT_STATUS_BADGE.active;
};

// ─── Progress Bar Component ───────────────────────────────────────
function ProgressBar({ value }) {
    const color = value >= 80 ? "bg-[#0b3166]" : value >= 50 ? "bg-[#0f4184]" : value >= 25 ? "bg-orange-400" : "bg-red-400";
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${color}`}
                />
            </div>
            <span className="text-xs font-bold text-textSecondary w-8 text-right">{value}%</span>
        </div>
    );
}

// ─── Empty Form States ────────────────────────────────────────────
const EMPTY_PROJECT_FORM = { projectName: "", clientName: "", description: "", startDate: "", endDate: "", status: "active" };

// ─── Main Component ───────────────────────────────────────────────
function Projects() {
    const { employees, currentUser, userRole } = useAppContext();

    const isAdminOrHR = ["Admin", "HR Head", "HR Accountant", "HR Recruiter"].includes(userRole);
    const isManager = userRole === "Manager";
    const canManage = isAdminOrHR || isManager;

    // ─── State ─────────────────────────────────────────────────────
    const [companyProjects, setCompanyProjects] = useState([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [search, setSearch] = useState("");
    const [expandedProjects, setExpandedProjects] = useState(new Set());
    const [addProjectModal, setAddProjectModal]   = useState(false);
    const [editProjectData, setEditProjectData]   = useState(null); // null | project object
    const [addModuleModal, setAddModuleModal]      = useState(null);
    const [deleteConfirm, setDeleteConfirm]        = useState(null); // null | project id
    const [activeTab, setActiveTab]               = useState("projects");
    const [viewMode, setViewMode]                 = useState("list");
    const [projectForm, setProjectForm]           = useState(EMPTY_PROJECT_FORM);
    const [moduleForm, setModuleForm]             = useState({ name: "", assignedToId: "", dueDate: "", status: "In Progress" });
    const [isSubmitting, setIsSubmitting]         = useState(false);
    const [isDeleting, setIsDeleting]             = useState(false);

    // ─── Load Projects ──────────────────────────────────────────────
    const loadProjects = useCallback(async () => {
        setIsLoadingProjects(true);
        try {
            const data = await getProjects(currentUser?.token);
            setCompanyProjects(data);
        } catch (err) {
            toast.error(err.message || "Failed to load projects");
        } finally {
            setIsLoadingProjects(false);
        }
    }, [currentUser?.token]);

    useEffect(() => {
        if (currentUser?.token) loadProjects();
    }, [currentUser?.token, loadProjects]);

    // ─── Socket.IO Real-Time Sync ───────────────────────────────────
    useEffect(() => {
        if (!currentUser?.token) return;
        // Dynamically import socket to avoid breaking the build if not connected
        import("socket.io-client").then(({ io }) => {
            const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
            const socket = io(API_BASE.replace("/api", ""), { withCredentials: true });

            socket.on("project_created", (p) => setCompanyProjects(prev => {
                if (prev.find(x => x.id === p.id)) return prev;
                return [p, ...prev];
            }));
            socket.on("project_updated", (p) => setCompanyProjects(prev => prev.map(x => x.id === p.id ? p : x)));
            socket.on("project_deleted", ({ id }) => setCompanyProjects(prev => prev.filter(x => x.id !== id)));

            return () => socket.disconnect();
        }).catch(() => {/* ignore if socket not available */});
    }, [currentUser?.token]);

    // ─── Derived State ──────────────────────────────────────────────
    const visibleProjects = useMemo(() => {
        let data = companyProjects;
        if (search) data = data.filter((p) =>
            p.projectName?.toLowerCase().includes(search.toLowerCase()) ||
            p.clientName?.toLowerCase().includes(search.toLowerCase())
        );
        return data;
    }, [companyProjects, search]);

    const allModules = useMemo(() => {
        return visibleProjects.flatMap((p) => (p.modules || []).map((m) => ({ ...m, projectName: p.projectName })));
    }, [visibleProjects]);

    const totalModules = companyProjects.reduce((sum, p) => sum + (p.modules?.length || 0), 0);
    const avgProgress  = totalModules
        ? Math.round(companyProjects.flatMap(p => p.modules || []).reduce((s, m) => s + (m.progress || 0), 0) / totalModules)
        : 0;
    const activeCount  = companyProjects.filter(p => p.status === "active").length;

    // ─── Handlers ──────────────────────────────────────────────────
    const toggleExpand = (id) => setExpandedProjects((prev) => {
        const s = new Set(prev);
        s.has(id) ? s.delete(id) : s.add(id);
        return s;
    });

    const openCreateModal = () => {
        setEditProjectData(null);
        setProjectForm(EMPTY_PROJECT_FORM);
        setAddProjectModal(true);
    };

    const openEditModal = (project) => {
        setEditProjectData(project);
        setProjectForm({
            projectName: project.projectName || "",
            clientName:  project.clientName  || "",
            description: project.description || "",
            startDate:   project.startDate   || "",
            endDate:     project.endDate     || "",
            status:      project.status      || "active"
        });
        setAddProjectModal(true);
    };

    const handleSaveProject = async () => {
        const { projectName, clientName, startDate, endDate } = projectForm;
        if (!projectName.trim() || !clientName.trim()) {
            toast.error("Project Name and Client are required.");
            return;
        }
        if (!startDate || !endDate) {
            toast.error("Both Start Date and End Date are required.");
            return;
        }
        if (new Date(startDate) > new Date(endDate)) {
            toast.error("Start Date cannot be after End Date.");
            return;
        }

        setIsSubmitting(true);
        try {
            if (editProjectData) {
                const updated = await updateProject(editProjectData.id, projectForm, currentUser?.token);
                setCompanyProjects(prev => prev.map(p => p.id === editProjectData.id ? updated : p));
                toast.success("Project updated successfully!");
            } else {
                await createProject(projectForm, currentUser?.token);
                toast.success("Project created successfully!");
            }
            setAddProjectModal(false);
        } catch (err) {
            toast.error(err.message || "Operation failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteProject = async () => {
        if (!deleteConfirm) return;
        setIsDeleting(true);
        try {
            await deleteProject(deleteConfirm, currentUser?.token);
            setCompanyProjects(prev => prev.filter(p => p.id !== deleteConfirm));
            toast.success("Project deleted.");
        } catch (err) {
            toast.error(err.message || "Could not delete project.");
        } finally {
            setIsDeleting(false);
            setDeleteConfirm(null);
        }
    };

    const handleAddModule = async (projectId) => {
        const emp = employees.find((e) => e.id === moduleForm.assignedToId || e.uid === moduleForm.assignedToId);
        if (!moduleForm.name || !emp || !moduleForm.dueDate) {
            toast.error("Fill in all required fields");
            return;
        }

        const project = companyProjects.find(p => p.id === projectId);
        if (!project) return;

        const newModule = { 
            id: `M-${Date.now()}`, 
            name: moduleForm.name, 
            assignedTo: emp.name, 
            assignedToId: emp.id || emp.uid, // Ensure it's the UID
            department: emp.department, 
            progress: 0, 
            status: moduleForm.status, 
            dueDate: moduleForm.dueDate, 
            projectId 
        };

        const updatedModules = [...(project.modules || []), newModule];

        try {
            await updateProject(projectId, { modules: updatedModules }, currentUser?.token);
            setCompanyProjects(prev => prev.map(p => p.id === projectId ? { ...p, modules: updatedModules } : p));
            setAddModuleModal(null);
            setModuleForm({ name: "", assignedToId: "", dueDate: "", status: "In Progress" });
            toast.success("Module added and saved!");
        } catch (err) {
            toast.error("Failed to save module: " + err.message);
        }
    };

    // ─── Render ────────────────────────────────────────────────────
    return (
        <div className="space-y-5">
            {/* Header */}
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
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-bold bg-gradient-to-r from-[#0f4184] to-[#0b3166] hover:opacity-90 transition-all shadow-sm"
                    >
                        <Plus size={18} /> New Project
                    </button>
                )}
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
                {[
                    { label: "Total Projects", value: isLoadingProjects ? "..." : visibleProjects.length, icon: Briefcase,   color: "text-[#0f4184] bg-[#0f4184]/10" },
                    { label: "Active",          value: isLoadingProjects ? "..." : activeCount,            icon: FolderKanban, color: "text-[#0b3166] bg-[#0b3166]/10" },
                    { label: "Total Modules",   value: isLoadingProjects ? "..." : totalModules,           icon: BarChart3,    color: "text-[#0b3166] bg-[#0b3166]/10" },
                    { label: "Avg Progress",    value: isLoadingProjects ? "..." : `${avgProgress}%`,     icon: Calendar,     color: "text-orange-500 bg-orange-50"    }
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="bg-white p-3 sm:p-6 rounded-xl border border-gray-100 flex items-center gap-2 sm:gap-4 cursor-default shadow-sm"
                    >
                        <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl ${stat.color} flex items-center justify-center shrink-0 shadow-sm`}>
                            <stat.icon size={18} className="sm:hidden" />
                            <stat.icon size={22} className="hidden sm:block" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] sm:text-[11px] font-bold text-textSecondary uppercase tracking-widest truncate">{stat.label}</p>
                            <p className="text-xl sm:text-2xl font-bold text-textPrimary mt-0.5">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Tabs + Search */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl">
                    {[{ id: "projects", label: "Projects & Modules" }, { id: "tracking", label: "Work Tracking" }].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab.id ? "bg-white text-primary shadow-sm" : "text-textSecondary hover:text-textPrimary"}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {activeTab === "projects" && (
                        <div className="flex bg-gray-100 p-1 rounded-xl">
                            <button onClick={() => setViewMode("kanban")} className={`p-2 rounded-lg transition-all ${viewMode === "kanban" ? "bg-white shadow-sm text-primary" : "text-textSecondary hover:text-textPrimary"}`}><LayoutGrid size={18} /></button>
                            <button onClick={() => setViewMode("list")}   className={`p-2 rounded-lg transition-all ${viewMode === "list"   ? "bg-white shadow-sm text-primary" : "text-textSecondary hover:text-textPrimary"}`}><ListIcon   size={18} /></button>
                        </div>
                    )}
                    <div className="relative flex-1 sm:flex-initial w-full sm:w-[300px] md:w-[400px] group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0f4184] transition-colors duration-300" size={18} />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search projects..."
                            className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-3 pl-12 pr-10 text-[14px] sm:text-[15px] focus:bg-white focus:border-[#0f4184] focus:ring-[4px] focus:ring-[#0f4184]/10 outline-none transition-all duration-300 placeholder:text-gray-400 font-medium text-textPrimary shadow-sm hover:border-gray-300"
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {isLoadingProjects && (
                <div className="flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative w-12 h-12">
                            <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
                            <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Projects...</p>
                    </div>
                </div>
            )}

            {/* PROJECTS LIST VIEW */}
            {!isLoadingProjects && activeTab === "projects" && viewMode === "list" && (
                <div className="space-y-4">
                    {visibleProjects.length === 0 && (
                        <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <FolderKanban size={48} className="mx-auto text-slate-300 mb-3" />
                            <p className="text-slate-500 font-medium">No projects found</p>
                            {canManage && <p className="text-slate-400 text-sm mt-1">Click <span className="font-semibold text-primary">+ New Project</span> to create your first one.</p>}
                        </div>
                    )}
                    {visibleProjects.map((project, pi) => {
                        const statusCfg = getStatusConfig(project.status);
                        return (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: pi * 0.05 }}
                                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:border-gray-300 transition-all group"
                            >
                                {/* Project Header Row */}
                                <div className="p-4 sm:p-5 flex items-start sm:items-center gap-3 sm:gap-5 flex-wrap">
                                    {/* Expand toggle */}
                                    <div
                                        className="flex-1 flex items-start sm:items-center gap-3 sm:gap-5 cursor-pointer flex-wrap"
                                        onClick={() => toggleExpand(project.id)}
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center shrink-0 font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">
                                            {(project.projectName || "P").charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h3 className="font-bold text-textPrimary text-[17px] tracking-tight">{project.projectName}</h3>
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-full ${statusCfg.bg} ${statusCfg.text}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />{statusCfg.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-2 text-textSecondary text-[13px] font-medium flex-wrap">
                                                <span className="flex items-center gap-1"><Briefcase size={14} className="text-gray-400" />{project.clientName}</span>
                                                {project.endDate && <><span className="w-1 h-1 rounded-full bg-gray-300" /><span className="flex items-center gap-1"><Calendar size={14} className="text-gray-400" />{project.endDate}</span></>}
                                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                <span className="text-primary font-bold">{(project.modules || []).length} Modules</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        {canManage && (
                                            <>
                                                <button
                                                    onClick={() => setAddModuleModal(project.id)}
                                                    className="px-3 py-2 text-[12px] font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                                                >
                                                    <Plus size={14} /> Module
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(project)}
                                                    className="p-2 rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-all"
                                                    title="Edit Project"
                                                >
                                                    <Edit2 size={15} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(project.id)}
                                                    className="p-2 rounded-lg bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-all"
                                                    title="Delete Project"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </>
                                        )}
                                        <div className={`p-2 rounded-lg bg-gray-50 text-gray-400 transform transition-transform duration-300 cursor-pointer ${expandedProjects.has(project.id) ? "rotate-180" : ""}`} onClick={() => toggleExpand(project.id)}>
                                            <ChevronDown size={20} />
                                        </div>
                                    </div>
                                </div>

                                {/* Modules Table */}
                                <AnimatePresence>
                                    {expandedProjects.has(project.id) && (project.modules || []).length > 0 && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                                            <div className="border-t border-slate-100 overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-slate-50/50">
                                                        <tr>
                                                            {["Module", "Assigned To", "Department", "Due Date", "Progress", "Status"].map(h => (
                                                                <th key={h} className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-50">
                                                        {(project.modules || []).map((mod) => (
                                                            <tr key={mod.id} className="hover:bg-slate-50/50 transition-colors">
                                                                <td className="px-5 py-3 font-semibold text-slate-800">{mod.name}</td>
                                                                <td className="px-5 py-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-black flex items-center justify-center">
                                                                            {(mod.assignedTo || "?").charAt(0)}
                                                                        </div>
                                                                        <span className="text-slate-700 text-xs">{mod.assignedTo}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-5 py-3 text-slate-500 text-xs">{mod.department}</td>
                                                                <td className="px-5 py-3 text-slate-500 text-xs">{mod.dueDate}</td>
                                                                <td className="px-5 py-3 min-w-[140px]"><ProgressBar value={mod.progress || 0} /></td>
                                                                <td className="px-5 py-3">
                                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg ${MODULE_STATUS_BADGE[mod.status]?.bg || "bg-gray-100"} ${MODULE_STATUS_BADGE[mod.status]?.text || "text-gray-500"}`}>
                                                                        <span className={`w-1 h-1 rounded-full ${MODULE_STATUS_BADGE[mod.status]?.dot || "bg-gray-400"}`} />{mod.status}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </motion.div>
                                    )}
                                    {expandedProjects.has(project.id) && (project.modules || []).length === 0 && (
                                        <div className="border-t border-slate-100 py-8 text-center text-slate-400 text-sm">
                                            No modules yet. {canManage && 'Click "+ Module" to add one.'}
                                        </div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* KANBAN VIEW */}
            {!isLoadingProjects && activeTab === "projects" && viewMode === "kanban" && (
                <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar items-start">
                    {["active", "on-hold", "completed", "cancelled"].map((status) => {
                        const cfg = getStatusConfig(status);
                        const statusProjects = visibleProjects.filter((p) => p.status === status);
                        return (
                            <div key={status} className="bg-gray-50/50 rounded-2xl p-5 min-w-[320px] w-[320px] border border-gray-100 flex flex-col shrink-0">
                                <div className="flex items-center justify-between mb-5 px-1">
                                    <div className="flex items-center gap-2.5">
                                        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                                        <h3 className="font-bold text-textPrimary text-sm">{cfg.label}</h3>
                                    </div>
                                    <span className="text-xs font-bold text-textSecondary bg-white border border-gray-100 px-2.5 py-0.5 rounded-full shadow-sm">{statusProjects.length}</span>
                                </div>
                                <div className="flex flex-col gap-4 flex-1 min-h-[100px]">
                                    {statusProjects.length === 0 && (
                                        <div className="flex-1 flex items-center justify-center p-10 border-2 border-dashed border-gray-100 rounded-xl bg-white/50">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">No projects in {cfg.label}</p>
                                        </div>
                                    )}
                                    {statusProjects.map((project) => {
                                        const progress = (project.modules || []).length > 0
                                            ? Math.round((project.modules || []).reduce((s, m) => s + (m.progress || 0), 0) / project.modules.length)
                                            : 0;
                                        return (
                                            <motion.div
                                                key={project.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all group"
                                                onClick={() => { setViewMode("list"); setExpandedProjects(new Set([project.id])); }}
                                            >
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0f4184] to-[#0b3166] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                                            {(project.projectName || "P").charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-textPrimary text-sm leading-tight">{project.projectName}</h4>
                                                            <p className="text-[11px] text-textSecondary mt-1 font-medium">{project.clientName}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-5 mb-4">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Progress</span>
                                                        <span className="text-[10px] font-bold text-textPrimary">{progress}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full ${cfg.dot}`} style={{ width: `${progress}%` }} />
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between mt-5 flex-wrap gap-2 border-t border-gray-50 pt-4">
                                                    <div className="flex items-center gap-1.5 text-[10px] text-textSecondary font-bold">
                                                        <Calendar size={13} />{project.endDate || "—"}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* WORK TRACKING TAB */}
            {!isLoadingProjects && activeTab === "tracking" && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-lg font-bold text-textPrimary">Employee Work Tracking</h3>
                        <p className="text-xs text-textSecondary mt-1 font-medium">Overview of which employee is working on which module.</p>
                    </div>
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    {["Employee", "Project", "Module", "Progress", "Status", "Due Date"].map(h => (
                                        <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {allModules.length === 0 && (
                                    <tr><td colSpan={6} className="py-16 text-center text-textSecondary font-medium">No modules assigned yet.</td></tr>
                                )}
                                {allModules.map((mod, i) => (
                                    <motion.tr key={mod.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-[#F0F9FF] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold border border-primary/20 shadow-sm">
                                                    {(mod.assignedTo || "?").charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-textPrimary text-xs">{mod.assignedTo}</p>
                                                    <p className="text-[11px] text-textSecondary font-medium">{mod.department}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-textSecondary font-medium">{mod.projectName}</td>
                                        <td className="px-6 py-4 font-bold text-textPrimary">{mod.name}</td>
                                        <td className="px-6 py-4 min-w-[160px]"><ProgressBar value={mod.progress || 0} /></td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${MODULE_STATUS_BADGE[mod.status]?.bg || "bg-gray-100"} ${MODULE_STATUS_BADGE[mod.status]?.text || "text-gray-500"}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${MODULE_STATUS_BADGE[mod.status]?.dot || "bg-gray-400"}`} />{mod.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-textSecondary text-xs font-medium">{mod.dueDate}</td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ─── Create / Edit Project Modal ─────────────────────── */}
            <AnimatePresence>
                {addProjectModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAddProjectModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-textPrimary">{editProjectData ? "Edit Project" : "New Project"}</h2>
                                    <p className="text-xs text-textSecondary mt-1 font-medium">{editProjectData ? "Update project details." : "Create a new project and assign modules."}</p>
                                </div>
                                <button onClick={() => setAddProjectModal(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-all"><X size={20} /></button>
                            </div>
                            <div className="p-8 space-y-5 overflow-y-auto custom-scrollbar">
                                {/* Project Name */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Project Name *</label>
                                    <input type="text" value={projectForm.projectName} onChange={(e) => setProjectForm(p => ({ ...p, projectName: e.target.value }))} placeholder="e.g. FinTrack ERP v2" className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-textPrimary" />
                                </div>
                                {/* Client */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Client *</label>
                                    <input type="text" value={projectForm.clientName} onChange={(e) => setProjectForm(p => ({ ...p, clientName: e.target.value }))} placeholder="Client company name" className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-textPrimary" />
                                </div>
                                {/* Description */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Description</label>
                                    <input type="text" value={projectForm.description} onChange={(e) => setProjectForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description" className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-textPrimary" />
                                </div>
                                {/* Dates */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Start Date *</label>
                                        <input type="date" value={projectForm.startDate} onChange={(e) => setProjectForm(p => ({ ...p, startDate: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-textPrimary" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">End Date *</label>
                                        <input type="date" value={projectForm.endDate} onChange={(e) => setProjectForm(p => ({ ...p, endDate: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-textPrimary" />
                                    </div>
                                </div>
                                {/* Status */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Status</label>
                                    <select value={projectForm.status} onChange={(e) => setProjectForm(p => ({ ...p, status: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-sm focus:bg-white focus:border-primary outline-none transition-all font-medium text-textPrimary appearance-none">
                                        <option value="active">Active</option>
                                        <option value="on-hold">On Hold</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                                <button onClick={() => setAddProjectModal(false)} className="px-6 py-2.5 text-sm font-bold text-textSecondary hover:bg-gray-100 rounded-lg transition-all">Cancel</button>
                                <button onClick={handleSaveProject} disabled={isSubmitting} className="px-8 py-2.5 text-sm font-bold text-white rounded-lg shadow-sm bg-gradient-to-r from-[#0f4184] to-[#0b3166] hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-60">
                                    {isSubmitting && <Loader2 size={15} className="animate-spin" />}
                                    {editProjectData ? "Update Project" : "Create Project"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ─── Add Module Modal ──────────────────────────────────── */}
            <AnimatePresence>
                {addModuleModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAddModuleModal(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                <div><h2 className="text-xl font-bold text-textPrimary">Add Module</h2><p className="text-xs text-textSecondary mt-1 font-medium">Assign a module to an employee.</p></div>
                                <button onClick={() => setAddModuleModal(null)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-all"><X size={20} /></button>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Module Name *</label>
                                    <input value={moduleForm.name} onChange={(e) => setModuleForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Authentication Flow" className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-textPrimary" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Assign To *</label>
                                    <select value={moduleForm.assignedToId} onChange={(e) => setModuleForm(p => ({ ...p, assignedToId: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-textPrimary appearance-none">
                                        <option value="">Select employee</option>
                                        {employees.filter((e) => e.status === "Active" || e.status === "active").map((e) => <option key={e.id || e.uid} value={e.id || e.uid}>{e.name} ({e.department})</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Due Date *</label>
                                        <input type="date" value={moduleForm.dueDate} onChange={(e) => setModuleForm(p => ({ ...p, dueDate: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-textPrimary" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Status</label>
                                        <select value={moduleForm.status} onChange={(e) => setModuleForm(p => ({ ...p, status: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-textPrimary appearance-none">
                                            {["Not Started", "In Progress", "Completed", "Blocked"].map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                                <button onClick={() => setAddModuleModal(null)} className="px-6 py-2.5 text-sm font-bold text-textSecondary hover:bg-gray-100 rounded-lg transition-all">Cancel</button>
                                <button onClick={() => handleAddModule(addModuleModal)} className="px-8 py-2.5 text-sm font-bold text-white rounded-lg shadow-sm bg-gradient-to-r from-[#0f4184] to-[#0b3166] hover:opacity-90 transition-all">Add Module</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ─── Delete Confirmation Modal ────────────────────────── */}
            <AnimatePresence>
                {deleteConfirm && (
                    <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteConfirm(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 flex flex-col items-center text-center"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
                                <Trash2 size={24} className="text-rose-500" />
                            </div>
                            <h2 className="text-lg font-bold text-textPrimary mb-2">Delete Project?</h2>
                            <p className="text-sm text-textSecondary mb-6">This action cannot be undone. All modules inside this project will also be removed.</p>
                            <div className="flex gap-3 w-full">
                                <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 text-sm font-bold text-textSecondary hover:bg-gray-100 rounded-lg transition-all">Cancel</button>
                                <button onClick={handleDeleteProject} disabled={isDeleting} className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                                    {isDeleting && <Loader2 size={14} className="animate-spin" />}
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Projects;
