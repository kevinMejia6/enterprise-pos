"use strict";

const crypto = require("crypto");

const saleRepository = require("../repositories/sale.repository");
const ApiError = require("../utils/ApiError");

class SaleService {
  async createSale(payload) {
    const items = Array.isArray(payload.items)
      ? payload.items
      : [];

    if (items.length === 0) {
      throw new ApiError(
        "La venta debe contener al menos un producto",
        422
      );
    }

    const normalizedItems = this.normalizeItems(items);

    const productIds = normalizedItems.map(
      (item) => item.productId
    );

    const products =
      await saleRepository.findProductsByIds(productIds);

    if (products.length !== productIds.length) {
      throw new ApiError(
        "Uno o más productos no existen",
        422
      );
    }

    const productMap = new Map(
      products.map((product) => [
        Number(product.id),
        product
      ])
    );

    const details = normalizedItems.map((item) => {
      const product = productMap.get(item.productId);

      if (!product.active) {
        throw new ApiError(
          `El producto ${product.name} está inactivo`,
          422
        );
      }

      const unitPrice = Number(item.unitPrice);

      const subtotal = Number(
        (unitPrice * item.quantity).toFixed(2)
      );

      return {
        productId: product.id,
        productName: product.name,
        barcode: product.barcode,
        quantity: item.quantity,
        unitPrice,
        subtotal
      };
    });

    const totalItems = details.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const subtotal = Number(
      details
        .reduce(
          (sum, item) => sum + item.subtotal,
          0
        )
        .toFixed(2)
    );

    const saleData = {
      saleNumber: this.generateSaleNumber(),
      totalItems,
      subtotal,
      total: subtotal,
      status: "COMPLETED"
    };

    return saleRepository.createSale({
      saleData,
      details
    });
  }

  async getSaleById(id) {
    const sale = await saleRepository.findById(id);

    if (!sale) {
      throw new ApiError(
        "La venta solicitada no existe",
        404
      );
    }

    return sale;
  }

  async getSales(filters = {}) {
    const page = Math.max(
      Number(filters.page || 1),
      1
    );

    const limit = Math.min(
      Math.max(Number(filters.limit || 10), 1),
      100
    );

    const search = String(
      filters.search || ""
    ).trim();

    const status = String(
      filters.status || ""
    ).trim();

    const dateFrom = String(
      filters.dateFrom || ""
    ).trim();

    const dateTo = String(
      filters.dateTo || ""
    ).trim();

    if (
      dateFrom &&
      dateTo &&
      new Date(dateFrom) > new Date(dateTo)
    ) {
      throw new ApiError(
        "La fecha inicial no puede ser mayor que la fecha final",
        422
      );
    }

    const result = await saleRepository.findAll({
      page,
      limit,
      search,
      status,
      dateFrom,
      dateTo
    });

    return {
      sales: result.rows,
      summary: {
        totalSales: result.count,
        totalAmount: result.summary.totalAmount,
        totalUnits: result.summary.totalUnits
      },
      pagination: {
        totalItems: result.count,
        totalPages: Math.ceil(
          result.count / limit
        ),
        currentPage: page,
        itemsPerPage: limit
      }
    };
  }

  normalizeItems(items) {
    const groupedItems = new Map();

    items.forEach((item) => {
      const productId = Number(item.productId);
      const quantity = Number(item.quantity);
      const unitPrice = Number(item.unitPrice);

      if (!Number.isInteger(productId) || productId <= 0) {
        throw new ApiError(
          "Uno de los productos tiene un identificador inválido",
          422
        );
      }

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new ApiError(
          "Todas las cantidades deben ser mayores que cero",
          422
        );
      }

      if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
        throw new ApiError(
          "Todos los precios deben ser mayores que cero",
          422
        );
      }

      if (groupedItems.has(productId)) {
        const existing = groupedItems.get(productId);

        existing.quantity += quantity;
      } else {
        groupedItems.set(productId, {
          productId,
          quantity,
          unitPrice: Number(
            unitPrice.toFixed(2)
          )
        });
      }
    });

    return Array.from(groupedItems.values());
  }

  generateSaleNumber() {
    const now = new Date();

    const datePart = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0")
    ].join("");

    const timePart = [
      String(now.getHours()).padStart(2, "0"),
      String(now.getMinutes()).padStart(2, "0"),
      String(now.getSeconds()).padStart(2, "0")
    ].join("");

    const randomPart = crypto
      .randomBytes(2)
      .toString("hex")
      .toUpperCase();

    return `V-${datePart}-${timePart}-${randomPart}`;
  }
}

module.exports = new SaleService();
