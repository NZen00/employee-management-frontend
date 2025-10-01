// src/features/departments/components/DepartmentFormModal.tsx
import { useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Department, CreateDepartmentDto } from '../types/department.types';
import './DepartmentFormModal.scss';

interface FormData {
    departmentId?: number;
    departmentCode: string;
    departmentName: string;
}

interface DepartmentFormModalProps {
    show: boolean;
    onHide: () => void;
    onSubmit: (data: CreateDepartmentDto) => Promise<void>;
    department: Department | null;
    loading: boolean;
}

const schema = yup.object().shape({
    departmentCode: yup
        .string()
        .required('Department code is required')
        .min(2, 'Code must be at least 2 characters')
        .max(10, 'Code must not exceed 10 characters')
        .matches(/^[A-Z0-9]+$/, 'Code must contain only uppercase letters and numbers')
        .trim(),
    departmentName: yup
        .string()
        .required('Department name is required')
        .min(3, 'Name must be at least 3 characters')
        .max(100, 'Name must not exceed 100 characters')
        .trim(),
});

const DepartmentFormModal = ({
                                 show,
                                 onHide,
                                 onSubmit,
                                 department,
                                 loading,
                             }: DepartmentFormModalProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<FormData>({ // Change from CreateDepartmentDto
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (department) {
            setValue('departmentId', department.departmentId);
            setValue('departmentCode', department.departmentCode);
            setValue('departmentName', department.departmentName);
        } else {
            reset();
        }
    }, [department, setValue, reset]);

    const handleFormSubmit = async (data: CreateDepartmentDto) => {
        await onSubmit(data);
    };

    const handleClose = () => {
        reset();
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} centered className="department-modal">
            <Modal.Header closeButton>
                <Modal.Title>
                    {department ? 'Edit Department' : 'Add New Department'}
                </Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit(handleFormSubmit)}>
                <Modal.Body>
                    {department && (
                        <input type="hidden" value={department.departmentId} {...register('departmentId')} />
                    )}
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Department Code <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="e.g., IT, HR, FIN"
                            {...register('departmentCode')}
                            isInvalid={!!errors.departmentCode}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.departmentCode?.message}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                            Use uppercase letters and numbers only (2-10 characters)
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            Department Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="e.g., Information Technology"
                            {...register('departmentName')}
                            isInvalid={!!errors.departmentName}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.departmentName?.message}
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
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    className="me-2"
                                />
                                Saving...
                            </>
                        ) : (
                            <>{department ? 'Update' : 'Create'} Department</>
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default DepartmentFormModal;