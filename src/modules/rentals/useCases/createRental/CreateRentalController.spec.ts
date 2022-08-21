import { hash } from 'bcrypt';
import dayjs from 'dayjs';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { app } from '../../../../shared/infra/http/server';
import createConnection from '../../../../shared/infra/typeorm';

let connection: Connection;

describe('Create Rental Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const password = await hash('pass', 8);

    await connection.query(
      `INSERT INTO users(id, name, email, password, "isAdmin", driver_license, created_at)
      VALUES('${uuidv4()}', 'Admin', 'admin@rentx.com.br', '${password}', true, 'XXXXXXX', now())
      `
    );

    await connection.query(
      `INSERT INTO users(id, name, email, password, "isAdmin", driver_license, created_at)
      VALUES('${uuidv4()}', 'Second Admin', 'second-admin@rentx.com.br', '${password}', true, 'XXXXXXX', now())
      `
    );

    await connection.query(
      `INSERT INTO users(id, name, email, password, "isAdmin", driver_license, created_at)
      VALUES('${uuidv4()}', 'Not Admin', 'not-admin@rentx.com.br', '${password}', false, 'XXXXXXX', now())
      `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create a new rental', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'pass',
    });

    const { token } = responseToken.body;

    const responseCarCategory = await request(app).post('/categories').send({
      name: 'New category',
      description: 'Description of the new category',
    });

    const responseCar = await request(app)
      .post('/cars')
      .send({
        name: 'Fake Car',
        description: 'Fake description',
        daily_rate: 100,
        license_plate: 'ABC-6464',
        fine_amount: 60,
        brand: 'brand',
        category_id: responseCarCategory.body.id,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseRental = await request(app)
      .post('/rentals')
      .send({
        expected_return_date: dayjs().add(3, 'days').toISOString(),
        car_id: responseCar.body.id,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(responseRental.status).toBe(201);
    expect(responseRental.body).toHaveProperty('id');
  });

  it('should not be able to create a new rental wit invalid return time', async () => {
    const responseAdminToken = await request(app).post('/sessions').send({
      email: 'second-admin@rentx.com.br',
      password: 'pass',
    });

    const { token: adminToken } = responseAdminToken.body;

    const responseCarCategory = await request(app).post('/categories').send({
      name: 'New category',
      description: 'Description of the new category',
    });

    const responseCar = await request(app)
      .post('/cars')
      .send({
        name: 'Fake Car',
        description: 'Fake description',
        daily_rate: 100,
        license_plate: 'CCC-2211',
        fine_amount: 60,
        brand: 'brand',
        category_id: responseCarCategory.body.id,
      })
      .set({
        Authorization: `Bearer ${adminToken}`,
      });

    const invalidReturnDate = dayjs().toISOString();

    const responseRental = await request(app)
      .post('/rentals')
      .send({
        expected_return_date: invalidReturnDate,
        car_id: responseCar.body.id,
      })
      .set({
        Authorization: `Bearer ${adminToken}`,
      });

    expect(responseRental.status).toBe(400);
    expect(responseRental.body).toHaveProperty(
      'message',
      'Invalid return time'
    );
  });

  it('should not be able to create a new rental if there is another open to the same user', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'pass',
    });

    const { token } = responseToken.body;

    const responseCarCategory = await request(app).post('/categories').send({
      name: 'New category',
      description: 'Description of the new category',
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
        category_id: responseCarCategory.body.id,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseRental = await request(app)
      .post('/rentals')
      .send({
        expected_return_date: dayjs().add(3, 'days').toISOString(),
        car_id: responseCar.body.id,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(responseRental.status).toBe(400);
  });

  it('should not be able to create a new rental if there is another open to the same car', async () => {
    const responseAdminToken = await request(app).post('/sessions').send({
      email: 'second-admin@rentx.com.br',
      password: 'pass',
    });

    const responseNotAdminToken = await request(app).post('/sessions').send({
      email: 'not-admin@rentx.com.br',
      password: 'pass',
    });

    const { token: adminToken } = responseAdminToken.body;
    const { token: notAdminToken } = responseNotAdminToken.body;

    const responseCarCategory = await request(app).post('/categories').send({
      name: 'New category',
      description: 'Description of the new category',
    });

    const responseCar = await request(app)
      .post('/cars')
      .send({
        name: 'Fake Car',
        description: 'Fake description',
        daily_rate: 100,
        license_plate: 'EEE-5522',
        fine_amount: 60,
        brand: 'brand',
        category_id: responseCarCategory.body.id,
      })
      .set({
        Authorization: `Bearer ${adminToken}`,
      });

    const returnDate = dayjs().add(3, 'days').toISOString();

    const responseFirstRental = await request(app)
      .post('/rentals')
      .send({
        expected_return_date: returnDate,
        car_id: responseCar.body.id,
      })
      .set({
        Authorization: `Bearer ${adminToken}`,
      });

    expect(responseFirstRental.status).toBe(201);

    const responseSecondRental = await request(app)
      .post('/rentals')
      .send({
        expected_return_date: returnDate,
        car_id: responseCar.body.id,
      })
      .set({
        Authorization: `Bearer ${notAdminToken}`,
      });

    expect(responseSecondRental.status).toBe(400);
  });
});
