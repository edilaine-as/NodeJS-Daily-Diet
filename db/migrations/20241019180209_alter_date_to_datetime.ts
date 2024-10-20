import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('diet', function(table) {
        table.datetime('date').alter();
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('diet', function(table) {
        table.date('date').alter();
    });
}

