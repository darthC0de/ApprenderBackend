import { Router, Request, Response } from 'express';
const routes = Router();

// const Questions = require('./controller/questions')

routes.get('/', (_req: Request, res: Response) => {
  return res.status(200).json({
    version: 1.2,
    message: 'Created heroku app ',
  });
});

// routes.get('/questions',Questions.index)
// routes.post('/questions',Questions.create)

export default routes;
