import { Request, Response } from 'express';
import { QuestionServices } from '../services';
import { validateFields } from '../utils';

//[{"id":1,"question":"10 + 10","answer":"20","type":"options","options":"[\"10\",\"12\",\"32\",\"20\"]"},{"id":2,"question":"20 + 10","answer":"30","type":"options","options":"[\"30\",\"15\",\"23\",\"18\"]"},{"id":3,"question":"18 - 10","answer":"8","type":"options","options":"[\"40\",\"13\",\"5\",\"8\"]"},{"id":4,"question":"15 x 2","answer":"30","type":"options","options":"[\"30\",\"62\",\"25\",\"18\"]"},{"id":5,"question":"78 - 43","answer":"35","type":"options","options":"[\"35\",\"19\",\"50\",\"72\"]"},{"id":6,"question":"155 + 42","answer":"197","type":"options","options":"[\"100\",\"210\",\"175\",\"197\"]"},{"id":7,"question":"32 - 18","answer":"14","type":"options","options":"[\"10\",\"12\",\"14\",\"16\"]"}]
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
