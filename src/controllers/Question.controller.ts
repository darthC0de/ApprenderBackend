/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable indent */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
import { Request, Response } from 'express';
import { QuestionServices } from '../services';
import { validateFields } from '../utils';


//     {
//         "id": 4,
//     },
//     {
//         "id": 5,
//     },
//     {
//         "id": 6,
//     },
//     {
//         "id": 7,
//     }
// ]
export class QuestionController {
  async getQuestions(_req: Request, res: Response) {
    const service = new QuestionServices();
    await service
      .questions()
      .then(response => {
        if (response.length === 0) return res.status(204).send();
        return res
          .status(200)
          .setHeader('X-TOTAL-COUNT', response.length)
          .json(response);
      })
      .catch(error => {
        return res.status(400).json({ error });
      });
  }

  async getUnapprovedQuestions(_req: Request, res: Response) {
    const service = new QuestionServices();
    await service
      .unapprovedQuestions()
      .then(response => {
        if (response.length === 0) return res.status(204).send();
        return res
          .status(200)
          .setHeader('X-TOTAL-COUNT', response.length)
          .json(response);
      })
      .catch(error => {
        return res.status(400).json({ error });
      });
  }

  async getQuestion(req: Request, res: Response) {
    const service = new QuestionServices();
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
      .question(id)
      .then(response => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!response) return res.status(204).send();
        return res.status(200).json(response);
      })
      .catch(error => {
        return res.status(400).json({ error });
      });
  }

  async create(req: Request, res: Response) {
    const service = new QuestionServices();
    const data = { ...req.body, ...req.headers };

    const fields = validateFields(
      [
        {
          name: 'question',
          type: 'string',
          required: true,
        },
        {
          name: 'answer',
          type: 'string',
          required: true,
        },
        {
          name: 'type',
          type: 'string',
          required: true,
        },
        {
          name: 'options',
          type: 'array',
          required: false,
        },
      ],
      data,
    );
    if (fields.hasMissing) {
      return res.status(400).json(fields.errors);
    }
    const { question, answer, user, options, type } = data;
    await service
      .createQuestion(question, answer, type, user, options)
      .then(response => {
        return res.status(201).json(response);
      })
      .catch(error => {
        return res.status(400).json(error);
      });
  }

  async update(req: Request, res: Response) {
    const service = new QuestionServices();
    const data = { ...req.body, ...req.headers };

    const fields = validateFields(
      [
        {
          name: 'id',
          type: 'string',
          required: true,
        },
        {
          name: 'question',
          type: 'string',
          required: false,
        },
        {
          name: 'answer',
          type: 'string',
          required: false,
        },
        {
          name: 'type',
          type: 'string',
          required: false,
        },
        {
          name: 'options',
          type: 'array',
          required: false,
        },
      ],
      data,
    );
    if (fields.hasMissing) {
      return res.status(400).json(fields.errors);
    }
    const { id, question, answer, user, options, type } = data;
    await service
      .updateQuestion(id, question, answer, type, user, options)
      .then(response => {
        return res.status(200).json(response);
      })
      .catch(error => {
        return res.status(400).json(error);
      });
  }

  async delete(req: Request, res: Response) {
    const service = new QuestionServices();
    const data = { ...req.params, ...req.headers };

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
    await service
      .deleteQuestion(String(id))
      .then(() => {
        return res.status(204).json();
      })
      .catch(error => {
        return res.status(400).json(error);
      });
  }

  async approve(req: Request, res: Response) {
    const service = new QuestionServices();
    const data = { ...req.params, ...req.headers };

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
    const { id, user } = data;
    await service
      .approveQuestion(String(id), String(user))
      .then(response => {
        return res.status(200).json(response);
      })
      .catch(error => {
        return res.status(400).json(error);
      });
  }
}
