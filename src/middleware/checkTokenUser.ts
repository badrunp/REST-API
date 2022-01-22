import { Request, Response, NextFunction } from 'express';
import { get } from 'lodash';
import { reIssueAccessToken } from '../services/session.service';
import { verifJwt } from '../utils/jwt';


export default async function checkTokenUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const accessToken = get(req, 'headers.authorization', '').split(' ')[1];
  const refresToken = get(req, 'headers.x-refres');

  if (!accessToken) return next();

  const { decoded, expired } = verifJwt(accessToken);

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (expired && refresToken) {
    const newAccessToken = await reIssueAccessToken({ refresToken });

    if (newAccessToken) {
      res.setHeader('x-access-token', newAccessToken);
      const { decoded } = verifJwt(newAccessToken);

      res.locals.user = decoded;
      return next();
    }
  }

  return next();
}



