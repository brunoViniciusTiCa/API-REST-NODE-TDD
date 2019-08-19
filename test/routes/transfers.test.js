const request = require('supertest');
const app = require('../../src/app');

const MAIN_ROUTE = '/v1/tranfers';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAsIm5hbWUiOiJMb25ndWluaG8gdXNlciAjMSIsIm1haWwiOiJ1c2VyMUBnbWFpbC5jb20ifQ.ONlO-k5tuViXjrTlpDonO2g8YO7cMzKZsrlpi43Z4v8'

test('Deve listar apenas as transferências do usuário', () => {
  return request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${TOKEN}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].description).toBe('Transfer user#1');
    });
});