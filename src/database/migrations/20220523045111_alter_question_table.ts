import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('questions', table => {
    table.string('approved_by').defaultTo(null);
    table.foreign('approved_by', 'FK_APPROVER_USER').references('users.id');
    table.index(['id', 'question', 'answer', 'options'], 'IDX_QUESTION_DATA');
    table.index(['id', 'approved_by'], 'IDX_APPROVER_USER');
    table.index(['id', 'type'], 'IDX_QUESTION_TYPE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('questions', table => {
    table.dropIndex('IDX_QUESTION_TYPE');
    table.dropIndex('IDX_APPROVER_USER');
    table.dropIndex('IDX_QUESTION_DATA');
    table.dropForeign('approved_by', 'FK_APPROVER_USER');
    table.dropColumn('approved_by');
  });
}
