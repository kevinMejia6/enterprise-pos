import api from "./api";

export default {
  async createSale(items) {
    const payload = {
      items: items.map((item) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
        unitPrice: Number(item.price)
      }))
    };

    const response = await api.post("/sales", payload);

    return response.data.data;
  },

  async getSales(filters = {}) {
    const response = await api.get("/sales", {
      params: {
        page: filters.page || 1,
        limit: filters.limit || 10,
        search: filters.search || undefined,
        status: filters.status || undefined,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined
      }
    });

    return response.data.data;
  },

  async getSaleById(id) {
    const response = await api.get(`/sales/${id}`);

    return response.data.data;
  }
};
