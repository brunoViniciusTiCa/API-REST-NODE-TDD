const validationError = require('../errors/ValidationError');

module.exports = (app) => {

  /** serviço para inserir uma conta. Não é muito diferente da logica de um insert no db.
   *  cria uma function save e passa por parametro o account. Depois uma conexão com o banco com
   *  app.db passando no parametro a tabela (accounts).insert. E dentro do insert como parametro,
   *  passamos o account e o "*" que é pra dizer pra inserir tudo. 
   */

  const findAll = (usersId) => {
    return app.db('accounts').where({ users_id: usersId }); 
  };

  const find = (filter = {}) => {
    return app.db('accounts').where(filter).first();
  };


  const save = async (account) => {
    if (!account.name) throw new validationError('Nome é um atributo obrigatorio');

    const accDb = await find({ name: account.name, users_id: account.users_id });
    if (accDb) throw new validationError('Já existe conta com esse nome');

    return app.db('accounts').insert(account, '*'); 
  };

  const update = (id, account) => {
    return app.db('accounts')
      .where({ id })
      .update(account, '*');
  };

  const remove = (id) => {
    return app.db('accounts')
    .where ({ id })
    .del()
  }

  return { findAll, find, save, update, remove };
};
