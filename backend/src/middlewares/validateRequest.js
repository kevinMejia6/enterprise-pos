


// Este archivo define un middleware de validación de solicitudes para una aplicación Express. 
// Utiliza la biblioteca express-validator para verificar si hay errores de validación en la solicitud entrante. Si se encuentran errores,
//  devuelve una respuesta con un código de estado 422 y un objeto JSON que contiene los detalles de los errores. Si no hay errores,
// llama a la función next() para pasar el control al siguiente middleware o controlador.

const { validationResult } = require("express-validator");

function validateRequest(req, res, next) {
  const validationErrors = validationResult(req);

  if (validationErrors.isEmpty()) {
    return next();
  }

  const errors = validationErrors.array().map((error) => ({
    field: error.path,
    message: error.msg,
    value: error.value,
  }));

  return res.status(422).json({
    success: false,
    message: "Existen datos inválidos en la solicitud",
    errors,
  });
}

module.exports = validateRequest;
