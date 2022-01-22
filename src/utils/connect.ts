import mongoose from 'mongoose';
import config from 'config';
import logger from './logger';

async function connect() {
  const dbUrl: string = config.get<string>('db_url');

  try {
    await mongoose.connect(dbUrl);
    logger.info('Database Connected');
  } catch (error) {
    logger.error('Database Error' + error);
    process.exit(1);
  }
}

export default connect;
