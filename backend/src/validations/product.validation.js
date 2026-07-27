    
    // Este archivo define las validaciones para las operaciones relacionadas con los productos en una aplicación Express.
    
    
    const { body, param, query } = require("express-validator");

    const createProductValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("El nombre es obligatorio")
        .isLength({ min: 2, max: 150 })
        .withMessage("El nombre debe contener entre 2 y 150 caracteres"),

    body("barcode")
        .trim()
        .notEmpty()
        .withMessage("El código de barras es obligatorio")
        .isLength({ min: 3, max: 100 })
        .withMessage("El código de barras debe contener entre 3 y 100 caracteres"),

    body("price")
        .notEmpty()
        .withMessage("El precio es obligatorio")
        .isFloat({ gt: 0, max: 99999999.99 })
        .withMessage("El precio debe ser mayor que cero"),

    body("description")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 500 })
        .withMessage("La descripción no puede superar los 500 caracteres"),

    body("active")
        .optional()
        .isBoolean()
        .withMessage("El estado activo debe ser verdadero o falso"),
    ];

    const updateProductValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El identificador del producto no es válido"),

    body("name")
        .trim()
        .notEmpty()
        .withMessage("El nombre es obligatorio")
        .isLength({ min: 2, max: 150 })
        .withMessage("El nombre debe contener entre 2 y 150 caracteres"),

    body("barcode")
        .trim()
        .notEmpty()
        .withMessage("El código de barras es obligatorio")
        .isLength({ min: 3, max: 100 })
        .withMessage("El código de barras debe contener entre 3 y 100 caracteres"),

    body("price")
        .notEmpty()
        .withMessage("El precio es obligatorio")
        .isFloat({ gt: 0, max: 99999999.99 })
        .withMessage("El precio debe ser mayor que cero"),

    body("description")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 500 })
        .withMessage("La descripción no puede superar los 500 caracteres"),

    body("active")
        .optional()
        .isBoolean()
        .withMessage("El estado activo debe ser verdadero o falso"),
    ];

    const productIdValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El identificador del producto no es válido"),
    ];

    const listProductsValidation = [
    query("search")
        .optional()
        .trim()
        .isLength({ max: 150 })
        .withMessage("El término de búsqueda es demasiado largo"),

    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("La página debe ser mayor o igual a 1"),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("El límite debe estar entre 1 y 100"),
    ];

    module.exports = {
    createProductValidation,
    updateProductValidation,
    productIdValidation,
    listProductsValidation,
    };
