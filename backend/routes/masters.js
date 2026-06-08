const express = require('express');
const router = express.Router();
const db = require('../db');

// --- EMPLOYEES ---

// GET all employees with relations
router.get('/employees', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT e.*, d.dept_name, c.category_name, des.designation_name
            FROM employees e
            LEFT JOIN departments d ON e.dept_id = d.dept_id
            LEFT JOIN employee_categories c ON e.category_id = c.category_id
            LEFT JOIN designations des ON e.designation_id = des.designation_id
            ORDER BY e.emp_id DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single employee with all extended details
router.get('/employees/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [emp] = await db.query('SELECT * FROM employees WHERE emp_id = ?', [id]);
        if (emp.length === 0) return res.status(404).json({ error: 'Employee not found' });
        
        const [personal] = await db.query('SELECT * FROM employee_personal_details WHERE emp_id = ?', [id]);
        const [address] = await db.query('SELECT * FROM employee_addresses WHERE emp_id = ? AND address_type = "CURRENT"', [id]);
        const [bank] = await db.query('SELECT * FROM employee_bank_details WHERE emp_id = ?', [id]);
        const [statutory] = await db.query('SELECT * FROM employee_statutory_details WHERE emp_id = ?', [id]);
        const [emergency] = await db.query('SELECT * FROM employee_emergency_contacts WHERE emp_id = ?', [id]);
        const [education] = await db.query('SELECT * FROM employee_education WHERE emp_id = ?', [id]);
        const [experience] = await db.query('SELECT * FROM employee_experience WHERE emp_id = ?', [id]);

        res.json({
            ...emp[0],
            personal: personal[0] || {},
            address: address[0] || {},
            bank: bank[0] || {},
            statutory: statutory[0] || {},
            emergency: emergency[0] || {},
            education: education || [],
            experience: experience || []
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new employee (Enterprise Form)
router.post('/employees', async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const data = req.body;
        
        // 1. Core Employee
        const [empResult] = await connection.query(
            `INSERT INTO employees (
                employee_number, first_name, middle_name, last_name, gender, dob, 
                joining_date, dept_id, category_id, designation_id, employment_type, 
                work_email, mobile_primary, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.employee_number, data.first_name, data.middle_name, data.last_name, data.gender, data.dob, 
                data.joining_date, data.dept_id || null, data.category_id || null, data.designation_id || null, 
                data.employment_type || 'FULL_TIME', data.work_email, data.mobile_primary, data.status || 'ACTIVE'
            ]
        );
        const empId = empResult.insertId;

        // 2. Personal Details
        if (data.marital_status || data.religion || data.blood_group || data.national_id_number) {
            await connection.query(
                `INSERT INTO employee_personal_details (emp_id, marital_status, religion, blood_group, national_id_number) 
                 VALUES (?, ?, ?, ?, ?)`,
                [empId, data.marital_status, data.religion, data.blood_group, data.national_id_number]
            );
        }

        // 3. Bank Details
        if (data.bank_name || data.account_number || data.ifsc_code) {
            await connection.query(
                `INSERT INTO employee_bank_details (emp_id, bank_name, branch_name, account_number, ifsc_code, account_holder_name) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [empId, data.bank_name, data.branch_name, data.account_number, data.ifsc_code, data.account_holder_name]
            );
        }

        // 4. Statutory Details (PF, ESI)
        if (data.pf_number || data.esi_number || data.pan_number) {
            await connection.query(
                `INSERT INTO employee_statutory_details (emp_id, pf_number, esi_number, pan_number) 
                 VALUES (?, ?, ?, ?)`,
                [empId, data.pf_number, data.esi_number, data.pan_number]
            );
        }

        // 5. Emergency Contact
        if (data.emergency_name || data.emergency_phone) {
            await connection.query(
                `INSERT INTO employee_emergency_contacts (emp_id, contact_name, relationship, phone_number) 
                 VALUES (?, ?, ?, ?)`,
                [empId, data.emergency_name, data.emergency_relationship, data.emergency_phone]
            );
        }

        // 6. Education
        if (data.degree_name || data.institution) {
            await connection.query(
                `INSERT INTO employee_education (emp_id, degree_name, institution, specialization, year_of_passing, percentage_cgpa)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [empId, data.degree_name, data.institution, data.specialization, data.year_of_passing, data.percentage_cgpa]
            );
        }

        // 7. Experience
        if (data.company_name || data.previous_designation) {
            await connection.query(
                `INSERT INTO employee_experience (emp_id, company_name, designation, from_date, to_date, reason_for_leaving)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [empId, data.company_name, data.previous_designation, data.exp_from_date || null, data.exp_to_date || null, data.reason_for_leaving]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Employee registered successfully', id: empId });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
});

// PUT update employee details
router.put('/employees/:id', async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, dept_id, designation_id, category_id } = req.body;
    try {
        await db.query(
            'UPDATE employees SET first_name = ?, last_name = ?, dept_id = ?, designation_id = ?, category_id = ? WHERE emp_id = ?',
            [first_name, last_name, dept_id, designation_id, category_id, id]
        );
        res.json({ message: 'Employee updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH manage status
router.patch('/employees/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await db.query('UPDATE employees SET status = ? WHERE emp_id = ?', [status, id]);
        res.json({ message: `Status updated to ${status}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- DEPARTMENTS (COST CENTERS) ---

router.get('/departments', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM departments');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/departments', async (req, res) => {
    const { dept_code, dept_name, company_context, cost_center_code } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO departments (dept_code, dept_name, company_context, cost_center_code) VALUES (?, ?, ?, ?)',
            [dept_code, dept_name, company_context, cost_center_code]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- DESIGNATIONS ---

router.get('/designations', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM designations');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/designations', async (req, res) => {
    const { designation_name, grade_level } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO designations (designation_name, grade_level) VALUES (?, ?)',
            [designation_name, grade_level]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- SALARY MASTERS ---

router.get('/salary-masters', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM salary_master');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/salary-masters', async (req, res) => {
    const { grade_name, base_salary, hra, conveyance_allowance, medical_allowance, special_allowance } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO salary_master (grade_name, base_salary, hra, conveyance_allowance, medical_allowance, special_allowance) VALUES (?, ?, ?, ?, ?, ?)',
            [grade_name, base_salary, hra, conveyance_allowance, medical_allowance || 0, special_allowance || 0]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- CATEGORIES ---

router.get('/categories', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM employee_categories');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
