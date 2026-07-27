
    // Este archivo define las rutas relacionadas con los productos en una aplicación Express.

    const express = require('express');

    const productController = require('../controllers/product.controller');
    const validateRequest = require('../middlewares/validateRequest');

    const {
    createProductValidation,
    updateProductValidation,
    productIdValidation,
    listProductsValidation
    } = require('../validations/product.validation');

    const router = express.Router();

    router.get(
    '/',
    listProductsValidation,
    validateRequest,
    productController.index.bind(productController)
    );

    router.get(
    '/:id',
    productIdValidation,
    validateRequest,
    productController.show.bind(productController)
    );

    router.post(
    '/',
    createProductValidation,
    validateRequest,
    productController.store.bind(productController)
    );

    router.put(
    '/:id',
    updateProductValidation,
    validateRequest,
    productController.update.bind(productController)
    );

    router.delete(
    '/:id',
    productIdValidation,
    validateRequest,
    productController.destroy.bind(productController)
    );

    module.exports = router;