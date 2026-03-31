import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import { Toaster } from "sonner";
import { AnimatePresence } from "framer-motion";
import { AppProvider } from "./hooks/useAppContext";
import { useAppContext } from "./hooks/useAppContext";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Candidates from "./pages/Candidates";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Payroll from "./pages/Payroll";
import Performance from "./pages/Performance";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import EmployeeProfile from "./pages/EmployeeProfile";
import Directory from "./pages/Directory";
import OrgChart from "./pages/OrgChart";
import AttendanceDashboard from "./pages/AttendanceDashboard";
import Tasks from "./pages/Tasks";
import Announcements from "./pages/Announcements";
import CalendarView from "./pages/CalendarView";
import Grievances from "./pages/Grievances";
import Projects from "./pages/Projects";
import Leads from "./pages/Leads";
import Clients from "./pages/Clients";
import Deals from "./pages/Deals";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/auth/AuthPage";
import ScrollToTop from "./components/common/ScrollToTop";
import LoadingScreen from "./components/common/LoadingScreen";
import { useState } from "react";

function ProtectedRoute({ children }) {
  const { isLoggedIn, isLoading } = useAppContext();
  if (isLoading) {
    return <LoadingScreen />;
  }
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
const AppRoutes = () => {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage initialRegister={true} />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>}
        >
          <Route index element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="employees/:id" element={<EmployeeProfile />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="attendance-analytics" element={<AttendanceDashboard />} />
          <Route path="leave" element={<Leave />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="performance" element={<Performance />} />
          <Route path="documents" element={<Documents />} />
          <Route path="settings" element={<Settings />} />
          <Route path="directory" element={<Directory />} />
          <Route path="org-chart" element={<OrgChart />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="calendar" element={<CalendarView />} />
          <Route path="grievances" element={<Grievances />} />
          <Route path="projects" element={<Projects />} />
          <Route path="leads" element={<Leads />} />
          <Route path="clients" element={<Clients />} />
          <Route path="deals" element={<Deals />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};
function App() {
  return <AppProvider>
      <Toaster position="top-right" richColors closeButton />
      <AppContent />
    </AppProvider>;
}
function AppContent() {
  const { isDark, currentTheme } = useAppContext();
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    ["ocean", "sunrise", "emerald"].forEach((t) => root.classList.remove(`theme-${t}`));
    if (currentTheme !== "default") {
      root.classList.add(`theme-${currentTheme}`);
    }
  }, [isDark, currentTheme]);
  return <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>;
}
export {
  App as default
};
