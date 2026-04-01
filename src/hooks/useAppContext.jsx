import React, { createContext, useContext, useState, useEffect } from "react";
import { getCookie, setCookie, eraseCookie } from "../lib/cookieUtils";
import { io } from "socket.io-client";

const AppContext = createContext(undefined);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export function AppProvider({ children }) {
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [projects, setProjects] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [leads, setLeads] = useState([]);
  const [clients, setClients] = useState([]);
  const [deals, setDeals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [chats, setChats] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [documents, setDocuments] = useState([]);
  
  // Dashboard trend/chart data
  const [payrollTrendData, setPayrollTrendData] = useState([]);
  const [employeeGrowthData, setEmployeeGrowthData] = useState([]);
  const [departmentDistribution, setDepartmentDistribution] = useState([]);
  const [attendanceTrendData, setAttendanceTrendData] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [orgChartData, setOrgChartData] = useState(null);

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return document.documentElement.classList.contains("dark");
  });
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem("app-theme") || "default");

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try { 
      const logged = getCookie("isLoggedIn");
      const user = getCookie("currentUser");
      return (logged === true || String(logged) === "true") && !!user?.token;
    } catch { return false; }
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try { return getCookie("currentUser"); } catch { return null; }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all data from backend on mount
  useEffect(() => {
    const doFetch = async () => {
      if (!isLoggedIn) return;
      setIsLoading(true);

      const fetchers = {
        employees: async () => {
          const resp = await fetch(`${API_BASE_URL}/getemp`, { 
            method: "POST", 
            headers: { "Authorization": `Bearer ${currentUser?.token}` } 
          });
          if (resp.status === 401 || resp.status === 403) throw new Error("Unauthorized");
          const data = await resp.json();
          if (data.success) return data.data || [];
          try {
            return data.message && typeof data.message === 'string' && data.message.startsWith('[') ? JSON.parse(data.message) : [];
          } catch (e) {
            return [];
          }
        },
        leaves: async () => {
          const resp = await fetch(`${API_BASE_URL}/leaves`, { 
            headers: { "Authorization": `Bearer ${currentUser?.token}` } 
          });
          const data = await resp.json();
          return data.success ? data.data : [];
        },
        pendingLeaves: async () => {
          const resp = await fetch(`${API_BASE_URL}/leaves/pending`, { 
            headers: { "Authorization": `Bearer ${currentUser?.token}` } 
          });
          const data = await resp.json();
          return data.success ? data.data : [];
        },
        attendanceStatus: async () => {
          const resp = await fetch(`${API_BASE_URL}/attendance/status`, { 
            headers: { "Authorization": `Bearer ${currentUser?.token}` } 
          });
          const data = await resp.json();
          return data.success ? data : null;
        },
        attendanceHistory: async () => {
          const resp = await fetch(`${API_BASE_URL}/attendance/history`, { 
            headers: { "Authorization": `Bearer ${currentUser?.token}` } 
          });
          const data = await resp.json();
          return data.success ? data.data : [];
        },
        calendarEvents: async () => {
          const resp = await fetch(`${API_BASE_URL}/calendar/events`, { 
            headers: { "Authorization": `Bearer ${currentUser?.token}` } 
          });
          const data = await resp.json();
          return data.success ? data.data : [];
        },
        tasks: async () => {
          const resp = await fetch(`${API_BASE_URL}/gettask`, { 
            method: "POST", 
            headers: { "Authorization": `Bearer ${currentUser?.token}` } 
          });
          const data = await resp.json();
          return data.tasks || [];
        },
        announcements: async () => {
          const resp = await fetch(`${API_BASE_URL}/announcements`, { 
            headers: { "Authorization": `Bearer ${currentUser?.token}` } 
          });
          const data = await resp.json();
          return data.success ? data.data : [];
        }
      };

      const runFetcher = async (key, fetcher) => {
        try {
          const data = await fetcher();
          switch(key) {
            case "employees": setEmployees(data); break;
            case "leaves": setLeaves(data); break;
            case "attendanceHistory": setAttendance(data); break;
            case "calendarEvents": setCalendarEvents(data); break;
            case "tasks": setTasks(data); break;
            case "announcements": setAnnouncements(data); break;
            case "attendanceStatus": 
              if (data && data.success) {
                setIsCheckedIn(data.isCheckedIn);
                setCheckInTime(data.checkInTime ? new Date(data.checkInTime) : null);
              }
              break;
          }
        } catch (e) {
          console.error(`Fetch failed for ${key}:`, e);
          if (e.message === "Unauthorized") {
            logout();
          }
        }
      };

      try {
        // Await the fetchers before hiding the loading screen 
        // to prevent the dashboard from rendering empty data
        await Promise.allSettled(
          Object.entries(fetchers).map(([key, fetcher]) => runFetcher(key, fetcher))
        );
      } finally {
        setIsLoading(false);
      }
    };

    doFetch();
  }, [isLoggedIn, currentUser?.token]);

  useEffect(() => {
    if (!isLoggedIn) return;
    
    // Connect Socket
    let socketUrl = API_BASE_URL.replace('/api', '');
    const socket = io(socketUrl, {
      withCredentials: true
    });

    socket.on('calendarEventAdded', (newEvent) => {
      setCalendarEvents(prev => {
        if (prev.find(e => e.id === newEvent.id)) return prev;
        return [...prev, newEvent];
      });
    });

    socket.on('calendarEventUpdated', (updatedEvent) => {
      setCalendarEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    });

    socket.on('calendarEventDeleted', ({ id }) => {
      setCalendarEvents(prev => prev.filter(e => e.id !== id));
    });

    return () => socket.disconnect();
  }, [isLoggedIn]);

  // If not logged in, stop loading immediately
  useEffect(() => {
    if (!isLoggedIn) setIsLoading(false);
  }, [isLoggedIn]);

  const toggleDark = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      setIsDark(false);
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      setIsDark(true);
      localStorage.setItem("theme", "dark");
    }
  };

  const changeTheme = (themeId) => {
    const root = document.documentElement;
    ["ocean", "sunrise", "emerald"].forEach((t) => root.classList.remove(`theme-${t}`));
    if (themeId !== "default") {
      root.classList.add(`theme-${themeId}`);
    }
    setCurrentTheme(themeId);
    localStorage.setItem("app-theme", themeId);
  };

  const register = async (email, password, name, role) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await response.json();
      
      if (data.success) {
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error || data.message };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: "Network error" };
    }
  };

  const login = async (email, password, role) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (data.success) {
        let user = { ...data.user, token: data.token };
        if (role) user = { ...user, role };
        setIsLoggedIn(true);
        setCurrentUser(user);
        setCookie("isLoggedIn", true);
        setCookie("currentUser", user);
        return { success: true, dashboardPath: data.dashboardPath || "/dashboard", role: user.role };
      }
      return { success: false, error: data.error };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Network error" };
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    eraseCookie("isLoggedIn");
    eraseCookie("currentUser");
  };

  const [isCheckedIn, setIsCheckedIn] = useState(() => {
    try { const s = getCookie("checkInState"); return s?.isCheckedIn || false; } catch { return false; }
  });
  const [checkInTime, setCheckInTime] = useState(() => {
    try { const s = getCookie("checkInState"); return s?.checkInTime ? new Date(s.checkInTime) : null; } catch { return null; }
  });

  const checkIn = async () => {
    const now = new Date();
    setIsCheckedIn(true);
    setCheckInTime(now);
    setCookie("checkInState", { isCheckedIn: true, checkInTime: now });
    toast.success("Checked In", { description: `Session started at ${now.toLocaleTimeString()}` });
    console.log("UI-only Check-in successful");
  };

  const checkOut = async () => {
    if (!isCheckedIn) return;
    setIsCheckedIn(false);
    setCheckInTime(null);
    eraseCookie("checkInState");
    toast.success("Checked Out", { description: `Session ended at ${new Date().toLocaleTimeString()}` });
    console.log("UI-only Check-out successful");
  };

  const createItem = async (endpoint, item, setter, method = "POST") => {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify(item)
      });
      const resData = await response.json();
      
      if (!response.ok || resData.success === false) {
        return { success: false, error: resData.error || resData.message || 'Failed to create item' };
      }
      
      const newItem = resData.data || resData;
      setter(prev => [newItem, ...prev]);
      return { success: true, data: newItem };
    } catch (error) {
      console.error(`Error creating ${endpoint}:`, error);
      return { success: false, error: "Network error" };
    }
  };

  const updateItem = async (endpoint, id, data, setter) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify(data)
      });
      const resData = await response.json();
      
      if (!response.ok || resData.success === false) {
        return { success: false, error: resData.error || resData.message || 'Failed to update item' };
      }
      
      const updatedItem = resData.data || resData;
      setter(prev => prev.map(item => item.id === id || item.uid === id ? { ...item, ...updatedItem } : item));
      return { success: true, data: updatedItem };
    } catch (error) {
      console.error(`Error updating ${endpoint}:`, error);
      return { success: false, error: "Network error" };
    }
  };

  const deleteItem = async (endpoint, id, setter) => {
    try {
      await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
        method: "DELETE"
      });
      setter(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error(`Error deleting ${endpoint}:`, error);
    }
  };

  const addLeave = (leave) => createItem("applyleave", leave, setLeaves);
  
  const approveLeave = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/approveleave/${id}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify({})
      });
      const resData = await response.json();
      
      if (!response.ok || resData.success === false) {
        return { success: false, error: resData.error || resData.message || 'Failed to approve leave' };
      }
      
      const updatedLeave = resData.data;
      setLeaves(prev => prev.map(l => l.id === id ? { ...l, ...updatedLeave } : l));
      return { success: true, data: updatedLeave };
    } catch (error) {
      console.error(`Error approving leave:`, error);
      return { success: false, error: "Network error" };
    }
  };
  
  const rejectLeave = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/rejectleave/${id}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify({})
      });
      const resData = await response.json();
      
      if (!response.ok || resData.success === false) {
        return { success: false, error: resData.error || resData.message || 'Failed to reject leave' };
      }
      
      const updatedLeave = resData.data;
      setLeaves(prev => prev.map(l => l.id === id ? { ...l, ...updatedLeave } : l));
      return { success: true, data: updatedLeave };
    } catch (error) {
      console.error(`Error rejecting leave:`, error);
      return { success: false, error: "Network error" };
    }
  };
  
  const addEmployee = (emp) => createItem("employees", emp, setEmployees);
  const updateEmployee = (id, data) => updateItem("update", id, data, setEmployees);
  const deleteEmployee = (id) => deleteItem("employees", id, setEmployees);
  
  const addCandidate = (c) => createItem("candidates", c, setCandidates);
  const updateCandidate = (id, data) => updateItem("candidates", id, data, setCandidates);
  
  const addCalendarEvent = async (event) => {
    try {
      const role = currentUser?.role;
      const userId = currentUser?.id || currentUser?.uid;
      
      const payload = { 
        ...event,
        creatorRole: role || "Unknown",
        createdBy: event.createdBy || userId || currentUser?.name || "Unknown"
      };
      
      if (role === "Employee") {
          payload.type = "leave";
      }

      const response = await fetch(`${API_BASE_URL}/calendar/add-event`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        const newEv = data.data;
        setCalendarEvents(prev => prev.some(e => e.id === newEv.id) ? prev : [newEv, ...prev]);
      }
      return { success: data.success, error: data.message };
    } catch (error) {
      console.error("Error adding calendar event:", error);
      return { success: false, error: "Network error" };
    }
  };

  const updateCalendarEvent = async (id, updatedData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/calendar/update-event/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentUser?.token}`,
          "X-User-Role": currentUser?.role
        },
        body: JSON.stringify(updatedData)
      });
      const data = await response.json();
      if (data.success) {
        setCalendarEvents(prev => prev.map(e => e.id === id ? { ...e, ...updatedData } : e));
      }
      return { success: data.success, error: data.message };
    } catch (error) {
      console.error("Error updating calendar event:", error);
      return { success: false, error: "Network error" };
    }
  };

  const deleteCalendarEvent = async (id) => {
    try {
      console.log(`Frontend: Requesting delete for event ID: ${id}`);
      const response = await fetch(`${API_BASE_URL}/calendar/delete-event/${id}`, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${currentUser?.token}`,
          "X-User-Role": currentUser?.role
        }
      });
      const data = await response.json();
      console.log(`Frontend: Delete response:`, data);
      if (data.success) {
        setCalendarEvents(prev => prev.filter(e => e.id !== id));
      }
      return { success: data.success, error: data.message };
    } catch (error) {
      console.error("Error deleting calendar event:", error);
      return { success: false, error: "Network error" };
    }
  };
  
  const addProject = (p) => createItem("projects", p, setProjects);
  const addModule = (projectId, m) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      const updatedModules = [...(project.modules || []), { ...m, id: `M-${Date.now()}`, projectId }];
      updateItem("projects", projectId, { modules: updatedModules }, setProjects);
    }
  };
  const updateModuleProgress = (projectId, moduleId, progress, status) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      const updatedModules = project.modules.map(m => m.id === moduleId ? { ...m, progress, status } : m);
      updateItem("projects", projectId, { modules: updatedModules }, setProjects);
    }
  };

  const addGrievance = (g) => createItem("grievances", g, setGrievances);
  const updateGrievanceStatus = (id, status) => updateItem("grievances", id, { status }, setGrievances);
  
  const addLead = (lead) => createItem("leads", lead, setLeads);
  const updateLead = (id, data) => updateItem("leads", id, data, setLeads);
  
  const addClient = (client) => createItem("clients", client, setClients);
  const addDeal = (deal) => createItem("deals", deal, setDeals);
  const updateDeal = (id, data) => updateItem("deals", id, data, setDeals);

  const addTask = (task) => createItem("createtask", task, setTasks);
  const updateTaskStatus = (id, status) => createItem("updatetaskstatus", { id, status }, setTasks);
  
  const addAnnouncement = (ann) => createItem("announcements", ann, setAnnouncements);
  const deleteAnnouncement = (id) => deleteItem("announcements", id, setAnnouncements);
  const addPayroll = (data) => createItem("payroll", data, setPayroll);
  
  const fetchPayslips = async (uid) => {
    const resp = await fetch(`${API_BASE_URL}/payslips`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${currentUser?.token}` },
      body: JSON.stringify({ uid })
    });
    return resp.json();
  };

  const getPerformance = async (uid) => {
    const resp = await fetch(`${API_BASE_URL}/performance`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${currentUser?.token}` },
      body: JSON.stringify({ uid })
    });
    return resp.json();
  };

  const addDocument = (doc) => createItem("documents", doc, setDocuments);
  const deleteDocument = (id) => deleteItem("documents", id, setDocuments);

  return (
    <AppContext.Provider value={{
      employees, setEmployees, leaves, setLeaves,
      candidates, setCandidates, addCandidate, updateCandidate,
      calendarEvents, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent,
      projects, setProjects, addProject, addModule, updateModuleProgress,
      grievances, addGrievance, updateGrievanceStatus,
      leads, setLeads, addLead, updateLead,
      clients, setClients, addClient,
      deals, setDeals, addDeal, updateDeal,
      currentUser, userRole: currentUser?.role ?? null,
      isLoggedIn, register, login, logout,
      isCheckedIn, checkInTime, checkIn, checkOut,
      addLeave, approveLeave, rejectLeave,
      addEmployee, updateEmployee, deleteEmployee,
      isDark, toggleDark, currentTheme, changeTheme,
      payroll, payrollTrendData, employeeGrowthData, departmentDistribution,
      attendanceTrendData, aiInsights, orgChartData, activityFeed,
      notifications, announcements, addAnnouncement, deleteAnnouncement,
      tasks, addTask, updateTaskStatus, attendance, documents, addDocument, deleteDocument,
      fetchPayslips, getPerformance, isLoading
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within an AppProvider");
  return context;
}
