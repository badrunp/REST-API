import pino from 'pino';
import dayjs from 'dayjs';

const logger = pino({
  base: {
    pid: false,
  },
  level: 'info',
  transport: {
    target: 'pino-pretty',
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});

export default logger;
