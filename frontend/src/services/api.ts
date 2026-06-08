import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/hr';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const mastersApi = {
    getEmployees: () => api.get('/masters/employees'),
    createEmployee: (data: any) => api.post('/masters/employees', data),
    getDepartments: () => api.get('/masters/departments'),
    getDesignations: () => api.get('/masters/designations'),
    getCategories: () => api.get('/masters/categories'),
};

export const tasksApi = {
    processPayroll: (month: number, year: number) => api.post('/tasks/process-payroll', { month, year }),
};

export const reportsApi = {
    getSalaryLedger: (month: number, year: number) => api.get('/reports/salary-ledger', { params: { month, year } }),
};

export default api;
