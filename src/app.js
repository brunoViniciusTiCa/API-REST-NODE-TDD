/** Fazendo as requisições */
const app = require('express')();
const consign = require('consign');

/** Consign esta responsavel para trazer para o arquivo app as rotas e os middlewares,
 * e assim distribuindo a apliação e deixando mais partilhadas.
 */
consign({
  cwd: 'src',
  verbose: false
})
  .include('./config/middlewares.js')
  .then('./routes')
  .then('./config/routes.js')
  .into(app);

/** Rota raiz para teste. */
app.get('/', (req, res) => {
  res.status(200).send();
});

/** Para fazer a exportação do APP */
module.exports = app;
