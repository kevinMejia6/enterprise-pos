// Este archivo contiene los servicios relacionados con productos.
// Centraliza las solicitudes HTTP hacia la API del backend.

import api from "./api";

export default {
  async getProducts(search = "", page = 1, limit = 12) {
    const response = await api.get("/products", {
      params: {
        search,
        page,
        limit
      }
    });

    // Devuelve:
    // {
    //   products: [...],
    //   pagination: {...}
    // }
    return response.data.data;
  },

  async getProductById(id) {
    const response = await api.get(`/products/${id}`);

    return response.data.data;
  },

  async createProduct(product) {
    const response = await api.post("/products", product);

    return response.data.data;
  },

  async updateProduct(id, product) {
    const response = await api.put(
      `/products/${id}`,
      product
    );

    return response.data.data;
  },

  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);

    return response.data;
  }
};