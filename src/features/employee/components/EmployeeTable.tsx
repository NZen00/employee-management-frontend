// src/features/employees/components/EmployeeTable.tsx
import { useState } from 'react';
import { Table, Button, Pagination, Badge } from 'react-bootstrap';
import { Pencil, Trash2, Mail } from 'lucide-react';
import { Employee } from '../types/employee.types';
import { formatDate } from '../../../shared/utils/dateUtils';
import './EmployeeTable.scss';

interface EmployeeTableProps {
    employees: Employee[];
    onEdit: (employee: Employee) => void;
    onDelete: (id: number) => void;
}

const EmployeeTable = ({ employees, onEdit, onDelete }: EmployeeTableProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentItems = employees.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(employees.length / pageSize);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    const getPaginationItems = () => {
        const items = [];
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <Pagination.Item
                    key={i}
                    active={i === currentPage}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </Pagination.Item>
            );
        }

        return items;
    };

    return (
        <div className="employee-table-wrapper">
            <div className="table-responsive">
                <Table hover className="employee-table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Age</th>
                        <th>Salary</th>
                        <th>Last Modified</th>
                        <th className="text-end">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentItems.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="text-center py-5 text-muted">
                                No employees found. Add your first employee!
                            </td>
                        </tr>
                    ) : (
                        currentItems.map((employee) => (
                            <tr key={employee.employeeId}>
                                <td>
                                    <div className="employee-name">
                                        <strong>{employee.firstName} {employee.lastName}</strong>
                                    </div>
                                </td>
                                <td>
                                    <div className="employee-email">
                                        <Mail size={14} className="me-1" />
                                        {employee.email}
                                    </div>
                                </td>
                                <td>
                                    <Badge bg="info" className="dept-badge">
                                        {employee.department?.departmentName || 'N/A'}
                                    </Badge>
                                </td>
                                <td>
                                    <span className="age-badge">{employee.age} yrs</span>
                                </td>
                                <td>
                                    <span className="salary">${employee.salary.toLocaleString()}</span>
                                </td>
                                <td>
                    <span className="text-muted">
                      {employee.updatedAt
                          ? formatDate(employee.updatedAt)
                          : formatDate(employee.createdAt || '')}
                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEdit(employee);
                                            }}
                                            title="Edit"
                                        >
                                            <Pencil size={16} />
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(employee.employeeId);
                                            }}
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </Table>
            </div>

            {employees.length > 0 && (
                <div className="table-footer">
                    <div className="page-size-selector">
                        <span className="me-2">Show</span>
                        <select
                            className="form-select form-select-sm"
                            value={pageSize}
                            onChange={handlePageSizeChange}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        <span className="ms-2">entries</span>
                    </div>

                    <div className="pagination-info">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, employees.length)} of{' '}
                        {employees.length} entries
                    </div>

                    <Pagination className="mb-0">
                        <Pagination.First
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                        />
                        <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        />
                        {getPaginationItems()}
                        <Pagination.Next
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        />
                        <Pagination.Last
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                </div>
            )}
        </div>
    );
};

export default EmployeeTable;