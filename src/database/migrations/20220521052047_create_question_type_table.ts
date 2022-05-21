import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('types', (table: Knex.CreateTableBuilder) => {
    table.string('id').notNullable().primary();
    table.string('description').notNullable();
    table.string('created_by').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table
      .foreign('created_by')
      .references('users.id')
      .onUpdate('SET NULL')
      .onDelete('SET NULL');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('types');
}
