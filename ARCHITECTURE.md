# Role-Based Dashboard Architecture & Navigation

This document explains the technical implementation of role-based dashboards and navigation in the Nexi5 platform.

## 1. Authentication & Role Management
The application uses a centralized state management system via `useAppContext.jsx`.

- **Login Flow**: Users authenticate through `AuthPage.jsx`. The selected role is captured and passed to the `login()` function.
- **State Persistence**: The user object, including their specific `role`, is stored in the `currentUser` state and persisted in `localStorage`.
- **Global Context**: The `userRole` is derived directly from `currentUser` and exported via the `useAppContext()` hook for easy access in any component.

## 2. Dynamic Sidebar Navigation
The sidebar in `DashboardLayout.jsx` is driven by a `navGroups` configuration. Each module defines a `roles` array specifying which users can see it.

- **Role Boundaries**:
    - **Admin**: Has full access to all system modules, including "Settings".
    - **HR Head / Recruiter / Accountant**: Access to relevant HR tools (Employees, Payroll, Candidates) while maintaining personal views (Leave, Attendance).
    - **Manager**: Focused on team oversight (Projects, Teams) and personal metrics.
    - **BDE**: Specialized view for Sales and CRM (Leads, Clients, Deals).
    - **Employee**: Streamlined "Personal" view focusing on individual productivity and attendance.

## 3. The Responsive Dashboard Page
`Dashboard.jsx` serves as a "Smart Component" that renders different UI modules based on the active role.

- **Granular Rendering**: Instead of just two broad views, the component uses a `switch` statement or conditional logic to deliver tailored KPIs and Charts:
    - **Admin/HR**: Org-wide metrics (Employee count, Payroll trends).
    - **Sales (BDE)**: CRM-centric metrics (Pipeline Revenue, Lead Conversion).
    - **Management**: Team performance and project health.
    - **Personal**: Individual check-ins and personal task status.

## 4. Component Refactoring & Reuse
To maintain visual consistency while delivering unique data:
- **StatCard**: Used across all dashboards with varying titles, icons, and color themes.
- **ChartsSection**: Modular chart component that renders Payroll, Attendance, or Recruitment data based on the dashboard's context.
- **ActivityFeed**: Shared between roles but can be filtered for relevant events.
