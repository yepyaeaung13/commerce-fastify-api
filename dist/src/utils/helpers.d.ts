import { PaginationParams, ApiResponse } from '../types';
export declare const hashPassword: (password: string) => Promise<string>;
export declare const comparePasswords: (password: string, hashedPassword: string) => Promise<boolean>;
export declare const createPagination: (params: PaginationParams) => {
    skip: number;
    take: number;
    page: number;
};
export declare const formatResponse: <T>(data: T, error?: string, meta?: ApiResponse<T>["meta"]) => ApiResponse<T>;
export declare const sanitizeUser: (user: any) => any;
