const { Pool } = require('pg');
const cfg = require('../config/db.config');

const pool = new Pool({
  connectionString: cfg.DATABASE_URL,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false
});

pool.connect().then(c => {
  console.log('Conectado a PostgreSQL.');
  c.release();
}).catch(err => {
  console.error('Error de conexión a PostgreSQL:', err);
  process.exit(1);
});

module.exports = pool;
