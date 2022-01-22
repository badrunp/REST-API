export default {
  port: process.env.PORT || 4000,
  db_url: process.env.MONGO_URL || 'mongodb://localhost:27017/ts-node',
  saltWorkFactor: 10,
  privateKey: 'thisissecretkey',
  publicKey: 'thisissecretkey',
  accessTokenTtl: '15m',
  refresToken: '1y',
};
