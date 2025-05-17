"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ProductService {
    async findAll(params) {
        const skip = params.skip ?? (params.page ? (params.page - 1) * (params.limit ?? 10) : 0);
        const take = params.take ?? params.limit ?? 10;
        const [data, total] = await Promise.all([
            prisma.product.findMany({
                skip,
                take,
                orderBy: params.sortBy ? { [params.sortBy]: params.order || 'desc' } : undefined
            }),
            prisma.product.count()
        ]);
        return { data, total };
    }
    async findById(id) {
        return prisma.product.findUnique({
            where: { id }
        });
    }
    async findByCategory(categoryId, params) {
        const skip = params.skip ?? (params.page ? (params.page - 1) * (params.limit ?? 10) : 0);
        const take = params.take ?? params.limit ?? 10;
        const [data, total] = await Promise.all([
            prisma.product.findMany({
                where: { categoryId },
                skip,
                take,
                orderBy: params.sortBy ? { [params.sortBy]: params.order || 'desc' } : undefined
            }),
            prisma.product.count({ where: { categoryId } })
        ]);
        return { data, total };
    }
    async create(data) {
        return prisma.product.create({
            data: data
        });
    }
    async update(id, data) {
        return prisma.product.update({
            where: { id },
            data
        });
    }
    async updateStock(id, quantity) {
        const product = await prisma.product.findUnique({
            where: { id }
        });
        if (!product) {
            throw new Error('Product not found');
        }
        const currentQuantity = product.quantity ?? 0;
        if (currentQuantity + quantity < 0) {
            throw new Error('Insufficient stock');
        }
        return prisma.product.update({
            where: { id },
            data: {
                quantity: currentQuantity + quantity,
                inStock: (currentQuantity + quantity) > 0
            }
        });
    }
    async delete(id) {
        return prisma.product.delete({
            where: { id }
        });
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map