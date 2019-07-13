const request = require('supertest');
const app = require('../../src/app');

test('Deve receber toke ao logar', () => {
  const mail = `${Date.now()}@gmail.com`;
  return app.services.user.save(
    { name: 'Carlos', mail , passwd: '123456' }
  ).then(() => request(app).post('/auth/signin')
    .send({ mail, passwd: '123456' }))
  .then((res) => {
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });   
});
