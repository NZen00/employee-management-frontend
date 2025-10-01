import { AxiosError } from 'axios';
import { ApiError } from './types/api.types';

export const handleApiError = (error: unknown): string => {
    if (error instanceof AxiosError) {
        const apiError = error.response?.data as ApiError;

        if (apiError?.message) {
            return apiError.message;
        }

        if (apiError?.errors) {
            const messages = Object.values(apiError.errors).flat();
            return messages.join(', ');
        }

        if (error.response?.status === 404) {
            return 'Resource not found';
        }

        if (error.response?.status === 500) {
            return 'Server error. Please try again later.';
        }

        return error.message || 'An unexpected error occurred';
    }

    return 'An unexpected error occurred';
};