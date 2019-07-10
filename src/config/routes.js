/** Vai criar uma exportação de outra aeroFunction e passando por paramentro
 * o app e nela pega as rotas.
 */
module.exports = (app) => {

  /**Routes para usuario */
  app.route('/users') // A palavra route é uma palavra reservada.
    .get(app.routes.users.findAll)
    .post(app.routes.users.create);

  /**Routes para as contas */
  app.route('/accounts')
    .get(app.routes.accounts.getAll)
    .post(app.routes.accounts.create);

  app.route('/accounts/:id')
    .get(app.routes.accounts.get)
    .put(app.routes.accounts.update)
    .delete(app.routes.accounts.remove);
};
