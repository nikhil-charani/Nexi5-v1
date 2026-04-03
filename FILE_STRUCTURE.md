# Nexi5 HRM Portal: Comprehensive File & Folder Structure

This document provides a deep dive into the project's organization, detailing the purpose of each directory and key file.

---

## 📂 Root Directory
The root manages the build environment, dependencies, and high-level configuration.

- `ARCHITECTURE.md`: Technical overview of design patterns.
- `package.json`: Core dependencies for both React (Vite) and Node.js.
- `tailwind.config.js`: Custom design system tokens (colors, fonts, animations).
- `vite.config.js`: Build and dev-server configuration.
- `vercel.json`: Deployment configuration for Vercel.
- `DOCUMENTATION.md`: Main technical manual.
- `README.md`: Project landing page.

---

## 🖥️ Backend (`/Backend`)
The server-side implementation using Node.js, Express, and Firebase Admin.

### `/config`
- `firebase.js`: Initializes Firebase Admin SDK with Service Account keys.
- `emailService.js`: logic for sending automated notifications (e.g. attendance alerts).

### `/controllers`
Business logic separated by domain:
- `authcontroller.js`: User registration and login flow.
- `employeecontroller.js`: CRUD operations for personnel records.
- `attendancecontroller.js`: Logic for check-in/out and leave management.
- `advancedAttendanceController.js`: Complex performance and project-wise analytics.
- `companyProjectController.js`: Management of company projects and real-time broadcasts.
- `payrollcontroller.js`: Salary calculation and slip generation.
- `taskcontroller.js`: Internal task tracking for modules.

### `/routes`
API endpoint definitions mapping URLs to controllers:
- `index.js`: Primary router aggregating all sub-modules.
- `advancedAttendanceRoutes.js`: Specialized routes for analytics metrics.
- `companyProjectRoutes.js`: REST endpoints for project CRUD.

### `/middleware`
- `auth.js`: Implements JWT/Firebase token verification and role resolution (RBAC).
- `errorhandler.js`: Centralized error logging and JSON response formatting.

---

## 🎨 Frontend (`/src`)
The client-side React 18 application with a modular component architecture.

### `/hooks`
- `useAppContext.jsx`: The state engine. Stores global state (user, theme, projects, alerts) using React Context API.
- `useAttendance.js`: Specialized hook for managing check-in/out state logic.

### `/api`
Service layer for backend interactions:
- `companyProjectApi.js`: Clean-fetch functions for project operations.

### `/components`
- `attendance/`: specialized views like `DailyAttendanceView.jsx` and `MonthlyPerformanceView.jsx`.
- `auth/`: Login and Registration UI components.
- `common/`: Reusable elements (Modals, Loaders, ScrollToTop).
- `ui/`: Design system components (Buttons, Inputs, Badges).
- `drawers/`: Side-panel overlays for advanced inputs.

### `/pages`
Route-mapped views:
- `Dashboard.jsx`: Primary landing for HR vs. Employee perspective.
- `AttendanceDashboard.jsx`: The analytics engine for monitoring personnel.
- `Employees.jsx`: Management interface for personnel records.
- `Projects.jsx`: CRUD interface for company projects (new module).
- `Payroll.jsx` & `Performance.jsx`: Financial and engagement tracking views.

### `/layouts`
- `DashboardLayout.jsx`: The "Master" layout. Handles Sidebar navigation, Topbar notifications, and RBAC-based content filtering.

### `/assets`
- Static images, logos, and high-fidelity project branding resources.

---

## 📦 Static Assets (`/public`)
- `vite.svg` & `favicon.ico`: Browser assets.
- Other public-facing static files (e.g. document templates).

---
*Documentation last updated: 2026-03-31*
