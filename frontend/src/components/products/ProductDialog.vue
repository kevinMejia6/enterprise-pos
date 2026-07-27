
    // Este archivo contiene la configuración de la instancia de Axios para realizar solicitudes HTTP a la API del backend. Se establece una URL base, un tiempo de espera 
    // y los encabezados necesarios para las solicitudes. Además, se implementa un interceptor de respuesta para manejar errores de manera uniforme y proporcionar mensajes de error
    

import api from "./api";

const productService = {
  async getAll(params = {}) {
    const response = await api.get("/products", {
      params
    });

    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/products/${id}`);

    return response.data;
  },

  async create(product) {
    const response = await api.post("/products", product);

    return response.data;
  },

  async update(id, product) {
    const response = await api.put(
      `/products/${id}`,
      product
    );

    return response.data;
  },

  async remove(id) {
    const response = await api.delete(`/products/${id}`);

    return response.data;
  }
};

export default productService;