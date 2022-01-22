import { Request, Response } from 'express';
import {
  CreateProductInput,
  DeleteProductInput,
  ReadProductInput,
  UpdateProductInput,
} from '../schema/product.schema';
import {
  createProduct,
  findProduct,
  findAndUpdateProduct,
  deleteProduct,
} from '../services/product.service';

export async function createProductHandler(
  req: Request<object, object, CreateProductInput['body']>,
  res: Response
) {
  const product = await createProduct({
    ...req.body,
    user: res.locals.user._id,
  });

  return res.send(product);
}


export async function updateProductHandler(
  req: Request<UpdateProductInput['params'], object, UpdateProductInput['body']>,
  res: Response
) {
  const userId = res.locals.user._id;
  const productId = req.params.productId;
  const update = req.body;

  const product = await findProduct({ productId });

  if (product?.user.toString() !== userId.toString())
    return res.sendStatus(404);

  const productUpdate = await findAndUpdateProduct({ productId }, update, {
    new: true,
  });

  return res.send({ product: productUpdate });
}


export async function getProductHandler(
  req: Request<ReadProductInput['params']>,
  res: Response
) {
  const productId = req.params.productId;

  const product = await findProduct({ productId });

  if (!product) return res.sendStatus(404);

  return res.send(product);
}



export async function deleteProductHandler(
  req: Request<DeleteProductInput['params']>,
  res: Response
) {
  const userId = res.locals.user._id;
  const productId = req.params.productId;

  const product = await findProduct({ productId });

  if (product?.user.toString() !== userId.toString())
    return res.sendStatus(404);

  await deleteProduct({ productId });

  return res.sendStatus(200);
}
