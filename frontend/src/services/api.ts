import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/hr';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const mastersApi = {
    // Employees
    getEmployees: () => api.get('/masters/employees'),
    createEmployee: (data: any) => api.post('/masters/employees', data),
    updateEmployee: (id: number, data: any) => api.put(`/masters/employees/${id}`, data),
    updateStatus: (id: number, status: string) => api.patch(`/masters/employees/${id}/status`, { status }),
    
    // Departments / Cost Centers
    getDepartments: () => api.get('/masters/departments'),
    createDepartment: (data: any) => api.post('/masters/departments', data),
    
    // Designations
    getDesignations: () => api.get('/masters/designations'),
    createDesignation: (data: any) => api.post('/masters/designations', data),
    
    // Categories
    getCategories: () => api.get('/masters/categories'),
    
    // Salary Masters
    getSalaryMasters: () => api.get('/masters/salary-masters'),
    createSalaryMaster: (data: any) => api.post('/masters/salary-masters', data),
};

export const tasksApi = {
    processPayroll: (month: number, year: number) => api.post('/tasks/process-payroll', { month, year }),
    markAttendance: (data: any) => api.post('/tasks/attendance/mark', data),
    getLeaveRequests: () => api.get('/tasks/leave/requests'),
    getLeaveTypes: () => api.get('/tasks/leave/types'),
    submitLeave: (data: any) => api.post('/tasks/leave/request', data),
    updateLeaveStatus: (id: number, status: string, approved_by: number) => 
        api.patch(`/tasks/leave/status/${id}`, { status, approved_by }),
    
    // Generic attendance retrieval
    getAttendanceLogs: (month: number, year: number) => api.get('/tasks/attendance/logs', { params: { month, year } }),
};

export const reportsApi = {
    getSalaryLedger: (month: number, year: number) => api.get('/reports/salary-ledger', { params: { month, year } }),
    getEmployeeSlips: (empId: number) => api.get(`/reports/employee-slips/${empId}`),
};

export default api;
