import { hash } from 'bcrypt';
import dayjs from 'dayjs';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { app } from '../../../../shared/infra/http/server';
import createConnection from '../../../../shared/infra/typeorm';

let connection: Connection;

describe('Devolution Rental Controller', () => {
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
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to return car', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'pass',
    });

    const { token } = responseToken.body;

    const responseCarCategory = await request(app)
      .post('/categories')
      .send({
        name: 'Daniel Parks',
        description: 'Erik Black',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseCar = await request(app)
      .post('/cars')
      .send({
        name: 'Edwin Gregory',
        description: 'Winifred Kim',
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

    const responseDevolution = await request(app)
      .post(`/rentals/devolution/${responseRental.body.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(responseDevolution.status).toBe(200);
    expect(responseDevolution.body).toHaveProperty('end_date');
    expect(responseDevolution.body).toHaveProperty('total', 280);
  });

  it('should not be able to return car with inexistent rental', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'pass',
    });

    const { token } = responseToken.body;

    const responseDevolution = await request(app)
      .post(`/rentals/devolution/${uuidv4()}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(responseDevolution.status).toBe(400);
  });

  it('should not be able to return car of another rental', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'pass',
    });

    const { token } = responseToken.body;

    const responseCarCategory = await request(app)
      .post('/categories')
      .send({
        name: 'Leila Washington',
        description: 'Violet Ward',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseCar = await request(app)
      .post('/cars')
      .send({
        name: 'Nettie Wilkerson',
        description: 'Alfred Robertson',
        daily_rate: 100,
        license_plate: 'DDDE-123',
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

    const { id: rentalId } = responseRental.body;

    const responseAnotherToken = await request(app).post('/sessions').send({
      email: 'second-admin@rentx.com.br',
      password: 'pass',
    });

    const { token: anotherToken } = responseAnotherToken.body;

    const responseDevolution = await request(app)
      .post(`/rentals/devolution/${rentalId}`)
      .set({
        Authorization: `Bearer ${anotherToken}`,
      });

    expect(responseDevolution.status).toBe(400);
  });
});
