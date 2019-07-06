const request = require('supertest');

const app = require('../../src/app');

test('Devo listar todos os usuarios', () => {
  return request(app).get('/users')
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0); // numA > numB
    });
});
test('Devo inserir um usuario', () => {
  const mail = `${Date.now()}@mail.com`;
  return request(app).post('/users')
    .send({ name: 'Bruno Vinicius Felix', mail, passwd: '123456' })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Bruno Vinicius Felix');
    });
});

test('Não deve inserir usuario sem nome', () => {
  return request(app).post('/users')
    .send({ mail: 'Luiz@gmail.com', passwd: '123456' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Nome é um atributo obrigatorio');
    });
});

test('Não deve inserir usuario sem Email!', async () => {
  const result = await request(app).post('/users')
    .send({ name: 'Ruan', passwd: '008776' });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('Email é um atributo obrigatorio');
});

test('Não deve inserir usuario sem Senha', (done) => {
  request(app).post('/users')
    .send({ name: 'Bili Carter', mail: 'Billi@gmail.com' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Senha é um atributo obrigatorio');
      done();
    });
});

/* test('Não deve inserir usuario se já existir Email', () => {
  return request(app).post('/users')
    .send({
      mail: 'Billi@gmail.com'
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Este email já é cadastrado');
    });
}); */
