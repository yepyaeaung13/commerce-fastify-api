"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.loginUser = loginUser;
exports.createUser = createUser;
exports.refreshAccessToken = refreshAccessToken;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const user_service_1 = require("../services/user.service");
const helpers_1 = require("../utils/helpers");
const config_1 = require("../config/config");
const userService = new user_service_1.UserService();
async function getUsers(request, reply) {
    try {
        const pagination = (0, helpers_1.createPagination)(request.query);
        const result = await userService.findAll(pagination);
        return reply.send((0, helpers_1.successResponseWithMeta)(result.data, {
            page: pagination.page,
            limit: pagination.take,
            total: result.total
        }, 'Users retrieved successfully'));
    }
    catch (error) {
        return reply.status(500).send((0, helpers_1.errorResponse)(error?.message || 'Internal server error'));
    }
}
async function getUserById(request, reply) {
    try {
        const { id } = request.params;
        const user = await userService.findById(id);
        if (!user) {
            return reply.status(404).send((0, helpers_1.errorResponse)('User not found'));
        }
        return reply.send((0, helpers_1.successResponse)(user, 'User retrieved successfully'));
    }
    catch (error) {
        return reply.status(500).send((0, helpers_1.errorResponse)(error?.message || 'Internal server error'));
    }
}
async function loginUser(request, reply) {
    try {
        const { email, password } = request.body;
        const user = await userService.login(email, password);
        if (!user) {
            return reply.status(401).send((0, helpers_1.errorResponse)('Invalid credentials'));
        }
        // Assuming you have a method to generate a JWT token
        const accessToken = await reply.accessJwtSign({ id: user.id, email: user.email }, { expiresIn: config_1.config.jwtAccessExpiresIn });
        const refreshToken = await reply.refreshJwtSign({ id: user.id, email: user.email }, { expiresIn: config_1.config.jwtRefreshExpiresIn });
        const userInfo = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
        };
        return reply.send((0, helpers_1.successResponse)({ userInfo, accessToken, refreshToken }, 'Login successful'));
    }
    catch (error) {
        return reply.status(500).send((0, helpers_1.errorResponse)(error?.message || 'Internal server error'));
    }
}
async function createUser(request, reply) {
    try {
        const userData = request.body;
        const hashedPassword = await (0, helpers_1.hashPassword)(userData.password);
        userData.password = hashedPassword;
        const user = await userService.create(userData);
        const accessToken = await reply.accessJwtSign({ id: user.id, email: user.email }, { expiresIn: config_1.config.jwtAccessExpiresIn });
        const refreshToken = await reply.refreshJwtSign({ id: user.id, email: user.email }, { expiresIn: config_1.config.jwtRefreshExpiresIn });
        const userInfo = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
        };
        return reply.send((0, helpers_1.successResponse)({ userInfo, accessToken, refreshToken }, 'User created successfully'));
    }
    catch (error) {
        return reply.status(500).send((0, helpers_1.errorResponse)(error?.message || 'Internal server error'));
    }
}
async function refreshAccessToken(request, reply) {
    try {
        // Verify the refresh token from the request headers or body (depending on your design)
        await request.refreshJwtVerify();
        // Extract user info from refresh token
        const user = request.refreshUser;
        if (!user) {
            return reply.status(401).send((0, helpers_1.errorResponse)('Invalid refresh token'));
        }
        // Sign a new access token (shorter expiry)
        const newAccessToken = await reply.accessJwtSign({ id: user.id, email: user.email }, { expiresIn: config_1.config.jwtAccessExpiresIn });
        return reply.send((0, helpers_1.successResponse)({ accessToken: newAccessToken }, 'New access token issued'));
    }
    catch (error) {
        return reply.status(401).send((0, helpers_1.errorResponse)(error.message || 'Invalid or expired refresh token'));
    }
}
async function updateUser(request, reply) {
    try {
        const { id } = request.params;
        const userData = request.body;
        const user = await userService.update(id, userData);
        return reply.send((0, helpers_1.successResponse)(user, 'User updated successfully'));
    }
    catch (error) {
        return reply.status(500).send((0, helpers_1.errorResponse)(error?.message || 'Internal server error'));
    }
}
async function deleteUser(request, reply) {
    try {
        const { id } = request.params;
        await userService.delete(id);
        return reply.send((0, helpers_1.successResponse)(null, 'User deleted successfully'));
    }
    catch (error) {
        return reply.status(500).send((0, helpers_1.errorResponse)(error?.message || 'Internal server error'));
    }
}
//# sourceMappingURL=users.js.map