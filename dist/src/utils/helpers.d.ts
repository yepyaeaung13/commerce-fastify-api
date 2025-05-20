import { PaginationParams, ApiResponse } from '../types';
export declare const hashPassword: (password: string) => Promise<string>;
export declare const comparePasswords: (password: string, hashedPassword: string) => Promise<boolean>;
export declare const createPagination: (params: PaginationParams) => {
    skip: number;
    take: number;
    page: number;
};
export declare const successResponse: <T>(data: T, message?: string) => ApiResponse<T>;
export declare const successResponseWithMeta: <T>(data: T, meta?: ApiResponse<T>["meta"], message?: string) => ApiResponse<T>;
export declare const errorResponse: <T>(error: string) => ApiResponse<T>;
export declare const sanitizeUser: (user: any) => any;
export declare const generateToken: (user: any, fastify: any) => Promise<string>;
