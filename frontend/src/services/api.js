
// Este archivo contiene la configuración de la instancia de Axios para realizar solicitudes HTTP a la API del backend. Se establece la URL base, el tiempo de espera y los encabezados predeterminados para las solicitudes.

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;