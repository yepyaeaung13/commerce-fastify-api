import { Prisma } from '@prisma/client';
import type { Product, PaginationParams } from '../types';
export declare class ProductService {
    findAll(params: PaginationParams): Promise<{
        data: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            price: Prisma.Decimal;
            categoryId: string;
            inStock: boolean;
            quantity: number;
            imageUrl: string | null;
            tags: string | null;
        }[];
        total: number;
    }>;
    findById(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: Prisma.Decimal;
        categoryId: string;
        inStock: boolean;
        quantity: number;
        imageUrl: string | null;
        tags: string | null;
    } | null>;
    findByCategory(categoryId: string, params: PaginationParams): Promise<{
        data: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            price: Prisma.Decimal;
            categoryId: string;
            inStock: boolean;
            quantity: number;
            imageUrl: string | null;
            tags: string | null;
        }[];
        total: number;
    }>;
    create(data: Partial<Product>): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: Prisma.Decimal;
        categoryId: string;
        inStock: boolean;
        quantity: number;
        imageUrl: string | null;
        tags: string | null;
    }>;
    update(id: string, data: Prisma.ProductUpdateInput): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: Prisma.Decimal;
        categoryId: string;
        inStock: boolean;
        quantity: number;
        imageUrl: string | null;
        tags: string | null;
    }>;
    updateStock(id: string, quantity: number): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: Prisma.Decimal;
        categoryId: string;
        inStock: boolean;
        quantity: number;
        imageUrl: string | null;
        tags: string | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: Prisma.Decimal;
        categoryId: string;
        inStock: boolean;
        quantity: number;
        imageUrl: string | null;
        tags: string | null;
    }>;
}
