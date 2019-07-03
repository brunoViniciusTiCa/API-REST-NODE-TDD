const request = require('supertest');

const app = require('../../src/app');

test('Devo verificar se usuario esta listado', () => {
  return request(app).get('/users')
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });
});

test.only('Devo inserir um usuario', () => {
  return request(app).post('/users')
    .send({
      name: 'Bruno Vinicius Felix',
      mail: 'bruninho@gmail.com',
      passwd: '123456'
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Bruno Vinicius Felix');
    });
});
