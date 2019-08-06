const request = require('supertest');
const app = require('../../src/app');
const jwt = require('jwt-simple');

/** Usei a variavel Main_route para manuziar melhor. Sabendo que a rota mesmo é: '/accounts' */
const MAIN_ROUTE = '/v1/accounts';
let user;
let user2;

/**  */
beforeEach(async () => {
  const res = await app.services.user.save({ name: 'User Account', mail: `${Date.now()}@gmail.com`, passwd: '123456' });
  user = { ...res[0] };
  user.token = jwt.encode(user, 'Segredo');
  const res2 = await app.services.user.save({ name: 'User Account #2', mail: `${Date.now()}@gmail.com`, passwd: '123456' });
  user2 = {
    ...res2[0]
  };
});

/** Nesse teste é apenas para verificar se inseriu uma conta. Dar um resquest passando app por paramentro,
 *  e o verbo post e dizendo em qual rota é pra adicionar. Depois o send envia os dados. Depois trata a promisse
 *  com o then e passando result como parametro. Depois vem as expectativas.
 */
test('Deve inserir uma conta com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ name: 'Acc #3' })
    .then((result) => {
      expect(result.status).toBe(201);
      expect(result.body.name).toBe('Acc #3');
    });
});

test('Não deve inserir uma conta sem nome', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ })
    .then((result) => {
      expect(result.status).toBe(400);
      expect(result.body.error).toBe('Nome é um atributo obrigatorio');
    });
});

test('Não deve inserir uma conta de nome duplicado, para o mesmo usuário', () => {
  return app.db('accounts').insert({ name: 'Acc duplicado', users_id: user.id })
    .then(() => request(app).post(MAIN_ROUTE)
      .set('authorization', `bearer ${user.token}`)
      .send({ name: 'Acc duplicado' }))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Já existe conta com esse nome');
    });
});

test('Deve listar apenas as contas do usuario', () => {
  return app.db('accounts').insert([
   { name: 'Acc User #1', users_id: user.id },
   { name: 'Acc User #2', users_id: user2.id },
  ]).then(() => request(app).get(MAIN_ROUTE)
  .set('authorization', `bearer ${user.token}`)
  .then((res) => {
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].name).toBe('Acc User #1');
  }));
});

test('Deve retornar uma conta por Id', () => {
  return app.db('accounts')
    .insert({ name: 'Acc By Id', users_id: user.id }, ['id'])
    .then(acc => request(app).get(`${MAIN_ROUTE}/${acc[0].id}`)
    .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Acc By Id');
      expect(res.body.users_id).toBe(user.id);
    });
});

test('Não deve retornar uma conta de outro usuario', () => {
  return app.db('accounts')
    .insert({ name: 'Acc User #2', users_id: user2.id }, ['id'])
    .then(acc => request(app).get(`${MAIN_ROUTE}/${acc[0].id}`)
    .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Este recurso não pertence ao usuario');
    })
});

/** Teste para alterar uma conta! Na parte do insert, ele já insere e já passa como o ultimo parametro o ID,
 *  Em seguida ele faz uma promise e enviar o que ele quer mudar, no caso o nome = acc Update.
 *  Depois na expectativa ele pega o resultado 200 para avisar que tudo ocorreu bem e em baixo o valor alterado.
 */
test('Deve alterar uma conta', () => {
  return app.db('accounts')
    .insert({ name: 'Acc To Upadate', users_id: user.id }, ['id'])
    .then(acc => request(app).put(`${MAIN_ROUTE}/${acc[0].id}`)
    .set('authorization', `bearer ${user.token}`)
      .send({ name: 'Acc Updated' }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Acc Updated');
    });
});

test('Não deve alterar uma conta de outro usuario', () => {
  return app.db('accounts')
    .insert({ name: 'Acc User #2', users_id: user2.id }, ['id'])
    .then(acc => request(app).put(`${MAIN_ROUTE}/${acc[0].id}`)
      .send({ name: 'Acc Updated' })
      .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Este recurso não pertence ao usuario');
    })
});


test('Deve remover uma conta', () => {
  return app.db('accounts')
    .insert({ name: 'Acc to remove', users_id: user.id }, ['id'])
    .then(acc => request(app).delete(`${MAIN_ROUTE}/${acc[0].id}`)
    .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

test('Não deve remover uma conta de outro usuario', () => {
  return app.db('accounts')
    .insert({ name: 'Acc User #2', users_id: user2.id }, ['id'])
    .then(acc => request(app).delete(`${MAIN_ROUTE}/${acc[0].id}`)
      .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Este recurso não pertence ao usuario');
    })
});
