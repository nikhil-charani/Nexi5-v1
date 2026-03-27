import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, Folder, Download, Eye, Trash2, X, Search, CheckCircle2, MoreVertical, LayoutGrid, List as ListIcon, FileCode, FileImage, File } from "lucide-react";
import { toast } from "sonner";
const initialDocs = [
    { id: "d1", name: "Employee_Handbook_2024.pdf", size: "2.4 MB", date: "Oct 24, 2024", category: "Company Policies", type: "PDF", status: "Verified" },
    { id: "d2", name: "Q4_Performance_Reviews_Template.docx", size: "156 KB", date: "Oct 20, 2024", category: "Templates", type: "DOCX", status: "Verified" },
    { id: "d3", name: "Diwali_Holiday_Schedule_2024.pdf", size: "1.1 MB", date: "Oct 15, 2024", category: "Company Policies", type: "PDF", status: "Verified" },
    { id: "d4", name: "Ananya_Iyer_Contract.pdf", size: "890 KB", date: "Jan 15, 2022", category: "Employee Contracts", type: "PDF", status: "Verified" },
    { id: "d5", name: "Rajesh_Pillai_Contract.pdf", size: "870 KB", date: "Jun 01, 2021", category: "Employee Contracts", type: "PDF", status: "Verified" },
    { id: "d6", name: "PF_Form_2024.pdf", size: "310 KB", date: "Nov 01, 2024", category: "Tax Forms", type: "PDF", status: "Under Review" }
];
const folderConfig = [
    { name: "Company Policies", color: "text-[#0f4184]", bg: "bg-[#0f4184]/10", gradient: "from-[#0f4184] to-[#0b3166]" },
    { name: "Employee Contracts", color: "text-[#0f4184]", bg: "bg-[#0f4184]/10", gradient: "from-[#0f4184] to-[#0b3166]" },
    { name: "Tax Forms", color: "text-[#0f4184]", bg: "bg-[#0f4184]/10", gradient: "from-[#0b3166] to-[#0b3166]" },
    { name: "Templates", color: "text-[#0f4184]", bg: "bg-[#0f4184]/10", gradient: "from-[#0f4184] to-[#67E8F9]" }
];
function StatusBadge({ status }) {
    const isVerified = status === "Verified";
    return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isVerified ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-orange-600"}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${isVerified ? "bg-emerald-500" : "bg-orange-500 animate-pulse"}`} />
        {status}
    </span>;
}
function TypeIcon({ type }) {
    let Icon = FileText;
    if (type === "PDF") Icon = File;
    else if (type === "DOCX") Icon = FileText;
    else if (["JPG", "PNG", "SVG"].includes(type)) Icon = FileImage;
    else if (["JSON", "XML", "MD"].includes(type)) Icon = FileCode;
    return <div className={`w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center text-textSecondary shadow-sm shrink-0 border border-gray-100 group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all`}>
        <Icon size={20} />
    </div>;
}
function Documents() {
    const [docs, setDocs] = useState(initialDocs);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState(null);
    const [viewDoc, setViewDoc] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [viewMode, setViewMode] = useState("list");
    const fileInputRef = useRef(null);
    const filtered = docs.filter((d) => {
        const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
        const matchCat = !activeCategory || d.category === activeCategory;
        return matchSearch && matchCat;
    });
    const handleUpload = (files) => {
        if (!files || files.length === 0) return;
        const newDocs = Array.from(files).map((f, i) => ({
            id: `d_new_${Date.now()}_${i}`,
            name: f.name,
            size: f.size > 1048576 ? `${(f.size / 1048576).toFixed(1)} MB` : `${Math.round(f.size / 1024)} KB`,
            date: (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
            category: "Company Policies",
            type: f.name.split(".").pop()?.toUpperCase() || "FILE",
            status: "Under Review"
        }));
        setDocs((prev) => [...newDocs, ...prev]);
        toast.success(`${files.length} file${files.length > 1 ? "s" : ""} uploaded!`, { description: "Files are pending review." });
    };
    const handleDelete = (id) => {
        setDocs((prev) => prev.filter((d) => d.id !== id));
        if (viewDoc?.id === id) setViewDoc(null);
        toast.info("Document removed.");
    };
    const handleDownload = (doc) => {
        toast.success(`Downloading ${doc.name}`, { description: "Your file will be ready shortly." });
    };
    return <div className="space-y-5 h-full flex flex-col">
        {
            /* Header */
        }
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
                <div className="flex items-center gap-3 mb-1 text-primary">
                    <UploadCloud size={24} className="shrink-0" />
                    <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Document Vault</h1>
                </div>
                <p className="text-textSecondary text-sm font-medium">Upload, review, and manage company documents securely.</p>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-textPrimary"}`}
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-textPrimary"}`}
                    >
                        <ListIcon size={18} />
                    </button>
                </div>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold shadow-sm bg-gradient-to-r from-[#0f4184] to-[#0b3166] hover:opacity-90 transition-all"
                >
                    <UploadCloud size={18} /> Upload Files
                </button>
            </div>
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
        </div>

        {
            /* Drag & Drop Zone */
        }
        <motion.div
            onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleUpload(e.dataTransfer.files);
            }}
            animate={{
                borderColor: isDragging ? "#0f4184" : "#E2E8F0",
                backgroundColor: isDragging ? "rgba(34, 193, 220, 0.05)" : "#F8FAFC"
            }}
            className="border-2 border-dashed rounded-2xl p-8 flex flex-col items-center text-center transition-all cursor-pointer group bg-[#F8FAFC]/50"
            onClick={() => fileInputRef.current?.click()}
        >
            <motion.div
                animate={{ scale: isDragging ? 1.1 : 1 }}
                className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-primary mb-4 shadow-sm border border-gray-100 group-hover:shadow-md transition-all"
            >
                <UploadCloud size={32} />
            </motion.div>
            <h3 className="text-sm font-bold text-textPrimary uppercase tracking-widest">
                {isDragging ? "Release to upload" : "Drag & drop files or click to browse"}
            </h3>
            <p className="text-xs text-textSecondary mt-2 font-medium">PDF, DOCX, Images up to 50MB</p>
        </motion.div>

        {
            /* Categories */
        }
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {folderConfig.map((folder) => {
                const count = docs.filter((d) => d.category === folder.name).length;
                const isActive = activeCategory === folder.name;
                return <motion.button
                    key={folder.name}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveCategory(isActive ? null : folder.name)}
                    className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${isActive ? "bg-white border-primary ring-4 ring-primary/5 shadow-lg" : "bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200"}`}
                >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${folder.gradient} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                        <Folder size={22} className="text-white fill-current opacity-90" />
                    </div>
                    <h4 className="font-bold text-textPrimary text-[13px] tracking-tight">{folder.name}</h4>
                    <p className="text-[10px] font-bold text-textSecondary mt-1.5 uppercase tracking-widest leading-none">{count} Files</p>

                    {isActive && <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(34,193,220,0.5)]" />}
                </motion.button>;
            })}
        </div>

        {
            /* Search + File Area */
        }
        <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-3">
                    <h3 className="font-bold text-[11px] uppercase tracking-widest text-textSecondary">
                        {activeCategory ? activeCategory : "Recent Documents"}
                    </h3>
                    {activeCategory && <button
                        onClick={() => setActiveCategory(null)}
                        className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest"
                    >
                        Clear Filter
                    </button>}
                </div>
                <div className="relative group flex-1 max-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0f4184] transition-colors duration-300" size={16} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Filter by name..."
                        className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-12 pr-10 text-[13px] sm:text-[14px] focus:bg-white focus:border-[#0f4184] focus:ring-[4px] focus:ring-[#0f4184]/10 outline-none transition-all duration-300 placeholder:text-gray-400 font-medium text-textPrimary shadow-sm hover:border-gray-300"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-10">
                {filtered.length === 0 ? <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <FileText size={48} className="text-gray-200 mb-4" />
                    <p className="font-bold text-textSecondary uppercase tracking-widest text-xs">No documents found</p>
                </div> : viewMode === "list" ? <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-50">
                        {filtered.map((doc, i) => <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="flex items-center gap-4 p-4 hover:bg-gray-50/80 transition-all group cursor-default"
                        >
                            <TypeIcon type={doc.type} />
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-bold text-textPrimary group-hover:text-primary transition-colors truncate">{doc.name}</p>
                                <div className="flex items-center gap-3 mt-1.5">
                                    <span className="text-[10px] font-bold text-textSecondary uppercase tracking-widest leading-none">{doc.size} • {doc.date}</span>
                                    <StatusBadge status={doc.status} />
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                <button
                                    onClick={() => setViewDoc(doc)}
                                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                >
                                    <Eye size={16} />
                                </button>
                                <button
                                    onClick={() => handleDownload(doc)}
                                    className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                >
                                    <Download size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(doc.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </motion.div>)}
                    </div>
                </div> : <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filtered.map((doc, i) => <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all group relative overflow-hidden cursor-default flex flex-col"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <StatusBadge status={doc.status} />
                            <button className="text-gray-300 hover:text-textPrimary transition-colors rounded-lg p-1.5 hover:bg-gray-50"><MoreVertical size={18} /></button>
                        </div>
                        <div className="flex flex-col items-center text-center flex-1">
                            <TypeIcon type={doc.type} />
                            <h4 className="mt-4 text-[13px] font-bold text-textPrimary line-clamp-2 leading-tight h-8 w-full">{doc.name}</h4>
                            <p className="mt-1.5 text-[10px] font-bold text-textSecondary uppercase tracking-widest">{doc.size} • {doc.type}</p>
                        </div>
                        <div className="mt-6 pt-5 border-t border-gray-50 flex justify-center gap-2">
                            <button onClick={() => setViewDoc(doc)} className="flex-1 py-2 rounded-xl bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center"><Eye size={16} /></button>
                            <button onClick={() => handleDownload(doc)} className="flex-1 py-2 rounded-xl bg-gray-50 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all flex items-center justify-center"><Download size={16} /></button>
                        </div>
                    </motion.div>)}
                </div>}
            </div>
        </div>

        {
            /* Document Preview Modal */
        }
        <AnimatePresence>
            {viewDoc && <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setViewDoc(null)}
                    className="absolute inset-0 bg-secondary/40 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
                >
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <div>
                            <h2 className="text-lg font-bold text-textPrimary leading-none">Document Preview</h2>
                            <p className="text-[10px] text-textSecondary font-bold uppercase tracking-widest mt-2">{viewDoc.category}</p>
                        </div>
                        <button onClick={() => setViewDoc(null)} className="p-2 rounded-xl hover:bg-white hover:shadow-sm text-gray-400 hover:text-textPrimary transition-all border border-transparent hover:border-gray-100"><X size={20} /></button>
                    </div>

                    <div className="p-10 flex flex-col items-center text-center">
                        <div className="relative group mb-8">
                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-50 group-hover:scale-100 transition-transform duration-700" />
                            <div className="relative w-28 h-36 rounded-2xl bg-white border border-gray-100 flex flex-col items-center justify-center shadow-xl group-hover:-rotate-3 transition-transform">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                                    <FileText size={36} />
                                </div>
                                <span className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">{viewDoc.type}</span>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-textPrimary leading-tight max-w-sm">{viewDoc.name}</h3>
                        <div className="mt-5 flex flex-wrap justify-center gap-3">
                            <span className="px-3 py-1.5 rounded-full bg-gray-100 text-[11px] font-bold text-textSecondary uppercase tracking-widest">{viewDoc.size}</span>
                            <span className="px-3 py-1.5 rounded-full bg-gray-100 text-[11px] font-bold text-textSecondary uppercase tracking-widest">{viewDoc.date}</span>
                            <StatusBadge status={viewDoc.status} />
                        </div>

                        {viewDoc.status === "Verified" && <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 flex items-center gap-4 p-5 bg-emerald-50 border border-emerald-100 rounded-2xl"
                        >
                            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-md">
                                <CheckCircle2 size={20} />
                            </div>
                            <p className="text-[12px] font-medium text-emerald-800 text-left leading-relaxed">Verified authenticity. This document is safe and has been approved for company use.</p>
                        </motion.div>}
                    </div>

                    <div className="p-6 border-t border-gray-50 flex justify-end gap-3 bg-gray-50/30">
                        <button onClick={() => setViewDoc(null)} className="px-6 py-3 text-sm font-bold text-textSecondary hover:bg-white hover:text-textPrimary rounded-xl transition-all hover:shadow-sm border border-transparent hover:border-gray-100">Close</button>
                        <button
                            onClick={() => handleDownload(viewDoc)}
                            className="px-8 py-3 text-sm font-bold text-white rounded-xl shadow-md flex items-center gap-2 bg-gradient-to-r from-[#0f4184] to-[#0b3166] hover:opacity-90 transition-all"
                        >
                            <Download size={18} /> Download Now
                        </button>
                    </div>
                </motion.div>
            </div>}
        </AnimatePresence>
    </div>;
}
export {
    Documents as default
};
