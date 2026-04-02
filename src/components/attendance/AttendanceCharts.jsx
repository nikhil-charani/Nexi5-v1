import React from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend, BarChart, Bar 
} from 'recharts';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const COLORS = ['#0f4184', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-xl ring-1 ring-black/5">
        <p className="text-xs font-bold text-slate-500 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-sm font-black" style={{ color: p.color }}>
            {p.name}: {p.value}{p.name.toLowerCase().includes('percentage') || p.name.includes('Attendance') || p.name.includes('Performance') ? '%' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AttendanceCharts = ({ monthlyTrend, deptDistribution, teamComparison }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Monthly Trend */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-nexi5"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-base font-bold text-slate-800 tracking-tight">Monthly Attendance Trend</h3>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mt-1">Consistency Over Time</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase">
            <Activity size={12} />
            Real-time
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f4184" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#0f4184" stopOpacity={0.01}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="percentage" 
                name="Attendance Grade"
                stroke="#0f4184" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorTrend)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Dept Distribution */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white p-6 rounded-xl border border-gray-200 shadow-nexi5 flex flex-col"
      >
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-800 tracking-tight">Departmental Health</h3>
          <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mt-1">Presence by Business Unit</p>
        </div>

        <div className="flex-1 h-[240px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={deptDistribution}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={8}
                dataKey="value"
              >
                {deptDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Team Comparison Bar Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-3 bg-white p-6 rounded-xl border border-gray-200 shadow-nexi5"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-base font-bold text-slate-800 tracking-tight">Manager Leaderboard</h3>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mt-1">Top Performing Teams</p>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={teamComparison}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="manager" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="attendance" 
                name="Team Performance"
                fill="#0f4184" 
                radius={[6, 6, 0, 0]} 
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default AttendanceCharts;
