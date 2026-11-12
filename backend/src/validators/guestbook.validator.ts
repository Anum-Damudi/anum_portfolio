import { z } from 'zod';

export const guestbookSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(50, 'Name must be under 50 characters'),
  message: z.string().trim().min(3, 'Message must be at least 3 characters').max(500, 'Message must be under 500 characters'),
});

export const guestbookStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']),
});

export type GuestbookInput = z.infer<typeof guestbookSchema>;
export type GuestbookStatusInput = z.infer<typeof guestbookStatusSchema>;
