const Cliente = require('../models/cliente.model');

exports.create = async (req, res) => {
  try {
    const { nombre, email, telefono } = req.body || {};
    if (!nombre || !email) return res.status(400).json({ message: 'nombre y email son obligatorios' });
    const data = await Cliente.create({ nombre, email, telefono });
    res.status(201).json(data);
  } catch (e) {
    if ((e.code || '').toString() === '23505') { // unique_violation
      return res.status(409).json({ message: 'El email ya existe' });
    }
    res.status(500).json({ message: e.message || 'Error al crear' });
  }
};

exports.findAll = async (_req, res) => {
  try {
    const data = await Cliente.getAll();
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message || 'Error al listar' });
  }
};

exports.findOne = async (req, res) => {
  try {
    const item = await Cliente.findById(req.params.clienteId);
    if (!item) return res.status(404).json({ message: 'No encontrado' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ message: e.message || 'Error al consultar' });
  }
};

exports.update = async (req, res) => {
  try {
    const { nombre, email, telefono } = req.body || {};
    if (!nombre || !email) return res.status(400).json({ message: 'nombre y email son obligatorios' });
    const item = await Cliente.updateById(req.params.clienteId, { nombre, email, telefono });
    if (!item) return res.status(404).json({ message: 'No encontrado' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ message: e.message || 'Error al actualizar' });
  }
};

exports.delete = async (req, res) => {
  try {
    const ok = await Cliente.remove(req.params.clienteId);
    if (!ok) return res.status(404).json({ message: 'No encontrado' });
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ message: e.message || 'Error al eliminar' });
  }
};

exports.deleteAll = async (_req, res) => {
  try {
    const count = await Cliente.removeAll();
    res.json({ message: `Eliminados: ${count}` });
  } catch (e) {
    res.status(500).json({ message: e.message || 'Error al vaciar' });
  }
};
