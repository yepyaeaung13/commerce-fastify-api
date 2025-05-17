"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeUser = exports.formatResponse = exports.createPagination = exports.comparePasswords = exports.hashPassword = void 0;
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
const formatResponse = (data, error, meta) => {
    if (error) {
        return {
            status: false,
            error,
        };
    }
    return {
        status: true,
        data,
        meta,
    };
};
exports.formatResponse = formatResponse;
const sanitizeUser = (user) => {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
};
exports.sanitizeUser = sanitizeUser;
//# sourceMappingURL=helpers.js.map