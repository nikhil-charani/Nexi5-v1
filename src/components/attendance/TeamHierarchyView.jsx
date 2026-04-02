import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, User, Users, Clock, AlertCircle } from 'lucide-react';
import { getInitials } from '../../lib/stringUtils';

const EmployeeCard = ({ employee }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/50 border border-gray-100 hover:bg-white hover:shadow-sm hover:border-blue-100 transition-all group"
    >
      <div className="relative">
        <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-slate-400 text-xs font-bold shadow-sm group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          {getInitials(employee.name)}
        </div>
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
          employee.attendanceStatus === 'present' ? 'bg-emerald-500' : 
          employee.attendanceStatus === 'late' ? 'bg-amber-500' : 'bg-rose-500'
        }`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-700 truncate">{employee.name}</p>
        <p className="text-[10px] font-semibold text-slate-400 truncate uppercase mt-0.5">{employee.designation || employee.role}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs font-black text-slate-800 tabular-nums">{employee.attendancePercentage}%</p>
        <div className="w-12 h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${
              employee.attendancePercentage > 90 ? 'bg-emerald-500' : 
              employee.attendancePercentage > 75 ? 'bg-amber-500' : 'bg-rose-500'
            }`} 
            style={{ width: `${employee.attendancePercentage}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

const TeamGroup = ({ manager, members }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const teamStats = useMemo(() => {
    const present = members.filter(m => m.attendanceStatus === 'present' || m.attendanceStatus === 'late').length;
    const avg = members.length > 0 ? Math.round(members.reduce((acc, m) => acc + m.attendancePercentage, 0) / members.length) : 0;
    return { present, total: members.length, avg };
  }, [members]);

  return (
    <div className="flex flex-col gap-4">
      {/* Manager Card */}
      <motion.div 
        layout
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-nexi5 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white text-lg font-bold shadow-md group-hover:scale-105 transition-transform duration-500 uppercase">
                {getInitials(manager.name)}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-white shadow-lg flex items-center justify-center text-[#0f4184] transition-all group-hover:scale-110">
                {isExpanded ? <ChevronDown size={18} strokeWidth={3} /> : <ChevronRight size={18} strokeWidth={3} />}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight group-hover:text-[#0f4184] transition-colors">{manager.name}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{manager.department} • Resource Lead</p>
            </div>
          </div>

          <div className="flex items-center gap-8 pr-2">
            <div className="text-center hidden sm:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Present</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-slate-800 tabular-nums">{teamStats.present}</span>
                <span className="text-xs font-bold text-slate-300">/ {teamStats.total}</span>
              </div>
            </div>
            <div className="text-center bg-gray-50 px-5 py-3 rounded-xl border border-gray-100 shadow-sm group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors min-w-[100px]">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg Score</p>
              <p className={`text-xl font-black tabular-nums ${
                teamStats.avg > 90 ? 'text-emerald-600' : 
                teamStats.avg > 75 ? 'text-amber-600' : 'text-rose-600'
              }`}>
                {teamStats.avg}%
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Team Members */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex flex-col gap-3 pl-12 relative"
          >
            {/* Connector Line */}
            <div className="absolute left-6 top-0 bottom-6 w-px bg-slate-200" />
            
            {members.map((member, idx) => (
              <div key={member.uid || idx} className="relative">
                 <div className="absolute -left-6 top-1/2 w-6 h-px bg-slate-200" />
                 <EmployeeCard employee={member} />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TeamHierarchyView = ({ employees }) => {
  const groups = useMemo(() => {
    const teams = {};
    const managers = {};

    // First pass: Index all employees
    employees.forEach(emp => {
      if (!emp.name) return;
      managers[emp.name.toLowerCase().trim()] = emp;
      managers[emp.uid] = emp;
    });

    // Second pass: Categorize by manager
    employees.forEach(emp => {
      let mName = emp.manager ? emp.manager.toLowerCase().trim() : 'none';
      if (mName === 'none' || mName === '') return;

      const managerObj = managers[mName] || managers[emp.manager] || { 
        name: emp.manager, 
        department: emp.department || 'General', 
        uid: `virtual-${emp.manager.replace(/\s+/g, '-')}` 
      };
      
      const mKey = managerObj.uid;

      if (!teams[mKey]) {
        teams[mKey] = {
          manager: managerObj,
          members: []
        };
      }
      teams[mKey].members.push(emp);
    });

    return Object.values(teams).sort((a, b) => b.members.length - a.members.length);
  }, [employees]);

  if (groups.length === 0) {
    return (
      <div className="p-24 text-center flex flex-col items-center gap-6 opacity-40">
        <Users size={64} className="text-slate-300" />
        <div>
          <p className="text-lg font-bold text-slate-800 uppercase tracking-widest">No Team Hierarchy Found</p>
          <p className="text-xs font-semibold text-slate-400 mt-2">Ensure employees have assigned managers in their profiles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      {groups.map(group => (
        <TeamGroup key={group.manager.uid} manager={group.manager} members={group.members} />
      ))}
    </div>
  );
};

export default TeamHierarchyView;
