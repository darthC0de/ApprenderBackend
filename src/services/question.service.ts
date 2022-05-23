import { Conn } from '../database';
import { v4 as uuid } from 'uuid';
import { Encrypt } from '../utils';
import { TypesServices, UserService } from '.';

export interface IQuestions {
  id?: string;
  question: string;
  answer: string;
  type: string;
  options?: string;
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
          .select('*')
          .then(response => {
            resolve(response);
          })
          .catch((error: Error) => reject(error.message));
      } catch (err) {
        reject(err);
      }
    });
  }
  async question(id: string) {
    return new Promise<IQuestions>(async (resolve, reject) => {
      try {
        await Conn('questions')
          .select('*')
          .where({ id })
          .first()
          .then(response => {
            resolve(response);
          })
          .catch((error: Error) => reject(error.message));
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
        const valid_user = await userService
          .findById(created_by)
          .then(response => response);
        console.log(valid_user);
        if (!valid_user) {
          return reject('Invalid user');
        }
        const valid_type = await typesService
          .findById(type)
          .then(response => response);
        if (!valid_type) {
          return reject('Invalid type');
        }
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
          .then(async _response => {
            await this.question(id).then(response => resolve(response));
          })
          .catch((error: Error) => reject(error.message));
      } catch (err) {
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
          return reject('Invalid question ID');
        }
        const valid_user = await userService
          .findById(updated_by)
          .then(response => response);
        console.log(valid_user);
        if (!valid_user) {
          return reject('Invalid user');
        }
        const valid_type = await typesService
          .findById(type)
          .then(response => response);
        if (!valid_type) {
          return reject('Invalid type');
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
          .then(async _response => {
            await this.question(id).then(response => resolve(response));
          })
          .catch((error: Error) => reject(error.message));
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
          .then(_response => {
            resolve('');
          })
          .catch((error: Error) => reject(error.message));
      } catch (err) {
        reject(err);
      }
    });
  }
}
