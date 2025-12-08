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