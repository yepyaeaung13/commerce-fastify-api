"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const helpers_1 = require("../utils/helpers");
const prisma = new client_1.PrismaClient();
class UserService {
    async findAll(params) {
        const skip = params.skip ?? (params.page ? (params.page - 1) * (params.limit ?? 10) : 0);
        const take = params.take ?? params.limit ?? 10;
        const [data, total] = await Promise.all([
            prisma.user.findMany({
                skip,
                take,
                orderBy: params.sortBy ? { [params.sortBy]: params.order || 'desc' } : undefined
            }),
            prisma.user.count()
        ]);
        return { data, total };
    }
    async findById(id) {
        return prisma.user.findUnique({
            where: { id }
        });
    }
    async findByEmail(email) {
        return prisma.user.findUnique({
            where: { email }
        });
    }
    async login(email, password) {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            return null;
        }
        // Assuming you have a method to verify the password
        const isValidPassword = await (0, helpers_1.comparePasswords)(password, user.password);
        if (!isValidPassword) {
            return null;
        }
        return user;
    }
    async create(data) {
        return prisma.user.create({
            data: data
        });
    }
    async update(id, data) {
        return prisma.user.update({
            where: { id },
            data
        });
    }
    async delete(id) {
        return prisma.user.delete({
            where: { id }
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map