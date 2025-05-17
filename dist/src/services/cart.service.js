"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CartService {
    async create(userId) {
        return prisma.cart.create({
            data: {
                userId
            }
        });
    }
    async findByUserId(userId) {
        return prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });
    }
    async addItem(userId, productId, quantity) {
        const cart = await this.findByUserId(userId);
        if (!cart)
            throw new Error('Cart not found');
        const existingItem = cart.items.find((item) => item.productId === productId);
        if (existingItem) {
            return prisma.cartItem.update({
                where: {
                    id: existingItem.id
                },
                data: {
                    quantity: existingItem.quantity + quantity
                },
                include: {
                    product: true
                }
            });
        }
        return prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId,
                quantity
            },
            include: {
                product: true
            }
        });
    }
    async removeItem(userId, productId) {
        const cart = await this.findByUserId(userId);
        if (!cart)
            throw new Error('Cart not found');
        const item = cart.items.find((item) => item.productId === productId);
        if (!item)
            throw new Error('Item not found in cart');
        return prisma.cartItem.delete({
            where: {
                id: item.id
            }
        });
    }
    async clear(userId) {
        const cart = await this.findByUserId(userId);
        if (!cart)
            throw new Error('Cart not found');
        return prisma.cartItem.deleteMany({
            where: {
                cartId: cart.id
            }
        });
    }
}
exports.CartService = CartService;
//# sourceMappingURL=cart.service.js.map