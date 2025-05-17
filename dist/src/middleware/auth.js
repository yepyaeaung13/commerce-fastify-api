"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config/config");
async function authenticate(request, reply) {
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return reply.status(401).send({ error: 'No token provided' });
        }
        const token = authHeader.replace('Bearer ', '');
        const decoded = (0, jsonwebtoken_1.verify)(token, config_1.config.jwtSecret);
        request.user = decoded;
    }
    catch (error) {
        reply.status(401).send({ error: 'Invalid token' });
    }
}
//# sourceMappingURL=auth.js.map