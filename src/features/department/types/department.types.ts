// src/features/departments/types/department.types.ts
export interface Department {
    departmentId: number;
    departmentCode: string;
    departmentName: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateDepartmentDto {
    departmentCode: string;
    departmentName: string;
}

export interface UpdateDepartmentDto {
    departmentId: number;
    departmentCode: string;
    departmentName: string;
}