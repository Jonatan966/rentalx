import { hash } from 'bcrypt';
import dayjs from 'dayjs';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { app } from '../../../../shared/infra/http/server';
import createConnection from '../../../../shared/infra/typeorm';

let connection: Connection;

describe('List Rentals by User Controller', () => {
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

  it('should be able to list rentals by user', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'user@rentx.com.br',
      password: 'pass',
    });

    const { token } = responseToken.body;

    const responseCarCategory = await request(app)
      .post('/categories')
      .send({
        name: 'Cody Osborne',
        description: 'Fannie Meyer',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseCar = await request(app)
      .post('/cars')
      .send({
        name: 'Lola Howell',
        description: 'Virgie Jefferson',
        daily_rate: 100,
        license_plate: 'ABC-6464',
        fine_amount: 60,
        brand: 'brand',
        category_id: responseCarCategory.body.id,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    await request(app)
      .post('/rentals')
      .send({
        expected_return_date: dayjs().add(3, 'days').toISOString(),
        car_id: responseCar.body.id,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const userRentalsResponse = await request(app)
      .get('/rentals/user')
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(userRentalsResponse.status).toBe(200);
    expect(userRentalsResponse.body).toHaveProperty('length', 1);
  });
});
