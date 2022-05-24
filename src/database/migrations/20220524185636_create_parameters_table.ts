import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('parameters', table => {
    table.string('id').notNullable().primary();
    table.string('description').notNullable();
    table.string('value').notNullable();
    table.string('updated_by').notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table
      .foreign('updated_by', 'FK_PARAMETER_UPDATER')
      .references('users.id')
      .onUpdate('SET NULL')
      .onDelete('SET NULL');
    table.index(['id', 'description', 'value'], 'IDX_PARAMETER_VALUE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('parameters');
}
