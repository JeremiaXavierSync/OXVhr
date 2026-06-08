# KSRTC HR & Payroll Module - Technical Specification & Data Dictionary

This document serves as the master technical reference for the KSRTC HR & Payroll Module. It covers the database architecture, UI/UX mandates, and functional archetypes implemented in the system.

## 1. System Philosophy & UI Mandate
The application is designed as a **Legacy "Finacle-Style" Workstation**, optimized for high-density data entry and professional administrative efficiency.
- **Aesthetics:** Flat design, zero border-radius, high-contrast crisp lines (`#888888`).
- **Typography:** System-default sans-serif and monospace (11px to 13px).
- **Interactivity:** Instant response actions with spreadsheet-style data grids.

---

## 2. Database Architecture (MySQL)

### 2.1 Structural & Organizational Masters
Tables that define the KSRTC hierarchy and operational framework.

| Table | Purpose | Key Fields |
| :--- | :--- | :--- |
| `departments` | Organizational units/depots | `dept_code`, `dept_name`, `cost_center_code` |
| `designations` | Official job titles | `designation_name`, `grade_level` |
| `employee_categories` | Workforce segmentation | `category_name` (e.g., Driver, Admin) |
| `salary_master` | Standard pay grades | `base_salary`, `hra`, `conveyance_allowance` |

### 2.2 Core Employee Ecosystem
A comprehensive 360-degree view of the human resource, split across normalized tables for maximum data integrity.

#### `employees` (The Central Registry)
- `employee_number`: Unique KSRTC identifier.
- `status`: `ACTIVE`, `ON_LEAVE`, `SUSPENDED`, `TERMINATED`, `RETIRED`, `TRAINING`.
- `employment_type`: `FULL_TIME`, `CONTRACT`, `CASUAL`, etc.
- `fingerprint_id`: Linked ID for biometric terminal integration.

#### Extended Information Modules
- `employee_personal_details`: Marital status, religion, blood group, and National ID/Passport/Visa tracking.
- `employee_addresses`: Multiple address types (`CURRENT`, `PERMANENT`, `EMERGENCY`).
- `employee_bank_details`: Primary and secondary bank accounts with IFSC/IBAN/Swift support.
- `employee_statutory_details`: Compliance IDs including PAN, PF (Provident Fund), and ESI (Health Insurance).
- `employee_education`: Academic pedigree tracking (Degrees, Institutions, CGPA).
- `employee_experience`: Professional history and previous employment audits.
- `employee_emergency_contacts`: Safety-critical contact points.

### 2.3 Attendance & Leave Management
High-precision tracking for payroll inputs.

- `attendance_logs`: Captures daily IN/OUT with `latitude`/`longitude` for mobile geo-fencing.
- `leave_types`: Configurable leave buckets (Annual, Sick, Casual).
- `leave_registry`: Transactional leave requests with approval audit trails.

### 2.4 Payroll & Compensation Engine
The financial core of the module, designed for atomicity and auditability.

- `payroll_runs`: Batch processing headers for monthly salary execution.
- `employee_salary_slips`: The final financial ledger for each employee.
    - **Earnings:** Basic, HRA, Conveyance, Special Allowance, Overtime.
    - **Deductions:** PF, ESI, Professional Tax, Disciplinary Fines.
- `disciplinary_actions`: Tracks violations and associated financial penalties/fines.

---

## 3. Frontend Implementation: "The Workstation"
The React frontend (Vite + TypeScript) implements a **Tabbed Registry Console** to manage the expanded data set.

- **Tab: GENERAL:** Core employment data, designation, and status.
- **Tab: PERSONAL:** Demographic and identity compliance.
- **Tab: CONTACT:** Communication channels and emergency links.
- **Tab: BANK/STATUTORY:** Financial disbursement and government ID mapping.
- **Tab: ACADEMIC/EXP:** Professional background and skill mapping.

---

## 4. Backend Engine & Safety
- **Express.js:** Organized routing layers (`/masters`, `/tasks`, `/reports`).
- **Transactional Safety:** Payroll processing routes use MySQL `BEGIN...COMMIT` blocks to ensure data atomicity—if one calculation fails, the entire batch rolls back.
- **Connectivity:** Secure connection pooling via `mysql2/promise`.

## 5. Environment Configuration
- **Host:** `localhost`
- **Port:** `5000`
- **DB Credentials:** `root` / `toor`
- **Primary Schema:** `ksrtc_hr_payroll`
