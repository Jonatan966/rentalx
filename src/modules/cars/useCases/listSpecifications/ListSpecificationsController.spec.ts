import { hash } from 'bcrypt';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { app } from '../../../../shared/infra/http/server';
import createConnection from '../../../../shared/infra/typeorm';

let connection: Connection;

describe('List Specifications Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidv4();
    const password = await hash('admin', 8);

    await connection.query(
      `INSERT INTO users(id, name, email, password, "isAdmin", driver_license, created_at)
      VALUES('${id}', 'Admin', 'admin@rentx.com.br', '${password}', true, 'XXXXXXX', now())
      `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to list all specifications', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    });

    const { token } = responseToken.body;

    const responseNewSpecification = await request(app)
      .post('/specifications')
      .send({
        name: 'fake specification',
        description: 'fake description',
      })
      .set('Authorization', `Bearer ${token}`);

    const { id: specificationId } = responseNewSpecification.body;

    const responseSpecificationsList = await request(app).get(
      '/specifications'
    );

    expect(responseSpecificationsList.status).toBe(200);
    expect(responseSpecificationsList.body).toHaveLength(1);
    expect(responseSpecificationsList.body[0]).toHaveProperty(
      'id',
      specificationId
    );
  });
});
