import { config as env } from 'dotenv';
env();

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import routes from './routes';

const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);
app.use(helmet.hidePoweredBy());

export default app;
