import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, List, BarChart3, LayoutGrid, Users, 
  Calendar, Layers, Activity, Search, Download 
} from 'lucide-react';
import { useAppContext } from '../hooks/useAppContext';
import AttendanceStats from '../components/attendance/AttendanceStats';
import DailyAttendanceView from '../components/attendance/DailyAttendanceView';
import MonthlyPerformanceView from '../components/attendance/MonthlyPerformanceView';
import { exportToCSV } from '../lib/csvExport';
import { toast } from 'sonner';
import { format } from 'date-fns';

const formatHHMM = (decimalHours) => {
  if (!decimalHours) return '00:00';
  const hrs = Math.floor(decimalHours);
  const mins = Math.round((decimalHours - hrs) * 60);
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

const AttendanceDashboard = () => {
  const { currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState('Employees'); // Default to Daily Employees
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [projectSummary, setProjectSummary] = useState([]);

  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));

  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const headers = { "Authorization": `Bearer ${currentUser?.token}` };

  // 1. Fetch Global Summary (KPIs)
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(`${apiBase}/attendance/advanced/summary`, { headers });
        const result = await res.json();
        if (result.success) setSummary(result.data);
      } catch (err) { console.error(err); }
    };
    if (currentUser?.token) fetchSummary();
  }, [currentUser?.token]);

  // 2. Fetch Daily Data
  useEffect(() => {
    const fetchDaily = async () => {
      if (activeTab !== 'Employees') return;
      setIsLoading(true);
      try {
        const res = await fetch(`${apiBase}/attendance/advanced/daily?date=${selectedDate}`, { headers });
        const result = await res.json();
        if (result.success) setDailyData(result.data);
      } catch (err) {
        toast.error("Failed to load daily logs");
      } finally {
        setIsLoading(false);
      }
    };
    if (currentUser?.token) fetchDaily();
  }, [currentUser?.token, selectedDate, activeTab]);

  // 3. Fetch Monthly Data
  useEffect(() => {
    const fetchMonthly = async () => {
      if (activeTab !== 'Monthly Attendance') return;
      setIsLoading(true);
      try {
        const [mRes, pRes] = await Promise.all([
          fetch(`${apiBase}/attendance/advanced/monthly?month=${selectedMonth}`, { headers }),
          fetch(`${apiBase}/attendance/advanced/project-summary?month=${selectedMonth}`, { headers })
        ]);
        const mResult = await mRes.json();
        const pResult = await pRes.json();
        if (mResult.success) setMonthlyData(mResult.data);
        if (pResult.success) setProjectSummary(pResult.data);
      } catch (err) {
        toast.error("Failed to load monthly analytics");
      } finally {
        setIsLoading(false);
      }
    };
    if (currentUser?.token) fetchMonthly();
  }, [currentUser?.token, selectedMonth, activeTab]);

  const handleExportDaily = (dataToExport) => {
    const formatted = dataToExport.map(emp => ({
      Name: emp.name,
      Department: emp.department,
      Projects: emp.projects.join(', '),
      CheckIn: emp.checkIn || 'Absent',
      CheckOut: emp.checkOut || '--:--',
      Hours: formatHHMM(emp.workingHours),
      Status: emp.status
    }));
    exportToCSV(formatted, `Daily_Attendance_${selectedDate}.csv`);
    toast.success("Daily report exported");
  };

  const handleExportMonthly = (dataToExport) => {
    const formatted = dataToExport.map(emp => ({
      Name: emp.name,
      Project: emp.projects[0] || 'Unassigned',
      Present_Days: emp.presentDays,
      Late_Days: emp.lateDays,
      Attendance_Percentage: `${emp.attendancePercentage}%`,
      Avg_Hours: formatHHMM(emp.avgWorkingHours),
      Productivity_Score: emp.productivityScore,
      Insights: emp.insights.join(' | ')
    }));
    exportToCSV(formatted, `Monthly_Performance_${selectedMonth}.csv`);
    toast.success("Monthly performance report exported");
  };

  const tabs = [
    { name: 'Employees', label: 'Daily Monitoring', icon: List },
    { name: 'Monthly Attendance', label: 'Performance Analytics', icon: BarChart3 }
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header & Tabs */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        <div>
          <div className="flex items-center gap-3 mb-1 text-primary">
            <Building2 size={24} className="shrink-0" />
            <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Attendance Management</h1>
          </div>
          <p className="text-textSecondary text-sm">Advanced workforce monitoring and project-based productivity</p>
        </div>

        <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
          {tabs.map(tab => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                activeTab === tab.name 
                  ? 'bg-[#0f4184] text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-[#0f4184]'
              }`}
            >
              <tab.icon size={14} />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Section (Always Visible) */}
      <AttendanceStats stats={summary} />

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-24"
          >
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
              <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Syncing Analytics...</p>
          </motion.div>
        ) : (
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            {activeTab === 'Employees' && (
              <DailyAttendanceView 
                data={dailyData} 
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onExport={handleExportDaily}
              />
            )}

            {activeTab === 'Monthly Attendance' && (
              <MonthlyPerformanceView 
                data={monthlyData}
                projectSummary={projectSummary}
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
                onExport={handleExportMonthly}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AttendanceDashboard;
