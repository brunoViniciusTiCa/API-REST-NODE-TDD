const validationError = require('../errors/ValidationError');
const bcrypt = require('bcrypt-nodejs');

module.exports = (app) => {
  const findAll = () => {
    return app.db('users').select(['id', 'name', 'mail']);
  };

  const findOne = (filter = {}) => {
    return app.db('users').where(filter).first();
  };

  const getPasswdHash = (passwd) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(passwd, salt);
  }

  const save = async (user) => {
    if (!user.name)  throw new validationError ('Nome é um atributo obrigatorio');
    if (!user.mail)  throw new validationError ('Email é um atributo obrigatorio');
    if (!user.passwd)  throw new validationError ('Senha é um atributo obrigatorio');

    const userDB = await findOne({ mail: user.mail });
    if (userDB) throw new validationError ('Já existe usuario com esse email');

    const newUser = { ...user };
    user.passwd = getPasswdHash(user.passwd);
    return app.db('users').insert(user, ['id', 'name', 'mail']);
  };

  return { findAll, save, findOne };
};
