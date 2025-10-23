const pool = require('./db');

const Cliente = {};

Cliente.create = async (nuevo) => {
  const { nombre, email, telefono } = nuevo;
  const q = `INSERT INTO clientes (nombre, email, telefono) VALUES ($1,$2,$3) RETURNING id, nombre, email, telefono`;
  const { rows } = await pool.query(q, [nombre, email, telefono || null]);
  return rows[0];
};

Cliente.findById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);
  return rows[0] || null;
};

Cliente.getAll = async () => {
  const { rows } = await pool.query('SELECT * FROM clientes ORDER BY id DESC');
  return rows;
};

Cliente.updateById = async (id, c) => {
  const q = `UPDATE clientes SET nombre=$1, email=$2, telefono=$3 WHERE id=$4 RETURNING id, nombre, email, telefono`;
  const { rows } = await pool.query(q, [c.nombre, c.email, c.telefono || null, id]);
  return rows[0] || null;
};

Cliente.remove = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM clientes WHERE id=$1', [id]);
  return rowCount > 0;
};

Cliente.removeAll = async () => {
  const { rowCount } = await pool.query('DELETE FROM clientes');
  return rowCount;
};

module.exports = Cliente;
