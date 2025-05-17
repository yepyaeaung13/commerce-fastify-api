"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = getOrders;
exports.getOrderById = getOrderById;
exports.createOrder = createOrder;
exports.updateOrderStatus = updateOrderStatus;
exports.deleteOrder = deleteOrder;
const order_service_1 = require("../services/order.service");
const helpers_1 = require("../utils/helpers");
const orderService = new order_service_1.OrderService();
async function getOrders(request, reply) {
    try {
        const pagination = (0, helpers_1.createPagination)(request.query);
        const { userId } = request.query;
        const result = userId
            ? await orderService.findByUserId(userId, pagination)
            : await orderService.findAll(pagination);
        return reply.send((0, helpers_1.formatResponse)(result.data, undefined, {
            page: pagination.page,
            limit: pagination.take,
            total: result.total
        }));
    }
    catch (error) {
        return reply.status(500).send((0, helpers_1.formatResponse)(null, error.message));
    }
}
async function getOrderById(request, reply) {
    try {
        const { id } = request.params;
        const order = await orderService.findById(id);
        if (!order) {
            return reply.status(404).send((0, helpers_1.formatResponse)(null, 'Order not found'));
        }
        return reply.send((0, helpers_1.formatResponse)(order));
    }
    catch (error) {
        return reply.status(500).send((0, helpers_1.formatResponse)(null, error.message));
    }
}
async function createOrder(request, reply) {
    try {
        const orderData = request.body;
        const { userId } = request.body;
        const order = await orderService.create(userId, {
            items: orderData.items,
            address: orderData.address
        });
        return reply.status(201).send((0, helpers_1.formatResponse)(order));
    }
    catch (error) {
        return reply.status(500).send((0, helpers_1.formatResponse)(null, error.message));
    }
}
async function updateOrderStatus(request, reply) {
    try {
        const { id } = request.params;
        const { status } = request.body;
        const order = await orderService.update(id, { status });
        return reply.send((0, helpers_1.formatResponse)(order));
    }
    catch (error) {
        return reply.status(500).send((0, helpers_1.formatResponse)(null, error.message));
    }
}
async function deleteOrder(request, reply) {
    try {
        const { id } = request.params;
        // Check if order exists
        const existingOrder = await orderService.findById(id);
        if (!existingOrder) {
            return reply.status(404).send((0, helpers_1.formatResponse)(null, 'Order not found'));
        }
        await orderService.delete(id);
        return reply.send((0, helpers_1.formatResponse)(null));
    }
    catch (error) {
        return reply.status(500).send((0, helpers_1.formatResponse)(null, error.message));
    }
}
//# sourceMappingURL=orders.js.map