import { config as env } from 'dotenv';
env();

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import RateLimit from 'express-rate-limit';
import routes from './routes';

const app = express();
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
});

// apply rate limiter to all requests
app.use(express.json());
app.use(cors());
if (['development', 'test'].indexOf(String(process.env.NODE_ENV)) !== -1) {
  app.use(limiter);
}

app.use(helmet.hidePoweredBy());
app.use(routes);

export default app;
