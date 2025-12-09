import z from 'zod';
import { PostDto } from './post.dto';

export const CreateSeriesSchema = z.object({
  title: z
    .string({ message: 'Title is required' })
    .min(5, 'Title must be at least 5 characters long')
    .max(100, 'Title must not exceed 100 characters'),
  description: z.string().optional(),
  thumbnail: z.url().optional(),
  postIds: z.array(z.cuid()).optional(),
});

export type CreateSeriesDTO = z.infer<typeof CreateSeriesSchema>;

export const UpdateSeriesSchema = CreateSeriesSchema.partial();
export type UpdateSeriesDTO = z.infer<typeof UpdateSeriesSchema>;

export const GetSeriesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
});

export type GetSeriesQueryDTO = z.infer<typeof GetSeriesQuerySchema>;

export const AddPostsToSeriesSchema = z.object({
  postIds: z.array(z.cuid()).min(1),
});

export type AddPostsToSeriesDTO = z.infer<typeof AddPostsToSeriesSchema>;

export const RemovePostsFromSeriesSchema = z.object({
  postIds: z.array(z.cuid()).min(1),
});

export type RemovePostsFromSeriesDTO = z.infer<
  typeof RemovePostsFromSeriesSchema
>;

export interface SeriesDto {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  author: {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    posts: number;
  };
  posts?: PostDto[];
}
