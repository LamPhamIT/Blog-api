import z from 'zod';

export const CreatePostSchema = z.object({
  title: z
    .string({ message: 'Title is required' })
    .min(10, 'Title must be at least 10 characters long')
    .max(200, 'Title must not exceed 200 characters'),

  content: z
    .string({ message: 'Content is required' })
    .min(50, 'Content must be at least 50 characters long'),

  description: z.string().optional(),

  thumbnail: z.url('Thumbnail must be a valid URL').optional(),

  seriesId: z.number().optional(),

  published: z.boolean().default(true),

  readTime: z.number().min(1, 'Read time must be at least 1 minute').optional(),
  tags: z.array(z.string()).optional(),
});

export type CreatePostDTO = z.infer<typeof CreatePostSchema>;

export const GetPostsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  seriesId: z.coerce.number().optional(),
  tagSlug: z.string().optional(),
  isDraft: z.coerce.boolean().optional(),
});

export type GetPostsQueryDTO = z.infer<typeof GetPostsQuerySchema>;
