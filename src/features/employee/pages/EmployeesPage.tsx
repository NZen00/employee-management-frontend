import { useState } from 'react';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { Plus } from 'lucide-react';
import EmployeeTable from '../components/EmployeeTable';
import EmployeeFormModal from '../components/EmployeeFormModal';
import { useEmployees } from '../hooks/useEmployees';
import { Employee, UpdateEmployeeDto } from '../types/employee.types';
import './EmployeesPage.scss';

const EmployeesPage = () => {
    const {
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
    } = useEmployees();
    const [showModal, setShowModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

    const handlePageChange = (page: number, size: number) => {
        fetchEmployees(page, size);
    };

    const handleAdd = () => {
        setEditingEmployee(null);
        setShowModal(true);
    };

    const handleEdit = (employee: Employee) => {
        setEditingEmployee(employee);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingEmployee(null);
    };

    const handleDelete = async (id: number) => {
        if (!id || id === 0) return;

        if (window.confirm('Are you sure you want to delete this employee?')) {
            const success = await deleteEmployee(id);
            if (success) {
                await fetchEmployees(currentPage, pageSize);
            }
        }
    };

    const handleSubmit = async (data: any) => {
        let success = false;

        if (editingEmployee && editingEmployee.employeeId) {
            const updateData: UpdateEmployeeDto = {
                employeeId: editingEmployee.employeeId,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                dateOfBirth: data.dateOfBirth,
                salary: Number(data.salary),
                departmentId: Number(data.departmentId),
            };
            success = await updateEmployee(editingEmployee.employeeId, updateData);
        } else {
            success = await createEmployee({
                ...data,
                salary: Number(data.salary),
                departmentId: Number(data.departmentId),
            });
        }

        if (success) {
            handleCloseModal();
            await fetchEmployees(currentPage, pageSize);
        }
    };

    return (
        <Container fluid className="employees-page">
            <Row className="mb-4">
                <Col>
                    <div className="page-header">
                        <div>
                            <h2 className="page-title">Employees</h2>
                            <p className="page-subtitle">Manage your organization's employees</p>
                        </div>
                        <Button variant="primary" className="add-btn" onClick={handleAdd}>
                            <Plus size={20} />
                            New Employee
                        </Button>
                    </div>
                </Col>
            </Row>

            {error && (
                <Row className="mb-3">
                    <Col>
                        <Alert variant="danger" dismissible>
                            {error}
                        </Alert>
                    </Col>
                </Row>
            )}

            <Row>
                <Col>
                    <div className="table-card">
                        {loading && employees.length === 0 ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-3 text-muted">Loading employees...</p>
                            </div>
                        ) : (
                            <EmployeeTable
                                employees={employees}
                                totalCount={totalCount}
                                currentPage={currentPage}
                                pageSize={pageSize}
                                onPageChange={handlePageChange}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        )}
                    </div>
                </Col>
            </Row>

            <EmployeeFormModal
                show={showModal}
                onHide={handleCloseModal}
                onSubmit={handleSubmit}
                employee={editingEmployee}
                loading={loading}
            />
        </Container>
    );
};

export default EmployeesPage;