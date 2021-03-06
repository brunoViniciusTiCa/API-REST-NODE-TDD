const request = require('supertest');

const app = require('../src/app');

test('Devo verificar se usuario esta listado', () => {
  return request(app).get('/users')
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toHaveProperty('name', 'Bruno Vinicius');
    });
});

test('Devo inserir um usuario', () => {
  return request(app).post('/users')
    .send({
      name: 'Claudio Antonio',
      mail: 'claudio@gmail.com'
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Claudio Antonio');
    });
});
