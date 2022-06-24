import request from 'supertest';
import app from '../src/app';

describe('Parameters suit', () => {
  let token: string;
  beforeAll(async () => {
    return await request(app)
      .post('/user/auth')
      .send({
        username: 'admin',
        password: 'YWRtaW4=',
      })
      .then(response => {
        // @ts-ignore
        token = response.token;
      });
  });
  it('should list default parameters', async () => {
    const v = await request(app)
      .get('/parameters')
      .set({ Authorization: `Bearer ${token}` })
      .send();
  });
});
