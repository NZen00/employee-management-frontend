// src/features/departments/components/DepartmentTable.tsx
import { useState } from 'react';
import { Table, Button, Pagination } from 'react-bootstrap';
import { Pencil, Trash2 } from 'lucide-react';
import { Department } from '../types/department.types';
import { formatDate } from '../../../shared/utils/dateUtils';
import './DepartmentTable.scss';

interface DepartmentTableProps {
    departments: Department[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number, pageSize: number) => void;
    onEdit: (department: Department) => void;
    onDelete: (id: number) => void;
}

const DepartmentTable = ({
                             departments,
                             totalCount,
                             currentPage,
                             pageSize,
                             onPageChange,
                             onEdit,
                             onDelete
                         }: DepartmentTableProps) => {
    const totalPages = Math.ceil(totalCount / pageSize);

    const handlePageChange = (page: number) => {
        onPageChange(page, pageSize);
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = Number(e.target.value);
        onPageChange(1, newSize);
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
                <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
                    {i}
                </Pagination.Item>
            );
        }

        return items;
    };

    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(currentPage * pageSize, totalCount);

    return (
        <div className="department-table-wrapper">
        <div className="table-responsive">
            <Table hover className="department-table">
        <thead>
            <tr>
                <th>Department Code</th>
    <th>Department Name</th>
    <th>Last Modified</th>
    <th className="text-end">Actions</th>
        </tr>
        </thead>
        <tbody>
        {departments.length === 0 ? (
            <tr>
                <td colSpan={4} className="text-center py-5 text-muted">
                    No departments found. Create your first department!
                </td>
            </tr>
        ) : (
            departments.map((department) => (
            <tr key={department.departmentId}>
            <td>
                <span className="dept-code">{department.departmentCode}</span>
            </td>
            <td>
            <span className="dept-name">{department.departmentName}</span>
            </td>
            <td>
            <span className="text-muted">
            {department.updatedAt
                    ? formatDate(department.updatedAt)
                    : formatDate(department.createdAt || '')}
            </span>
            </td>
            <td>
                <div className="action-buttons">
                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('Editing department:', department); // Debug
                            onEdit(department);
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
                            console.log('Deleting department ID:', department.departmentId); // Debug
                            onDelete(department.departmentId);
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

            {totalCount > 0 && (
                <div className="table-footer">
                    <div className="page-size-selector">
                        <span className="me-2">Show</span>
                        <select className="form-select form-select-sm" value={pageSize} onChange={handlePageSizeChange}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        <span className="ms-2">entries</span>
                    </div>

                    <div className="pagination-info">
                        Showing {startIndex} to {endIndex} of {totalCount} entries
                    </div>

                    <Pagination className="mb-0">
                        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                        {getPaginationItems()}
                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                </div>
            )}
    </div>
);
};

export default DepartmentTable;