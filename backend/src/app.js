    
    
    // Este archivo define la configuración principal de la aplicación Express, incluyendo middlewares de seguridad, registro, compresión y manejo de errores. 
    
    const express = require('express');
    const cors = require('cors');
    const helmet = require('helmet');
    const morgan = require('morgan');
    const compression = require('compression');

    const routes = require('./routes');

    const {
    notFoundHandler,
    errorHandler
    } = require('./middlewares/errorHandler');

    const app = express();

    app.disable('x-powered-by');

    app.use(helmet());

    app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:8080',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
    );

    app.use(compression());
    app.use(morgan('dev'));

    app.use(
    express.json({
        limit: '2mb'
    })
    );

    app.use(
    express.urlencoded({
        extended: true
    })
    );

    app.use('/api/v1', routes);

    app.use(notFoundHandler);
    app.use(errorHandler);

    module.exports = app;