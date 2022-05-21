import { Request, Response } from 'express';
import { UserService, iUser } from '../services';
import { Encrypt, validateFields, logger } from '../utils';

export class UserController {
  async getUsers(_req: Request, res: Response) {
    const service = new UserService();
    await service
      .listAll()
      .then(response => {
        if (!response.length) return res.status(204).json();
        return res.status(200).json(response);
      })
      .catch(err => {
        return res.status(400).json({ error: err });
      });
  }
  async getUser(req: Request, res: Response) {
    const service = new UserService();
    const fields = validateFields(
      [
        {
          name: 'id',
          type: 'string',
          required: true,
        },
      ],
      req.params,
    );
    if (fields.hasMissing) {
      return res.status(400).json(fields.errors);
    }
    const { id } = req.params;
    await service
      .findById(id)
      .then(response => {
        return res.status(200).json(response);
      })
      .catch(err => {
        return res.status(400).json({ error: err });
      });
  }
  async login(req: Request, res: Response) {
    const service = new UserService();
    const fields = validateFields(
      [
        {
          name: 'username',
          type: 'string',
          required: true,
        },
        {
          name: 'password',
          type: 'string',
          required: true,
        },
      ],
      req.body,
    );
    if (fields.hasMissing) {
      return res.status(400).json(fields.errors);
    }
    const { username, password } = req.params;
    const { cript } = new Encrypt();
    const pwd = await cript(password).then(response => response);

    await service
      .authenticate(username, pwd)
      .then(response => {
        return res.status(200).json(response);
      })
      .catch(err => {
        return res.status(400).json({ error: err });
      });
  }
  async create(req: Request, res: Response) {
    return new Promise(async (resolve, reject) => {
      try {
        const service = new UserService();
        const fields = validateFields(
          [
            {
              name: 'username',
              type: 'string',
              required: true,
            },
            {
              name: 'password',
              type: 'string',
              required: true,
            },
            {
              name: 'name',
              type: 'string',
              required: true,
            },
            {
              name: 'email',
              type: 'string',
              required: true,
            },
            {
              name: 'avatar',
              type: 'string',
              required: false,
            },
          ],
          req.body,
        );
        if (fields.hasMissing) {
          return res.status(400).json(fields.errors);
        }
        const { username, password, email, name, avatar } = req.body;
        const cript = new Encrypt();
        const pwd = await cript.cript(password).then(response => response);
        await service
          .create(name, username, email, pwd, avatar)
          .then(response => {
            return res.status(201).json(response);
          })
          .catch(error => {
            return res.status(400).json({ error });
          });
      } catch (err) {
        return res.status(400).json({ error: err });
      }
    });
  }
  async update(req: Request, res: Response) {
    return new Promise(async (resolve, reject) => {
      try {
        const service = new UserService();
        const fields = validateFields(
          [
            {
              name: 'username',
              type: 'string',
              required: false,
            },
            {
              name: 'password',
              type: 'string',
              required: false,
            },
            {
              name: 'name',
              type: 'string',
              required: false,
            },
            {
              name: 'email',
              type: 'string',
              required: false,
            },
            {
              name: 'avatar',
              type: 'string',
              required: false,
            },
          ],
          req.body,
        );
        if (fields.hasMissing) {
          return res.status(400).json(fields.errors);
        }
        const { username, password, email, name, avatar } = req.params;
        const { user } = req.headers;
        const { cript } = new Encrypt();
        const pwd = await cript(password).then(response => response);
        await service
          .update(String(user), name, username, email, pwd, avatar)
          .then(response => {
            return res.status(200).json(response);
          })
          .catch(error => {
            return res.status(400).json({ error });
          });
      } catch (err) {
        return res.status(400).json({ error: err });
      }
    });
  }
  async delete(req: Request, res: Response) {
    return new Promise(async (resolve, reject) => {
      try {
        const service = new UserService();
        const fields = validateFields(
          [
            {
              name: 'id',
              type: 'string',
              required: true,
            },
          ],
          req.query,
        );
        if (fields.hasMissing) {
          return res.status(400).json(fields.errors);
        }
        const { id } = req.query;
        await service
          .delete(String(id))
          .then(_response => {
            return res.status(204).json();
          })
          .catch(error => {
            return res.status(400).json({ error });
          });
      } catch (err) {
        return res.status(400).json({ error: err });
      }
    });
  }
}
