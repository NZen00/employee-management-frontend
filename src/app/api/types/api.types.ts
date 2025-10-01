export interface ApiResponse<T> {
    data: T;
    message?: string;
    success?: boolean;
}

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
    statusCode?: number;
}

export interface ValidationError {
    field: string;
    message: string;
}