
// Este archivo define la clase ApiResponse, que se utiliza para estandarizar las respuestas de la API en formato JSON.

class ApiResponse {
  static success(
    res,
    data = null,
    message = "Operación realizada correctamente",
    statusCode = 200,
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created(res, data, message = "Registro creado correctamente") {
    return this.success(res, data, message, 201);
  }
}

module.exports = ApiResponse;
