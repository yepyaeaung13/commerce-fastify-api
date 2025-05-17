import { PaginationParams } from '../types';
export interface IBaseService<T> {
    findAll(params: PaginationParams): Promise<{
        data: T[];
        total: number;
    }>;
    findById(id: string): Promise<T | null>;
    create(data: any): Promise<T>;
    update(id: string, data: any): Promise<T>;
    delete(id: string): Promise<T>;
}
