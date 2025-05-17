import { Prisma } from "@prisma/client";
export declare class CartService {
    create(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    findByUserId(userId: string): Promise<({
        items: ({
            product: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            quantity: number;
            cartId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }) | null>;
    addItem(userId: string, productId: string, quantity: number): Promise<{
        product: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        quantity: number;
        cartId: string;
    }>;
    removeItem(userId: string, productId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        quantity: number;
        cartId: string;
    }>;
    clear(userId: string): Promise<Prisma.BatchPayload>;
}
