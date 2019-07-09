const request = require('supertest');
const app = require('../../src/app');

/** Usei a variavel Main_route para manuziar melhor. Sabendo que a rota mesmo é: '/accounts' */
const MAIN_ROUTE = '/accounts';
let user;

/**  */
beforeAll(async () => {
  const res = await app.services.user.save({ name: 'User Account', mail: `${Date.now()}@gmail.com`, passwd: '123456' });
  user = { ...res[0] };
});

/** Nesse teste é apenas para verificar se inseriu uma conta. Dar um resquest passando app por paramentro,
 *  e o verbo post e dizendo em qual rota é pra adicionar. Depois o send envia os dados. Depois trata a promisse
 *  com o then e passando result como parametro. Depois vem as expectativas.
 */
test('Deve inserir uma conta com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ name: 'Acc #1', users_id: user.id })
    .then((result) => {
      expect(result.status).toBe(201);
      expect(result.body.name).toBe('Acc #1');
    });
});

test('Devo listar todas as contas', () => {
  return app.db('accounts')
    .insert({ name: 'Acc list ', users_id: user.id })
    .then(() => request(app).get(MAIN_ROUTE))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Deve retornar uma conta por Id', () => {
  return app.db('accounts')
    .insert({ name: 'Acc By Id', users_id: user.id }, ['id'])
    .then(acc => request(app).get(`${MAIN_ROUTE}/${acc[0].id}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Acc By Id');
      expect(res.body.users_id).toBe(user.id);
    });
});

/** Teste para alterar uma conta! Na parte do insert, ele já insere e já passa como o ultimo parametro o ID,
 *  Em seguida ele faz uma promise e enviar o que ele quer mudar, no caso o nome = acc Update.
 *  Depois na expectativa ele pega o resultado 200 para avisar que tudo ocorreu bem e em baixo o valor alterado.
 */
test('Deve alterar uma conta', () => {
  return app.db('accounts')
    .insert({ name: 'Acc To Upadate', users_id: user.id }, ['id'])
    .then(acc => request(app).put(`${MAIN_ROUTE}/${acc[0].id}`)
      .send({ name: 'Acc Updated' }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Acc Updated');
    });
});
