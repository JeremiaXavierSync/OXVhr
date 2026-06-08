const express = require('express');
const router = express.Router();
const db = require('../db');

// Execute Monthly Payroll
router.post('/process-payroll', async (req, res) => {
    const { month, year } = req.body;
    
    if (!month || !year) {
        return res.status(400).json({ error: 'Month and Year are required' });
    }

    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();

        // 1. Create a payroll run record
        const [runResult] = await connection.query(
            'INSERT INTO payroll_runs (payroll_month, payroll_year, status) VALUES (?, ?, ?)',
            [month, year, 'PROCESSED']
        );
        const runId = runResult.insertId;

        // 2. Fetch all active employees with their salary structure (via designation/grade)
        const [employees] = await connection.query(`
            SELECT e.emp_id, e.employee_number, sm.base_salary, sm.hra, sm.conveyance_allowance, sm.medical_allowance
            FROM employees e
            JOIN designations d ON e.designation_id = d.designation_id
            JOIN salary_master sm ON d.grade_level = sm.grade_name
            WHERE e.status = 'ACTIVE'
        `);

        // 3. Process each employee
        for (const emp of employees) {
            // Fetch attendance for this employee and period (Simplified: count 'PRESENT' days)
            const [attendance] = await connection.query(
                'SELECT COUNT(*) as days_present FROM attendance_logs WHERE emp_id = ? AND MONTH(log_date) = ? AND YEAR(log_date) = ? AND status = "PRESENT"',
                [emp.emp_id, month, year]
            );

            const daysPresent = attendance[0].days_present || 22; // Default to 22 if no logs (for demo)
            const totalDays = 30; // Simplified
            
            // Calculate pro-rated salary
            const proRatedBase = (emp.base_salary / totalDays) * daysPresent;
            const proRatedHra = (emp.hra / totalDays) * daysPresent;
            const proRatedConv = (emp.conveyance_allowance / totalDays) * daysPresent;
            
            const grossPay = proRatedBase + proRatedHra + proRatedConv;
            const pfDeduction = proRatedBase * 0.12; // 12% PF
            const netPay = grossPay - pfDeduction;

            await connection.query(
                `INSERT INTO employee_salary_slips (
                    run_id, emp_id, basic_pay, hra, conveyance, net_pay, pf_deduction
                ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [runId, emp.emp_id, proRatedBase, proRatedHra, proRatedConv, netPay, pfDeduction]
            );
        }

        await connection.commit();
        res.json({ message: 'Payroll processed successfully', run_id: runId, count: employees.length });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: 'Payroll processing failed: ' + err.message });
    } finally {
        connection.release();
    }
});

// --- ATTENDANCE ---

// Mark daily attendance
router.post('/attendance/mark', async (req, res) => {
    const { emp_id, log_date, status, clock_in, clock_out } = req.body;
    try {
        const [result] = await db.query(
            `INSERT INTO attendance_logs (emp_id, log_date, status, clock_in, clock_out) 
             VALUES (?, ?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE status = VALUES(status), clock_in = VALUES(clock_in), clock_out = VALUES(clock_out)`,
            [emp_id, log_date || new Date(), status || 'PRESENT', clock_in, clock_out]
        );
        res.json({ message: 'Attendance marked successfully', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- LEAVE MANAGEMENT ---

// Submit leave request
router.post('/leave/request', async (req, res) => {
    const { emp_id, leave_type_id, start_date, end_date, reason } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO leave_registry (emp_id, leave_type_id, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?, ?)',
            [emp_id, leave_type_id, start_date, end_date, reason, 'PENDING']
        );
        res.json({ message: 'Leave request submitted', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Approve/Reject leave
router.patch('/leave/status/:id', async (req, res) => {
    const { status, approved_by } = req.body; // status: 'APPROVED' or 'REJECTED'
    const { id } = req.params;
    try {
        await db.query(
            'UPDATE leave_registry SET status = ?, approved_by = ? WHERE leave_id = ?',
            [status, approved_by, id]
        );
        res.json({ message: `Leave ${status.toLowerCase()} successfully` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
