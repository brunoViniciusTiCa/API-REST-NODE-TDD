const request = require('supertest');
const app = require('../../src/app');
//const jwt = require('jwt-simple');

test('Deve criar usuario via signup', () => {
  return request(app).post('/auth/signup')
    .send({ name: 'Bruno', mail: `${Date.now()}@gmail.com`, passwd:'123456' })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Bruno');
      expect(res.body).toHaveProperty('mail');
      expect(res.body).not.toHaveProperty('passwd');
    });
});

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

test('Não deve autenticar usuario com senha errada', () => {
  const mail = `${Date.now()}@gmail.com`;
  return app.services.user.save(
    { name: 'Carlos', mail, passwd: '123456'} 
    ).then(() => request(app).post('/auth/signin')
      .send({ mail, passwd: '259874' }))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Usuario ou senha invalido');
    });
});

test('Não deve autenticar usuario com email errada', () => {
  return request(app).post('/auth/signin')
      .send({ mail: 'Bruninho@hotmail.com', passwd: '123456' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Usuario ou senha invalido');
    });
});

test('Não deve acessar uma rota protegida sem token', () => {
  return request(app).get('/v1/users')
    //.set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(401);
    });
});