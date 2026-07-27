
// Este archivo contiene la configuración de la instancia de Axios para realizar solicitudes HTTP a la API del backend. Se establece una URL base, un tiempo de espera 
// y los encabezados necesarios para las solicitudes. Además, se implementa un interceptor de respuesta para manejar errores de manera uniforme y proporcionar mensajes de error
//  más claros al usuario.

import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.VUE_APP_API_URL ||
    "http://localhost:3000/api/v1",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.response.use(
  response => response,
  error => {
    const normalizedError = {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        "No fue posible comunicarse con el servidor",
      errors: error.response?.data?.errors || []
    };

    return Promise.reject(normalizedError);
  }
);

export default api;