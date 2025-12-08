import z from 'zod';

export const CreateCommentSchema = z.object({
  content: z.string().min(1, 'Content cannot be empty').max(2000),
  postId: z.cuid(),
  parentId: z.cuid().optional(),
});

export type CreateCommentDTO = z.infer<typeof CreateCommentSchema>;

export interface CommentDto {
  id: string;
  content: string;
  postId: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
  };
}

export const GetCommentsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  postId: z.cuid({ message: 'Post ID is required' }),
});

export type GetCommentsQueryDTO = z.infer<typeof GetCommentsQuerySchema>;

export interface CommentDto {
  id: string;
  content: string;
  postId: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
  };
  children?: CommentDto[];
  _count?: {
    children: number;
  };
}
