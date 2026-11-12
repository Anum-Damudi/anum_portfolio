import { z } from 'zod';

export const currentlySchema = z.object({
  learning: z.string().trim().min(1, 'Learning description is required').max(500),
  building: z.string().trim().min(1, 'Building description is required').max(500),
  listeningTo: z.string().trim().min(1, 'ListeningTo description is required').max(500),
});

export const currentlyUpdateSchema = currentlySchema.partial();
