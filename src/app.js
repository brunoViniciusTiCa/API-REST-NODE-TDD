/** Requisitanto os frames que seram usados, no caso
 *  expresse e o consign.
 */
const express = require('express');
const consign = require('consign');
const knex = require('knex');
const knexfile = require('../knexfile');

const app = express();

// TODO criar chaveamento dinamico
app.db = knex(knexfile.test);

/** Consign esta responsavel para trazer para o arquivo app as rotas e os middlewares,
 * e assim distribuindo a apliação e deixando mais partilhadas.
 */
consign({
  cwd: 'src',
  verbose: false
})
  .include('./config/middlewares.js')
  .then('./config/routes.js')
  .then('./routes')
  .into(app);

/** Rota raiz para teste. */
app.get('/', (req, res) => {
  res.status(200).send();
});

/** Para fazer a exportação do APP */
module.exports = app;
