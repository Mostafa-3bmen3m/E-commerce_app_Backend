import express from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const getWatchlist = async (req: AuthRequest, res: express.Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        wishlist: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ success: true, watchlist: user.wishlist });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleWatchlistItem = async (req: AuthRequest, res: express.Response) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.body;

    if (!userId) return res.status(401).json({ message: 'Not authenticated' });

    // Check if item is already in wishlist
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { wishlist: { select: { id: true } } },
    });

    const isInWishlist = user?.wishlist.some((item) => item.id === productId);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        wishlist: isInWishlist
          ? { disconnect: { id: productId } }
          : { connect: { id: productId } },
      },
      include: {
        wishlist: {
          include: {
            category: true,
          },
        },
      },
    });

    res.json({ 
      success: true, 
      watchlist: updatedUser.wishlist,
      action: isInWishlist ? 'removed' : 'added'
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
