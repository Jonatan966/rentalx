import { hash } from 'bcrypt';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { app } from '../../../../shared/infra/http/server';
import createConnection from '../../../../shared/infra/typeorm';

let connection: Connection;

describe('Upload Car Image Controller', () => {
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

  it('should bea able to upload a new car image', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'pass',
    });

    const { token } = responseToken.body;

    const responseCarCategory = await request(app)
      .post('/categories')
      .send({
        name: 'New category',
        description: 'The new category',
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
        license_plate: 'ABC-6464',
        fine_amount: 60,
        brand: 'brand',
        category_id: responseCarCategory.body.id,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const { id: carId } = responseCar.body;

    const fakeImage = Buffer.from('fake');

    const responseCarImage = await request(app)
      .post(`/cars/${carId}/images`)
      .attach('images', fakeImage, 'fake-image-1.png')
      .attach('images', fakeImage, 'fake-image-2.png')
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(responseCarImage.status).toBe(201);
    expect(responseCarImage.body).toHaveLength(2);
  });
});
