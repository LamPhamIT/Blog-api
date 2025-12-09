import { PostDto } from '../dtos/post.dto';
import { PostItem } from '../repositories/post.repository';

export const PostMapper = {
  toDto(post: PostItem): PostDto {
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      thumbnail: post.thumbnail,
      excerpt: post.excerpt,
      contentType: post.contentType,
      content: post.content,
      contentHtml: post.contentHtml,
      viewCount: post.viewCount,
      published: post.published,
      readTime: post.readTime,
      createdAt: post.createdAt,
      order: post.order,
      author: post.author,
      series: post.series,
      tags: post.tags,
      totalUpvotes: post._count?.upvotes ?? 0,
      isUpvoted: Array.isArray(post.upvotes) && post.upvotes.length > 0,
    };
  },
};
