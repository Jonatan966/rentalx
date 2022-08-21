import { hash } from 'bcrypt';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { app } from '../../../../shared/infra/http/server';
import createConnection from '../../../../shared/infra/typeorm';

let connection: Connection;

describe('Create Car Specification Controller', () => {
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

  it('should be able to add a new specification to the car', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    });

    const { token } = responseToken.body;

    const responseCategory = await request(app)
      .post('/categories')
      .send({
        name: 'New category',
        description: 'description',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseCar = await request(app)
      .post('/cars')
      .send({
        name: 'Fake Car',
        description: 'Fake description',
        daily_rate: 100,
        license_plate: 'ABC-1234',
        fine_amount: 60,
        brand: 'brand',
        category_id: responseCategory.body.id,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseSpecification = await request(app)
      .post('/specifications')
      .send({
        name: 'New specification',
        description: 'description',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseCarSpecification = await request(app)
      .post(`/cars/${responseCar.body.id}/specifications`)
      .send({
        specifications_id: [responseSpecification.body.id],
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(responseCarSpecification.status).toBe(200);
    expect(responseCarSpecification.body).toHaveProperty('specifications', [
      responseSpecification.body,
    ]);
  });

  it('should not be able to add a new specification to a non existent car', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    });

    const { token } = responseToken.body;

    const responseSpecification = await request(app)
      .post('/specifications')
      .send({
        name: 'Best specification',
        description: 'description',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseCarSpecification = await request(app)
      .post(`/cars/${uuidv4()}/specifications`)
      .send({
        specifications_id: [responseSpecification.body.id],
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(responseCarSpecification.status).toBe(400);
  });
});
