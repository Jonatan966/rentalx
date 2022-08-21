import { hash } from 'bcrypt';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { app } from '../../../../shared/infra/http/server';
import createConnection from '../../../../shared/infra/typeorm';

let connection: Connection;

describe('Update User Avatar Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const password = await hash('pass', 8);

    await connection.query(
      `INSERT INTO users(id, name, email, password, "isAdmin", driver_license, created_at)
      VALUES('${uuidv4()}', 'Admin', 'admin@rentx.com.br', '${password}', true, 'XXXXXXX', now())
      `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to update a user avatar', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'pass',
    });

    const { token } = responseToken.body;

    const fakeImage = Buffer.from('fake');

    const responseUpdateUserAvatar = await request(app)
      .patch('/users/avatar')
      .attach('avatar', fakeImage, 'fake.jpg')
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(responseUpdateUserAvatar.status).toBe(204);
  });
});
