import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table: Knex.CreateTableBuilder) => {
    table.string('id').notNullable();
    table.string('name').notNullable();
    table
      .string('username')
      .notNullable()
      .unique({ indexName: 'idx_username' });
    table.text('avatar');
    table.string('email').notNullable().unique({ indexName: 'idx_email' });
    table.string('password').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
