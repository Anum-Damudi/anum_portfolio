import { z } from 'zod';

export const eventSchema = z.object({
  type: z.enum(['page_view', 'easter_egg', 'cv_download'], {
    message: 'Type must be one of: page_view, easter_egg, cv_download',
  }),
  path: z.string().trim().max(200).optional(),
  meta: z.record(z.string(), z.any()).optional(),
});

export type EventInput = z.infer<typeof eventSchema>;