/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable camelcase */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable indent */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
import { v4 as uuid } from 'uuid';
import { Conn } from '../database';
import { TypesServices, UserService } from '.';

export interface IQuestions {
  id?: string;
  question: string;
  answer: string;
  type: string;
  options?: string;
  approved_by?: string;
  created_by?: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
}
export class QuestionServices {
  async questions() {
    return new Promise<IQuestions[]>(async (resolve, reject) => {
      try {
        await Conn('questions')
          .select(
            'id',
            'question',
            'answer',
            'type',
            'options',
            'created_by',
            'updated_by',
            'created_at',
            'updated_at',
            'approved_by',
          )
          .whereNotNull('approved_by')
          .then(response => {
            resolve(response);
          })
          .catch((error: Error) => reject(error));
      } catch (err) {
        reject(err);
      }
    });
  }

  async question(id: string) {
    return new Promise<IQuestions>(async (resolve, reject) => {
      try {
        await Conn('questions')
          .select(
            'id',
            'question',
            'answer',
            'type',
            'options',
            'created_by',
            'updated_by',
            'created_at',
            'updated_at',
            'approved_by',
          )
          .where({ id })
          .first()
          .then(response => {
            resolve(response);
          })
          .catch((error: Error) => reject(error));
      } catch (err) {
        reject(err);
      }
    });
  }

  async createQuestion(
    question: string,
    answer: string,
    type: string,
    created_by: string,
    options?: string,
  ) {
    return new Promise<IQuestions>(async (resolve, reject) => {
      try {
        const userService = new UserService();
        const typesService = new TypesServices();
        await userService
          .findById(created_by)
          .catch(() => reject(new Error('Invalid user')));

        await typesService
          .findById(type)
          .catch(() => reject(new Error('Invalid type')));

        console.log('got here');
        const id = uuid();
        await Conn('questions')
          .insert({
            id,
            question,
            answer,
            type,
            created_by,
            options,
          })
          .then(async () => {
            await this.question(id)
              .then(response => resolve(response))
              .catch((error: Error) => {
                console.log(error);
                reject(error);
              });
          })
          .catch((error: Error) => {
            console.log(error);
            reject(error);
          });
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  }

  async updateQuestion(
    id: string,
    question: string,
    answer: string,
    type: string,
    updated_by: string,
    options?: string,
  ) {
    return new Promise<IQuestions>(async (resolve, reject) => {
      try {
        const userService = new UserService();
        const typesService = new TypesServices();

        const valid_question = await this.question(id).then(
          response => response,
        );
        if (!valid_question) {
          return reject(new Error('Invalid question ID'));
        }
        const valid_user = await userService
          .findById(updated_by)
          .then(response => response);
        console.log(valid_user);
        if (!valid_user) {
          return reject(new Error('Invalid user'));
        }
        const valid_type = await typesService
          .findById(type)
          .then(response => response);
        if (!valid_type) {
          return reject(new Error('Invalid type'));
        }
        const updated_at = new Date();
        await Conn('questions')
          .update({
            id,
            question,
            answer,
            type,
            updated_by,
            updated_at,
            options,
          })
          .then(async () => {
            await this.question(id).then(response => resolve(response));
          })
          .catch((error: Error) => reject(error));
      } catch (err) {
        reject(err);
      }
    });
  }

  async unapprovedQuestions() {
    return new Promise<IQuestions[]>(async (resolve, reject) => {
      try {
        await Conn('questions')
          .select(
            'id',
            'question',
            'answer',
            'type',
            'options',
            'created_by',
            'updated_by',
            'created_at',
            'updated_at',
            'approved_by',
          )
          .whereNull('approved_by')
          .then(response => {
            resolve(response);
          })
          .catch((error: Error) => reject(error));
      } catch (err) {
        reject(err);
      }
    });
  }

  async approveQuestion(id: string, approver: string) {
    return new Promise<IQuestions>(async (resolve, reject) => {
      try {
        const userService = new UserService();

        const valid_question = await this.question(id).then(
          response => response,
        );
        if (!valid_question || valid_question.approved_by !== null) {
          return reject(new Error('Invalid question ID'));
        }
        const valid_user = await userService
          .findById(approver)
          .then(response => response);

        if (!valid_user) {
          return reject(new Error('Invalid user'));
        }

        const updated_at = new Date();
        await Conn('questions')
          .update({
            approved_by: approver,
            updated_by: approver,
            updated_at,
          })
          .where({ id })
          .then(async () => {
            await this.question(id).then(response => resolve(response));
          })
          .catch((error: Error) => reject(error));
      } catch (err) {
        reject(err);
      }
    });
  }

  async deleteQuestion(id: string) {
    return new Promise<any>(async (resolve, reject) => {
      try {
        await Conn('questions')
          .where({ id })
          .first()
          .delete()
          .then(() => {
            resolve('');
          })
          .catch((error: Error) => reject(error));
      } catch (err) {
        reject(err);
      }
    });
  }
}
