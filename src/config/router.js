const express = require('express');

module.exports = (app) => {
  app.use('/auth', app.routes.auth);
  const protectedRouter = express.Router();

  
  protectedRouter.use('/users',  app.routes.users);
  protectedRouter.use('/accounts',  app.routes.accounts);
  protectedRouter.use('/transactions', app.routes.transactions);
  protectedRouter.use('/transfers', app.routes.transfers);

  app.get('/v1', (req, res) => res.status(200).send('Faça o login. Você não esta autorizado!'));
  app.get('/v1/users', (req, res) => res.status(200).send('Você não esta autorizado!'));
  app.use('/v1', app.config.passport.authenticate(), protectedRouter);

  app.get('/v2', (req, res) => res.status(200).send('V2 esta rodando na segunda rota sem está protegida.'));
  app.get('/v2/users', (req, res) => res.status(200).send('V2/users esta rodando na segunda rota sem está protegida.'));
  app.use('/v2', protectedRouter);
};
