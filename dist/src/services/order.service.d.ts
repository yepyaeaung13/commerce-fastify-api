import { Prisma } from "@prisma/client";
interface PaginationParams {
    skip?: number;
    take?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
}
type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export declare class OrderService {
    findAll(params: PaginationParams): Promise<{
        data: {
            id: string;
            address: Prisma.JsonValue;
            status: import(".prisma/client").$Enums.OrderStatus;
            createdAt: Date;
            updatedAt: Date;
            totalAmount: Prisma.Decimal;
            userId: string;
        }[];
        total: number;
    }>;
    findById(id: string): Promise<{
        id: string;
        address: Prisma.JsonValue;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: Prisma.Decimal;
        userId: string;
    } | null>;
    findByUserId(userId: string, params: PaginationParams): Promise<{
        data: {
            id: string;
            address: Prisma.JsonValue;
            status: import(".prisma/client").$Enums.OrderStatus;
            createdAt: Date;
            updatedAt: Date;
            totalAmount: Prisma.Decimal;
            userId: string;
        }[];
        total: number;
    }>;
    create(userId: string, data: any): Promise<{
        id: string;
        address: Prisma.JsonValue;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: Prisma.Decimal;
        userId: string;
    }>;
    update(id: string, data: Prisma.OrderUpdateInput): Promise<{
        id: string;
        address: Prisma.JsonValue;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: Prisma.Decimal;
        userId: string;
    }>;
    updateStatus(id: string, status: OrderStatus): Promise<{
        id: string;
        address: Prisma.JsonValue;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: Prisma.Decimal;
        userId: string;
    }>;
    delete(id: string): Promise<{
        id: string;
        address: Prisma.JsonValue;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: Prisma.Decimal;
        userId: string;
    }>;
}
export {};
