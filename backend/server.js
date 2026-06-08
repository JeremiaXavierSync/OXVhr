const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const masterRoutes = require('./routes/masters');
const taskRoutes = require('./routes/tasks');
const reportRoutes = require('./routes/reports');

app.use('/api/hr/masters', masterRoutes);
app.use('/api/hr/tasks', taskRoutes);
app.use('/api/hr/reports', reportRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'UP', module: 'HR & Payroll', system: 'KSRTC ERP' });
});

app.listen(PORT, () => {
    console.log(`[HR & PAYROLL] Backend Engine running on port ${PORT}`);
});
