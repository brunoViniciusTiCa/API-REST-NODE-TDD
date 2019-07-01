module.exports = (app) => {
  app.route('/users') // A palavra route é uma palavra reservada.
    .get(app.routes.users.findAll)
    .post(app.routes.users.create);
};
