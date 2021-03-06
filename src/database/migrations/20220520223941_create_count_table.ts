import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    'questions',
    (table: Knex.CreateTableBuilder) => {
      table.string('id').notNullable().primary();
      table.string('question').notNullable();
      table.string('answer').notNullable();
      table.string('type').notNullable();
      table.specificType('options', 'text[]');
      table.string('created_by').notNullable();
      table.string('updated_by');
      table
        .foreign('created_by')
        .references('users.id')
        .onUpdate('SET NULL')
        .onDelete('SET NULL');
      table
        .foreign('type')
        .references('types.id')
        .onUpdate('SET NULL')
        .onDelete('SET NULL');
      table
        .foreign('updated_by')
        .references('users.id')
        .onUpdate('SET NULL')
        .onDelete('SET NULL');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at');
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('counts');
}
