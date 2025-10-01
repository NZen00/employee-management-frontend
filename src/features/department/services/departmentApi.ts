import apiClient from '../../../app/api/apiClient';
import { Department, CreateDepartmentDto, UpdateDepartmentDto } from '../types/department.types';

const DEPARTMENT_ENDPOINT = '/departments';

export const departmentApi = {

    getAll: async (): Promise<Department[]> => {
        const response = await apiClient.get<Department[]>(DEPARTMENT_ENDPOINT);
        return response.data;
    },

    getPaged: async (page: number, pageSize: number): Promise<PagedResult<Department>> => {
        const response = await apiClient.get<PagedResult<Department>>(
            `${DEPARTMENT_ENDPOINT}/paged`,
            { params: { page, pageSize } }
        );
        return response.data;
    },

    getById: async (id: number): Promise<Department> => {
        const response = await apiClient.get<Department>(`${DEPARTMENT_ENDPOINT}/${id}`);
        return response.data;
    },

    create: async (department: CreateDepartmentDto): Promise<Department> => {
        const response = await apiClient.post<Department>(DEPARTMENT_ENDPOINT, department);
        return response.data;
    },

    update: async (id: number, department: UpdateDepartmentDto): Promise<void> => {
        await apiClient.put(`${DEPARTMENT_ENDPOINT}/${id}`, department);
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`${DEPARTMENT_ENDPOINT}/${id}`);
    },

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