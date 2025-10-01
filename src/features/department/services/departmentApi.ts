// src/features/departments/services/departmentApi.ts
import apiClient from '../../../app/api/apiClient';
import { Department, CreateDepartmentDto, UpdateDepartmentDto } from '../types/department.types';

const DEPARTMENT_ENDPOINT = '/departments';

export const departmentApi = {
    // Get all departments
    getAll: async (): Promise<Department[]> => {
        const response = await apiClient.get<Department[]>(DEPARTMENT_ENDPOINT);
        return response.data;
    },

    // Get department by ID
    getById: async (id: number): Promise<Department> => {
        const response = await apiClient.get<Department>(`${DEPARTMENT_ENDPOINT}/${id}`);
        return response.data;
    },

    // Create department
    create: async (department: CreateDepartmentDto): Promise<Department> => {
        const response = await apiClient.post<Department>(DEPARTMENT_ENDPOINT, department);
        return response.data;
    },

    // Update department
    update: async (id: number, department: UpdateDepartmentDto): Promise<void> => {
        await apiClient.put(`${DEPARTMENT_ENDPOINT}/${id}`, department);
    },

    // Delete department
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`${DEPARTMENT_ENDPOINT}/${id}`);
    },

    // Check if department code exists (for validation)
    checkCodeExists: async (code: string, excludeId?: number): Promise<boolean> => {
        try {
            const departments = await departmentApi.getAll();
            return departments.some(
                (dept) => dept.departmentCode === code && dept.departmentId !== excludeId
            );
        } catch (error) {
            return false;
        }
    },
};

export default departmentApi;