import { Request, Response } from 'express';
import {
  createSession,
  findSession,
  updateSession,
} from '../services/session.service';
import { validatePassword } from '../services/user.service';
import { signJwt } from '../utils/jwt';
import config from 'config';
import logger from '../utils/logger';
import { get } from 'lodash';

export async function createUserSessionHandler(req: Request, res: Response) {
  const user = await validatePassword(req.body);

  if (!user) return res.status(401).send('Invlida email or password');

  const session = await createSession(user._id, req.get('user-agent') || '');

  const accessToken = signJwt(
    { ...user, session: get(session, '_id') },
    { expiresIn: config.get<string>('accessTokenTtl') }
  );

  const refresToken = signJwt(
    { ...user, session: get(session, '_id') },
    { expiresIn: config.get<string>('refresToken') }
  );

  return res.send({ accessToken, refresToken });
}

export async function getSessionHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;

  const sessions = await findSession({ user: userId, valid: true });

  return res.send(sessions);
}

export async function deleteSessionHandler(
  req: Request,
  res: Response,
) {
  try {
    const sessionId = res.locals.user.session;

    await updateSession({ _id: sessionId }, { valid: false });

    return res.send({
      accessToken: null,
      refresToken: null,
    });
  } catch (error) {
    logger.error(error);
  }
}
