import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  // await knex("table_name").del();
  const usersDefaultRole = uuid();
  await knex('roles').insert([
    {
      id: usersDefaultRole,
      description: 'viewer',
      created_by: '1',
    },
    {
      id: uuid(),
      description: 'admin',
      created_by: '1',
    },
    {
      id: uuid(),
      description: 'contributor',
      created_by: '1',
    },
  ]);

  await knex('parameters').insert([
    {
      id: uuid(),
      description: 'defaultRole',
      value: usersDefaultRole,
      updated_by: '1',
    },
  ]);
}
