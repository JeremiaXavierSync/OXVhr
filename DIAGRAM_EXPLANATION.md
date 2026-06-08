# KSRTC HR & Payroll Module: Diagram Presentation Guide

This document provides a detailed breakdown of each UML diagram designed for the KSRTC HR & Payroll Module. It is structured to help you present the technical and business logic to clients, stakeholders, and auditors clearly.

## 1. HR_01_UseCaseDiagram: Business Overview
**Purpose:** This diagram provides a high-level, system-wide view of *who* interacts with the system and *what* they can do. It sets the boundaries of the software.

### The Actors (Users)
*   **System Admin / HR:** The power user. They control the backend data, setup the financial rules, manage the employee database, and execute the final payroll runs.
*   **Manager / Approver:** The operational supervisor. Their primary role in this module is monitoring their team and approving or rejecting time-off (leave) requests.
*   **Employee / Staff:** The end-user. They interact with the system for self-service tasks like marking attendance, submitting leave, and viewing their payslips.

### The Packages (Modules)
The system is divided into three core corporate packages:
1.  **1. MASTER (Setup):** Where the foundational rules are built.
    *   **Register Staff / Update Details / Manage Status:** The complete lifecycle management of an employee profile.
    *   **Manage Cost Centers:** Organizing the business into logical departments.
    *   **Configure Salary Master:** Defining how much each grade/rank gets paid (Base, HRA, etc.).
2.  **2. TASKS (Operations):** The daily and monthly functional activities.
    *   **Mark Daily Attendance / Manual Attendance Import:** How the system knows who was at work.
    *   **Submit / Approve Leave:** The workflow for handling absences.
    *   **Execute Payroll Engine:** The heavy-lifting process that calculates salaries based on the master data and task data.
    *   *(Note the `<<include>>` line: It shows that Payroll Execution physically requires the Attendance data to run).*
3.  **3. REPORTS (Monitoring):** The output of the system.
    *   **View Personal Payslips:** For employees to see their earnings.
    *   **Generate Reports (Ledger / Register):** For HR and Auditors to review the total financial payout and attendance records for the month.

---

## 2. HR_02_PayrollWorkflow: Payroll Execution Process
**Purpose:** This Activity Diagram zooms in on the most complex process in the system: how a month's salary is actually calculated. It shows the step-by-step logic the system follows.

### The Flow Breakdown
1.  **Initiation & Validation:** The HR Admin starts the process for a specific month/year. The system's first job is a safety check: *Has this month already been paid?* If yes, it blocks the process to prevent double-paying.
2.  **Preparation (DRAFT status):** If it's a new run, a DRAFT record is created, and the system pulls a list of all currently **ACTIVE** employees.
3.  **The Iteration (While Loop):** For every single employee on that list, the system fetches:
    *   Their specific **Salary Grade** (from Master).
    *   Their **Attendance Logs** (from Tasks).
4.  **Parallel Calculation (The Fork):** The system performs two complex math operations simultaneously:
    *   **Earnings:** Calculates the pro-rated Base Salary and allowances based on how many days they actually worked.
    *   **Deductions:** Calculates the statutory subtractions like Provident Fund (PF) and Employee State Insurance (ESI).
5.  **Finalization:** It subtracts deductions from earnings to get the **Net Pay**, generates the individual Salary Slip, and saves it.
6.  **Commitment:** Once all employees are processed, the entire batch is marked as **PROCESSED**, the database transaction is permanently saved, and the HR Admin sees a success summary.

---

## 3. HR_03_ClassDiagram: Core Data Model
**Purpose:** This diagram represents the underlying database architecture. It shows how the data tables relate to each other to form a cohesive system.

### The Core Entities (Tables)
*   **Employee:** The central hub of the system. Every other piece of data connects back to a specific employee ID.
*   **Department:** Represents the Cost Centers.
*   **Salary Master:** The financial rulebook defining grades and fixed pay amounts.
*   **Leave / Attendance (Tasks):** The daily transactional logs indicating presence or absence.
*   **Salary Slip:** The final financial output generated monthly.

### The Relationships (The Lines)
*   **Employee to Department (`many to 1`):** Many employees can work in one department, but an employee only has one primary department.
*   **Employee to Salary Master (`many to 1`):** Many employees can share the same pay grade (e.g., 'Grade A'), ensuring standardized pay across roles.
*   **Employee to Task (`1 to many`):** One employee generates hundreds of attendance logs over their career.
*   **Employee to Slip (`1 to many`):** One employee receives one salary slip every month, accumulating many over time.

---

## 4. HR_04_EmployeeLifecycleWorkflow: Data Management
**Purpose:** This Activity Diagram details the comprehensive data collection process required for a large-scale ERP, specifically focusing on how an employee is onboarded and maintained.

### The Flow Breakdown
1.  **Action Selection:** The HR Admin opens the registry and chooses to either onboard a new staff member or edit an existing one.
2.  **Enterprise Data Input (New Hire):** To meet enterprise standards, onboarding isn't just a name and email. The system requires data across five distinct tabs:
    *   **Official Data:** Job role, department, joining date.
    *   **Personal & Emergency:** Demographics and who to contact in a crisis.
    *   **Bank Details:** Where to send the salary.
    *   **Statutory:** Government tracking numbers (PAN, PF, ESI) required for legal payroll compliance.
    *   **Education & Experience:** Background data for HR records.
3.  **Validation & Creation:** The system checks all inputs and creates the profile with an **ACTIVE** status.
4.  **Lifecycle Management (Existing Hire):** If managing an existing employee, HR can either do a standard profile edit, or trigger a **Status Change** (e.g., moving them from Active to Suspended, Terminated, or Retired). This is crucial for historical auditing.
