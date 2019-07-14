/** Vai criar uma exportação de outra aeroFunction e passando por paramentro
 * o app e nela pega as rotas.
 */
module.exports = (app) => {

  app.route('/auth/signin').post(app.routes.auth.signin);

  /**Routes para usuario */
  app.route('/users') // A palavra route é uma palavra reservada.
    .all(app.config.passport.authenticate())
    .get(app.routes.users.findAll)
    .post(app.routes.users.create);

  /**Routes para as contas */
  app.route('/accounts')
    .all(app.config.passport.authenticate())
    .get(app.routes.accounts.getAll)
    .post(app.routes.accounts.create);

  app.route('/accounts/:id')
    .all(app.config.passport.authenticate())
    .get(app.routes.accounts.get)
    .put(app.routes.accounts.update)
    .delete(app.routes.accounts.remove);
};
