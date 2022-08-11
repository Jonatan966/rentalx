import { hash } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import createConnection from '../index';

async function create() {
  const connection = await createConnection('localhost');

  const id = uuidv4();
  const password = await hash('admin', 8);

  await connection.query(
    `INSERT INTO users(id, name, email, password, "isAdmin", driver_license, created_at)
    VALUES('${id}', 'Admin', 'admin@rentx.com.br', '${password}', true, 'XXXXXXX', now())
    `
  );

  await connection.close();
}

create().then(() => console.log('User admin created'));
