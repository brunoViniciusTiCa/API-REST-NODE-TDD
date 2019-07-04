const request = require('supertest');

const app = require('../../src/app');

test('Devo verificar se usuario esta listado', () => {
  return request(app).get('/users')
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0); // numA > numB
    });
});

test('Devo inserir um usuario', () => {
  const mail = `${(Date.now())}@gmail.com`;
  return request(app).post('/users')
    .send({
      name: 'Bruno Vinicius Felix',
      mail,
      passwd: '123456'
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Bruno Vinicius Felix');
    });
});
