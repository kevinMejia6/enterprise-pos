"use strict";

const saleService = require("../services/sale.service");
const ApiResponse = require("../utils/ApiResponse");

class SaleController {
  async index(req, res, next) {
    try {
      const result = await saleService.getSales(
        req.query
      );

      return ApiResponse.success(
        res,
        result,
        "Ventas obtenidas correctamente"
      );
    } catch (error) {
      return next(error);
    }
  }

  async show(req, res, next) {
    try {
      const sale = await saleService.getSaleById(
        Number(req.params.id)
      );

      return ApiResponse.success(
        res,
        sale,
        "Venta obtenida correctamente"
      );
    } catch (error) {
      return next(error);
    }
  }

  async store(req, res, next) {
    try {
      const sale = await saleService.createSale(
        req.body
      );

      return ApiResponse.created(
        res,
        sale,
        "Venta registrada correctamente"
      );
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new SaleController();