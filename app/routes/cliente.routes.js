module.exports = (app) => {
  const c = require('../controllers/clientes.controller');
  const base = '/clientes';
  app.post(base, c.create);
  app.get(base, c.findAll);
  app.get(`${base}/:clienteId`, c.findOne);
  app.put(`${base}/:clienteId`, c.update);
  app.delete(`${base}/:clienteId`, c.delete);
  app.delete(base, c.deleteAll);
};
