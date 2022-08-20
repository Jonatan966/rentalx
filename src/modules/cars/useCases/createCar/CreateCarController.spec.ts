import { hash } from 'bcrypt';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { app } from '../../../../shared/infra/http/server';
import createConnection from '../../../../shared/infra/typeorm';

let connection: Connection;
let carCategoryId: string;

describe('Create Car Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidv4();
    const password = await hash('admin', 8);

    await connection.query(
      `INSERT INTO users(id, name, email, password, "isAdmin", driver_license, created_at)
      VALUES('${id}', 'User', 'admin@rentx.com.br', '${password}', true, 'XXXXXXX', now())
      `
    );

    carCategoryId = uuidv4();

    await connection.query(`
      INSERT INTO categories(id, name, description)
      VALUES ('${carCategoryId}', 'Category', 'A new category')
    `);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create a new car', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    });

    const { token } = responseToken.body;

    const responseCar = await request(app)
      .post('/cars')
      .send({
        name: 'Fake Car',
        description: 'Fake description',
        daily_rate: 100,
        license_plate: 'ABC-1234',
        fine_amount: 60,
        brand: 'brand',
        category_id: carCategoryId,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(responseCar.status).toBe(201);
    expect(responseCar.body).toHaveProperty('id');
  });

  it('should not be able to create a car with exists license plate', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    });

    const { token } = responseToken.body;

    const responseCar = await request(app)
      .post('/cars')
      .send({
        name: 'Fake Car 2',
        description: 'Fake description',
        daily_rate: 100,
        license_plate: 'ABC-1234',
        fine_amount: 60,
        brand: 'brand',
        category_id: carCategoryId,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(responseCar.status).toBe(400);
  });

  it('should not be able to create a car with available true by default', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    });

    const { token } = responseToken.body;

    const responseCar = await request(app)
      .post('/cars')
      .send({
        name: 'Available Car',
        description: 'Description',
        daily_rate: 100,
        license_plate: 'CBA-4321',
        fine_amount: 60,
        brand: 'brand',
        category_id: carCategoryId,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(responseCar.body).toHaveProperty('available', true);
  });
});
