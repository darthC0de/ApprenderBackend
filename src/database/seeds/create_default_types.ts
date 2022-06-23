import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  // await knex("table_name").del();
  await knex('types').insert([
    {
      id: uuid(),
      description: 'Options',
      created_by: '1',
    },
    {
      id: uuid(),
      description: 'Input',
      created_by: '1',
    },
  ]);
}
