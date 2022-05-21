import { Conn } from '../database';
import { v4 as uuid } from 'uuid';
import { Encrypt, logger } from '../utils';
import { Auth } from '../middlewares';

export interface iUser {
  id?: any;
  name?: string;
  username: string;
  email?: string;
  avatar?: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}
export class UserService {
  public async listAll() {
    return new Promise<iUser[]>(async (resolve, reject) => {
      await Conn('users')
        .select(
          'id',
          'name',
          'username',
          'email',
          'avatar',
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
    return new Promise<iUser>(async (resolve, reject) => {
      await Conn('users')
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
          resolve(response);
        })
        .catch((err: Error) => {
          reject(err.message);
        });
    });
  }
  public async findByUser(username: string) {
    return new Promise<iUser>(async (resolve, reject) => {
      await Conn('users')
        .select(
          'id',
          'name',
          'username',
          'email',
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
    avatar?: string,
  ) {
    return new Promise<iUser>(async (resolve, reject) => {
      try {
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
          return reject('usuário já cadastrado');
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
          })
          .then(async (response: any) => {
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
  ) {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const user = await Conn('users')
          .select('*')
          .where({ id })
          .then((response: any) => response)
          .catch((err: Error) => reject(err.message));
        if (!user || !user.length) {
          return reject('User not found');
        }
        const updated_at = new Date().toISOString();
        return await Conn('users')
          .update({
            name,
            username,
            email,
            password,
            avatar,
            updated_at,
            updated_by: id,
          })
          .then((_response: any) => resolve(''))
          .catch((err: Error) => reject(err.message));
      } catch (err) {
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
          return reject('Invalid username');
        }
        await Conn('users')
          .where({ id })
          .delete()
          .then((_response: any) => resolve(''))
          .catch((err: Error) => reject(err.message));
      } catch (err) {
        reject(err);
      }
    });
  }
  public async authenticate(username: string, password: string) {
    return new Promise<{ id: string; token: string }>(
      async (resolve, reject) => {
        try {
          const user = await Conn('users')
            .select('username', 'password')
            .first()
            .where({ username })
            .then((response: any) => response)
            .catch((err: Error) => reject(err.message));
          if (!user || !user.length) {
            return reject('Invalid username');
          }
          const { compare } = new Encrypt();
          const isValid: boolean = await compare(password, user.password).then(
            response => response,
          );
          let token = Auth.signin(user.id, username);
          resolve({
            id: user.id,
            token,
          });
        } catch (err) {
          reject(err);
        }
      },
    );
  }
}