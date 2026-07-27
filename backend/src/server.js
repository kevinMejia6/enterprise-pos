
// Este archivo es el punto de entrada principal para la aplicación Express. Configura y arranca el servidor, 
// estableciendo la conexión con la base de datos y escuchando en un puerto específico.  

require('dotenv').config();

const app = require('./app');
const db = require('./models');

const PORT = Number(process.env.PORT || 3000);

async function startServer() {
  try {
    await db.sequelize.authenticate();

    console.log('✅ Conexión con MariaDB establecida correctamente.');

    app.listen(PORT, () => {
      console.log('');
      console.log('==========================================');
      console.log('🚀 Enterprise POS API iniciada');
      console.log(`🌐 http://localhost:${PORT}`);
      console.log(`🩺 http://localhost:${PORT}/api/v1/health`);
      console.log(`📦 http://localhost:${PORT}/api/v1/products`);
      console.log('==========================================');
      console.log('');
    });
  } catch (error) {
    console.error('❌ No fue posible iniciar Enterprise POS.');
    console.error(error.message);

    process.exit(1);
  }
}

startServer();