    
    //  Este archivo define los middlewares de manejo de errores para una aplicación Express.
    
    
    const {
    ValidationError,
    UniqueConstraintError,
    DatabaseError
    } = require('sequelize');

    const ApiError = require('../utils/ApiError');

    function notFoundHandler(req, res, next) {
    return next(
        new ApiError(
        `La ruta ${req.method} ${req.originalUrl} no existe`,
        404
        )
    );
    }

    function errorHandler(error, req, res, next) {
    console.error(error);

    if (error instanceof UniqueConstraintError) {
        return res.status(409).json({
        success: false,
        message: 'Ya existe un registro con los mismos datos',
        errors: error.errors.map(item => ({
            field: item.path,
            message: item.message
        }))
        });
    }

    if (error instanceof ValidationError) {
        return res.status(422).json({
        success: false,
        message: 'Los datos proporcionados no son válidos',
        errors: error.errors.map(item => ({
            field: item.path,
            message: item.message
        }))
        });
    }

    if (error instanceof DatabaseError) {
        return res.status(500).json({
        success: false,
        message: 'Ocurrió un error al consultar la base de datos'
        });
    }

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message: error.message || 'Error interno del servidor',
        errors: error.errors || null,
        stack:
        process.env.NODE_ENV === 'development'
            ? error.stack
            : undefined
    });
    }

    module.exports = {
    notFoundHandler,
    errorHandler
    };