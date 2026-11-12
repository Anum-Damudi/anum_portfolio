import { z } from 'zod';

export const numiLineSchema = z.object({
  section: z.string().trim().min(1, 'Section is required').max(50),
  line: z.string().trim().min(1, 'Line text is required').max(500),
});
