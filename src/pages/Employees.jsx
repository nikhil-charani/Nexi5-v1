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
      const idMatch = (emp.id || emp.employeeId || "").toLowerCase().includes(term);
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
  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#0f4184]/10 text-[#0b3166]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0f4184]" />Active
        </span>;
      case "On Leave":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-600">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />On Leave
        </span>;
      case "Suspended":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />Suspended
        </span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">{status}</span>;
    }
  };
  const SortTh = ({ label, sortKey }) => <th
    onClick={() => requestSort(sortKey)}
    className="px-6 py-4 font-semibold text-gray-500 uppercase text-xs tracking-wider cursor-pointer hover:text-primary transition-colors select-none"
  >
    <div className="flex items-center gap-1.5">
      {label}
      <ArrowUpDown size={12} className={sortConfig?.key === sortKey ? "text-primary" : "text-gray-300"} />
    </div>
  </th>;
  return <div className="space-y-5 h-full flex flex-col">
    {
      /* Header */
    }
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
      <div>
        <div className="flex items-center gap-3 mb-1 text-primary">
          <Users size={24} className="shrink-0" />
          <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Employees</h1>
        </div>
        <p className="text-textSecondary text-sm">Manage your team members and their information</p>
      </div>
      {isAdminOrHRHead && (
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-semibold bg-gradient-to-r from-[#0f4184] to-[#0b3166] hover:opacity-90 transition-all shadow-sm"
        >
          <Plus size={18} />
          Add Employee
        </button>
      )}
    </div>

    {
      /* Table Card */
    }
    <div className="bg-white rounded-xl border border-gray-200 flex flex-col flex-1 overflow-hidden shadow-nexi5">
      <div className="p-4 border-b border-gray-100 flex gap-4 items-center">
        <div className="relative flex-1 sm:max-w-md w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0f4184] transition-colors duration-300" size={18} />
          <input
            type="text"
            placeholder="Search by name, ID, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-10 text-[14px] sm:text-[15px] focus:bg-white focus:border-[#0f4184] focus:ring-[4px] focus:ring-[#0f4184]/10 outline-none transition-all duration-300 placeholder:text-gray-400 font-medium text-textPrimary shadow-sm hover:border-gray-300"
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
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-textSecondary hover:bg-gray-50 transition-colors">
          <Filter size={16} />
          <span className="hidden sm:inline">Filters</span>
        </button>
        <span className="text-xs font-semibold text-textSecondary ml-auto hidden sm:block">{filteredEmployees.length} employees</span>
      </div>

      {
        /* Table */
      }
      <div className="overflow-x-auto flex-1 custom-scrollbar">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="sticky top-0 z-10 bg-white shadow-sm ring-1 ring-gray-100">
            <tr>
              <SortTh label="Employee" sortKey="name" />
              <SortTh label="ID" sortKey="id" />
              <SortTh label="Department" sortKey="department" />
              <SortTh label="Joining Date" sortKey="joiningDate" />
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase text-xs tracking-wider">Status</th>
              <th className="px-6 py-4 font-semibold text-gray-500 uppercase text-xs tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredEmployees.map((emp, index) => <motion.tr
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.03, duration: 0.2 }}
              key={emp.uid || emp.id || index}
              className="group hover:bg-[#F0F9FF] transition-colors cursor-pointer"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0f4184] to-primary flex items-center justify-center text-white text-xs font-bold shadow-sm ring-2 ring-gray-50 uppercase">
                      {getInitials(emp.name)}
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${emp.status === "Active" ? "bg-[#0f4184]" : emp.status === "On Leave" ? "bg-orange-400" : "bg-red-500"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-textPrimary group-hover:text-primary transition-colors">{emp.name}</p>
                    <p className="text-xs text-textSecondary mt-0.5">{emp.designation}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-xs font-mono font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">{emp.employeeId || emp.uid || emp.id}</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#0f4184]/10 text-[#0b3166]">{emp.department}</span>
              </td>
              <td className="px-6 py-4 text-textSecondary text-sm font-medium">{emp.joiningDate}</td>
              <td className="px-6 py-4">{getStatusBadge(emp.status)}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => navigate(`/dashboard/employees/${emp.uid || emp.id}`)}
                    className="p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-lg transition-colors"
                    title="View Profile"
                  >
                    <Eye size={18} />
                  </button>

                  {isAdminOrHRHead && (
                    <DropdownMenu
                      trigger={
                        <button className="p-1.5 text-slate-300 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      }
                    >
                      <DropdownMenuItem onClick={() => handleEdit(emp)}><Edit2 size={14} /> Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(emp.uid || emp.id)} destructive><Trash2 size={14} /> Delete</DropdownMenuItem>
                    </DropdownMenu>
                  )}
                </div>
              </td>
            </motion.tr>)}
            {filteredEmployees.length === 0 && <tr>
              <td colSpan={6} className="py-16 text-center">
                <Users size={36} className="mx-auto mb-3 text-slate-200 dark:text-slate-700" />
                <p className="font-semibold text-slate-400">No employees found</p>
                <p className="text-sm text-slate-300 dark:text-slate-600 mt-1">Try adjusting your search terms</p>
              </td>
            </tr>}
          </tbody>
        </table>
      </div>

      {
        /* Footer */
      }
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
        <span className="text-xs text-textSecondary font-semibold">Showing {filteredEmployees.length} of {employees.length} employees</span>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-500 hover:bg-white disabled:opacity-40 transition-colors" disabled>← Previous</button>
          <button className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold shadow-sm shadow-primary/20">1</button>
          <button className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-500 hover:bg-white disabled:opacity-40 transition-colors" disabled>Next →</button>
        </div>
      </div>
    </div>

    <EmployeeDrawer isOpen={isDrawerOpen} onClose={handleDrawerClose} employeeToEdit={employeeToEdit} />
  </div>;
}
export {
  Employees as default
};
