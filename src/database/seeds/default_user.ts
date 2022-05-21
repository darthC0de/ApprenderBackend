import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';
export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  // await knex("table_name").del();

  // Inserts seed entries
  await knex('users').insert([
    {
      id: uuid(),
      name: 'admin',
      username: 'admin',
      email: 'admin@rod.com',
      avatar: null,
      password: '$2a$10$3G4zdVptdPPv15zFTmt1wONX/MRjhJFe5bqpNDp3FmefsmTUO7gm2',
    },
  ]);
}
