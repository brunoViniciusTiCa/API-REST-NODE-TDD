const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const mail = `${Date.now()}@mail.com`;
const MAIN_ROUTE = '/v1/users'
let user;

/**  */
beforeAll(async () => {
  const res = await app.services.user.save({ name: 'User Account', mail: `${Date.now()}@mail.com`, passwd: '123456' });
  user = { ...res[0] };
  user.token = jwt.encode(user, 'Segredo');
});

test('Devo listar todos os usuarios', () => {
  return request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0); // numA > numB
    });
});

test('Devo inserir usuario com sucesso', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ name: 'Bruno Vinicius Felix', mail, passwd: '123456' })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Bruno Vinicius Felix');
      expect(res.body).not.toHaveProperty('passwd');
    });
});

test('Deve armazenar senha criptografada', async () => {
  const res = await request(app).post(MAIN_ROUTE)
    .send({ name: 'Bruno Vinicius Felix', mail: `${Date.now()}@mail.com`, passwd: '123456' })
    .set('authorization', `bearer ${user.token}`);
    expect(res.status).toBe(201);
    
    const { id } = res.body;
    const userDB = await app.services.user.findOne({ id });
    expect(userDB.passwd).not.toBeUndefined();
    expect(userDB.passwd).not.toBe('123456');
});

test('Não deve inserir usuario sem nome', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ mail: 'Luiz@gmail.com', passwd: '123456' })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Nome é um atributo obrigatorio');
    });
});

test('Não deve inserir usuario sem Email!', async () => {
  const result = await request(app).post(MAIN_ROUTE)
    .send({ name: 'Ruan', passwd: '008776' })
    .set('authorization', `bearer ${user.token}`);
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('Email é um atributo obrigatorio');
});

test('Não deve inserir usuario sem Senha', (done) => {
  request(app).post(MAIN_ROUTE)
    .send({ name: 'Bili Carter', mail: 'Billi@gmail.com' })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Senha é um atributo obrigatorio');
      done();
    });
});

test('Não deve inserir usuario se já existir Email', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ name: 'Bruno Vinicius Felix', mail, passwd: '123456' })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Já existe usuario com esse email');
    });
});
