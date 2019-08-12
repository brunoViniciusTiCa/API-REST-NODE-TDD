
exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('transactions').del()
    .then(() => knex('transfers').del())
    .then(() => knex('accounts').del())
    .then(() => knex('users').del())
    .then(() => knex('users').insert([
      { id:10000, name: 'Longuinho user #1', mail: 'user1@gmail.com', passwd: '	$2a$10$BAu953PM.v7fgqn/wrwSyOV.aEP38d4iOlBCYX1U0qV.mAM6xeUr2' },
      { id:10001, name: 'Valtinho user #2',  mail: 'user2@gmail.com', passwd: '	$2a$10$BAu953PM.v7fgqn/wrwSyOV.aEP38d4iOlBCYX1U0qV.mAM6xeUr2' }
    ]))
    .then(() => knex('accounts').insert([
      { id: 10000, name: 'AccO #1', users_id: 10000 },
      { id: 10001, name: 'AccD #1', users_id: 10000 },
      { id: 10002, name: 'AccD #2', users_id: 10001 },
      { id: 10003, name: 'AccD #2', users_id: 10001 },
    ]))
    .then(() => knex('transfers').insert([
      { id: 10000, description: 'Transfer user#1', users_id: 10000, acc_ori_id: 10000, acc_dest_id: 10001, ammount: 100, date: new Date() },
      { id: 10001, description: 'Transfer user#2', users_id: 10001, acc_ori_id: 10002, acc_dest_id: 10003, ammount: 100, date: new Date() }
    ]))
    .then(() => knex('transations').insert([
      { description: 'Transfer from AccO #1', date: new Date(), ammount: 100, type: 'I', acc_id: 10001, transfer_id: 10000 },
      { description: 'Transfer to AccD #1', date: new Date(), ammount: -100, type: 'O', acc_id: 10000, transfer_id: 10000  },
      { description: 'Transfer from AccO #2', date: new Date(), ammount: 100, type: 'I', acc_id: 10003, transfer_id: 10001 }, 
      { description: 'Transfer to AccD #2', date: new Date(), ammount: -100, type: 'O', acc_id: 10002, transfer_id: 10001 }
    ]))
};
