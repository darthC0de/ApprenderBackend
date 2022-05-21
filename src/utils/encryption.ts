import bcrypt from 'bcryptjs';

class Encrypt {
  private saltRounds: number;
  constructor() {
    this.saltRounds = 10;
  }
  async cript(pwd: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      await bcrypt
        .hash(pwd, this.saltRounds)
        .then((hash: string) => {
          resolve(hash);
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  }
  async compare(pwd: string, hash: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      await bcrypt
        .compare(pwd, hash)
        .then((valid: boolean) => {
          resolve(valid);
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  }
}

export { Encrypt };
