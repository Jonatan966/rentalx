import { hash } from 'bcrypt';
import dayjs from 'dayjs';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { app } from '../../../../shared/infra/http/server';
import createConnection from '../../../../shared/infra/typeorm';

let connection: Connection;
const magicToken = uuidv4();
const expiredMagicToken = uuidv4();

describe('Reset User Password Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidv4();
    const password = await hash('old-pass', 8);

    await connection.query(
      `INSERT INTO users(id, name, email, password, "isAdmin", driver_license, created_at)
      VALUES('${id}', 'User', 'user@rentx.com.br', '${password}', true, 'XXXXXXX', now())
      `
    );

    await connection.query(
      `INSERT INTO users_tokens(id, refresh_token, user_id, expires_date)
      VALUES('${uuidv4()}', '${magicToken}', '${id}', '${dayjs()
        .add(3, 'hours')
        .toISOString()}')
      `
    );

    await connection.query(
      `INSERT INTO users_tokens(id, refresh_token, user_id, expires_date)
      VALUES('${uuidv4()}', '${expiredMagicToken}', '${id}', '${dayjs()
        .subtract(3, 'days')
        .toISOString()}')
      `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to reset user password', async () => {
    const resetResponse = await request(app)
      .post(`/password/reset?token=${magicToken}`)
      .send({
        password: 'new-pass',
      });

    expect(resetResponse.status).toBe(200);

    const authWithNewPassResponse = await request(app).post('/sessions').send({
      email: 'user@rentx.com.br',
      password: 'new-pass',
    });

    expect(authWithNewPassResponse.status).toBe(200);
  });

  it('should not be able to reset user password with already used magic token', async () => {
    const resetResponse = await request(app)
      .post(`/password/reset?token=${magicToken}`)
      .send({
        password: 'new-pass',
      });

    expect(resetResponse.status).toBe(400);
  });

  it('should not be able to reset user password with inexistent magic token', async () => {
    const resetResponse = await request(app)
      .post(`/password/reset?token=${uuidv4()}`)
      .send({
        password: 'new-pass',
      });

    expect(resetResponse.status).toBe(400);
  });

  it('should not be able to reset user password with expired magic token', async () => {
    const resetResponse = await request(app)
      .post(`/password/reset?token=${expiredMagicToken}`)
      .send({
        password: 'new-pass',
      });

    expect(resetResponse.status).toBe(400);
  });
});
