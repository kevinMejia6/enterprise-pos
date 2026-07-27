

// Este archivo define el repositorio de productos, que es responsable de interactuar con la base de datos para realizar operaciones relacionadas con los productos.

const { Op } = require("sequelize");
const { Product } = require("../models");

class ProductRepository {
  async findAll({ search = "", page = 1, limit = 12 }) {
    const offset = (page - 1) * limit;

    const where = {};

    if (search) {
      where[Op.or] = [
        {
          name: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          barcode: {
            [Op.like]: `%${search}%`,
          },
        },
      ];
    }

    return Product.findAndCountAll({
      where,
      order: [
        ["active", "DESC"],
        ["name", "ASC"],
      ],
      limit,
      offset,
    });
  }

  async findById(id) {
    return Product.findByPk(id);
  }

  async findByBarcode(barcode) {
    return Product.findOne({
      where: {
        barcode,
      },
    });
  }

  async findByBarcodeExcludingId(barcode, id) {
    return Product.findOne({
      where: {
        barcode,
        id: {
          [Op.ne]: id,
        },
      },
    });
  }

  async create(productData) {
    return Product.create(productData);
  }

  async update(product, productData) {
    return product.update(productData);
  }

  async delete(product) {
    return product.destroy();
  }
}

module.exports = new ProductRepository();
