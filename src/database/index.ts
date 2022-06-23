/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/extensions */
import knex, { Knex } from 'knex';
import dotenv from 'dotenv';
import configuration from '../../knexfile';

dotenv.config();

// @ts-ignore
const config: Knex.Config = configuration[process.env.NODE_ENV];
const Conn = knex(config);

export { Conn };
