"use strict";

const {
  body,
  param,
  query
} = require("express-validator");

const createSaleValidation = [
  body("items")
    .isArray({
      min: 1
    })
    .withMessage(
      "La venta debe contener al menos un producto"
    ),

  body("items.*.productId")
    .isInt({
      gt: 0
    })
    .withMessage(
      "El identificador del producto no es válido"
    )
    .toInt(),

  body("items.*.quantity")
    .isInt({
      gt: 0
    })
    .withMessage(
      "La cantidad debe ser mayor que cero"
    )
    .toInt(),

  body("items.*.unitPrice")
    .isFloat({
      gt: 0
    })
    .withMessage(
      "El precio unitario debe ser mayor que cero"
    )
    .toFloat()
];

const saleIdValidation = [
  param("id")
    .isInt({
      gt: 0
    })
    .withMessage(
      "El identificador de la venta no es válido"
    )
    .toInt()
];

const listSalesValidation = [
  query("page")
    .optional()
    .isInt({
      min: 1
    })
    .withMessage(
      "La página debe ser mayor o igual a 1"
    )
    .toInt(),

  query("limit")
    .optional()
    .isInt({
      min: 1,
      max: 100
    })
    .withMessage(
      "El límite debe estar entre 1 y 100"
    )
    .toInt(),

  query("search")
    .optional()
    .trim()
    .isLength({
      max: 100
    })
    .withMessage(
      "La búsqueda no puede superar 100 caracteres"
    ),

  query("status")
    .optional({
      checkFalsy: true
    })
    .isIn([
      "COMPLETED",
      "CANCELLED"
    ])
    .withMessage(
      "El estado de la venta no es válido"
    ),

  query("dateFrom")
    .optional({
      checkFalsy: true
    })
    .isISO8601({
      strict: true
    })
    .withMessage(
      "La fecha inicial no es válida"
    ),

  query("dateTo")
    .optional({
      checkFalsy: true
    })
    .isISO8601({
      strict: true
    })
    .withMessage(
      "La fecha final no es válida"
    )
];

module.exports = {
  createSaleValidation,
  saleIdValidation,
  listSalesValidation
};
