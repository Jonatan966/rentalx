import { hash } from 'bcrypt';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { app } from '../../../../shared/infra/http/server';
import createConnection from '../../../../shared/infra/typeorm';

let connection: Connection;

describe('List Available Cars Controller', () => {
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

  it('should be able to list all available cars', async () => {
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

    const responseAvailableCars = await request(app).get('/cars/available');

    expect(responseAvailableCars.status).toBe(200);
    expect(responseAvailableCars.body).toHaveLength(1);
    expect(responseAvailableCars.body).toStrictEqual([responseCar.body]);
  });

  it('should be able to list available cars by name', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    });

    const { token } = responseToken.body;

    const responseCategory = await request(app)
      .post('/categories')
      .send({
        name: 'New second category',
        description: 'description',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const { id: category_id } = responseCategory.body;

    const responseSearchCar = await request(app)
      .post('/cars')
      .send({
        name: 'Search Car Name',
        description: 'Fake description',
        daily_rate: 100,
        license_plate: 'ABB-1212',
        fine_amount: 60,
        brand: 'brand1',
        category_id,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseAvailableCars = await request(app).get(
      '/cars/available?name=Search Car Name'
    );

    expect(responseAvailableCars.body).toHaveLength(1);
    expect(responseAvailableCars.body).toStrictEqual([responseSearchCar.body]);
  });

  it('should be able to list available cars by brand', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    });

    const { token } = responseToken.body;

    const responseCategory = await request(app)
      .post('/categories')
      .send({
        name: 'New category 3',
        description: 'description',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const { id: category_id } = responseCategory.body;

    const responseSearchCar = await request(app)
      .post('/cars')
      .send({
        name: 'Search Car Brand',
        description: 'Fake description',
        daily_rate: 100,
        license_plate: 'BBA-2121',
        fine_amount: 60,
        brand: 'search brand',
        category_id,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseAvailableCars = await request(app).get(
      '/cars/available?brand=search brand'
    );

    expect(responseAvailableCars.body).toHaveLength(1);
    expect(responseAvailableCars.body).toStrictEqual([responseSearchCar.body]);
  });

  it('should be able to list available cars by category', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    });

    const { token } = responseToken.body;

    const responseCategory = await request(app)
      .post('/categories')
      .send({
        name: 'New search category',
        description: 'description',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const { id: category_id } = responseCategory.body;

    const responseSearchCar = await request(app)
      .post('/cars')
      .send({
        name: 'Search Car Category',
        description: 'Fake description',
        daily_rate: 100,
        license_plate: 'ACC-3434',
        fine_amount: 60,
        brand: 'brand3',
        category_id,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseAvailableCars = await request(app).get(
      `/cars/available?category_id=${category_id}`
    );

    expect(responseAvailableCars.body).toHaveLength(1);
    expect(responseAvailableCars.body).toStrictEqual([responseSearchCar.body]);
  });

  it('should be able to list available cars by all filters at same time', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    });

    const { token } = responseToken.body;

    const responseCategory = await request(app)
      .post('/categories')
      .send({
        name: 'New all category',
        description: 'description',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const { id: category_id } = responseCategory.body;

    const responseSearchCar = await request(app)
      .post('/cars')
      .send({
        name: 'Search Car All',
        description: 'Fake description',
        daily_rate: 100,
        license_plate: 'ADD-8888',
        fine_amount: 60,
        brand: 'brand-4',
        category_id,
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const responseAvailableCars = await request(app).get(
      `/cars/available?category_id=${category_id}&name=Search Car All&brand=brand-4`
    );

    expect(responseAvailableCars.body).toHaveLength(1);
    expect(responseAvailableCars.body).toStrictEqual([responseSearchCar.body]);
  });
});
