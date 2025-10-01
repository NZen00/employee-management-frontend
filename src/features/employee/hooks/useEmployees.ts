import { useState, useEffect } from 'react';
import employeeApi from '../services/employeeApi';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '../types/employee.types';
import { useToast } from '../../../shared/hooks/useToast';

export const useEmployees = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();

    const fetchEmployees = async (page: number = 1, size: number = 10) => {
        try {
            setLoading(true);
            setError(null);
            const data = await employeeApi.getPaged(page, size);
            setEmployees(data.items);
            setTotalCount(data.totalCount);
            setCurrentPage(page);
            setPageSize(size);
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Failed to fetch employees';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const createEmployee = async (employee: CreateEmployeeDto): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            const newEmployee = await employeeApi.create(employee);
            setEmployees((prev) => [...prev, newEmployee]);
            toast.success('Employee created successfully!');
            return true;
        } catch (err: any) {
            let errorMsg = 'Failed to create employee';

            // Handle different error response formats
            if (err.response?.data) {
                const errorData = err.response.data;

                if (errorData['']) {
                    errorMsg = Array.isArray(errorData['']) ? errorData[''][0] : errorData[''];
                }

                else if (errorData.errors) {
                    const errorMessages = Object.values(errorData.errors).flat().join(', ');
                    errorMsg = errorMessages;
                }

                else if (errorData.Email) {
                    errorMsg = Array.isArray(errorData.Email) ? errorData.Email[0] : errorData.Email;
                }

                else if (errorData.message) {
                    errorMsg = errorData.message;
                }
            }

            toast.error(errorMsg);
            setError(errorMsg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateEmployee = async (id: number, employee: UpdateEmployeeDto): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            await employeeApi.update(id, employee);
            setEmployees((prev) =>
                prev.map((emp) =>
                    emp.employeeId === id ? { ...emp, ...employee } : emp
                )
            );
            toast.success('Employee updated successfully!');
            return true;
        } catch (err: any) {
            let errorMsg = 'Failed to update employee';

            // Handle different error response formats
            if (err.response?.data) {
                const errorData = err.response.data;

                if (errorData['']) {
                    errorMsg = Array.isArray(errorData['']) ? errorData[''][0] : errorData[''];
                }

                else if (errorData.errors) {
                    const errorMessages = Object.values(errorData.errors).flat().join(', ');
                    errorMsg = errorMessages;
                }

                else if (errorData.Email) {
                    errorMsg = Array.isArray(errorData.Email) ? errorData.Email[0] : errorData.Email;
                }

                else if (errorData.message) {
                    errorMsg = errorData.message;
                }
            }

            toast.error(errorMsg);
            setError(errorMsg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteEmployee = async (id: number): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            await employeeApi.delete(id);
            setEmployees((prev) => prev.filter((emp) => emp.employeeId !== id));
            toast.success('Employee deleted successfully!');
            return true;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Failed to delete employee';
            setError(errorMsg);
            toast.error(errorMsg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees(currentPage, pageSize);
    }, []);

    return {
        employees,
        totalCount,
        currentPage,
        pageSize,
        loading,
        error,
        fetchEmployees,
        createEmployee,
        updateEmployee,
        deleteEmployee,
    };
};

export default useEmployees;