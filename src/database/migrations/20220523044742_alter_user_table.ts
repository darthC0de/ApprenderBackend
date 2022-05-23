import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('users', table => {
    table.string('role');
    table
      .foreign('role', 'FK_USER_ROLE')
      .references('roles.id')
      .onUpdate('SET NULL')
      .onDelete('SET NULL');
    table.index(['id', 'username', 'name', 'email'], 'IDX_USER_DATA');
    table.index(['username', 'password'], 'IDX_USER_LOGIN');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('users', table => {
    table.dropIndex('IDX_USER_LOGIN');
    table.dropIndex('IDX_USER_DATA');
    table.dropForeign('role', 'FK_USER_ROLE');
    table.dropColumn('role');
  });
}
