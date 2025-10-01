// src/features/employees/types/employee.types.ts
export interface Employee {
    employeeId: number;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    age: number;
    salary: number;
    departmentId: number;
    createdAt?: string;
    updatedAt?: string;
    department?: {
        departmentId: number;
        departmentCode: string;
        departmentName: string;
    };
}

export interface CreateEmployeeDto {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    salary: number;
    departmentId: number;
}

export interface UpdateEmployeeDto {
    employeeId: number;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    salary: number;
    departmentId: number;
}