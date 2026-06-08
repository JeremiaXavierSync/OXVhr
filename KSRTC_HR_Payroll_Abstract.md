# ABSTRACT
## KSRTC HR & Payroll Management System

### Overview
Enterprise Resource Planning (ERP) systems are integrated software platforms designed to consolidate and automate the core business processes of an organization into a unified system. By providing a centralized database and real-time information flow across departments, ERP systems eliminate data silos, reduce manual effort, and improve decision-making. Modern ERP implementations span domains such as finance, human resources, procurement, inventory, and asset management, and are deployed across industries ranging from manufacturing to public sector utilities.

Human Capital Management (HCM) and Payroll, as a critical discipline within ERP, is concerned with the systematic tracking, compensation, and lifecycle governance of an organization's workforce. Effective HR management ensures that an organization has accurate records of employee demographics, statutory compliance (PF, ESI), attendance logs, and performance status. For large public sector organizations that operate geographically distributed workforces across various depots and offices, manual workforce tracking through registers and spreadsheets introduces significant risks including payroll miscalculations, lack of audit trails, and delayed statutory compliance reporting.

A web-based HR & Payroll ERP module addresses these challenges by providing a structured workflow-driven platform for employee registration, attendance tracking, automated payroll calculation, leave management, and statutory reporting. Role-based access control ensures that only authorized personnel can initiate salary changes or approve leaves, while a complete audit trail supports both internal and state audit requirements.

### Technology Stack
| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite) | SPA interface for administrative staff and employees |
| **Styling** | Plain CSS | Functional, high-density ERP-style interface |
| **HTTP Client**| Axios | REST API communication |
| **Backend** | Node.js + Express | REST API with business logic and payroll calculation engine |
| **Database** | MySQL 8.0 | Relational storage for all employee, attendance, and payroll data |
| **Diagramming**| Mermaid.js & PlantUML | Architecture and workflow documentation |

---

### Project Abstract
The Kerala State Road Transport Corporation (KSRTC) operates one of the largest public bus transport networks in India, managing a massive workforce of drivers, conductors, mechanics, and administrative staff spread across depots throughout the state. Employee records and attendance are currently maintained in manual registers or disconnected spreadsheets at each depot, leading to a lack of unified workforce visibility, difficulty in pro-rated salary calculations, no structured workflow for leave approvals, and an absence of audit trails for employment status changes.

This project presents the design and development of the **KSRTC HR & Payroll Management System (OXVhr)** - a centralized web-based ERP module that digitizes the complete lifecycle of KSRTC employees. The system covers comprehensive enterprise-grade employee registration (Official, Personal, Bank, Statutory, Education, Experience), complex automated payroll execution based on salary grades and attendance logs, inter-departmental leave approval workflows, and management reporting for state audit compliance.

The system follows standard software engineering principles including functional decomposition, role-based access control, and a structured state transition model for employee statuses (e.g., Active, On Leave, Terminated). Key stakeholders include HR Administrators, Department Managers, and all KSRTC Employees across the depot network.

### Database Design
The system uses a highly normalized MySQL database organized into core master data and transactional logs:

#### Master Tables (Structural & Employee)
| Table | KSRTC Purpose |
| :--- | :--- |
| `departments` | KSRTC Cost Centers and divisional units |
| `designations` | Job titles and grade level mapping |
| `salary_master` | Base pay, HRA, and fixed allowance definitions per grade |
| `employees` | Central registry containing core job details and employment status |
| `employee_personal_details` | Demographics, emergency contacts, and statutory IDs |
| `employee_bank_details` | Account mapping for salary disbursements |

#### Transaction Tables (Operations & Payroll)
| Table | Purpose |
| :--- | :--- |
| `attendance_logs` | Daily biometric/manual clock-in and clock-out tracking |
| `leave_registry` | Employee time-off requests with approval workflow tracking |
| `payroll_runs` | Monthly batch execution records (Draft/Processed state) |
| `employee_salary_slips` | Individual calculated earnings, pro-rated pay, and statutory deductions (PF, ESI) |

---

### System Architecture & Workflows

#### 1. Use Case Diagram
The system defines boundaries between three primary actors:
*   **System Admin / HR:** Configures Master data (Salary Grades, Cost Centers), registers staff, and executes the Monthly Payroll engine.
*   **Manager / Approver:** Monitors departmental teams and approves/rejects Leave Requests.
*   **Employee:** Marks daily attendance, submits leave applications, and accesses personal payslips.

*(Reference: `HR_01_UseCaseDiagram.puml`)*

#### 2. Payroll Execution Engine (Activity Diagram)
The core financial engine handles mathematical calculations and database commits. 
1.  **Validation:** Checks if the target month/year is already processed to prevent duplicates.
2.  **Data Fetching:** Pulls Active Employees, their Salary Grades, and their Monthly Attendance Logs.
3.  **Parallel Calculation:** Simultaneously calculates pro-rated Earnings (Base, HRA) and Statutory Deductions (PF, ESI) based on payable days.
4.  **Commitment:** Generates individual Salary Slips and updates the run status to PROCESSED.

*(Reference: `HR_02_PayrollWorkflow.puml`)*

#### 3. Employee Lifecycle Management
Outlines the comprehensive data entry required for onboarding a new KSRTC employee across multiple domains: Official Job Data, Personal Demographics, Bank Details for routing, Statutory compliance numbers, and historical Education/Experience tracking. It also maps the flow for updating existing records and managing state changes (Active -> Retired/Terminated).

*(Reference: `HR_04_EmployeeLifecycleWorkflow.puml`)*
