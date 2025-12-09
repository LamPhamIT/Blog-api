import { PostContentType } from '@prisma/client';
import z from 'zod';

export const CreatePostSchema = z.object({
  title: z
    .string({ message: 'Title is required' })
    .min(10, 'Title must be at least 10 characters long')
    .max(200, 'Title must not exceed 200 characters'),

  contentType: z.enum(PostContentType).default(PostContentType.QUILL_DELTA),
  content: z.unknown().refine((val) => val !== null && val !== undefined, {
    message: 'Content is required',
  }),

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

export const GetPostDetailSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
});

export type GetPostDetailDTO = z.infer<typeof GetPostDetailSchema>;

export interface UpvoteResponseDto {
  postId: string;
  isUpvoted: boolean;
  totalUpvotes: number;
}

export interface PostDto {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnail: string | null;
  contentType: PostContentType;
  content: unknown;
  contentHtml: string | null;
  viewCount: number;
  published: boolean;
  readTime: number | null;
  createdAt: Date;
  order: number;
  totalUpvotes: number;
  isUpvoted: boolean;

  author: {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
  };
  series: {
    id: number;
    title: string;
    slug: string;
  } | null;
  tags: {
    id: number;
    name: string;
    slug: string;
  }[];
}
