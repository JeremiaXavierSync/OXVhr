# OXVhr UML Diagram Design Instructions

This document provides step-by-step instructions for drawing the architectural and behavioral diagrams for the OXVhr system. Use these guidelines to create diagrams in any modeling tool (Lucidchart, Draw.io, Visio, etc.).

---

## 1. Use Case Diagram
**Goal**: Define the interactions between users and the system's core features.

### Actors
- **HR Administrator**: The primary power user responsible for data entry and financial processing.
- **Department Manager**: Responsible for oversight and approvals within their specific unit.
- **Employee**: The end-user who interacts with personal data and attendance.

### Core Processes (Use Cases)
- **Employee Management**: Registering new staff, updating personal/bank details, and managing employment status (Active/Resigned/Terminated).
- **Financial Engine**: Configuring salary master data, executing monthly payroll runs, and generating consolidated monthly reports.
- **Attendance & Leave**: Marking daily attendance, submitting leave requests, and approving/rejecting leave applications.
- **Self-Service**: Viewing and downloading monthly payslips.

### Drawing Instructions
1. Place the three **Actors** outside a "System Boundary" box.
2. Inside the box, group the processes into packages: **Employee Management**, **Financial Engine**, and **Attendance/Leave**.
3. Draw lines connecting the **HR Administrator** to all Financial and Employee Management processes.
4. Connect the **Manager** to Leave Approvals and Reports.
5. Connect the **Employee** to Attendance Marking, Leave Submission, and Payslip Viewing.
6. **Relationship Note**: Link the "Execute Payroll" use case to "Attendance Logs" with an "Include" relationship, as payroll requires attendance data.

---

## 2. Sequence Diagram: Monthly Payroll Processing
**Goal**: Illustrate the step-by-step logic of the payroll execution.

### Participants (Lifelines)
- **HR Admin** (Actor)
- **Frontend (React)** (System Component)
- **Backend (Express)** (System Component)
- **Database (MySQL)** (Data Store)

### Step-by-Step Interactions
1. **Initiation**: The Admin selects the period (Month/Year) on the UI and clicks 'Process'.
2. **Request**: The UI sends a POST request to the Backend API.
3. **Transaction Start**: The Backend tells the Database to begin a new transaction.
4. **Initialization**: The Backend creates a 'DRAFT' record in the Payroll Runs table.
5. **Data Retrieval**: The Backend fetches a list of all 'ACTIVE' employees from the Database.
6. **Processing Loop**: For every employee in the list:
    - Backend calculates earnings (Basic + Allowances).
    - Backend calculates deductions (Tax + PF).
    - Backend sends a command to the Database to save a new 'Salary Slip' record.
7. **Finalization**: After the loop, the Backend updates the Payroll Run status to 'PROCESSED' and commits the transaction.
8. **Feedback**: The Backend sends a success response to the UI, which then displays a summary to the Admin.

---

## 3. Activity Diagram: Payroll Business Logic
**Goal**: Show the flow of control and decision paths during payroll calculation.

### Flow Steps
1. **Start**: Triggered by the Payroll Initiation request.
2. **Validation**: Check if the selected month has already been processed.
3. **Branching**:
    - If **Invalid**: End the process with an error message.
    - If **Valid**: Open a database transaction.
4. **Data Preparation**: Fetch the list of active employees.
5. **Iteration (Loop)**: For each employee:
    - Retrieve attendance logs for the period.
    - Calculate the daily rate and total earnings.
    - Apply statutory deductions.
    - Store the calculated slip.
6. **Completion**: Once the loop finishes, update the master run status.
7. **Commit**: Save all changes to the database.
8. **End**: Return a success notification.

---

## 4. Entity Relationship Diagram (ERD)
**Goal**: Define the data structure and how tables relate to one another.

### Main Entities & Key Attributes
- **Departments**: (ID, Code, Name, Cost Center).
- **Employees**: (ID, Number, Name, Status, Dept_ID, Designation_ID).
- **Bank Details**: (ID, Emp_ID, Bank Name, Account Number).
- **Payroll Runs**: (ID, Month, Year, Status).
- **Salary Slips**: (ID, Run_ID, Emp_ID, Net Pay, Basic Pay).

### Relationship Rules
- **Department to Employee**: One-to-Many (A department has many employees).
- **Employee to Bank Details**: One-to-One (Each employee has one primary bank record).
- **Employee to Salary Slips**: One-to-Many (One employee gets many slips over time).
- **Payroll Run to Salary Slips**: One-to-Many (One run generates many slips).
- **Employee to Manager**: Self-referencing (An employee may have a Manager who is also an employee).

---

## 5. Component Diagram
**Goal**: Map the physical or logical architecture of the application.

### Components
- **Client Side**: A React SPA running in the browser.
- **API Layer**: An Express.js server handling routing and business logic.
- **Middleware**: Modules for security (CORS) and data parsing.
- **Persistence**: A MySQL database instance.

### Connection Instructions
- Draw an arrow from **React SPA** to the **Express Server** labeled "REST API / JSON".
- Draw an arrow from the **Express Server** to the **MySQL Database** labeled "SQL Query / Connection Pool".
- Group the internal React modules into **Views** (Registry, Ledger) and **Components** (Sidebar, Layout).
