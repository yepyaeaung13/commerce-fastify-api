"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.sanitizeUser = exports.errorResponse = exports.successResponseWithMeta = exports.successResponse = exports.createPagination = exports.comparePasswords = exports.hashPassword = void 0;
const config_1 = require("../config/config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const hashPassword = async (password) => {
    const salt = await bcrypt_1.default.genSalt(10);
    return bcrypt_1.default.hash(password, salt);
};
exports.hashPassword = hashPassword;
const comparePasswords = async (password, hashedPassword) => {
    return bcrypt_1.default.compare(password, hashedPassword);
};
exports.comparePasswords = comparePasswords;
const createPagination = (params) => {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(Math.max(1, params.limit || 10), 100);
    const skip = (page - 1) * limit;
    return {
        skip,
        take: limit,
        page,
    };
};
exports.createPagination = createPagination;
const successResponse = (data, message) => ({
    status: true,
    data,
    message,
});
exports.successResponse = successResponse;
const successResponseWithMeta = (data, meta, message) => ({
    status: true,
    data,
    meta,
    message,
});
exports.successResponseWithMeta = successResponseWithMeta;
const errorResponse = (error) => ({
    status: false,
    error,
});
exports.errorResponse = errorResponse;
const sanitizeUser = (user) => {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
};
exports.sanitizeUser = sanitizeUser;
const generateToken = async (user, fastify) => {
    return fastify.jwt.sign({ id: user.id, email: user.email, role: user.role }, { expiresIn: config_1.config.jwtAccessExpiresIn });
};
exports.generateToken = generateToken;
//# sourceMappingURL=helpers.js.map