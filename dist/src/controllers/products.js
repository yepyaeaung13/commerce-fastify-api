"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = getProducts;
exports.getProductById = getProductById;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.updateProductStock = updateProductStock;
const product_service_1 = require("../services/product.service");
const helpers_1 = require("../utils/helpers");
const productService = new product_service_1.ProductService();
async function getProducts(request, reply) {
    try {
        const pagination = (0, helpers_1.createPagination)(request.query);
        const { categoryId } = request.query;
        const result = categoryId
            ? await productService.findByCategory(categoryId, pagination)
            : await productService.findAll(pagination);
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
async function getProductById(request, reply) {
    try {
        const { id } = request.params;
        const product = await productService.findById(id);
        if (!product) {
            return reply.status(404).send((0, helpers_1.formatResponse)(null, 'Product not found'));
        }
        return reply.send((0, helpers_1.formatResponse)(product));
    }
    catch (error) {
        return reply.status(500).send((0, helpers_1.formatResponse)(null, error?.message || 'Internal server error'));
    }
}
async function createProduct(request, reply) {
    try {
        const productData = request.body;
        const product = await productService.create(productData);
        return reply.status(201).send((0, helpers_1.formatResponse)(product));
    }
    catch (error) {
        return reply.status(500).send((0, helpers_1.formatResponse)(null, error?.message || 'Internal server error'));
    }
}
async function updateProduct(request, reply) {
    try {
        const { id } = request.params;
        const productData = request.body;
        const product = await productService.update(id, productData);
        return reply.send((0, helpers_1.formatResponse)(product));
    }
    catch (error) {
        return reply.status(500).send((0, helpers_1.formatResponse)(null, error?.message || 'Internal server error'));
    }
}
async function deleteProduct(request, reply) {
    try {
        const { id } = request.params;
        await productService.delete(id);
        return reply.send((0, helpers_1.formatResponse)({ success: true }));
    }
    catch (error) {
        return reply.status(500).send((0, helpers_1.formatResponse)(null, error?.message || 'Internal server error'));
    }
}
async function updateProductStock(request, reply) {
    try {
        const { id } = request.params;
        const { quantity } = request.body;
        const product = await productService.updateStock(id, quantity);
        return reply.send((0, helpers_1.formatResponse)(product));
    }
    catch (error) {
        return reply.status(500).send((0, helpers_1.formatResponse)(null, error?.message || 'Internal server error'));
    }
}
//# sourceMappingURL=products.js.map