import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/hr';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const mastersApi = {
    getEmployees: () => api.get('/masters/employees'),
    createEmployee: (data: any) => api.post('/masters/employees', data),
    updateEmployee: (id: number, data: any) => api.put(`/masters/employees/${id}`, data),
    updateStatus: (id: number, status: string) => api.patch(`/masters/employees/${id}/status`, { status }),
    getDepartments: () => api.get('/masters/departments'),
    getDesignations: () => api.get('/masters/designations'),
    getCategories: () => api.get('/masters/categories'),
};

export const tasksApi = {
    processPayroll: (month: number, year: number) => api.post('/tasks/process-payroll', { month, year }),
    markAttendance: (data: any) => api.post('/tasks/attendance/mark', data),
    submitLeave: (data: any) => api.post('/tasks/leave/request', data),
    updateLeaveStatus: (id: number, status: string, approved_by: number) => 
        api.patch(`/tasks/leave/status/${id}`, { status, approved_by }),
};

export const reportsApi = {
    getSalaryLedger: (month: number, year: number) => api.get('/reports/salary-ledger', { params: { month, year } }),
    getEmployeeSlips: (empId: number) => api.get(`/reports/employee-slips/${empId}`),
};

export default api;
