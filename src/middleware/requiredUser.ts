import { Request, Response, NextFunction } from 'express';

const requiredUser = (req: Request, res: Response, next: NextFunction) => {
  const userId = res.locals.user;

  if (!userId) return res.sendStatus(403);

  return next();
};

export default requiredUser;
