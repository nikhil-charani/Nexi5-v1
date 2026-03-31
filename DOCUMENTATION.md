# Nexi5 HRM Portal: Technical Documentation

Nexi5 is a modern, full-stack Human Resource Management (HRM) system designed for enterprise-level operational agility. It features real-time analytics, automated attendance monitoring, and role-based access control (RBAC).

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS (with custom theme support)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Context API (`AppProvider`)
- **Routing**: React Router DOM v6
- **Toasts**: Sonner

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Firebase Firestore
- **Authentication**: Firebase Admin SDK
- **Real-time**: Socket.IO
- **Email**: NodeMailer (Configured in `Backend/config/emailService.js`)

---

## 📂 Architecture & Folder Structure

For a complete, in-depth map of every directory and key file, see the **[Detailed File Structure](file:///d:/Nexi5-v1/FILE_STRUCTURE.md)**.

### Frontend (`/src`)
- `components/`: UI components (common, attendance, charts, modals).
- `pages/`: Page-level components mapped to routes.
- `hooks/`: Custom hooks and global context (`useAppContext.jsx`).
- `api/`: API service layers for direct backend communication.
- `layouts/`: Master layouts like `DashboardLayout.jsx`.
- `lib/`: Utilities and shared helpers.

### Backend (`/Backend`)
- `controllers/`: Request handling logic.
- `routes/`: API endpoint definitions.
- `middleware/`: Authentication (`auth.js`) and error filtering.
- `config/`: Firebase initialization and service account keys.

---

## 🗄️ Database Schema (Firestore)

Nexi5 uses a multi-collection architecture to separate operational data from personnel records.

### Core Collections
| Collection | Purpose | Key Fields |
|---|---|---|
| `Staff` | Internal management users | `name`, `email`, `role`, `uid`, `department` |
| `employees` | Registered personnel | `employeeData` (nested object), `uid`, `id` |
| `attendance` | Daily check-in/out logs | `uid`, `date`, `checkInTime`, `checkOutTime`, `status` |
| `company_projects` | Isolated project module | `projectName`, `clientName`, `modules`, `status` |
| `calendar` | Shared and private events | `title`, `start`, `end`, `rolePerspective`, `uid` |
| `tasks` | Module-specific task tracking | `title`, `status`, `assignedTo`, `projectId` |
| `payroll` | Salary and slips generation | `employeeId`, `month`, `year`, `salaryData` |

---

## 📡 API Reference

### User & Employee Management
- `GET  /api/users`: Returns unified list of all Staff and Employees.
- `GET  /api/employees`: Returns list of all personnel in `employees` collection.
- `POST /api/employees`: Create a new employee record.
- `PUT  /api/update/:uid`: Update employee profile data.

### Attendance & Analytics
- `POST /api/checkin`: Register a check-in event.
- `PUT  /api/checkout`: Update current attendance with check-out.
- `GET  /api/attendance/status`: Real-time status of the current user.
- `GET  /api/attendance/advanced/summary`: Aggregated project-wise attendance data.

### Project Management
- `GET    /api/company-projects`: Fetch all projects.
- `POST   /api/company-projects`: Create project (Admin/HR/Manager only).
- `PUT    /api/company-projects/:id`: Update project/modules.
- `DELETE /api/company-projects/:id`: Remove project.

### Calendar
- `GET /api/calendar/events`: Fetch role-specific calendar events.
- `POST /api/calendar/add-event`: Create new event with Socket.IO broadcast.

---

## 🔑 Core Features & Logic

### 1. Role-Based Access Control (RBAC)
The system distinguishes between **Staff** (Admin, Manager, HR variants) and **Employees**. 
- **Staff** roles use `Staff` collection and have access to management dashboards.
- **Employees** are limited to self-service views (Check-in, personal tasks, slips).
- **Logic Location**: `Backend/middleware/auth.js` (Role resolution) and `src/layouts/DashboardLayout.jsx` (Sidebar filtering).

### 2. Advanced Attendance Analytics
Calculates productivity based on project assignments and check-in times.
- **Logic**: Maps `attendance` records against `company_projects` (modules assigned to user).
- **Status Logic**: `Present`, `Late`, `Half Day`, `Absent`.
- **Location**: `Backend/controllers/advancedAttendanceController.js`.

### 3. Real-Time Synchronization
Uses Socket.IO to push updates for Projects, Calendar events, and Tasks without page refreshes.
- **Location**: `Backend/server.js` (Socket init) and individual controllers using `req.app.get("io")`.

---

## 🛠️ Developer Setup

### Prerequisites
- Node.js (v18+)
- Firebase Project with Firestore and Auth enabled.

### Local Installation
1. Clone the repository.
2. Install dependencies: `npm install` and `cd Backend && npm install`.
3. Configure Environment Variables (`.env` in root and `Backend/`):
   - `VITE_API_BASE_URL=http://localhost:5000/api`
   - `FIREBASE_SERVICE_ACCOUNT` (JSON string or path to service account key).
4. Start Development Servers:
   - Backend: `cd Backend && npm start`
   - Frontend: `npm run dev`

---
*Documentation last updated: 2026-03-31*
