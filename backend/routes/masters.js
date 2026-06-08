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
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new employee
router.post('/employees', async (req, res) => {
    const { 
        employee_number, first_name, last_name, gender, dob, 
        joining_date, dept_id, category_id, designation_id, status 
    } = req.body;
    try {
        const [result] = await db.query(
            `INSERT INTO employees (
                employee_number, first_name, last_name, gender, dob, 
                joining_date, dept_id, category_id, designation_id, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                employee_number, first_name, last_name, gender, dob, 
                joining_date, dept_id, category_id, designation_id, status || 'ACTIVE'
            ]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- DEPARTMENTS ---

router.get('/departments', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM departments WHERE is_active = TRUE');
        res.json(rows);
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
