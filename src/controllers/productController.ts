import express from 'express';
import prisma from '../config/prisma';

export const getProducts = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { category, search, minPrice, maxPrice, rating, sort, page = 1, limit = 12 } = req.query;
    
    const where: any = {};
    if (category) where.categoryId = String(category);
    if (search) where.name = { contains: String(search), mode: 'insensitive' };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }
    if (rating) where.rating = { gte: Number(rating) };

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const orderBy: any = {};
    if (sort === 'price_asc') orderBy.price = 'asc';
    else if (sort === 'price_desc') orderBy.price = 'desc';
    else if (sort === 'rating_desc') orderBy.rating = 'desc';
    else if (sort === 'newest') orderBy.createdAt = 'desc';
    else orderBy.createdAt = 'desc';

    const [products, total] = await Promise.all([
      prisma.product.findMany({ 
        where, 
        skip, 
        take, 
        orderBy, 
        include: { 
          category: true,
          _count: { select: { reviews: true } }
        } 
      }),
      prisma.product.count({ where })
    ]);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    next(error);
  }
};

export const getProductById = async (req: express.Request<{ id: string }>, res: express.Response, next: express.NextFunction) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { 
        category: true, 
        reviews: { 
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' }
        } 
      }
    });

    if (!product) {
      const error: any = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, product });
  } catch (error: any) {
    next(error);
  }
};

export const createProduct = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { name, description, price, stock, images, categoryId } = req.body;
    const product = await prisma.product.create({ 
      data: { 
        name, 
        description, 
        price: Number(price), 
        stock: Number(stock), 
        images: Array.isArray(images) ? images : [], 
        categoryId 
      } 
    });
    res.status(201).json({ success: true, product });
  } catch (error: any) {
    next(error);
  }
};

export const updateProduct = async (req: express.Request<{ id: string }>, res: express.Response, next: express.NextFunction) => {
  try {
    const { name, description, price, stock, images, categoryId } = req.body;
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { 
        name, 
        description, 
        price: price !== undefined ? Number(price) : undefined, 
        stock: stock !== undefined ? Number(stock) : undefined, 
        images: Array.isArray(images) ? images : undefined, 
        categoryId 
      }
    });
    res.status(200).json({ success: true, product });
  } catch (error: any) {
    next(error);
  }
};

export const deleteProduct = async (req: express.Request<{ id: string }>, res: express.Response, next: express.NextFunction) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error: any) {
    next(error);
  }
};
