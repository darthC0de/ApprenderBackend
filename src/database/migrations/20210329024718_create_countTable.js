
exports.up = function(knex) {
  return knex.schema.createTable('contas',table=>{
      table.increments();
      table.string('question')
      table.string('answer')
      table.string('type')
      table.specificType('options','ARRAY')
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('contas')
};
