import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '../../../../shared/infra/http/server';
import createConnection from '../../../../shared/infra/typeorm';

let connection: Connection;

describe('Create User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create an user', async () => {
    const response = await request(app).post('/users').send({
      name: 'fake user',
      email: 'user@email.com',
      password: 'the-password',
      driver_license: '1234-ABCD',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to create a user with the same e-mail', async () => {
    const response = await request(app).post('/users').send({
      name: 'fake user 2',
      email: 'user@email.com',
      password: 'the-password',
      driver_license: '12345-ABCDE',
    });

    expect(response.status).toBe(400);
  });
});
