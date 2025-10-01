// src/features/employees/components/EmployeeFormModal.tsx
import { useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Employee, CreateEmployeeDto } from '../types/employee.types';
import { Department } from '../../department/types/department.types';
import './EmployeeFormModal.scss';
import { useDepartmentsLazy } from '../../department/hooks/useDepartmentsLazy';

interface EmployeeFormModalProps {
    show: boolean;
    onHide: () => void;
    onSubmit: (data: CreateEmployeeDto) => Promise<void>;
    employee: Employee | null;
    loading: boolean;
}

const schema = yup.object().shape({
    firstName: yup
        .string()
        .required('First name is required')
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must not exceed 50 characters')
        .matches(/^[a-zA-Z\s]+$/, 'First name can only contain letters')
        .trim(),
    lastName: yup
        .string()
        .required('Last name is required')
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must not exceed 50 characters')
        .matches(/^[a-zA-Z\s]+$/, 'Last name can only contain letters')
        .trim(),
    email: yup
        .string()
        .required('Email is required')
        .email('Invalid email format')
        .max(100, 'Email must not exceed 100 characters')
        .trim(),
    dateOfBirth: yup
        .string()
        .required('Date of birth is required')
        .test('age', 'Employee must be at least 18 years old', function(value) {
            if (!value) return false;
            const birthDate = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                return age - 1 >= 18;
            }
            return age >= 18;
        }),
    salary: yup
        .number()
        .required('Salary is required')
        .positive('Salary must be positive')
        .min(0.01, 'Salary must be at least 0.01')
        .max(999999999.99, 'Salary is too large')
        .typeError('Salary must be a number'),
    departmentId: yup
        .number()
        .required('Department is required')
        .positive('Please select a department')
        .typeError('Please select a department'),
});

const EmployeeFormModal = ({
                               show,
                               onHide,
                               onSubmit,
                               employee,
                               loading,
                           }: EmployeeFormModalProps) => {

    const { departments, loading: departmentsLoading, error: departmentsError, fetchDepartments } = useDepartmentsLazy();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<CreateEmployeeDto>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (employee) {
            setValue('firstName', employee.firstName);
            setValue('lastName', employee.lastName);
            setValue('email', employee.email);
            setValue('dateOfBirth', employee.dateOfBirth.split('T')[0]);
            setValue('salary', employee.salary);
            setValue('departmentId', employee.departmentId);
        } else {
            reset();
        }
    }, [employee, setValue, reset]);

    useEffect(() => {
        if (show && departments.length === 0) {
            fetchDepartments(); // Call fetchDepartments from your hook
        }
    }, [show, departments.length, fetchDepartments]);

    const handleFormSubmit = async (data: CreateEmployeeDto) => {
        await onSubmit(data);
    };

    const handleClose = () => {
        reset();
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg" className="employee-modal">
            <Modal.Header closeButton>
                <Modal.Title>
                    {employee ? 'Edit Employee' : 'Add New Employee'}
                </Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit(handleFormSubmit)}>
                <Modal.Body>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    First Name <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter first name"
                                    {...register('firstName')}
                                    isInvalid={!!errors.firstName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.firstName?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Last Name <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter last name"
                                    {...register('lastName')}
                                    isInvalid={!!errors.lastName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.lastName?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            Email Address <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="employee@example.com"
                            {...register('email')}
                            isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Date of Birth <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="date"
                                    {...register('dateOfBirth')}
                                    isInvalid={!!errors.dateOfBirth}
                                    max={new Date().toISOString().split('T')[0]}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.dateOfBirth?.message}
                                </Form.Control.Feedback>
                                <Form.Text className="text-muted">
                                    Must be at least 18 years old
                                </Form.Text>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Salary <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...register('salary')}
                                    isInvalid={!!errors.salary}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.salary?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            Department <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                            {...register('departmentId')}
                            isInvalid={!!errors.departmentId}
                        >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept.departmentId} value={dept.departmentId}>
                                    {dept.departmentName} ({dept.departmentCode})
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.departmentId?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" className="me-2" />
                                Saving...
                            </>
                        ) : (
                            <>{employee ? 'Update' : 'Create'} Employee</>
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default EmployeeFormModal;