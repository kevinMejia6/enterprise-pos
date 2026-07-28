"use strict";

// Este archivo define el servicio de productos.
// Contiene la lógica de negocio para las operaciones de productos.

const productRepository = require("../repositories/product.repository");
const ApiError = require("../utils/ApiError");

class ProductService {
  async getProducts(filters = {}) {
    const search = String(filters.search || "").trim();
    const page = Number(filters.page || 1);
    const limit = Number(filters.limit || 12);

    const result = await productRepository.findAll({
      search,
      page,
      limit
    });

    return {
      products: result.rows,
      pagination: {
        totalItems: result.count,
        totalPages: Math.ceil(result.count / limit),
        currentPage: page,
        itemsPerPage: limit
      }
    };
  }

  async getProductById(id) {
    const product = await productRepository.findById(id);

    if (!product) {
      throw new ApiError(
        "El producto solicitado no existe",
        404
      );
    }

    return product;
  }

  async createProduct(productData) {
    const normalizedData = this.normalizeProductData(productData);

    const existingProduct =
      await productRepository.findByBarcode(
        normalizedData.barcode
      );

    if (existingProduct) {
      throw new ApiError(
        "Ya existe un producto con ese código de barras",
        409,
        [
          {
            field: "barcode",
            message:
              "El código de barras ya está registrado"
          }
        ]
      );
    }

    return productRepository.create(normalizedData);
  }

  async updateProduct(id, productData) {
    const product = await this.getProductById(id);

    const normalizedData = this.normalizeProductData(
      productData,
      true
    );

    if (normalizedData.barcode) {
      const duplicatedProduct =
        await productRepository.findByBarcodeExcludingId(
          normalizedData.barcode,
          id
        );

      if (duplicatedProduct) {
        throw new ApiError(
          "Ya existe otro producto con ese código de barras",
          409,
          [
            {
              field: "barcode",
              message:
                "El código de barras ya está registrado"
            }
          ]
        );
      }
    }

    return productRepository.update(
      product,
      normalizedData
    );
  }

  async deleteProduct(id) {
    const product = await this.getProductById(id);

    await productRepository.delete(product);

    return {
      id: Number(id)
    };
  }

  normalizeProductData(productData, isUpdate = false) {
    const normalizedData = {};

    if (!isUpdate || productData.name !== undefined) {
      normalizedData.name = String(
        productData.name || ""
      ).trim();
    }

    if (!isUpdate || productData.barcode !== undefined) {
      normalizedData.barcode = String(
        productData.barcode || ""
      ).trim();
    }

    if (!isUpdate || productData.price !== undefined) {
      normalizedData.price = Number(productData.price);
    }

    if (!isUpdate || productData.description !== undefined) {
      normalizedData.description = productData.description
        ? String(productData.description).trim()
        : null;
    }

    if (!isUpdate || productData.imageUrl !== undefined) {
      normalizedData.imageUrl = productData.imageUrl
        ? String(productData.imageUrl).trim()
        : null;
    }

    if (!isUpdate || productData.active !== undefined) {
      normalizedData.active =
        typeof productData.active === "boolean"
          ? productData.active
          : true;
    }

    return normalizedData;
  }
}

module.exports = new ProductService();