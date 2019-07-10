const validationError = require('../errors/ValidationError');

module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('users').where(filter).select();
  };

  const save = async (user) => {
    if (!user.name)  throw new validationError ('Nome é um atributo obrigatorio');
    if (!user.mail)  throw new validationError ('Email é um atributo obrigatorio');
    if (!user.passwd)  throw new validationError ('Senha é um atributo obrigatorio');

    const userDB = await findAll({ mail: user.mail });

    if (userDB && userDB.length > 0) throw new validationError ('Já existe usuario com esse email');

    return app.db('users').insert(user, '*');
  };

  return { findAll, save };
};
