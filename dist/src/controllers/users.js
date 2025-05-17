"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const user_service_1 = require("../services/user.service");
const helpers_1 = require("../utils/helpers");
const userService = new user_service_1.UserService();
async function getUsers(request, reply) {
    try {
        const pagination = (0, helpers_1.createPagination)(request.query);
        const result = await userService.findAll(pagination);
        return reply.send((0, helpers_1.formatResponse)(result.data, undefined, {
            page: pagination.page,
            limit: pagination.take,
            total: result.total
        }));
    }
    catch (error) {
        return reply.status(500).send((0, helpers_1.formatResponse)(null, error?.message || 'Internal server error'));
    }
}
async function getUserById(request, reply) {
    try {
        const { id } = request.params;
        const user = await userService.findById(id);
        if (!user) {
            return reply.status(404).send((0, helpers_1.formatResponse)(null, 'User not found'));
        }
        return reply.send((0, helpers_1.formatResponse)(user));
    }
    catch (error) {
        return reply.status(500).send((0, helpers_1.formatResponse)(null, error?.message || 'Internal server error'));
    }
}
async function createUser(request, reply) {
    try {
        const userData = request.body;
        const user = await userService.create(userData);
        return reply.status(201).send((0, helpers_1.formatResponse)(user));
    }
    catch (error) {
        return reply.status(500).send((0, helpers_1.formatResponse)(null, error?.message || 'Internal server error'));
    }
}
async function updateUser(request, reply) {
    try {
        const { id } = request.params;
        const userData = request.body;
        const user = await userService.update(id, userData);
        return reply.send((0, helpers_1.formatResponse)(user));
    }
    catch (error) {
        return reply.status(500).send((0, helpers_1.formatResponse)(null, error?.message || 'Internal server error'));
    }
}
async function deleteUser(request, reply) {
    try {
        const { id } = request.params;
        await userService.delete(id);
        return reply.send((0, helpers_1.formatResponse)({ success: true }));
    }
    catch (error) {
        return reply.status(500).send((0, helpers_1.formatResponse)(null, error?.message || 'Internal server error'));
    }
}
//# sourceMappingURL=users.js.map