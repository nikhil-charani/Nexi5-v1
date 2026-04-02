import React from 'react';
import { Users, UserCheck, UserX, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, trend, color, delay }) => {
  const iconBgMap = {
    blue: "bg-primary/10 text-primary",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 relative overflow-hidden group cursor-pointer shadow-nexi5"
    >
      <div className="flex justify-between items-start relative z-10">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-semibold text-textSecondary uppercase tracking-wider truncate">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-textPrimary mt-1 sm:mt-2 tabular-nums">
            <CountUp end={value} duration={2} />
            {title.includes('%') && '%'}
          </h3>
          {trend && (
            <div className="flex items-center gap-1.5 mt-2 sm:mt-3 flex-wrap">
              <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-xs font-bold ${trend.startsWith('+') ? 'bg-[#0f4184]/10 text-[#0b3166]' : 'bg-red-100 text-red-600'}`}>
                {trend.startsWith('+') ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {trend}
              </span>
              <span className="text-xs text-textSecondary hidden sm:inline text-[10px]">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl shrink-0 ${iconBgMap[color] || iconBgMap.blue} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ml-2`}>
          <Icon size={24} className="group-hover:scale-110 transition-transform duration-300" />
        </div>
      </div>
    </motion.div>
  );
};

const AttendanceStats = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title="Total Employees" 
        value={stats.totalEmployees} 
        icon={Users} 
        color="blue" 
        delay={0.1}
      />
      <StatCard 
        title="Present Today" 
        value={stats.presentToday} 
        icon={UserCheck} 
        trend={stats.trend || "+12%"} 
        color="green" 
        delay={0.2}
      />
      <StatCard 
        title="Absent Today" 
        value={stats.absentToday} 
        icon={UserX} 
        color="red" 
        delay={0.3}
      />
      <StatCard 
        title="Average Attendance %" 
        value={stats.attendancePercentage} 
        icon={Clock} 
        color="orange" 
        delay={0.4}
      />
    </div>
  );
};

export default AttendanceStats;
