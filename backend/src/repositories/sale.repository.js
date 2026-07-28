"use strict";

const { Op } = require("sequelize");

const {
  sequelize,
  Sale,
  SaleDetail,
  Product
} = require("../models");

class SaleRepository {
  async createSale({
    saleData,
    details
  }) {
    return sequelize.transaction(async (transaction) => {
      const sale = await Sale.create(
        saleData,
        {
          transaction
        }
      );

      const detailRecords = details.map((detail) => ({
        ...detail,
        saleId: sale.id
      }));

      await SaleDetail.bulkCreate(
        detailRecords,
        {
          transaction
        }
      );

      return Sale.findByPk(sale.id, {
        include: [
          {
            model: SaleDetail,
            as: "details"
          }
        ],
        transaction
      });
    });
  }

  async findById(id) {
    return Sale.findByPk(id, {
      include: [
        {
          model: SaleDetail,
          as: "details"
        }
      ]
    });
  }

  buildWhere({
    search = "",
    status = "",
    dateFrom = "",
    dateTo = ""
  } = {}) {
    const where = {};

    if (search) {
      where.saleNumber = {
        [Op.like]: `%${search}%`
      };
    }

    if (status) {
      where.status = status;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};

      if (dateFrom) {
        const startDate = new Date(`${dateFrom}T00:00:00.000`);

        where.createdAt[Op.gte] = startDate;
      }

      if (dateTo) {
        const endDate = new Date(`${dateTo}T23:59:59.999`);

        where.createdAt[Op.lte] = endDate;
      }
    }

    return where;
  }

  async findAll({
    page = 1,
    limit = 10,
    search = "",
    status = "",
    dateFrom = "",
    dateTo = ""
  } = {}) {
    const safePage = Math.max(Number(page) || 1, 1);

    const safeLimit = Math.min(
      Math.max(Number(limit) || 10, 1),
      100
    );

    const offset = (safePage - 1) * safeLimit;

    const where = this.buildWhere({
      search,
      status,
      dateFrom,
      dateTo
    });

    const [
      result,
      totalAmount,
      totalUnits
    ] = await Promise.all([
      Sale.findAndCountAll({
        where,
        order: [["id", "DESC"]],
        limit: safeLimit,
        offset
      }),

      Sale.sum("total", {
        where
      }),

      Sale.sum("totalItems", {
        where
      })
    ]);

    return {
      ...result,
      summary: {
        totalAmount: Number(totalAmount || 0),
        totalUnits: Number(totalUnits || 0)
      }
    };
  }

  async findProductsByIds(productIds) {
    return Product.findAll({
      where: {
        id: productIds
      }
    });
  }
}

module.exports = new SaleRepository();
