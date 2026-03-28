import express from 'express';
import prisma from '../config/prisma';

export const getCategories = async (req: express.Request, res: express.Response) => {
  try {
    const categories = await prisma.category.findMany({ include: { _count: { select: { products: true } } } });
    res.status(200).json({ success: true, categories });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req: express.Request, res: express.Response) => {
  try {
    const { name } = req.body;
    const category = await prisma.category.create({ data: { name } });
    res.status(201).json({ success: true, category });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req: express.Request<{ id: string }>, res: express.Response) => {
  try {
    const { name } = req.body;
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: { name }
    });
    res.status(200).json({ success: true, category });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req: express.Request<{ id: string }>, res: express.Response) => {
  try {
    await prisma.category.delete({
      where: { id: req.params.id }
    });
    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
