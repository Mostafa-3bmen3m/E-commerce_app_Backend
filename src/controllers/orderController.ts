import express from 'express';
import prisma from '../config/prisma';

export const createOrder = async (req: express.Request, res: express.Response) => {
  try {
    const { orderItems, totalAmount, address, city, zipCode, country, phone } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount: Number(totalAmount),
        address,
        city,
        zipCode,
        country,
        phone,
        orderItems: {
          create: orderItems.map((item: any) => ({
            productId: item.productId,
            quantity: Number(item.quantity),
            price: Number(item.price)
          }))
        }
      },
      include: {
        orderItems: true
      }
    });

    return res.status(201).json({ success: true, order });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

export const getMyOrders = async (req: express.Request, res: express.Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { orderItems: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json({ success: true, orders });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

export const getOrderById = async (req: express.Request<{ id: string }>, res: express.Response) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { 
        orderItems: { include: { product: true } }, 
        user: { select: { name: true, email: true } } 
      }
    });
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    if (order.userId !== req.user?.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    return res.status(200).json({ success: true, order });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

export const getAllOrders = async (req: express.Request, res: express.Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export const updateOrderStatus = async (req: express.Request<{ id: string }>, res: express.Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
