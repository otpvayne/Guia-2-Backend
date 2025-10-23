-- Ejecuta esto una sola vez al crear la base en PostgreSQL
CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  telefono VARCHAR(30),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
