"use strict";

const {
  body,
  param,
  query
} = require("express-validator");

const createProductValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre del producto es obligatorio")
    .isLength({
      min: 2,
      max: 150
    })
    .withMessage(
      "El nombre debe contener entre 2 y 150 caracteres"
    ),

  body("barcode")
    .trim()
    .notEmpty()
    .withMessage("El código de barras es obligatorio")
    .isLength({
      min: 3,
      max: 100
    })
    .withMessage(
      "El código debe contener entre 3 y 100 caracteres"
    ),

  body("price")
    .notEmpty()
    .withMessage("El precio es obligatorio")
    .isFloat({
      gt: 0
    })
    .withMessage("El precio debe ser mayor que cero")
    .toFloat(),

  body("description")
    .optional({
      nullable: true,
      checkFalsy: true
    })
    .trim()
    .isLength({
      max: 500
    })
    .withMessage(
      "La descripción no puede superar los 500 caracteres"
    ),

  body("imageUrl")
    .optional({
      nullable: true,
      checkFalsy: true
    })
    .trim()
    .isLength({
      max: 1000
    })
    .withMessage(
      "La URL de la imagen no puede superar los 1000 caracteres"
    )
    .isURL({
      protocols: ["http", "https"],
      require_protocol: true
    })
    .withMessage(
      "La imagen debe contener una URL válida con http:// o https://"
    ),

  body("active")
    .optional()
    .isBoolean()
    .withMessage("El campo activo debe ser verdadero o falso")
    .toBoolean()
];

const updateProductValidation = [
  param("id")
    .isInt({
      gt: 0
    })
    .withMessage("El identificador del producto no es válido")
    .toInt(),

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El nombre del producto no puede estar vacío")
    .isLength({
      min: 2,
      max: 150
    })
    .withMessage(
      "El nombre debe contener entre 2 y 150 caracteres"
    ),

  body("barcode")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El código de barras no puede estar vacío")
    .isLength({
      min: 3,
      max: 100
    })
    .withMessage(
      "El código debe contener entre 3 y 100 caracteres"
    ),

  body("price")
    .optional()
    .isFloat({
      gt: 0
    })
    .withMessage("El precio debe ser mayor que cero")
    .toFloat(),

  body("description")
    .optional({
      nullable: true,
      checkFalsy: true
    })
    .trim()
    .isLength({
      max: 500
    })
    .withMessage(
      "La descripción no puede superar los 500 caracteres"
    ),

  body("imageUrl")
    .optional({
      nullable: true,
      checkFalsy: true
    })
    .trim()
    .isLength({
      max: 1000
    })
    .withMessage(
      "La URL de la imagen no puede superar los 1000 caracteres"
    )
    .isURL({
      protocols: ["http", "https"],
      require_protocol: true
    })
    .withMessage(
      "La imagen debe contener una URL válida con http:// o https://"
    ),

  body("active")
    .optional()
    .isBoolean()
    .withMessage("El campo activo debe ser verdadero o falso")
    .toBoolean()
];

const productIdValidation = [
  param("id")
    .isInt({
      gt: 0
    })
    .withMessage("El identificador del producto no es válido")
    .toInt()
];

const listProductsValidation = [
  query("search")
    .optional()
    .trim()
    .isLength({
      max: 150
    })
    .withMessage(
      "La búsqueda no puede superar los 150 caracteres"
    ),

  query("page")
    .optional()
    .isInt({
      min: 1
    })
    .withMessage("La página debe ser mayor o igual a 1")
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
    .toInt()
];

module.exports = {
  createProductValidation,
  updateProductValidation,
  productIdValidation,
  listProductsValidation
};