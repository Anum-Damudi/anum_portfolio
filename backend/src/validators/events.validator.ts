import { z } from 'zod';

export const eventSchema = z.object({
  type: z.enum(['page_view', 'easter_egg', 'cv_download'], {
    errorMap: () => ({ message: 'type must be one of: page_view, easter_egg, cv_download' }),
  }),
  path: z.string().trim().min(1, 'Path cannot be empty').max(300, 'Path is too long'),
});

export type EventInput = z.infer<typeof eventSchema>;
