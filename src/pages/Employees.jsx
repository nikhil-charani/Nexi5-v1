import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter, Eye, Edit2, Trash2, ArrowUpDown, MoreVertical, Users, Copy, Mail, CheckCircle2, Key, X } from "lucide-react";
import { useAppContext } from "../hooks/useAppContext";
import EmployeeDrawer from "../components/drawers/EmployeeDrawer";
import { getInitials } from "../lib/stringUtils";
import { DropdownMenu, DropdownMenuItem } from "../components/ui/dropdown";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
function Employees() {
  const { userRole, employees, deleteEmployee } = useAppContext();
  const isAdminOrHRHead = ["Admin", "HR Head"].includes(userRole);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [sortConfig, setSortConfig] = useState(null);
  const [newCredentials, setNewCredentials] = useState(null);
  const [copied, setCopied] = useState(false);
  const filteredEmployees = (employees || []).filter(
    (emp) => {
      if (!emp) return false;
      const term = search.toLowerCase();
      const nameMatch = (emp.name || "").toLowerCase().includes(term);
      const deptMatch = (emp.department || "").toLowerCase().includes(term);
      const idMatch = (emp.employeeId || emp.uid || emp.id || "").toLowerCase().includes(term);
      return nameMatch || deptMatch || idMatch;
    }
  ).sort((a, b) => {
    if (!sortConfig) return 0;
    const valA = a[sortConfig.key];
    const valB = b[sortConfig.key];
    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };
  const handleAdd = () => {
    setEmployeeToEdit(null);
    setDrawerOpen(true);
  };
  const handleEdit = (emp) => {
    setEmployeeToEdit(emp);
    setDrawerOpen(true);
  };
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) deleteEmployee(id);
  };
  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setEmployeeToEdit(null);
  };
  const copyCredentials = () => {
    if (!newCredentials) return;
    navigator.clipboard.writeText(`ID: ${newCredentials.id}
Email: ${newCredentials.email}
Password: ${newCredentials.password}`);
    setCopied(true);
    toast.success("Credentials copied to clipboard!");
    setTimeout(() => setCopied(false), 2e3);
  };
  const getStatusPill = (status) => {
    const config = {
      Active: { bg: "bg-white text-slate-900", dot: "bg-emerald-500" },
      "On Leave": { bg: "bg-white text-slate-900", dot: "bg-amber-500" },
      Suspended: { bg: "bg-white text-slate-900", dot: "bg-rose-500" }
    };
    const c = config[status] || { bg: "bg-white text-slate-900", dot: "bg-slate-300" };
    return <span className={`inline-flex items-center gap-2.5 px-3 py-1 rounded-full text-[11px] font-black ${c.bg}`}>
      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
      {status}
    </span>;
  };

  const SortTh = ({ label, sortKey }) => <th
    onClick={() => requestSort(sortKey)}
    className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[3px] cursor-pointer group"
  >
    <div className="flex items-center gap-2">
      {label}
      <ArrowUpDown size={10} className={`transition-opacity ${sortConfig?.key === sortKey ? "text-[#0f4184] opacity-100" : "opacity-0 group-hover:opacity-40"}`} />
    </div>
  </th>;

  return <div className="space-y-6 flex flex-col h-full animate-in fade-in duration-700 pb-10">
    {/* Page Header */}
    <div className="flex justify-between items-center px-4">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-1 select-none flex items-center gap-3">
          Employees
        </h1>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[4px]">Workforce Directory & Unit Management</p>
      </div>
      {isAdminOrHRHead && (
        <button
          onClick={handleAdd}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl text-white text-[11px] font-black uppercase tracking-[3px] bg-[#0f4184] hover:bg-slate-900 hover:shadow-2xl transition-all active:scale-95 shadow-lg shadow-blue-900/10"
        >
          <Plus size={18} strokeWidth={3} />
          Add Employee
        </button>
      )}
    </div>

    {/* Clean Management Console */}
    <div className="bg-white rounded-[2rem] border border-slate-100 flex flex-col overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.04)]">
      <div className="p-8 pb-4 flex flex-col lg:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0f4184] transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search by identity, department, or corporate ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50/30 border border-slate-100 rounded-2xl py-4 pl-16 pr-10 text-sm focus:bg-white focus:border-[#0f4184] outline-none transition-all placeholder:text-slate-300 font-bold text-slate-700"
          />
        </div>
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
            <Filter size={16} /> Filters
          </button>
          <span className="text-[10px] font-black text-[#0f4184] bg-blue-50/50 px-6 py-4 rounded-2xl border border-blue-100/50 uppercase tracking-widest whitespace-nowrap">
            {filteredEmployees.length} Units Active
          </span>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-50">
              <SortTh label="Identity & Role" sortKey="name" />
              <SortTh label="Corporate ID" sortKey="employeeId" />
              <SortTh label="Department" sortKey="department" />
              <SortTh label="Joining Date" sortKey="joiningDate" />
              <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[3px]">Status</th>
              <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[3px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50/50">
            {filteredEmployees.map((emp, index) => <motion.tr
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              key={emp.uid || emp.id || index}
              className="group hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <td className="px-8 py-5">
                <div className="flex items-center gap-6">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-[#0f4184] text-white flex items-center justify-center text-xs font-black shadow-inner uppercase group-hover:scale-105 transition-transform duration-300">
                        {emp.profileImage ? (
                            <img src={emp.profileImage} alt={emp.name} className="w-full h-full rounded-xl object-cover" />
                        ) : (
                            getInitials(emp.name)
                        )}
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${emp.status === "Active" ? "bg-emerald-500" : "bg-slate-300"}`} />
                    </div>
                  </div>
                  <div>
                    <p className="text-[14px] font-black text-slate-900 group-hover:text-[#0f4184] transition-colors leading-tight mb-1">{emp.name}</p>
                    <div className="flex items-center gap-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{emp.designation}</p>
                        {emp.workMode && (
                            <span className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200/50">
                                {emp.workMode}
                            </span>
                        )}
                        {emp.employeeType && (
                            <span className={`text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-md border ${emp.employeeType === 'Intern' ? 'bg-amber-50 text-amber-600 border-amber-200/50' : 'bg-cyan-50 text-cyan-600 border-cyan-200/50'}`}>
                                {emp.employeeType}
                            </span>
                        )}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5">
                <span className="text-[11px] font-black font-mono text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100/50 uppercase tracking-tighter shadow-sm">{emp.employeeId || emp.id || "N/A"}</span>
              </td>
              <td className="px-6 py-5">
                <span className="inline-flex px-3 py-1.5 rounded-lg bg-blue-50/50 text-[10px] font-black text-[#0f4184] border border-blue-100/30 uppercase tracking-widest leading-none">{emp.department}</span>
              </td>
              <td className="px-6 py-5 text-[12px] font-bold text-slate-500">{emp.joiningDate || "— — —"}</td>
              <td className="px-6 py-5">
                {getStatusPill(emp.status)}
              </td>
              <td className="px-8 py-5 text-right">
                <div className="flex justify-end gap-2 transition-opacity">
                  <button
                    onClick={() => navigate(`/dashboard/employees/${emp.uid || emp.employeeId || emp.id}`)}
                    className="p-2 text-slate-300 hover:text-[#0f4184] transition-colors"
                  >
                    <Eye size={16} />
                  </button>

                  {isAdminOrHRHead && (
                    <DropdownMenu
                      trigger={
                        <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      }
                    >
                      <DropdownMenuItem onClick={() => handleEdit(emp)}><Edit2 size={13} /> Edit Unit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(emp.uid || emp.id)} destructive><Trash2 size={13} /> Purge Identity</DropdownMenuItem>
                    </DropdownMenu>
                  )}
                </div>
              </td>
            </motion.tr>)}
          </tbody>
        </table>
      </div>

      <div className="p-6 border-t border-slate-50 flex items-center justify-between text-[10px] font-black text-slate-300 uppercase tracking-[3px] bg-slate-50/10">
        <span>Showing {filteredEmployees.length} of {employees.length} Units</span>
        <div className="flex gap-4">
          <button className="px-6 py-2 rounded-xl text-slate-300 hover:text-[#0f4184] transition-colors" disabled>Previous</button>
          <div className="w-8 h-8 bg-[#0f4184] text-white flex items-center justify-center rounded-lg shadow-lg shadow-blue-900/10">1</div>
          <button className="px-6 py-2 rounded-xl text-slate-300 hover:text-[#0f4184] transition-colors" disabled>Next</button>
        </div>
      </div>
    </div>

    <EmployeeDrawer isOpen={isDrawerOpen} onClose={handleDrawerClose} employeeToEdit={employeeToEdit} />
  </div>;
}

export {
  Employees as default
};
