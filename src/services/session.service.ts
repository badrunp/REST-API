import Session, { SessionDocument } from '../models/session.model';
import logger from '../utils/logger';
import { FilterQuery } from 'mongoose';
import { get } from 'lodash';
import { signJwt, verifJwt } from '../utils/jwt';
import { findUser } from './user.service';
import config from 'config';

export async function createSession(userId: string, userAgent: string) {
  try {
    const session = await Session.create({
      user: userId,
      userAgent,
    });

    return session.toJSON();
  } catch (error) {
    logger.error(error);
  }
}

export async function findSession(query: FilterQuery<SessionDocument>) {
  return await Session.find(query).lean();
}

export async function updateSession(
  query: FilterQuery<SessionDocument>,
  update: FilterQuery<SessionDocument>
) {
  try {
    return await Session.updateOne(query, update);
  } catch (error) {
    logger.error(error);
  }
}

export async function reIssueAccessToken({
  refresToken,
}: {
  refresToken: string;
}) {
  try {
    const { decoded } = verifJwt(refresToken);

    if (!decoded && !get(decoded, 'session')) return false;

    const session = await Session.findById(get(decoded, 'session'));

    if (!session || !session.valid) return false;

    const user = await findUser({ _id: session.user });

    if (!user) return false;

    const accessToken = signJwt(
      { ...user, session: session._id },
      { expiresIn: config.get<string>('accessTokenTtl') }
    );

    return accessToken;
  } catch (error) {
    logger.error(error);
  }
}
