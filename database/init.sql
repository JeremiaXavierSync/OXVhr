-- KSRTC HR & Payroll Module - COMPREHENSIVE DATABASE SCHEMA
-- Style: Legacy Relational (MySQL)

DROP DATABASE IF EXISTS ksrtc_hr_payroll;
CREATE DATABASE ksrtc_hr_payroll;
USE ksrtc_hr_payroll;

-- 1. STRUCTURAL MASTERS --

CREATE TABLE departments (
    dept_id INT AUTO_INCREMENT PRIMARY KEY,
    dept_code VARCHAR(20) UNIQUE NOT NULL,
    dept_name VARCHAR(100) NOT NULL,
    company_context VARCHAR(100),
    cost_center_code VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB;

CREATE TABLE employee_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
) ENGINE=InnoDB;

CREATE TABLE designations (
    designation_id INT AUTO_INCREMENT PRIMARY KEY,
    designation_name VARCHAR(100) UNIQUE NOT NULL,
    grade_level VARCHAR(10)
) ENGINE=InnoDB;

-- 2. CORE EMPLOYEE REGISTRY --

CREATE TABLE employees (
    emp_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_number VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(200),
    gender ENUM('MALE', 'FEMALE', 'OTHER'),
    dob DATE NOT NULL,
    joining_date DATE NOT NULL,
    probation_end_date DATE,
    confirmation_date DATE,
    retirement_date DATE,
    dept_id INT,
    category_id INT,
    designation_id INT,
    employment_type ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'CASUAL') DEFAULT 'FULL_TIME',
    work_email VARCHAR(150) UNIQUE,
    personal_email VARCHAR(150),
    mobile_primary VARCHAR(20),
    mobile_secondary VARCHAR(20),
    status ENUM('ACTIVE', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED', 'RETIRED', 'TRAINING') DEFAULT 'ACTIVE',
    manager_id INT,
    photo_path VARCHAR(255),
    fingerprint_id VARCHAR(50),
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id),
    FOREIGN KEY (category_id) REFERENCES employee_categories(category_id),
    FOREIGN KEY (designation_id) REFERENCES designations(designation_id),
    FOREIGN KEY (manager_id) REFERENCES employees(emp_id),
    INDEX idx_emp_num (employee_number),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- 3. EXTENDED EMPLOYEE DETAILS --

CREATE TABLE employee_personal_details (
    emp_id INT PRIMARY KEY,
    marital_status ENUM('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'),
    nationality VARCHAR(50),
    religion VARCHAR(50),
    blood_group VARCHAR(5),
    national_id_type VARCHAR(50), -- E.g., Aadhar, SSN
    national_id_number VARCHAR(50),
    passport_number VARCHAR(50),
    passport_expiry DATE,
    visa_number VARCHAR(50),
    visa_expiry DATE,
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE employee_addresses (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    emp_id INT NOT NULL,
    address_type ENUM('CURRENT', 'PERMANENT', 'EMERGENCY'),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    zip_code VARCHAR(20),
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE employee_bank_details (
    bank_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    emp_id INT NOT NULL,
    bank_name VARCHAR(150),
    branch_name VARCHAR(150),
    account_number VARCHAR(50),
    ifsc_code VARCHAR(20), -- For India
    swift_code VARCHAR(20), -- International
    iban VARCHAR(34),
    account_holder_name VARCHAR(200),
    is_primary BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE employee_statutory_details (
    stat_id INT PRIMARY KEY,
    emp_id INT NOT NULL,
    pan_number VARCHAR(20), -- Tax ID
    pf_number VARCHAR(50), -- Provident Fund
    esi_number VARCHAR(50), -- Employee State Insurance
    lwf_number VARCHAR(50), -- Labour Welfare Fund
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE employee_education (
    edu_id INT AUTO_INCREMENT PRIMARY KEY,
    emp_id INT NOT NULL,
    degree_name VARCHAR(100),
    institution VARCHAR(255),
    specialization VARCHAR(100),
    year_of_passing INT,
    percentage_cgpa DECIMAL(5,2),
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE employee_experience (
    exp_id INT AUTO_INCREMENT PRIMARY KEY,
    emp_id INT NOT NULL,
    company_name VARCHAR(255),
    designation VARCHAR(100),
    from_date DATE,
    to_date DATE,
    reason_for_leaving TEXT,
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE employee_emergency_contacts (
    contact_id INT AUTO_INCREMENT PRIMARY KEY,
    emp_id INT NOT NULL,
    contact_name VARCHAR(200),
    relationship VARCHAR(50),
    phone_number VARCHAR(20),
    email VARCHAR(150),
    is_primary BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. PAYROLL & COMPENSATION --

CREATE TABLE salary_master (
    grade_id INT AUTO_INCREMENT PRIMARY KEY,
    grade_name VARCHAR(50) NOT NULL,
    base_salary DECIMAL(15, 2) NOT NULL,
    hra DECIMAL(15, 2) DEFAULT 0,
    conveyance_allowance DECIMAL(15, 2) DEFAULT 0,
    medical_allowance DECIMAL(15, 2) DEFAULT 0,
    special_allowance DECIMAL(15, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB;

CREATE TABLE employee_salary_structure (
    emp_id INT PRIMARY KEY,
    grade_id INT,
    custom_base_salary DECIMAL(15, 2),
    effective_from DATE,
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id),
    FOREIGN KEY (grade_id) REFERENCES salary_master(grade_id)
) ENGINE=InnoDB;

-- 5. ATTENDANCE & LEAVE --

CREATE TABLE attendance_logs (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    emp_id INT NOT NULL,
    log_date DATE NOT NULL,
    clock_in DATETIME,
    clock_out DATETIME,
    total_hours DECIMAL(5,2),
    status ENUM('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE') DEFAULT 'PRESENT',
    source ENUM('MANUAL', 'MOBILE', 'BIOMETRIC') DEFAULT 'BIOMETRIC',
    latitude VARCHAR(20),
    longitude VARCHAR(20),
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id),
    UNIQUE KEY uk_emp_date (emp_id, log_date)
) ENGINE=InnoDB;

CREATE TABLE leave_types (
    leave_type_id INT AUTO_INCREMENT PRIMARY KEY,
    leave_type_name VARCHAR(50) UNIQUE,
    annual_limit INT
) ENGINE=InnoDB;

CREATE TABLE leave_registry (
    leave_id INT AUTO_INCREMENT PRIMARY KEY,
    emp_id INT NOT NULL,
    leave_type_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days DECIMAL(4,1),
    reason TEXT,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED') DEFAULT 'PENDING',
    approved_by INT,
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id),
    FOREIGN KEY (leave_type_id) REFERENCES leave_types(leave_type_id),
    FOREIGN KEY (approved_by) REFERENCES employees(emp_id)
) ENGINE=InnoDB;

-- 6. DISCIPLINARY --

CREATE TABLE disciplinary_actions (
    action_id INT AUTO_INCREMENT PRIMARY KEY,
    emp_id INT NOT NULL,
    action_date DATE,
    violation_description TEXT,
    action_type ENUM('VERBAL_WARNING', 'WRITTEN_WARNING', 'SUSPENSION', 'TERMINATION', 'FINE'),
    fine_amount DECIMAL(15, 2) DEFAULT 0,
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id)
) ENGINE=InnoDB;

-- 7. PAYROLL RUNS --

CREATE TABLE payroll_runs (
    run_id INT AUTO_INCREMENT PRIMARY KEY,
    payroll_month INT NOT NULL,
    payroll_year INT NOT NULL,
    execution_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('DRAFT', 'PROCESSED', 'PAID', 'REVERSED') DEFAULT 'DRAFT',
    total_gross DECIMAL(20, 2),
    total_deductions DECIMAL(20, 2),
    total_net DECIMAL(20, 2),
    processed_by INT,
    FOREIGN KEY (processed_by) REFERENCES employees(emp_id)
) ENGINE=InnoDB;

CREATE TABLE employee_salary_slips (
    slip_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    run_id INT NOT NULL,
    emp_id INT NOT NULL,
    basic_pay DECIMAL(15, 2),
    hra DECIMAL(15, 2),
    conveyance DECIMAL(15, 2),
    special_allowance DECIMAL(15, 2),
    overtime_pay DECIMAL(15, 2) DEFAULT 0,
    pf_deduction DECIMAL(15, 2) DEFAULT 0,
    esi_deduction DECIMAL(15, 2) DEFAULT 0,
    tax_deduction DECIMAL(15, 2) DEFAULT 0,
    other_deductions DECIMAL(15, 2) DEFAULT 0,
    net_pay DECIMAL(15, 2),
    FOREIGN KEY (run_id) REFERENCES payroll_runs(run_id),
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id)
) ENGINE=InnoDB;
