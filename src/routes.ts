import { Express } from 'express';
import {
  createProductHandler,
  deleteProductHandler,
  getProductHandler,
  updateProductHandler,
} from './controllers/product.controller';
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getSessionHandler,
} from './controllers/session.controller';
import { createUserHandler } from './controllers/user.controller';
import requiredUser from './middleware/requiredUser';
import validate from './middleware/validateResource';
import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  updateProductSchema,
} from './schema/product.schema';
import { createSessionSchema } from './schema/session.schema';
import { createUserSchema } from './schema/user.schema';

function routes(app: Express) {
  app.post('/api/users', validate(createUserSchema), createUserHandler);
  app.post(
    '/api/sessions',
    validate(createSessionSchema),
    createUserSessionHandler
  );
  app.get('/api/sessions', requiredUser, getSessionHandler);
  app.delete('/api/sessions', requiredUser, deleteSessionHandler);

  app.post(
    '/api/product',
    [requiredUser, validate(createProductSchema)],
    createProductHandler
  );
  app.put(
    '/api/product/:productId',
    [requiredUser, validate(updateProductSchema)],
    updateProductHandler
  );
  app.delete(
    '/api/product/:productId',
    [requiredUser, validate(deleteProductSchema)],
    deleteProductHandler
  );
  app.get(
    '/api/product/:productId',
    validate(getProductSchema),
    getProductHandler
  );
}

export default routes;
