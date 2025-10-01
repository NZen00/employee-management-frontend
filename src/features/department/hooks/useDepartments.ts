// src/features/departments/hooks/useDepartments.ts
import { useState, useEffect } from 'react';
import departmentApi from '../services/departmentApi';
import { Department, CreateDepartmentDto, UpdateDepartmentDto } from '../types/department.types';
import { useToast } from '../../../shared/hooks/useToast';

export const useDepartments = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await departmentApi.getAll();
            setDepartments(data);
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Failed to fetch departments';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const createDepartment = async (department: CreateDepartmentDto): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            const newDept = await departmentApi.create(department);
            setDepartments((prev) => [...prev, newDept]);
            toast.success('Department created successfully!');
            return true;
        } catch (err: any) {
            // Handle validation errors from backend
            if (err.response?.data?.errors) {
                const errors = err.response.data.errors;
                const errorMessages = Object.values(errors).flat().join(', ');
                toast.error(errorMessages);
                setError(errorMessages);
            } else if (err.response?.data?.DepartmentCode) {
                // Handle specific format: {"DepartmentCode":["error msg"]}
                const errorMsg = err.response.data.DepartmentCode[0];
                toast.error(errorMsg);
                setError(errorMsg);
            } else {
                const errorMsg = err.response?.data?.message || 'Failed to create department';
                toast.error(errorMsg);
                setError(errorMsg);
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateDepartment = async (id: number, department: UpdateDepartmentDto): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            await departmentApi.update(id, department);
            setDepartments((prev) =>
                prev.map((dept) =>
                    dept.departmentId === id ? { ...dept, ...department } : dept
                )
            );
            toast.success('Department updated successfully!');
            return true;
        } catch (err: any) {
            // Handle validation errors from backend - SAME LOGIC AS createDepartment
            if (err.response?.data?.errors) {
                const errors = err.response.data.errors;
                const errorMessages = Object.values(errors).flat().join(', ');
                toast.error(errorMessages);
                setError(errorMessages);
            } else if (err.response?.data?.DepartmentCode) {
                // Handle specific format: {"DepartmentCode":["error msg"]}
                const errorMsg = err.response.data.DepartmentCode[0];
                toast.error(errorMsg);
                setError(errorMsg);
            } else if (err.response?.data?.message) {
                // Handle format: {message: "error message"}
                const errorMsg = err.response.data.message;
                toast.error(errorMsg);
                setError(errorMsg);
            } else {
                const errorMsg = 'Failed to update department';
                toast.error(errorMsg);
                setError(errorMsg);
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteDepartment = async (id: number): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            await departmentApi.delete(id);
            setDepartments((prev) => prev.filter((dept) => dept.departmentId !== id));
            toast.success('Department deleted successfully!');
            return true;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Failed to delete department';
            setError(errorMsg);
            toast.error(errorMsg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    return {
        departments,
        loading,
        error,
        fetchDepartments,
        createDepartment,
        updateDepartment,
        deleteDepartment,
    };
};

export default useDepartments;