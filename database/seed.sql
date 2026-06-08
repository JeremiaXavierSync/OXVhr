USE ksrtc_hr_payroll;

-- Clear existing data (optional but good for clean seed)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE employee_salary_slips;
TRUNCATE TABLE payroll_runs;
TRUNCATE TABLE attendance_logs;
TRUNCATE TABLE employee_emergency_contacts;
TRUNCATE TABLE employee_experience;
TRUNCATE TABLE employee_education;
TRUNCATE TABLE employee_statutory_details;
TRUNCATE TABLE employee_bank_details;
TRUNCATE TABLE employee_addresses;
TRUNCATE TABLE employee_personal_details;
TRUNCATE TABLE employees;
TRUNCATE TABLE designations;
TRUNCATE TABLE employee_categories;
TRUNCATE TABLE departments;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Structural Masters
INSERT INTO departments (dept_code, dept_name, company_context, cost_center_code) VALUES
('DEP-TVM-01', 'Thiruvananthapuram Central', 'KSRTC-SOUTH', 'CC-101'),
('DEP-EKM-01', 'Ernakulam Depot', 'KSRTC-CENTRAL', 'CC-201'),
('DEP-CLT-01', 'Kozhikode Depot', 'KSRTC-NORTH', 'CC-301');

INSERT INTO employee_categories (category_name, description) VALUES
('Driver', 'Bus driving operations'),
('Conductor', 'Ticket and passenger management'),
('Mechanical', 'Vehicle maintenance and repair'),
('Administrative', 'Office and management staff');

INSERT INTO designations (designation_name, grade_level) VALUES
('Senior Grade Driver', 'G4'),
('Junior Conductor', 'G1'),
('Chief Mechanic', 'G5'),
('Office Assistant', 'G2'),
('Depot Manager', 'G8');

-- 2. Employees
INSERT INTO employees (employee_number, first_name, last_name, gender, dob, joining_date, dept_id, category_id, designation_id, status) VALUES
('KSRTC1001', 'Rajesh', 'Kumar', 'MALE', '1985-05-15', '2010-01-01', 1, 1, 1, 'ACTIVE'),
('KSRTC1002', 'Saritha', 'Nair', 'FEMALE', '1990-08-20', '2015-06-15', 1, 4, 4, 'ACTIVE'),
('KSRTC1003', 'Mohammad', 'Shafi', 'MALE', '1982-11-10', '2008-03-20', 2, 3, 3, 'ACTIVE');

-- 3. Extended Details
INSERT INTO employee_personal_details (emp_id, marital_status, nationality, religion, blood_group, national_id_number) VALUES
(1, 'MARRIED', 'Indian', 'Hindu', 'O+', '1234-5678-9012'),
(2, 'SINGLE', 'Indian', 'Hindu', 'A+', '9876-5432-1098'),
(3, 'MARRIED', 'Indian', 'Islam', 'B+', '4567-8901-2345');

INSERT INTO employee_bank_details (emp_id, bank_name, branch_name, account_number, ifsc_code) VALUES
(1, 'State Bank of India', 'TVM Main', '111222333444', 'SBIN0001234'),
(2, 'Federal Bank', 'EKM Town', '555666777888', 'FDRL0005678'),
(3, 'Canara Bank', 'CLT Beach', '999000111222', 'CNRB0009012');

-- 4. Attendance
INSERT INTO attendance_logs (emp_id, log_date, clock_in, clock_out, total_hours, status) VALUES
(1, '2024-05-01', '2024-05-01 08:00:00', '2024-05-01 17:00:00', 9.00, 'PRESENT'),
(2, '2024-05-01', '2024-05-01 09:00:00', '2024-05-01 18:00:00', 9.00, 'PRESENT'),
(3, '2024-05-01', '2024-05-01 07:30:00', '2024-05-01 16:30:00', 9.00, 'PRESENT');
