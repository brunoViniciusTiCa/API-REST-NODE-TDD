module.exports = (app) => {

  /** serviço para inserir uma conta. Não é muito diferente da logica de um insert no db.
   *  cria uma function save e passa por parametro o account. Depois uma conexão com o banco com
   *  app.db passando no parametro a tabela (accounts).insert. E dentro do insert como parametro,
   *  passamos o account e o "*" que é pra dizer pra inserir tudo. 
   */
  const save = (account) => {
    return app.db('accounts').insert(account, '*');
  };

  const findAll = () => {
    return app.db('accounts');
  };

  const find = (filter = {}) => {
    return app.db('accounts').where(filter).first();
  };

  const update = (id, account) => {
    return app.db('accounts')
      .where({ id })
      .update(account, '*');
  };

  return { 
    save, findAll, find, update, 
  };
};
