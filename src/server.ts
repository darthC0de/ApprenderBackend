import { config as env } from 'dotenv';
import app from './app';

env();

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
