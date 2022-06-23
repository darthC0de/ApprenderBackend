/* eslint-disable indent */
/* eslint-disable no-async-promise-executor */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { v4 as uuid } from 'uuid';
import { Conn } from '../database';
import { UserService } from './users.service';

interface IParam {
  id?: string;
  description: string;
  value?: string | number;
  updated_by: string;
  updated_at?: string;
}

export class ParameterService {
  async findAll() {
    return new Promise<IParam[]>(async (resolve, reject) => {
      try {
        await Conn('parameters')
          .select('*')
          .then(response => {
            resolve(response);
          })
          .catch((err: Error) => {
            reject(err.message);
          });
      } catch (err) {
        reject(err);
      }
    });
  }

  async findById(id: string) {
    return new Promise<IParam>(async (resolve, reject) => {
      try {
        await Conn('parameters')
          .select('id', 'description', 'value')
          .where({ id })
          .first()
          .then(response => {
            resolve(response);
          })
          .catch((err: Error) => reject(err.message));
      } catch (err) {
        reject(err);
      }
    });
  }

  async findByDescription(description: string) {
    return new Promise<IParam>(async (resolve, reject) => {
      try {
        await Conn('parameters')
          .select('id', 'description', 'value')
          .where({ description })
          .first()
          .then(response => {
            resolve(response);
          })
          .catch((err: Error) => reject(err.message));
      } catch (err) {
        reject(err);
      }
    });
  }

  async create(description: string, author: string, value?: string | number) {
    return new Promise(async (resolve, reject) => {
      try {
        const userService = new UserService();
        const user = await userService
          .findById(author)
          .then(response => response)
          .catch(err => reject(err));
        if (!user) {
          return;
        }
        const id = uuid();
        await Conn('parameters')
          .insert({
            description,
            updated_by: author,
            value,
            updated_at: new Date().toISOString(),
          })
          .then(async (_response: any) => {
            await this.findById(id).then(response => resolve(response));
          })
          .catch((err: Error) => reject(err.message));
      } catch (err) {
        reject(err);
      }
    });
  }

  async update(id: string, description: string, author: string) {
    return new Promise<IParam>(async (resolve, reject) => {
      try {
        const validParam = await this.findById(id).then(response => response);
        if (!validParam) return reject('Invalid param ID');
        const userService = new UserService();
        const user = await userService
          .findById(author)
          .then(response => response)
          .catch(err => reject(err));
        if (!user) {
          return;
        }
        const descriptionNotUsed = await Conn('parameters')
          .select('*')
          .where({ description })
          .first()
          .then(response => {
            return response;
          })
          .catch((err: Error) => reject(err.message));
        if (descriptionNotUsed && descriptionNotUsed.length) {
          return reject('Description already used');
        }
        await Conn('parameters')
          .update({
            description,
            updated_by: author,
            updated_at: new Date().toISOString(),
          })
          .where({ id })
          .then(async (_response: any) => {
            await this.findById(id).then(response => resolve(response));
          })
          .catch((err: Error) => reject(err.message));
      } catch (err) {
        reject(err);
      }
    });
  }

  async delete(id: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const validType = await this.findById(id).then(response => response);
        if (!validType) return reject('Invalid param ID');
        await Conn('parameters')
          .where({ id })
          .first()
          .delete()
          .then(_response => resolve(''))
          .catch((err: Error) => reject(err.message));
      } catch (err) {
        reject(err);
      }
    });
  }
}
