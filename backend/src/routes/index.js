
// Este archivo define las rutas principales de la aplicación Express, incluyendo una ruta de salud y las rutas relacionadas con los productos.

const express = require('express');
const productRoutes = require('./product.routes');

const router = express.Router();

router.get('/health', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Enterprise POS API funcionando correctamente',
    data: {
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    }
  });
});

router.use('/products', productRoutes);

module.exports = router;