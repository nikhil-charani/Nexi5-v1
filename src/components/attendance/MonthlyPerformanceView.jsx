import React, { useState, useMemo } from 'react';
import { Search, Download, ChevronDown, ChevronRight, Projector, Briefcase, Filter, Calendar, Star, AlertTriangle, User, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
const getInitials = (name) => {
  if (!name) return '';
  return name.split(' ').map(n => n?.[0]).join('').substring(0, 2).toUpperCase();
};

const formatHHMM = (decimalHours) => {
  if (!decimalHours) return '00:00';
  const hrs = Math.floor(decimalHours);
  const mins = Math.round((decimalHours - hrs) * 60);
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

const InsightBadge = ({ flag }) => {
  const configs = {
    'Frequent Late': { color: 'bg-rose-50 text-rose-600 border-rose-100', icon: AlertTriangle },
    'Low Attendance': { color: 'bg-amber-50 text-amber-600 border-amber-100', icon: TrendingUp },
    'High Performer': { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: Star },
  };
  const config = configs[flag] || { color: 'bg-gray-50 text-gray-400 border-gray-100', icon: AlertTriangle };
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${config.color}`}>
       <Icon size={10} /> {flag}
    </span>
  );
};

const MonthlyPerformanceView = ({ data, projectSummary, onExport, selectedMonth, onMonthChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedProjects, setExpandedProjects] = useState(new Set(['Unassigned'])); // default some open

  const toggleProject = (p) => {
    const next = new Set(expandedProjects);
    if (next.has(p)) next.delete(p);
    else next.add(p);
    setExpandedProjects(next);
  };

  const groupedData = useMemo(() => {
    const groups = {};
    data.forEach(emp => {
      let p = 'Unassigned';
      if (emp.projects && emp.projects.length > 1) {
        p = 'Multi-Project';
      } else if (emp.projects && emp.projects.length === 1) {
        p = emp.projects[0];
      }
      
      if (!groups[p]) groups[p] = [];
      if (emp.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        groups[p].push(emp);
      }
    });
    return groups;
  }, [data, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-nexi5 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
          <Calendar size={16} className="text-gray-400" />
          <input 
            type="month" 
            value={selectedMonth} 
            onChange={(e) => onMonthChange(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-600 outline-none"
          />
        </div>

        <div className="relative flex-1 min-w-[200px] group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0f4184] transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-xs focus:border-[#0f4184] outline-none transition-all font-medium text-slate-700"
          />
        </div>

        <button 
          onClick={() => onExport(data)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-xs font-bold text-[#0f4184] hover:bg-gray-50 transition-all shadow-sm"
        >
          <Download size={14} />
          Full Monthly CSV
        </button>
      </div>

      {/* Project-based Grouping */}
      <div className="space-y-4">
        {projectSummary.map((summary, idx) => {
          const members = groupedData[summary.project] || [];
          if (searchTerm && members.length === 0) return null;

          return (
            <motion.div 
               key={summary.project}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.05 }}
               className="bg-white rounded-xl border border-gray-200 shadow-nexi5 overflow-hidden"
            >
              {/* Project Header Widget */}
              <div 
                className="p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 transition-all group"
                onClick={() => toggleProject(summary.project)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110`}>
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 tracking-tight group-hover:text-primary transition-colors">{summary.project}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Project Productivity Center</p>
                  </div>
                </div>

                <div className="flex divide-x divide-gray-100 flex-1 justify-center sm:max-w-md">
                   <div className="px-6 text-center">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Squad Size</p>
                     <p className="text-xl font-black text-slate-700">{summary.teamSize}</p>
                   </div>
                   <div className="px-6 text-center">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Team Presence</p>
                     <p className="text-xl font-black text-emerald-600">{summary.avgAttendance}%</p>
                   </div>
                   <div className="px-6 text-center">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Hours</p>
                     <p className="text-xl font-black text-[#0f4184]">{formatHHMM(summary.avgHours)}</p>
                   </div>
                </div>

                <div className="flex items-center gap-4">
                   <div className="flex flex-col text-right">
                     <p className="text-[10px] font-bold text-rose-500 uppercase">{summary.totalLate} Late Flags</p>
                     <p className="text-[10px] font-medium text-slate-400">This Month</p>
                   </div>
                   <div className={`p-2 rounded-lg bg-gray-50 text-gray-400 transform transition-transform duration-300 ${expandedProjects.has(summary.project) ? 'rotate-180' : ''}`}>
                     <ChevronDown size={14} />
                   </div>
                </div>
              </div>

              {/* Members Table */}
              <AnimatePresence>
                {expandedProjects.has(summary.project) && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-50 bg-slate-50/30 overflow-hidden"
                  >
                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-gray-100/50">
                          <tr>
                            <th className="px-8 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest">Team Member</th>
                            <th className="px-8 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest">Attendance %</th>
                            <th className="px-8 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest">Avg Hours</th>
                            <th className="px-8 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest">Productivity</th>
                            <th className="px-8 py-3 font-bold text-slate-500 uppercase text-[9px] tracking-widest">Insights / Flags</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {members.map((member) => (
                            <tr key={member.uid} className="hover:bg-white transition-colors group">
                               <td className="px-8 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[10px] font-bold transition-all group-hover:border-primary group-hover:text-primary">
                                      {getInitials(member.name)}
                                    </div>
                                    <div>
                                      <p className="text-xs font-bold text-slate-700">{member.name}</p>
                                      <p className="text-[9px] text-slate-400 font-semibold">{member.uid}</p>
                                    </div>
                                  </div>
                               </td>
                               <td className="px-8 py-4">
                                  <div className="flex flex-col gap-1 w-24">
                                     <span className="text-xs font-black text-slate-700">{member.attendancePercentage}%</span>
                                     <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${member.attendancePercentage > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${member.attendancePercentage}%` }} />
                                     </div>
                                  </div>
                               </td>
                               <td className="px-8 py-4">
                                  <span className="text-xs font-bold text-slate-600">{formatHHMM(member.avgWorkingHours)} / day</span>
                               </td>
                               <td className="px-8 py-4">
                                  <div className="flex items-center gap-2">
                                     <div className="w-10 h-10 rounded-full border-2 border-[#0f4184]/10 p-0.5 relative">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                           <circle className="stroke-gray-100" strokeWidth="3" fill="transparent" r="16" cx="18" cy="18" />
                                           <circle 
                                              className="stroke-[#0f4184]" 
                                              strokeWidth="3" 
                                              strokeDasharray={`${member.productivityScore}, 100`} 
                                              strokeLinecap="round" 
                                              fill="transparent" 
                                              r="16" cx="18" cy="18" 
                                           />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black">{member.productivityScore}</div>
                                     </div>
                                     <span className="text-[10px] font-bold text-slate-400">Score</span>
                                  </div>
                               </td>
                               <td className="px-8 py-4">
                                  <div className="flex flex-wrap gap-2">
                                     {member.insights.map((insight, i) => <InsightBadge key={i} flag={insight} />)}
                                     {member.insights.length === 0 && <span className="text-[10px] text-slate-300 italic">No flags</span>}
                                  </div>
                               </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyPerformanceView;
