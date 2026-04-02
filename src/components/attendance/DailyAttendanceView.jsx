import React, { useState } from 'react';
import { Search, Download, Clock, ChevronRight, Projector, Briefcase, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { getInitials } from '../../lib/stringUtils';

const formatHHMM = (decimalHours) => {
  if (!decimalHours) return '00:00';
  const hrs = Math.floor(decimalHours);
  const mins = Math.round((decimalHours - hrs) * 60);
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

const DailyAttendanceView = ({ data, onExport, selectedDate, onDateChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterProject, setFilterProject] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = data.filter(emp => {
    const matchesSearch = (emp.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.uid || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'All' || emp.department === filterDept;
    const matchesProject = filterProject === 'All' || (emp.projects && emp.projects.includes(filterProject));
    const matchesStatus = filterStatus === 'All' || emp.status === filterStatus;
    return matchesSearch && matchesDept && matchesProject && matchesStatus;
  });

  const departments = ['All', ...new Set(data.map(emp => emp.department))];
  const projects = ['All', ...new Set(data.flatMap(emp => emp.projects))];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'present':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Present
          </span>
        );
      case 'late':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100/50">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Late
          </span>
        );
      case 'half-day':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100/50">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Half Day
          </span>
        );
      case 'absent':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100/50">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Absent
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-50 text-gray-400 border border-gray-100">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-nexi5 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
          <Clock size={16} className="text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-600 outline-none"
          />
        </div>

        <div className="relative flex-1 min-w-[200px] group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0f4184] transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-xs focus:border-[#0f4184] outline-none transition-all font-medium text-slate-700"
          />
        </div>

        <select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-600 outline-none focus:border-[#0f4184]"
        >
          <option value="All">All Projects</option>
          {projects.filter(p => p !== 'All').map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-600 outline-none focus:border-[#0f4184]"
        >
          <option value="All">All Status</option>
          <option value="present">Present</option>
          <option value="late">Late</option>
          <option value="half-day">Half Day</option>
          <option value="absent">Absent</option>
        </select>

        <button
          onClick={() => onExport(filtered)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0f4184] text-white text-xs font-bold hover:opacity-90 transition-all shadow-sm"
        >
          <Download size={14} />
          Export
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-nexi5">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider">Employee</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider">Department</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider">Project</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider">Check-In</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider">Check-Out</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider">Hours</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((emp, index) => (
                <motion.tr
                  key={emp.uid || index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="group hover:bg-[#F0F9FF] transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold uppercase transition-transform group-hover:scale-110">
                        {getInitials(emp.name)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 group-hover:text-[#0f4184] transition-colors">{emp.name}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">{emp.employeeData?.employeeId || emp.uid}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-slate-600">{emp.department}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                      {emp.projects.map((p, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-blue-50 text-[9px] font-bold text-blue-600 border border-blue-100/50">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-black text-slate-700">{emp.checkIn || '--:--'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-black ${emp.checkOut === 'In-Progress' ? 'text-amber-500 italic' : 'text-slate-700'}`}>
                      {emp.checkOut || '--:--'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-800">{formatHHMM(emp.workingHours)}</span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(emp.status)}
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <Filter size={40} className="mx-auto mb-4 text-gray-200" />
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No matching records for {selectedDate}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DailyAttendanceView;
