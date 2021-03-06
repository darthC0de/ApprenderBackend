/* eslint-disable indent */
/* eslint-disable import/extensions */
import { Router, Request, Response } from 'express';
import { version } from '../package.json';
import { Auth, Validations } from './middlewares';

import {
  UserController,
  TypesController,
  QuestionController,
  RolesController,
  ParametersController,
} from './controllers';

const routes = Router();

routes.get('/', (_req: Request, res: Response) => {
  return res.status(200).json({
    version,
    message: 'Created heroku app ',
  });
});

const users = new UserController();
const types = new TypesController();
const questions = new QuestionController();
const roles = new RolesController();
const parameters = new ParametersController();

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

routes.get('/roles', Auth.isAuthenticated, roles.listAll);
routes.post('/roles', Auth.isAuthenticated, roles.create);
routes.put('/roles/:id', Auth.isAuthenticated, roles.update);
routes.delete('/roles/:id', Auth.isAuthenticated, roles.delete);

routes.get('/parameters', Auth.isAuthenticated, parameters.listAll);
routes.post('/parameters', Auth.isAuthenticated, parameters.create);
routes.put('/parameters/:id', Auth.isAuthenticated, parameters.update);
routes.delete('/parameters/:id', Auth.isAuthenticated, parameters.delete);

routes.get('/questions', questions.getQuestions);
routes.get(
  '/questions/pending',
  Auth.isAuthenticated,
  questions.getUnapprovedQuestions,
);
routes.get('/questions/:id', questions.getQuestion);
routes.post('/questions', Auth.isAuthenticated, questions.create);
routes.patch('/questions', Auth.isAuthenticated, questions.update);
routes.delete('/questions/:id', Auth.isAuthenticated, questions.delete);
routes.get('/approve/:id', Auth.isAuthenticated, questions.approve);

export default routes;
