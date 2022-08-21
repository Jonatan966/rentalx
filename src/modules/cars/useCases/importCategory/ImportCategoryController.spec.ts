import { hash } from 'bcrypt';
import path from 'path';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { app } from '../../../../shared/infra/http/server';
import createConnection from '../../../../shared/infra/typeorm';

let connection: Connection;

describe('Import Category Controller', () => {
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

  it('should be able to import a new category', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'pass',
    });

    const { token } = responseToken.body;

    const csvFilePath = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '__mocks__',
      'import-category.csv'
    );

    const responseImportCategory = await request(app)
      .post('/categories/import')
      .attach('file', csvFilePath)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(responseImportCategory.status).toBe(201);
    expect(responseImportCategory.body).toHaveProperty('categories');
    expect(responseImportCategory.body.categories).toHaveLength(3);
  });
});
