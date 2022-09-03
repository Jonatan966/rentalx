import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import auth from '../../../../config/auth';
import { app } from '../../../../shared/infra/http/server';
import createConnection from '../../../../shared/infra/typeorm';

let connection: Connection;

describe('Refresh Token Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidv4();
    const password = await hash('pass', 8);

    await connection.query(
      `INSERT INTO users(id, name, email, password, "isAdmin", driver_license, created_at)
      VALUES('${id}', 'User', 'user@rentx.com.br', '${password}', true, 'XXXXXXX', now())
      `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to generate a new refresh token if pass refresh token into body', async () => {
    const authResponse = await request(app).post('/sessions').send({
      email: 'user@rentx.com.br',
      password: 'pass',
    });

    const { refresh_token } = authResponse.body;

    const refreshResponse = await request(app).post('/refresh-token').send({
      token: refresh_token,
    });

    expect(refreshResponse.status).toBe(200);
    expect(refreshResponse.body).toHaveProperty('refresh_token');
  });

  it('should be able to generate a new token if pass refresh token into headers', async () => {
    const authResponse = await request(app).post('/sessions').send({
      email: 'user@rentx.com.br',
      password: 'pass',
    });

    const { refresh_token } = authResponse.body;

    const refreshResponse = await request(app)
      .post('/refresh-token')
      .set('x-access-token', refresh_token);

    expect(refreshResponse.status).toBe(200);
    expect(refreshResponse.body).toHaveProperty('refresh_token');
  });

  it('should be able to generate a new token if pass refresh token into query', async () => {
    const authResponse = await request(app).post('/sessions').send({
      email: 'user@rentx.com.br',
      password: 'pass',
    });

    const { refresh_token } = authResponse.body;

    const refreshResponse = await request(app).post(
      `/refresh-token?token=${refresh_token}`
    );

    expect(refreshResponse.status).toBe(200);
    expect(refreshResponse.body).toHaveProperty('refresh_token');
  });

  it('should not be able to generate a new token with inexistent refresh token', async () => {
    const refresh_token = sign(
      { email: 'afi@ekci.et' },
      auth.secret_refresh_token,
      {
        subject: uuidv4(),
      }
    );

    const refreshResponse = await request(app).post('/refresh-token').send({
      token: refresh_token,
    });

    expect(refreshResponse.status).toBe(400);
  });
});
