# OXVhr - HR & Payroll Management System

OXVhr is a specialized HR and Payroll management module designed for robust employee lifecycle management, attendance tracking, and automated payroll processing.

## 🏗️ System Architecture

The project follows a standard MERN-like stack:
- **Frontend**: React (TypeScript) with Vite
- **Backend**: Node.js (Express)
- **Database**: MySQL

---

## 📊 UML Documentation

This section provides a visual overview of the system's logic and structure. We use **Mermaid.js** for embedded diagrams.

### 1. Use Case Diagram
Describes the primary interactions between different users (Actors) and the system.

```mermaid
useCaseDiagram
    actor "HR Administrator" as Admin
    actor "Department Manager" as Manager
    actor "Employee" as Emp

    package "OXVhr Module" {
        package "Employee Management" {
            usecase "Register Staff" as UC1
            usecase "Update Details" as UC2
            usecase "Manage Status" as UC3
        }
        package "Financial Engine" {
            usecase "Configure Salary" as UC4
            usecase "Execute Payroll" as UC5
            usecase "Generate Reports" as UC6
        }
        package "Attendance & Leave" {
            usecase "Mark Attendance" as UC7
            usecase "Submit Leave" as UC8
            usecase "Approve/Reject Leave" as UC9
        }
        usecase "View Payslips" as UC10
    }

    Admin --> UC1
    Admin --> UC2
    Admin --> UC3
    Admin --> UC4
    Admin --> UC5
    Admin --> UC6
    
    Manager --> UC9
    Manager --> UC6

    Emp --> UC7
    Emp --> UC8
    Emp --> UC10

    UC5 ..> UC7 : <<include>>
```

### 2. Sequence Diagram: Monthly Payroll Processing
Illustrates the step-by-step interaction between components during a payroll run.

```mermaid
sequenceDiagram
    participant Admin as HR Admin
    participant UI as Frontend (React)
    participant API as Backend (Express)
    participant DB as MySQL Database

    Admin->>UI: Select Month/Year & Process
    UI->>API: POST /api/tasks/process-payroll
    activate API
    API->>DB: BEGIN TRANSACTION
    API->>DB: INSERT INTO payroll_runs (Status=DRAFT)
    DB-->>API: run_id
    API->>DB: SELECT * FROM employees WHERE status='ACTIVE'
    DB-->>API: Employee List
    
    loop For Each Employee
        API->>API: Calculate Salary (Base + Allowances)
        API->>DB: INSERT INTO salary_slips
    end

    API->>DB: COMMIT TRANSACTION
    API-->>UI: 200 OK (Success)
    deactivate API
    UI-->>Admin: Show Success Message
```

### 3. Activity Diagram: Payroll Business Logic
Shows the flow of control and decision points during the payroll calculation.

```mermaid
graph TD
    A[Start Payroll Process] --> B{Valid Period?}
    B -- No --> C[Return Error]
    B -- Yes --> D[Create Payroll Run Record]
    D --> E[Fetch Active Employees]
    E --> F[Initialize Loop]
    F --> G{More Employees?}
    G -- Yes --> H[Fetch Attendance Logs]
    H --> I[Calculate Earnings & Deductions]
    I --> J[Save Salary Slip]
    J --> G
    G -- No --> K[Commit Transaction]
    K --> L[End]
```

### 4. Entity Relationship / Class Diagram
Represents the core data structures and their relationships.

```mermaid
classDiagram
    class Employee {
        +int emp_id
        +string employee_number
        +string first_name
        +string last_name
        +string status
    }
    class Department {
        +int dept_id
        +string dept_name
    }
    class PayrollRun {
        +int run_id
        +int month
        +int year
        +string status
    }
    class SalarySlip {
        +int slip_id
        +decimal net_pay
    }

    Department "1" -- "*" Employee : contains
    Employee "1" -- "*" SalarySlip : receives
    PayrollRun "1" -- "*" SalarySlip : generates
```

---

## 🛠️ Development Tools

- **PlantUML**: Original source for complex diagrams can be found in `DIAGRAMS.txt`.
- **Mermaid.js**: Used for GitHub README visualization.
- **MySQL Workbench**: Recommended for direct database modeling.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL

### Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install && cd frontend && npm install
   ```
3. Configure `.env` in the `backend/` directory.
4. Run the development servers:
   ```bash
   # Backend
   cd backend && npm start
   # Frontend
   cd frontend && npm run dev
   ```
