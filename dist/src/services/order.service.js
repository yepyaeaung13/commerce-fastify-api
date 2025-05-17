"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class OrderService {
    async findAll(params) {
        const skip = params.skip ?? (params.page ? (params.page - 1) * (params.limit ?? 10) : 0);
        const take = params.take ?? params.limit ?? 10;
        const [data, total] = await Promise.all([
            prisma.order.findMany({
                skip,
                take,
                orderBy: params.sortBy ? { [params.sortBy]: params.order || 'desc' } : undefined
            }),
            prisma.order.count()
        ]);
        return { data, total };
    }
    async findById(id) {
        return prisma.order.findUnique({
            where: { id }
        });
    }
    async findByUserId(userId, params) {
        const skip = params.skip ?? (params.page ? (params.page - 1) * (params.limit ?? 10) : 0);
        const take = params.take ?? params.limit ?? 10;
        const [data, total] = await Promise.all([
            prisma.order.findMany({
                where: { userId },
                skip,
                take,
                orderBy: params.sortBy ? { [params.sortBy]: params.order || 'desc' } : undefined
            }),
            prisma.order.count({ where: { userId } })
        ]);
        return { data, total };
    }
    async create(userId, data) {
        return prisma.order.create({
            data: {
                ...data,
                userId,
                status: 'PENDING'
            }
        });
    }
    async update(id, data) {
        const order = await prisma.order.findUnique({ where: { id } });
        if (!order) {
            throw new Error('Order not found');
        }
        // Validate update data
        const allowedFields = ['shippingAddress', 'billingAddress', 'totalAmount', 'status'];
        const invalidFields = Object.keys(data).filter(key => !allowedFields.includes(key));
        if (invalidFields.length > 0) {
            throw new Error(`Invalid update fields: ${invalidFields.join(', ')}`);
        }
        return prisma.order.update({
            where: { id },
            data
        });
    }
    async updateStatus(id, status) {
        const order = await prisma.order.findUnique({ where: { id } });
        if (!order) {
            throw new Error('Order not found');
        }
        // Validate status transitions
        const validTransitions = {
            'PENDING': ['PROCESSING', 'CANCELLED'],
            'PROCESSING': ['SHIPPED', 'CANCELLED'],
            'SHIPPED': ['DELIVERED'],
            'DELIVERED': [],
            'CANCELLED': []
        };
        if (!validTransitions[order.status].includes(status)) {
            throw new Error(`Invalid status transition from ${order.status} to ${status}`);
        }
        return prisma.order.update({
            where: { id },
            data: { status }
        });
    }
    async delete(id) {
        return prisma.order.delete({
            where: { id }
        });
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map