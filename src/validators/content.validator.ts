import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  slug: z.string().trim().min(1, 'Slug is required').max(200),
  summary: z.string().trim().min(1, 'Summary is required').max(500),
  description: z.string().trim().min(1, 'Description is required'),
  techStack: z.array(z.string().trim()).min(1, 'At least one tech stack tag is required'),
  liveUrl: z.string().url('Invalid URL').nullable().optional(),
  githubUrl: z.string().url('Invalid URL').nullable().optional(),
  imageUrl: z.string().url('Invalid URL').nullable().optional(),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
});

export const projectUpdateSchema = projectSchema.partial();

export const skillSchema = z.object({
  name: z.string().trim().min(1, 'Skill name is required').max(100),
  category: z.string().trim().min(1, 'Category is required').max(100),
  level: z.string().trim().min(1, 'Level is required').max(100),
  order: z.number().int().default(0),
});

export const skillUpdateSchema = skillSchema.partial();

export const achievementSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: z.string().trim().min(1, 'Description is required'),
  date: z.string().trim().min(1, 'Date is required').max(100),
  icon: z.string().trim().min(1, 'Icon name is required').max(100),
});

export const achievementUpdateSchema = achievementSchema.partial();

export const experimentSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: z.string().trim().min(1, 'Description is required'),
  status: z.enum(['idea', 'in_progress', 'broken', 'shipped'], {
    errorMap: () => ({ message: 'Status must be one of: idea, in_progress, broken, shipped' }),
  }),
  link: z.string().url('Invalid URL').nullable().optional(),
});

export const experimentUpdateSchema = experimentSchema.partial();
