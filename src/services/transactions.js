module.exports = (app) => {
  const find = (userId,filter = {}) => {
    return app.db('transacionts')
      .join('accounts', 'accounts.id', 'acc_id')
      .where(filter)
      .endWhere('accounts.users_id', '=', userId )
      .select();
  }

  return { find };
}