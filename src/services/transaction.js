const validarionError = require('../errors/ValidationError');

module.exports = (app) => {
  const find = (userId, filter = {}) => {
    return app.db('transactions')
      .join('accounts', 'accounts.id', 'acc_id')
      .where(filter)
      .andWhere('accounts.users_id', '=', userId)
      .select();
  }

  const findOne = (filter) => {
    return app.db('transactions')
      .where(filter)
      .first();
  };

  const save = (transaction) => {

    if (!transaction.description) throw new validarionError('Descrição é um atributo obrigatorio.');
    if (!transaction.ammount) throw new validarionError('Valor é um atributo obrigatorio.');
    if (!transaction.date) throw new validarionError('Data é um atributo obrigatorio.');
    if (!transaction.acc_id) throw new validarionError('Conta é um atributo obrigatorio.');
    if (!transaction.type) throw new validarionError('Tipo é um atributo obrigatorio.');
    if (!(transaction.type === 'I' || transaction.type === 'O')) throw new validarionError('Este tipo não existe.');
    
    
    const newTransaction = {...transaction}
    if ((transaction.type === 'I' && transaction.ammount < 0)
     || (transaction.type === 'O' && transaction.ammount > 0)) {
      newTransaction.ammount *= -1;
    }
    return app.db('transactions')
      .insert(newTransaction, '*');
  }

  const update = (id, transaction) => {
    return app.db('transactions')
      .where({ id })
      .update(transaction, '*')
  }

  const remove = (id) => {
    return app.db('transactions')
      .where({ id })
      .del();
  };

  return { find, save, findOne, update, remove };
}