import knex, { Knex } from 'knex';
import configuration from '../../knexfile';
import dotenv from 'dotenv';
dotenv.config();

// @ts-ignore
const config: Knex.Config = configuration[process.env.NODE_ENV];
const Conn = knex(config);

export { Conn };
