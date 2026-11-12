import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be under 100 characters'),
  email: z.string().trim().email('Invalid email address').max(200, 'Email must be under 200 characters'),
  message: z.string().trim().min(5, 'Message must be at least 5 characters').max(5000, 'Message must be under 5000 characters'),
  website: z.string().optional(), // Honeypot
});

export type ContactInput = z.infer<typeof contactSchema>;
