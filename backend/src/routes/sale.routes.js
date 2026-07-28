"use strict";

const express = require("express");

const saleController = require(
  "../controllers/sale.controller"
);

const validateRequest = require(
  "../middlewares/validateRequest"
);

const {
  createSaleValidation,
  saleIdValidation,
  listSalesValidation
} = require(
  "../validations/sale.validation"
);

const router = express.Router();

router.get(
  "/",
  listSalesValidation,
  validateRequest,
  saleController.index.bind(saleController)
);

router.get(
  "/:id",
  saleIdValidation,
  validateRequest,
  saleController.show.bind(saleController)
);

router.post(
  "/",
  createSaleValidation,
  validateRequest,
  saleController.store.bind(saleController)
);

module.exports = router;