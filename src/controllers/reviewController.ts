import express from 'express';
import prisma from '../config/prisma';

export const createReview = async (req: express.Request, res: express.Response) => {
  try {
    const { rating, comment, productId } = req.body;
    const userId = req.user!.id;

    const review = await prisma.review.create({
      data: { rating, comment, productId, userId }
    });


    const reviews = await prisma.review.findMany({ where: { productId } });
    const avgRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;
    
    await prisma.product.update({
      where: { id: productId },
      data: { rating: avgRating }
    });

    res.status(201).json({ success: true, review });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductReviews = async (req: express.Request<{ productId: string }>, res: express.Response) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: req.params.productId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, reviews });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
