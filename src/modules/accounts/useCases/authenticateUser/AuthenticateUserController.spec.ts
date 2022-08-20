import { hash } from 'bcrypt';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { app } from '../../../../shared/infra/http/server';
import createConnection from '../../../../shared/infra/typeorm';

let connection: Connection;

describe('Authenticate User Controller', () => {
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

  it('should be able to authenticate a user', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'user@rentx.com.br',
      password: 'pass',
    });

    expect(responseToken.body).toHaveProperty('token');
  });

  it('should not be able to authenticate a nonoexistent user', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'nonexistent@rentx.com.br',
      password: 'pass',
    });

    expect(response.status).toBe(400);
  });

  it('should not be able to authenticate with incorrect password', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'user@rentx.com.br',
      password: '1nc0rr3cT-pA5S',
    });

    expect(response.status).toBe(400);
  });
});
