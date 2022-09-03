import { hash } from 'bcrypt';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { app } from '../../../../shared/infra/http/server';
import createConnection from '../../../../shared/infra/typeorm';

let connection: Connection;
const sendMailMock = jest.fn().mockReturnValue({
  messageId: 'fake',
});

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockImplementation(() => ({
    sendMail: sendMailMock,
  })),
  createTestAccount: jest.fn().mockResolvedValue({
    smtp: {
      host: 'test',
      port: 1234,
      secure: true,
    },
    user: 'fake user',
    pass: 'fake pass',
  }),
  getTestMessageUrl: jest.fn(),
}));

describe('Send Forgot Password Mail Controller', () => {
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

  it('should be able to send forgot password mail', async () => {
    const response = await request(app).post('/password/forgot').send({
      email: 'user@rentx.com.br',
    });

    expect(response.status).toBe(200);

    expect(sendMailMock).toBeCalled();
  });

  it('should not be able to send forgot password mail to inexistent email', async () => {
    const response = await request(app).post('/password/forgot').send({
      email: 'soari@fuwos.dk',
    });

    expect(response.status).toBe(400);
  });
});
