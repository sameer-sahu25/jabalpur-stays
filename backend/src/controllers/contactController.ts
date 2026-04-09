import { Request, Response } from 'express';
import { db } from '../config/db';
import { messages, newsletters } from '../db/schema';
import { eq } from 'drizzle-orm';

// @desc    Submit contact message
// @route   POST /api/contact/message
// @access  Public
export const submitMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, department, message } = req.body;

    if (!name || !email || !department || !message) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const newMessage = await db.insert(messages).values({
      name,
      email,
      phone,
      department,
      message,
    }).returning();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage[0],
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Subscribe to newsletter
// @route   POST /api/contact/newsletter
// @access  Public
export const subscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide an email address' });
    }

    // Check if already subscribed
    const existing = await db.select().from(newsletters).where(eq(newsletters.email, email));
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }

    await db.insert(newsletters).values({ email });

    res.status(201).json({
      success: true,
      message: 'Subscribed to newsletter successfully',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
