const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all employees
router.get('/employees', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT e.*, d.dept_name, c.category_name 
            FROM employees e
            LEFT JOIN departments d ON e.dept_id = d.dept_id
            LEFT JOIN employee_categories c ON e.category_id = c.category_id
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new employee
router.post('/employees', async (req, res) => {
    const { employee_number, first_name, last_name, dept_id, category_id, status } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO employees (employee_number, first_name, last_name, dept_id, category_id, status) VALUES (?, ?, ?, ?, ?, ?)',
            [employee_number, first_name, last_name, dept_id, category_id, status || 'ACTIVE']
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
