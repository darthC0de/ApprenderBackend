import { Router, Request, Response } from 'express';
import { version } from '../package.json';
import { Auth, Validations } from './middlewares';
const routes = Router();

import {
  UserController,
  TypesController,
  QuestionController,
} from './controllers';


routes.get('/', (_req: Request, res: Response) => {
  return res.status(200).json({
    version,
    message: 'Created heroku app ',
  });
});

const users = new UserController();
const types = new TypesController();
const questions = new QuestionController();

const { validateBase64Data, validateParams } = Validations.default;

routes.get('/users', users.getUsers);
routes.get('/user/:id', Auth.isAuthenticated, users.getUser);
routes.post(
  '/user',
  Auth.isAuthenticated,
  [validateBase64Data],
  validateParams,
  users.create,
);
routes.patch(
  '/user',
  Auth.isAuthenticated,
  [validateBase64Data],
  validateParams,
  users.update,
);
routes.delete('/user/:id', Auth.isAuthenticated, users.delete);
routes.post('/user/auth', [validateBase64Data], validateParams, users.login);

routes.get('/types', Auth.isAuthenticated, types.listAll);
routes.post('/types', Auth.isAuthenticated, types.create);
routes.put('/types/:id', Auth.isAuthenticated, types.update);
routes.delete('/types/:id', Auth.isAuthenticated, types.delete);

routes.get('/questions', questions.getQuestions);
routes.get('/questions/:id', questions.getQuestion);
routes.post('/questions', Auth.isAuthenticated, questions.create);

export default routes;
