import React, { useState } from 'react';
import { Search, Download, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getInitials } from '../../lib/stringUtils';

const AttendanceTable = ({ data, onExport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');

  const filtered = data.filter(emp => {
    const matchesSearch = (emp.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (emp.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'All' || emp.department === filterDept;
    return matchesSearch && matchesDept;
  });

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
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100/50">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Absent
          </span>
        );
    }
  };

  const departments = ['All', ...new Set(data.map(emp => emp.department))];

  return (
    <div className="bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden shadow-nexi5">
      {/* Table Actions */}
      <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 items-center bg-gray-50/30">
        <div className="relative flex-1 min-w-[240px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0f4184] transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-12 pr-10 text-sm focus:border-[#0f4184] focus:ring-4 focus:ring-[#0f4184]/5 outline-none transition-all placeholder:text-gray-400 font-medium text-slate-700 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-600 outline-none focus:border-[#0f4184] transition-all"
          >
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <button 
            onClick={() => onExport(filtered)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-xs font-bold text-slate-600 hover:bg-white hover:text-[#0f4184] transition-all shadow-sm"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider">Employee</th>
              <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider">Status</th>
              <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider">Timing</th>
              <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider">Health</th>
              <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((emp, index) => (
              <motion.tr 
                key={emp.uid || index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group hover:bg-[#F0F9FF] transition-colors cursor-pointer"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0f4184] to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-sm uppercase">
                      {getInitials(emp.name)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-[#0f4184] transition-colors">{emp.name}</p>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">{emp.department}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(emp.attendanceStatus)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <Clock size={12} className="text-slate-400" />
                      {emp.checkin || '--:--'}
                    </div>
                    {emp.checkout && (
                      <span className="text-[10px] text-slate-400 font-medium">Out: {emp.checkout}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1.5 w-32">
                    <div className="flex justify-between text-[9px] font-black uppercase text-slate-400">
                      <span>Vitality</span>
                      <span>{emp.attendancePercentage}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${emp.attendancePercentage}%` }}
                        className={`h-full rounded-full ${
                          emp.attendancePercentage > 90 ? 'bg-emerald-500' : 
                          emp.attendancePercentage > 75 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-slate-300 hover:text-[#0f4184] hover:bg-blue-50 rounded-lg transition-all">
                    <ChevronRight size={16} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
