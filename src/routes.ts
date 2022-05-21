import { Router, Request, Response } from 'express';
import { version } from '../package.json';
const routes = Router();

import { UserController } from './controllers';
// const Questions = require('./controller/questions')

routes.get('/', (_req: Request, res: Response) => {
  return res.status(200).json({
    version,
    message: 'Created heroku app ',
  });
});

const users = new UserController();

routes.get('/users', users.getUsers);
routes.get('/user/:id', users.getUser);
routes.post('/user', users.create);
routes.patch('/user', users.update);
routes.delete('/user/:id', users.delete);
routes.post('/user/auth', users.login);

// routes.get('/questions',Questions.index)
// routes.post('/questions',Questions.create)

export default routes;
