

// Este archivo define el controlador de productos, que maneja las solicitudes HTTP relacionadas con los productos en la aplicación Express.

const productService = require('../services/product.service');
const ApiResponse = require('../utils/ApiResponse');

class ProductController {
  async index(req, res, next) {
    try {
      const result = await productService.getProducts(req.query);

      return ApiResponse.success(
        res,
        result,
        'Productos obtenidos correctamente'
      );
    } catch (error) {
      return next(error);
    }
  }

  async show(req, res, next) {
    try {
      const product = await productService.getProductById(
        Number(req.params.id)
      );

      return ApiResponse.success(
        res,
        product,
        'Producto obtenido correctamente'
      );
    } catch (error) {
      return next(error);
    }
  }

  async store(req, res, next) {
    try {
      const product = await productService.createProduct(req.body);

      return ApiResponse.created(
        res,
        product,
        'Producto creado correctamente'
      );
    } catch (error) {
      return next(error);
    }
  }

  async update(req, res, next) {
    try {
      const product = await productService.updateProduct(
        Number(req.params.id),
        req.body
      );

      return ApiResponse.success(
        res,
        product,
        'Producto actualizado correctamente'
      );
    } catch (error) {
      return next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      const result = await productService.deleteProduct(
        Number(req.params.id)
      );

      return ApiResponse.success(
        res,
        result,
        'Producto eliminado correctamente'
      );
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new ProductController();