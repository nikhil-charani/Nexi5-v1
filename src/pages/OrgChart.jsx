import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Users, Building, MousePointer2, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { useAppContext } from "../hooks/useAppContext";
const DEPT_CONFIG = {
    Executive: { gradient: "from-[#0f4184] to-[#0b3166]", dot: "bg-primary", shadow: "shadow-primary/20", text: "text-white" },
    Engineering: { gradient: "from-blue-500 to-indigo-600", dot: "bg-blue-400", shadow: "shadow-blue-200", text: "text-white" },
    Marketing: { gradient: "from-orange-400 to-rose-500", dot: "bg-orange-400", shadow: "shadow-orange-200", text: "text-white" },
    Finance: { gradient: "from-emerald-400 to-teal-600", dot: "bg-emerald-400", shadow: "shadow-emerald-200", text: "text-white" },
    HR: { gradient: "from-rose-400 to-pink-600", dot: "bg-rose-400", shadow: "shadow-rose-200", text: "text-white" }
};
function OrgNodeCard({ node, depth = 0 }) {
    const [expanded, setExpanded] = useState(depth < 1);
    const hasChildren = node.children && node.children.length > 0;
    const config = DEPT_CONFIG[node.department] || { gradient: "from-slate-500 to-slate-600", dot: "bg-slate-400", shadow: "shadow-slate-200" };
    return <div className="flex flex-col items-center">
        <div className="relative">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: depth * 0.08, type: "spring", stiffness: 260, damping: 20 }}
                className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all w-56 text-center group relative overflow-hidden"
            >
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${config.gradient}`} />

                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${config.gradient} mx-auto mb-4 flex items-center justify-center shadow-lg p-0.5 group-hover:scale-110 transition-transform`}>
                    {node.avatarUrl ? <img src={node.avatarUrl} alt={node.name} className="w-full h-full rounded-2xl object-cover" /> : <Users size={28} className="text-white opacity-80" />}
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${config.dot} shadow-sm`} />
                </div>

                <p className="font-bold text-textPrimary text-[15px] leading-tight mb-1">{node.name}</p>
                <p className="text-textSecondary text-[10px] font-bold uppercase tracking-widest mb-4 line-clamp-1 px-2">{node.title}</p>

                <div className={`inline-flex items-center px-3 py-1 rounded-lg bg-gray-50 text-textSecondary text-[9px] font-bold uppercase tracking-widest border border-gray-100`}>
                    {node.department}
                </div>

                {hasChildren && <button
                    onClick={() => setExpanded(!expanded)}
                    className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary transition-all shadow-md z-10 group/btn hover:scale-110 ${expanded ? "rotate-180" : ""}`}
                >
                    <ChevronDown size={16} className="transition-transform" />
                </button>}
            </motion.div>
        </div>

        <AnimatePresence>
            {hasChildren && expanded && <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
            >
                <div className="mt-12 relative flex flex-col items-center">
                    {
                        /* Connector line down from parent */
                    }
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-6 bg-gradient-to-b from-gray-200 to-gray-100 shadow-sm" />

                    <div className="flex gap-10 items-start pt-6 relative">
                        {
                            /* Horizontal connector */
                        }
                        {node.children.length > 1 && <div
                            className="absolute top-6 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gray-200 to-transparent"
                            style={{ left: `${100 / (2 * node.children.length)}%`, right: `${100 / (2 * node.children.length)}%` }}
                        />}

                        {node.children.map((child) => <div key={child.id} className="flex flex-col items-center">
                            {
                                /* Vertical connector up to child */
                            }
                            <div className="w-[2px] h-6 bg-gradient-to-b from-gray-100 to-gray-200 mb-0" />
                            <OrgNodeCard node={child} depth={depth + 1} />
                        </div>)}
                    </div>
                </div>
            </motion.div>}
        </AnimatePresence>
    </div>;
}
function OrgChart() {
    const { employees } = useAppContext();
    const [zoom, setZoom] = useState(1);
    const buildTree = (managerName) => {
        const emp = (employees || []).find((e) => e?.name === managerName);
        const directReports = (employees || []).filter((e) => e?.manager === managerName && e?.name !== managerName);
        return {
            id: emp?.id || managerName,
            name: managerName,
            title: emp?.designation || (managerName === "Arjun Mehta" ? "Chief Executive Officer" : "Manager"),
            department: emp?.department || "Executive",
            avatarUrl: emp?.avatarUrl,
            children: directReports.length > 0 ? directReports.map((report) => buildTree(report.name)) : void 0
        };
    };
    const dynamicOrgChartData = buildTree("Arjun Mehta");
    return <div className="space-y-5 h-full flex flex-col">
        {
            /* Header */
        }
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
                <div className="flex items-center gap-3 mb-1 text-primary">
                    <Building size={24} className="shrink-0" />
                    <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Organization Chart</h1>
                </div>
                <p className="text-textSecondary text-sm font-medium">Visual hierarchy of the company reporting structure.</p>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-2xl shadow-inner border border-gray-200">
                <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} className="p-2.5 rounded-xl hover:bg-white text-gray-400 hover:text-primary transition-all hover:shadow-sm"><ZoomOut size={18} /></button>
                <span className="text-[11px] font-bold text-textPrimary w-12 text-center">{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(Math.min(1.5, zoom + 0.1))} className="p-2.5 rounded-xl hover:bg-white text-gray-400 hover:text-primary transition-all hover:shadow-sm"><ZoomIn size={18} /></button>
                <div className="w-[1px] h-5 bg-gray-200 mx-1.5" />
                <button onClick={() => setZoom(1)} className="p-2.5 rounded-xl hover:bg-white text-gray-400 hover:text-primary transition-all hover:shadow-sm"><Maximize2 size={18} /></button>
            </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-50/50 rounded-3xl border border-gray-100 shadow-inner custom-scrollbar p-12 flex justify-center items-start min-h-[500px]">
            <motion.div
                animate={{ scale: zoom }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex justify-center min-w-max pt-10 origin-top"
            >
                <OrgNodeCard node={dynamicOrgChartData} />
            </motion.div>
        </div>

        {
            /* Legend & Tips */
        }
        <div className="flex flex-col sm:flex-row gap-6 justify-between items-center p-6 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/20" />
            <div className="flex gap-6 flex-wrap justify-center">
                {Object.entries(DEPT_CONFIG).map(([dept, config]) => <div key={dept} className="flex items-center gap-2.5 group cursor-default">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${config.gradient} shadow-md group-hover:scale-125 transition-all`} />
                    <span className="text-[10px] font-bold text-textSecondary uppercase tracking-widest group-hover:text-textPrimary transition-colors">{dept}</span>
                </div>)}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                <MousePointer2 size={14} className="animate-bounce" />
                Scroll to explore hierarchy
            </div>
        </div>
    </div>;
}
export {
    OrgChart as default
};
