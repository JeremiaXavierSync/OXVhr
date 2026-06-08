const express = require('express');
const router = express.Router();

// Placeholder for reports
router.get('/salary-ledger', (req, res) => {
    res.json([
        { emp_no: 'KSRTC001', name: 'John Doe', base: 5000, allowances: 1200, deductions: 200, net: 6000 },
        { emp_no: 'KSRTC002', name: 'Jane Smith', base: 5500, allowances: 1300, deductions: 250, net: 6550 }
    ]);
});

module.exports = router;
