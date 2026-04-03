# Nexi5 HRM Portal: Attendance Module & Analytics Documentation

The Attendance Module in Nexi5 is a high-fidelity system designed for operational monitoring and strategic performance analysis. It integrates personnel data, project assignments, and daily check-in logs into a unified analytics dashboard.

---

## 📊 Overview: Attendance Analytics

The **Attendance Analytics** system (located at `/dashboard/attendance-analytics`) provides HR and Management with real-time insights into workforce productivity.

### Key Metrics (KPIs)
| Metric | Calculation / Logic |
|---|---|
| **Attendance %** | `(Present Employees / Total Registered Staff) * 100` |
| **Productivity Score** | Weighted average: `(Attendance % * 0.6) + (Average Hours Score * 0.4)` |
| **Status Logic** | **Present**: Check-in exists. <br> **Late**: Check-in after 09:30 AM. <br> **Half Day**: Total hours > 0 and < 4. <br> **Absent**: No check-in record for the date. |

---

## 🏗️ Architectural Flow

### 1. Data Collection (The Employee Side)
Employees interact with the standard attendance view to log their day.
- **Check-in**: Logs `uid`, `date`, and `checkin` timestamp.
- **Check-out**: Updates the record with `checkout` timestamp and calculates `totalHours`.
- **Location**: `Backend/controllers/attendancecontroller.js`.

### 2. Analytical Processing (The Manager Side)
The `advancedAttendanceController.js` performs "Joins" across Firestore collections to provide rich context.
- **Project Mapping**: Uses `getProjectMap()` to find which projects an employee is currently assigned to (via `projects` collection modules).
- **Deduplication**: Normalizes users from both `Staff` and `employees` collections to ensure 100% data coverage.

### 3. Frontend Visualization
- **`AttendanceStats.jsx`**: Renders the top KPI cards (Total, Present, Absent, Late).
- **`DailyAttendanceView.jsx`**: Real-time operational log. Shows who is "In-Progress" (checked in but not out).
- **`MonthlyPerformanceView.jsx`**: Aggregated view with productivity scores, trend analysis, and performance "Insights" (e.g., "Frequent Late", "High Performer").

---

## 📡 API Endpoints (Advanced)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/attendance/advanced/summary` | `GET` | Returns high-level numbers for the current day's KPIs. |
| `/api/attendance/advanced/daily` | `GET` | Returns full list of everyone (Staff + Employees) with their project info and today's status. |
| `/api/attendance/advanced/monthly` | `GET` | Aggregates data for a specific month, calculating productivity scores and insights. |
| `/api/attendance/advanced/project-summary` | `GET` | Groups attendance data by Project/Team to show which projects have the highest engagement. |

---

## ⚙️ Core Logic Deep Dive

### Productivity Scoring Logic
The system uses a 100-point scale to rank employee engagement:
1. **Attendance Component (60%)**: Based on the percentage of working days attended in the month.
2. **Hours Component (40%)**: Compares average daily working hours against an 8-hour benchmark.
   - `HourScore = Min(100, (AvgHours / 8) * 100)`
3. **Final Score**: `(AttendanceScore * 0.6) + (HourScore * 0.4)`

### Performance Insights (Automatic Flags)
- **High Performer**: Attendance >= 95% AND Avg Hours >= 8.
- **Frequent Late**: More than 5 "Late" status logs in a month.
- **Low Attendance**: Attendance < 75%.

---

## 🗄️ Database Integration

### `attendance` Collection
```json
{
  "employeeId": "UID_STRING",
  "date": "YYYY-MM-DD",
  "checkin": "ISO_TIMESTAMP",
  "checkout": "ISO_TIMESTAMP",
  "totalHours": 8.5,
  "status": "present | late | half-day"
}
```

### `projects` Collection (Linked via `assignedToId`)
The analytics system reads the `modules` array inside each project document to map employees to their respective project names for reporting.

---
*Documentation last updated: 2026-03-31*
