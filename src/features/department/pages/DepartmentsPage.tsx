// src/features/departments/pages/DepartmentsPage.tsx
import { useState } from 'react';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { Plus } from 'lucide-react';
import DepartmentTable from '../components/DepartmentTable';
import DepartmentFormModal from '../components/DepartmentFormModal';
import { useDepartments } from '../hooks/useDepartments';
import {Department, UpdateDepartmentDto} from '../types/department.types';
import './DepartmentsPage.scss';

const DepartmentsPage = () => {
    const { departments, loading, error, createDepartment, updateDepartment, deleteDepartment, fetchDepartments } = useDepartments();
    const [showModal, setShowModal] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

    const handleAdd = () => {
        setEditingDepartment(null);
        setShowModal(true);
    };

    const handleEdit = (department: Department) => {
        setEditingDepartment(department);
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {

        if (window.confirm('Are you sure you want to delete this department?')) {
            const success = await deleteDepartment(id);
            if (success) {
                await fetchDepartments();
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingDepartment(null);
    };

    const handleSubmit = async (data: any) => {
        let success = false;

        if (editingDepartment && editingDepartment.departmentId) {
            const updateData: UpdateDepartmentDto = {
                departmentId: editingDepartment.departmentId,
                departmentCode: data.departmentCode,
                departmentName: data.departmentName,
            };
            success = await updateDepartment(editingDepartment.departmentId, updateData);
        } else {
            success = await createDepartment(data);
        }

        if (success) {
            handleCloseModal();
            await fetchDepartments();
        }
    };

    return (
        <Container fluid className="departments-page">
            <Row className="mb-4">
                <Col>
                    <div className="page-header">
                        <div>
                            <h2 className="page-title">Departments</h2>
                            <p className="page-subtitle">Manage your organization's departments</p>
                        </div>
                        <Button variant="primary" className="add-btn" onClick={handleAdd}>
                            <Plus size={20} />
                            New Department
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
                        {loading && departments.length === 0 ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-3 text-muted">Loading departments...</p>
                            </div>
                        ) : (
                            <DepartmentTable
                                departments={departments}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        )}
                    </div>
                </Col>
            </Row>

            <DepartmentFormModal
                show={showModal}
                onHide={handleCloseModal}
                onSubmit={handleSubmit}
                department={editingDepartment}
                loading={loading}
            />
        </Container>
    );
};

export default DepartmentsPage;