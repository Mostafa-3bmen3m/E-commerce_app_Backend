import express from 'express';
import prisma from '../config/prisma';

export const submitContact = async (req: express.Request, res: express.Response) => {
  try {
    const { name, email, message } = req.body;
    const contact = await prisma.contact.create({
      data: { name, email, message }
    });
    res.status(201).json({ success: true, contact });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getContacts = async (req: express.Request, res: express.Response) => {
  try {
    const contacts = await prisma.contact.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json({ success: true, contacts });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
