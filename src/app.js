const express = require('express');
const consign = require('consign');
const knex = require('knex');
const knexfile = require('../knexfile');

const app = express();

app.db = knex(knexfile.test);

consign({ cwd: 'src', verbose: false })
  .include('./config/passport.js')
  .then('./config/middlewares.js')
  .then('./services')
  .then('./routes')
  .then('./config/router.js')
  .into(app);

app.get('/', (req, res) => {
  res.status(200).send();
});

/** Validação de error caso no browser seja solicitado uma rota que não exista.
 *  Esta middleware cuidará para isso.
 */
app.use((err, req, res, next) => {
  const { name, message, stack } = err;
  if (name === 'ValidationError') res.status(400).json({ error: message });
  if (name === 'RecursosIndevidoError') res.status(403).json({ error: message });
  else res.status(500).json({ name, message, stack }); 
  next(err);
});

/* app.db.on('query', (query) => {
  console.log({
    sql: query.sql,
    bindings: query.bindings ? query.bindings.join(',') : ' '
  });
}).on('query-response', (response) => {
  console.log(response);
}).on('error', error => console.log(error)); */

module.exports = app;
