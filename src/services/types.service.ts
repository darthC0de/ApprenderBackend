import { v4 as uuid } from 'uuid';
import { Conn } from '../database';
import { UserService } from './users.service';

export interface ITypes {
  id: string;
  description?: string;
  created_by?: string;
  created_at?: string;
}

export class TypesServices {
  async findAll() {
    return new Promise<ITypes[]>(async (resolve, reject) => {
      try {
        await Conn('types')
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
    return new Promise<ITypes>(async (resolve, reject) => {
      try {
        await Conn('types')
          .select('*')
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

  async create(description: string, author: string) {
    return new Promise<ITypes>(async (resolve, reject) => {
      try {
        const userService = new UserService();
        const user = await userService
          .findById(author)
          .then(response => response)
          .catch(err => reject(err));
        if (!user) {
          return;
        }
        const description_not_used = await Conn('types')
          .select('*')
          .where({ description })
          .first()
          .then(response => {
            return response;
          })
          .catch((err: Error) => reject(err.message));
        if (description_not_used && description_not_used.length) {
          return reject('Description already used');
        }
        const id = uuid();
        await Conn('types')
          .insert({
            id,
            description,
            created_by: author,
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
    return new Promise<ITypes>(async (resolve, reject) => {
      try {
        const valid_type = await this.findById(id).then(response => response);
        if (!valid_type) return reject('Invalid type ID');
        const userService = new UserService();
        const user = await userService
          .findById(author)
          .then(response => response)
          .catch(err => reject(err));
        if (!user) {
          return;
        }
        const description_not_used = await Conn('types')
          .select('*')
          .where({ description })
          .first()
          .then(response => {
            return response;
          })
          .catch((err: Error) => reject(err.message));
        if (description_not_used && description_not_used.length) {
          return reject('Description already used');
        }
        await Conn('types')
          .update({
            description,
            created_by: author,
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
        const valid_type = await this.findById(id).then(response => response);
        if (!valid_type) return reject('Invalid type ID');
        await Conn('types')
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
