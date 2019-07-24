/** Importando arquivos ou Frames */
const express = require('express');
const consign = require('consign');
const knex = require('knex');
const knexfile = require('../knexfile');

const app = express();

app.db = knex(knexfile.test);

/** Usando o consign para modularizar a aplicação e subdivir todos os caminhos.
 * Assim o consign fica responsável de colocar tudo no App. Sem que o arquivo fique
 * gigante.
 */
consign({ cwd: 'src', verbose: false })
  .include('./config/passport.js')
  .then('./config/middlewares.js')
  .then('./services')
  .then('./routes')
  .then('./config/router.js')
  .into(app);

  /** Usando o verbo para fazer um teste na rota raiz e assim passando um status 
   * 200 apenas para teste.*/
app.get('/', (req, res) => {
  res.status(200).send();
});

/** Validação de error caso no browser seja solicitado uma rota que não exista.
 *  Assim criei dois arquivos de error e faço as validações para verificar que esta
 *  rodando certinho.
 */
app.use((err, req, res, next) => {
  const { name, message, stack } = err;
  if (name === 'ValidationError') res.status(400).json({ error: message });
  if (name === 'RecursosIndevidoError') res.status(403).json({ error: message });
  else res.status(500).json({ name, message, stack }); 
  next(err);
});

module.exports = app;
