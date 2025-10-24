// server.js
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de conexión a PostgreSQL (Render)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Render la provee automáticamente
  ssl: { rejectUnauthorized: false } // necesario en Render
});

// Verificar conexión
pool.connect()
  .then(() => console.log('✅ Conectado correctamente a PostgreSQL en Render'))
  .catch((err) => console.error('❌ Error de conexión a PostgreSQL:', err.message));

// Endpoint raíz
app.get('/', (req, res) => {
  res.send('🚀 API de clientes activa con PostgreSQL en Render');
});

// Endpoint para listar clientes
app.get('/api/clientes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error en /api/clientes:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para crear un nuevo cliente
app.post('/api/clientes', async (req, res) => {
  try {
    const { nombre, email, telefono } = req.body;
    if (!nombre || !email) {
      return res.status(400).json({ error: 'Nombre y correo son obligatorios' });
    }
    const result = await pool.query(
      'INSERT INTO clientes (nombre, email, telefono) VALUES ($1,$2,$3) RETURNING *',
      [nombre, email, telefono || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error en POST /api/clientes:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 1337;
app.listen(PORT, () => console.log(`🌐 Servidor escuchando en puerto ${PORT}`));

// Crear tabla y poblarla automáticamente
(async () => {
  try {
    // 1️⃣ Crear tabla si no existe
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        telefono VARCHAR(30),
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla clientes creada o ya existente');

    // 2️⃣ Insertar datos iniciales
    await pool.query(`
      INSERT INTO clientes (nombre, email, telefono) VALUES
      ('Ana Pérez', 'ana@example.com', '+57 3001111111'),
      ('Carlos Gómez', 'carlos@example.com', '+57 3012222222'),
      ('María López', 'maria@example.com', '+57 3023333333'),
      ('Andrés Rojas', 'andres@example.com', '+57 3034444444'),
      ('Paula Díaz', 'paula@example.com', '+57 3045555555'),
      ('Camilo Suárez', 'camilo@example.com', '+57 3056666666')
      ON CONFLICT (email) DO NOTHING;
    `);
    console.log('✅ Datos iniciales de clientes insertados');
  } catch (err) {
    console.error('❌ Error creando tabla clientes:', err.message);
  }
})();
// Obtener un cliente por id (opcional)
app.get('/api/clientes/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM clientes WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Actualizar (PUT)
app.put('/api/clientes/:id', async (req, res) => {
  try {
    const { nombre, email, telefono } = req.body || {};
    if (!nombre || !email) return res.status(400).json({ error: 'Nombre y email son obligatorios' });

    const { rows } = await pool.query(
      `UPDATE clientes SET nombre=$1, email=$2, telefono=$3 WHERE id=$4
       RETURNING id, nombre, email, telefono, creado_en`,
      [nombre, email, telefono || null, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (e) {
    if ((e.code || '') === '23505') return res.status(409).json({ error: 'El email ya existe' });
    res.status(500).json({ error: e.message });
  }
});

// Eliminar (DELETE)
app.delete('/api/clientes/:id', async (req, res) => {
  try {
    const r = await pool.query('DELETE FROM clientes WHERE id=$1', [req.params.id]);
    if (r.rowCount === 0) return res.status(404).json({ error: 'No encontrado' });
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
