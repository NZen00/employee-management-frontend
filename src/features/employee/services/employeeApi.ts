import apiClient from '../../../app/api/apiClient';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto, PagedResult } from '../types/employee.types';

const EMPLOYEE_ENDPOINT = '/employees';

export const employeeApi = {
    getAll: async (): Promise<Employee[]> => {
        const response = await apiClient.get<Employee[]>(EMPLOYEE_ENDPOINT);
        return response.data;
    },

    getPaged: async (page: number, pageSize: number): Promise<PagedResult<Employee>> => {
        const response = await apiClient.get<PagedResult<Employee>>(
            `${EMPLOYEE_ENDPOINT}/paged`,
            { params: { page, pageSize } }
        );
        return response.data;
    },

    getById: async (id: number): Promise<Employee> => {
        const response = await apiClient.get<Employee>(`${EMPLOYEE_ENDPOINT}/${id}`);
        return response.data;
    },

    create: async (employee: CreateEmployeeDto): Promise<Employee> => {
        const response = await apiClient.post<Employee>(EMPLOYEE_ENDPOINT, employee);
        return response.data;
    },

    update: async (id: number, employee: UpdateEmployeeDto): Promise<void> => {
        await apiClient.put(`${EMPLOYEE_ENDPOINT}/${id}`, employee);
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`${EMPLOYEE_ENDPOINT}/${id}`);
    },
};

export default employeeApi;