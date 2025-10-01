import { useState, useCallback } from 'react';
import departmentApi from '../services/departmentApi';
import { Department } from '../types/department.types';
import { useToast } from '../../../shared/hooks/useToast';

export const useDepartmentsLazy = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();

    const fetchDepartments = useCallback(async () => {
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
    }, [toast]);

    return {
        departments,
        loading,
        error,
        fetchDepartments,
    };
};

export default useDepartmentsLazy;