import { Request, Response } from 'express';
import { QuestionServices } from '../services';
import { validateFields } from '../utils';

export class QuestionController {
  async getQuestions(_req: Request, res: Response) {
    const service = new QuestionServices();
    await service
      .questions()
      .then(response => {
        return res.status(200).json(response);
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
        return res.status(200).json(response);
      })
      .catch(error => {
        return res.status(400).json({ error });
      });
  }
  async create(req: Request, res: Response) {
    const service = new QuestionServices();
    const data = { ...req.body, ...req.headers };
    console.log(data);
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
        return res.status(400).json({ error });
      });
  }
}
