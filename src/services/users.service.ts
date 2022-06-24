/* eslint-disable import/extensions */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-async-promise-executor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuid } from 'uuid';
import { Conn } from '../database';
import { Encrypt } from '../utils';
import { Auth } from '../middlewares';
import { ParameterService } from '.';

export interface IUser {
  id?: any;
  name?: string;
  username: string;
  email?: string;
  avatar?: string;
  role?: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}
export class UserService {
  public async listAll() {
    return new Promise<IUser[]>(async (resolve, reject) => {
      await Conn('users')
        .select(
          'id',
          'name',
          'username',
          'email',
          'avatar',
          'role',
          'created_at',
          'updated_at',
        )
        .then((response: any) => {
          resolve(response);
        })
        .catch((err: Error) => {
          reject(err.message);
        });
    });
  }

  public async findById(id: string) {
    return new Promise<IUser>(async (resolve, reject) => {
      await Conn('users')
        .select(
          'id',
          'name',
          'username',
          'email',
          'avatar',
          'role',
          'created_at',
          'updated_at',
        )
        .where({ id })
        .first()
        .then((response: any) => {
          resolve(response);
        })
        .catch((err: Error) => {
          reject(err.message);
        });
    });
  }

  public async findByUser(username: string) {
    return new Promise<IUser>(async (resolve, reject) => {
      await Conn('users')
        .select(
          'id',
          'name',
          'username',
          'email',
          'role',
          'avatar',
          'created_at',
          'updated_at',
        )
        .where({ username })
        .first()
        .then((response: any) => {
          resolve(response);
        })
        .catch((err: Error) => {
          reject(err.message);
        });
    });
  }

  public async create(
    name: string,
    username: string,
    email: string,
    password: string,
    role?: string,
    avatar?: string,
  ) {
    return new Promise<IUser>(async (resolve, reject) => {
      const parameters = new ParameterService();
      try {
        const userRole = await parameters
          .findByDescription('Default user role')
          .then((response: any) => {
            return response.value;
          });
        const user = await Conn('users')
          .select('*')
          .where('email', email)
          .orWhere('username', username)
          .first()
          .then((response: any) => {
            return response;
          })
          .catch((err: Error) => reject(err.message));
        if (user) {
          return reject(new Error('usuário já cadastrado'));
        }

        const id = uuid();
        await Conn('users')
          .insert({
            id,
            name,
            username,
            email,
            password,
            avatar,
            role: role || userRole,
          })
          .then(async () => {
            const details = await this.findById(id);
            resolve(details);
          })
          .catch((error: Error) => reject(error.message));
      } catch (err) {
        reject(err);
      }
    });
  }

  public async update(
    id: string,
    name?: string,
    username?: string,
    email?: string,
    password?: string,
    avatar?: string,
    role?: string,
  ) {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const user = await Conn('users')
          .select(
            'id',
            'name',
            'username',
            'email',
            'avatar',
            'created_at',
            'updated_at',
          )
          .where({ id })
          .first()
          .then((response: any) => {
            return response;
          });

        if (!user) {
          return reject(new Error('User not found'));
        }
        const updatedAt = new Date().toISOString();
        return await Conn('users')
          .update({
            name,
            username,
            email,
            password,
            avatar,
            role,
            updated_at: updatedAt,
          })
          .where({ id })
          .then(() => resolve(''))
          .catch((err: Error) => {
            console.log({ err });
            return reject(err.message);
          });
      } catch (err) {
        console.log({ err });
        reject(err);
      }
    });
  }

  public async delete(id: string) {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const user = await Conn('users')
          .select('username', 'password')
          .where({ id })
          .first()
          .then((response: any) => response)
          .catch((err: Error) => reject(err.message));
        if (!user || !user.length) {
          return reject(new Error('Invalid username'));
        }
        await Conn('users')
          .where({ id })
          .delete()
          .then(() => resolve(''))
          .catch((err: Error) => reject(err.message));
      } catch (err) {
        reject(err);
      }
    });
  }

  public async authenticate(username: string, password: string) {
    return new Promise<{ id: string; token: string; role: string }>(
      async (resolve, reject) => {
        try {
          const user = await Conn('users')
            .select('id', 'username', 'password', 'role')
            .where({ username })
            .first()
            .then((response: any) => response)
            .catch((err: Error) => reject(err.message));
          if (!user) {
            return reject(new Error('Invalid username'));
          }
          const cript = new Encrypt();
          const isValid: boolean = await cript
            .compare(password, user.password)
            .then(response => response)
            .catch(() => {
              return false;
            });
          if (!isValid) {
            return reject(new Error('Invalid username or password'));
          }
          const token = Auth.signin(user.id, username, user.role);
          resolve({
            id: user.id,
            token,
            role: user.role,
          });
        } catch (err) {
          console.log({ err });
          reject(err);
        }
      },
    );
  }
}
