// src/features/employees/hooks/useEmployees.ts
import { useState, useEffect } from 'react';
import employeeApi from '../services/employeeApi';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '../types/employee.types';
import { useToast } from '../../../shared/hooks/useToast';

export const useEmployees = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await employeeApi.getAll();
            setEmployees(data);
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

                // Format 1: {"":["error message"]}
                if (errorData['']) {
                    errorMsg = Array.isArray(errorData['']) ? errorData[''][0] : errorData[''];
                }
                // Format 2: {errors: {...}}
                else if (errorData.errors) {
                    const errorMessages = Object.values(errorData.errors).flat().join(', ');
                    errorMsg = errorMessages;
                }
                // Format 3: {Email: ["error"]}
                else if (errorData.Email) {
                    errorMsg = Array.isArray(errorData.Email) ? errorData.Email[0] : errorData.Email;
                }
                // Format 4: {message: "error"}
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

                // Format 1: {"":["error message"]}
                if (errorData['']) {
                    errorMsg = Array.isArray(errorData['']) ? errorData[''][0] : errorData[''];
                }
                // Format 2: {errors: {...}}
                else if (errorData.errors) {
                    const errorMessages = Object.values(errorData.errors).flat().join(', ');
                    errorMsg = errorMessages;
                }
                // Format 3: {Email: ["error"]}
                else if (errorData.Email) {
                    errorMsg = Array.isArray(errorData.Email) ? errorData.Email[0] : errorData.Email;
                }
                // Format 4: {message: "error"}
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
        fetchEmployees();
    }, []);

    return {
        employees,
        loading,
        error,
        fetchEmployees,
        createEmployee,
        updateEmployee,
        deleteEmployee,
    };
};

export default useEmployees;