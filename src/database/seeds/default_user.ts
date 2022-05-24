import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';
export async function seed(knex: Knex): Promise<void> {
  // "username": "admin",
  // "password": "YWRtaW4="
  await knex('users').insert([
    {
      id: uuid(),
      name: 'Administrator',
      username: 'admin',
      email: 'admin@apprender.com.br',
      password: '$2a$10$6GBkxbYeysxCzhkalG/WZ.cwa4ds96fL7IHkk1mTqJZp/MoqTr3.G',
      avatar: undefined,
      role: undefined,
    },
  ]);
}
