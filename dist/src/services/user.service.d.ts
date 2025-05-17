import { Prisma } from '@prisma/client';
import type { User, PaginationParams } from '../types';
export declare class UserService {
    findAll(params: PaginationParams): Promise<{
        data: {
            id: string;
            name: string;
            email: string;
            password: string;
            age: number;
            phoneNumber: string | null;
            address: Prisma.JsonValue | null;
            preferences: Prisma.JsonValue | null;
            role: import(".prisma/client").$Enums.UserRole;
            status: import(".prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
    }>;
    findById(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        password: string;
        age: number;
        phoneNumber: string | null;
        address: Prisma.JsonValue | null;
        preferences: Prisma.JsonValue | null;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findByEmail(email: string): Promise<{
        id: string;
        name: string;
        email: string;
        password: string;
        age: number;
        phoneNumber: string | null;
        address: Prisma.JsonValue | null;
        preferences: Prisma.JsonValue | null;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    create(data: Partial<User>): Promise<{
        id: string;
        name: string;
        email: string;
        password: string;
        age: number;
        phoneNumber: string | null;
        address: Prisma.JsonValue | null;
        preferences: Prisma.JsonValue | null;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: Prisma.UserUpdateInput): Promise<{
        id: string;
        name: string;
        email: string;
        password: string;
        age: number;
        phoneNumber: string | null;
        address: Prisma.JsonValue | null;
        preferences: Prisma.JsonValue | null;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        password: string;
        age: number;
        phoneNumber: string | null;
        address: Prisma.JsonValue | null;
        preferences: Prisma.JsonValue | null;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
