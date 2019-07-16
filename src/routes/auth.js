const express = require('express');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const validationError = require('../../src/errors/ValidationError');

const secret = 'Segredo';

module.exports = (app) => {
  const router = express.Router();

  router.post('/signin', (req, res, next) => {
    app.services.user.findOne({ mail: req.body.mail }) 
    .then((user) => {

      if (!user) throw new validationError('Usuario ou senha invalido');
      if (bcrypt.compareSync(req.body.passwd, user.passwd)){
        const payload ={
          id: user.id,
          name: user.name,
          mail: user.mail,
        };
        const token = jwt.encode(payload, secret)
        res.status(200).json({ token });
      } else throw new validationError('Usuario ou senha invalido');
    }).catch(err => next(err));
  });

  return { router };
}