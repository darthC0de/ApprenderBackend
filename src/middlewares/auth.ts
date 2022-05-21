import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export function signin(id: string, username: string) {
  return jwt.sign({ id, username }, String(process.env.APP_SECRET), {
    expiresIn: '15 days',
  });
}
export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { authorization }: any = req.headers;
  if (!authorization) return res.status(401).json({ message: 'Unauthorized' });
  const [method, token] = authorization.split(' ');
  if (method !== 'Bearer' || !token) {
    return res.status(401).json({
      message: 'You must provide a valid Bearer authentication token',
    });
  }
  const decoded: any = jwt.verify(
    token,
    String(process.env.APP_SECRET),
    // @ts-ignore
    (err: Error, decoded: any) => {
      if (err)
        return res.status(500).json({
          errors: [err.message],
        });

      req.headers.user = decoded.id;
      req.headers.username = decoded.username;

      next();
    },
  );
}
