import { v4 as uuid } from 'uuid';
import { Conn } from '../database';
import { UserService } from './users.service';

export interface IRoles {
  id: string;
  description?: string;
  created_by?: string;
  created_at?: string;
}

export class RolesServices {
  async findAll() {
    return new Promise<IRoles[]>(async (resolve, reject) => {
      try {
        await Conn('roles')
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
    return new Promise<IRoles>(async (resolve, reject) => {
      try {
        await Conn('roles')
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
    return new Promise<IRoles>(async (resolve, reject) => {
      try {
        const userService = new UserService();
        const user = await userService
          .findById(author)
          .then(response => response)
          .catch(err => reject(err));
        if (!user) {
          return;
        }
        const descriptionNotUsed = await Conn('roles')
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
        const id = uuid();
        await Conn('roles')
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
    return new Promise<IRoles>(async (resolve, reject) => {
      try {
        const validRole = await this.findById(id).then(response => response);
        if (!validRole) return reject('Invalid role ID');
        const userService = new UserService();
        const user = await userService
          .findById(author)
          .then(response => response)
          .catch(err => reject(err));
        if (!user) {
          return;
        }
        const descriptionNotUsed = await Conn('roles')
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
        await Conn('roles')
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
        const validType = await this.findById(id).then(response => response);
        if (!validType) return reject('Invalid role ID');
        await Conn('roles')
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
