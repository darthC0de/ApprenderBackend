/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable indent */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import { Request, Response } from 'express';
import { ParameterService } from '../services';
import { validateFields } from '../utils';

// eslint-disable-next-line import/prefer-default-export
export class ParametersController {
  async listAll(_req: Request, res: Response) {
    const services = new ParameterService();
    try {
      await services
        .findAll()
        .then(response => {
          return res.status(200).json(response);
        })
        .catch(err => {
          return res.status(400).json({ error: err });
        });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  async create(req: Request, res: Response) {
    const services = new ParameterService();
    try {
      const fields = validateFields(
        [
          {
            name: 'description',
            type: 'string',
            required: true,
          },
          {
            name: 'value',
            required: false,
          },
        ],
        req.body,
      );
      if (fields.hasMissing) {
        return res.status(400).json(fields.errors);
      }
      const { description } = req.body;
      const { user } = req.headers;
      await services
        .create(description, String(user))
        .then(response => {
          return res.status(201).json(response);
        })
        .catch(err => {
          return res.status(400).json({ error: err });
        });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  async update(req: Request, res: Response) {
    const services = new ParameterService();
    try {
      const data = { ...req.body, ...req.params, ...req.headers };
      const fields = validateFields(
        [
          {
            name: 'id',
            type: 'string',
            required: true,
          },
          {
            name: 'description',
            type: 'string',
            required: true,
          },
        ],
        data,
      );
      if (fields.hasMissing) {
        return res.status(400).json(fields.errors);
      }
      const { description, id, user } = data;

      await services
        .update(id, description, String(user))
        .then(response => {
          return res.status(201).json(response);
        })
        .catch(err => {
          return res.status(400).json({ error: err });
        });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  async delete(req: Request, res: Response) {
    const services = new ParameterService();
    try {
      const data = { ...req.body, ...req.params };
      const fields = validateFields(
        [
          {
            name: 'id',
            type: 'string',
            required: true,
          },
        ],
        data,
      );
      if (fields.hasMissing) {
        return res.status(400).json(fields.errors);
      }
      const { id } = data;
      await services
        .delete(id)
        .then(() => {
          return res.status(204).json();
        })
        .catch(err => {
          return res.status(400).json({ error: err });
        });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
}
