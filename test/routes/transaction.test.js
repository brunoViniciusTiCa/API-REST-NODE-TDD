const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const MAIN_ROUTE = '/v1/transactions';
let user;
let user2;
let accUser;
let accUser2;

beforeAll(async () => {
   await app.db('transactions').del();
   await app.db('accounts').del();
   await app.db('users').del();
   const users = await app.db('users').insert([
    { name: 'User #1', mail: 'user@mail.com', passwd: '	$2a$10$BAu953PM.v7fgqn/wrwSyOV.aEP38d4iOlBCYX1U0qV.mAM6xeUr2' },
    { name: 'User #2', mail: 'user2@mail.com', passwd: '	$2a$10$BAu953PM.v7fgqn/wrwSyOV.aEP38d4iOlBCYX1U0qV.mAM6xeUr2' },
   ], '*');
   [user, user2] = users;
   delete user.passwd;
   user.token = jwt.encode(user, 'Segredo');
   const accs = await app.db('accounts').insert([
     { name: 'Acc #1', users_id: user.id },
     { name: 'Acc #2', users_id: user2.id },
   ], '*');
   [accUser, accUser2] = accs;
});

test('Deve listar apenas a transações do usuario', () => {
  return app.db('transactions').insert([
    { description: 'T1', date: new Date(), ammount: 100, type: 'I', acc_id: accUser.id },
    { description: 'T2', date: new Date(), ammount: 300, type: 'O', acc_id: accUser2.id },
  ]).then(() => request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].description).toBe('T1');
    }));
});

test('Deve inserir uma transação com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ description: 'New T', date: new Date(), ammount: 100, type: 'I', acc_id: accUser.id })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.acc_id).toBe(accUser.id);
      expect(res.body.ammount).toBe('100.00');
    });
});

test('Transações de entrada devem ser positivas', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ description: 'New T', date: new Date(), ammount: 100, type: 'I', acc_id: accUser.id })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.acc_id).toBe(accUser.id);
      expect(res.body.ammount).toBe('100.00');
    });
});

test('Transações de saída devem ser negativas', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ description: 'New T', date: new Date(), ammount: 100, type: 'O', acc_id: accUser.id })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.acc_id).toBe(accUser.id);
      expect(res.body.ammount).toBe('-100.00');
    });
});

test('Não deve inserir uma transação sem descrição', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ date: new Date(), ammount: 100, type: 'I', acc_id: accUser.id })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Descrição é um atributo obrigatorio.');
    });
});
test('Não deve inserir uma transação sem valor', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ description: 'New T', date: new Date(), type: 'I', acc_id: accUser.id })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Valor é um atributo obrigatorio.');
      });
});
test('Não deve inserir uma transação sem data', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ description: 'New T', ammount: 100, type: 'I', acc_id: accUser.id })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Data é um atributo obrigatorio.');
      });
});

test('Não deve inserir uma transação sem conta', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ description: 'New T', date: new Date(), ammount: 100, type: 'O' })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Conta é um atributo obrigatorio.');
      });
});
test('Não deve inserir uma transação sem tipo', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ description: 'New T', date: new Date(), ammount: 100, acc_id: accUser.id })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Tipo é um atributo obrigatorio.');
    });
});

test('Não deve inserir uma transação com tipo invalido', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ description: 'New T', date: new Date(), ammount: 100, type: 'R', acc_id: accUser.id })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Este tipo não existe.');
    });
});

test('Deve retornar uma transação por ID', () => {
  return app.db('transactions').insert(
    { description: 'T ID', date: new Date(), ammount: 100, type: 'I', acc_id: accUser.id }, ['id']
  ).then(trans => request(app).get(`${MAIN_ROUTE}/${trans[0].id}`)
    .set('authorization', `bearer ${user.token}`)
    .then((res) =>{
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(trans[0].id);
      expect(res.body.description).toBe('T ID');
    }));
});

test('Deve alterar uma transação', () => {
  return app.db('transactions')
    .insert({ description: 'to Update', date: new Date(), ammount: 100, type: 'I', acc_id: accUser.id }, ['id']
    ).then(trans => request(app).put(`${MAIN_ROUTE}/${trans[0].id}`)
    .set('authorization', `bearer ${user.token}`)
      .send({ description: 'Updated' })
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.description).toBe('Updated');
    }));
});

test('Deve remover uma transação', () => {
  return app.db('transactions').insert({ description: 'to Delete', date: new Date(), ammount: 100, type: 'I', acc_id: accUser.id }, ['id'] 
  ).then(trans => request(app).delete(`${MAIN_ROUTE}/${trans[0].id}`)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(204);
    }));
});

test('Não deve remover transação de outro usuario', () => {
  return app.db('transactions').insert({ description: 'to Delete', date: new Date(), ammount: 100, type: 'I', acc_id: accUser2.id }, ['id'] 
  ).then(trans => request(app).delete(`${MAIN_ROUTE}/${trans[0].id}`)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Este recurso não pertence ao usuario');
    }));
});

test('Não deve remover conta com transação', () => {
  return app.db('transactions').insert({ description: 'to Delete', date: new Date(), ammount: 100, type: 'I', acc_id: accUser.id
  }, ['id']).then(() => request(app).delete(`/v1/accounts/${accUser.id}`)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Essa conta possui transações associadas');
    }));
});

