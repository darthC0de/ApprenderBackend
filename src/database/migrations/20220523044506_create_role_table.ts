import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('roles', table => {
    table.string('id').notNullable().primary();
    table.string('description').notNullable();
    table.string('created_by').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table
      .foreign('created_by', 'FK_ROLE_AUTHOR')
      .references('users.id')
      .onUpdate('SET NULL')
      .onDelete('SET NULL');
    table.index(['id', 'description'], 'IDX_ROLE_ID');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('roles');
}
