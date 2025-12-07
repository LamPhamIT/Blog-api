/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { marked } from 'marked';
import { PostContentType, Prisma } from '@prisma/client';
import sanitizeHtml from 'sanitize-html';

interface QuillDelta {
  ops: { insert: string | object; attributes?: object }[];
}

export const PostContentUtil = {
  generateHtml(type: PostContentType, content: Prisma.JsonValue): string {
    try {
      switch (type) {
        case PostContentType.QUILL_DELTA: {
          const delta = content as unknown as QuillDelta;
          if (!delta?.ops || !Array.isArray(delta.ops)) return '';

          const converter = new QuillDeltaToHtmlConverter(delta.ops, {
            inlineStyles: true,
          });
          return converter.convert();
        }

        case PostContentType.MARKDOWN: {
          const mdText =
            typeof content === 'string'
              ? content
              : (content as Record<string, string>).text || '';

          const htmlFromMd = marked.parse(mdText) as string;
          return sanitizeHtml(htmlFromMd);
        }

        case PostContentType.HTML_RAW: {
          const rawHtml =
            typeof content === 'string'
              ? content
              : (content as Record<string, string>).html || '';

          return sanitizeHtml(rawHtml, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([
              'img',
              'h1',
              'h2',
            ]),
            allowedAttributes: {
              ...(sanitizeHtml.defaults.allowedAttributes as Record<
                string,
                string[]
              >),
              img: ['src', 'alt'],
            },
          });
        }

        default:
          return '';
      }
    } catch (_error) {
      return '';
    }
  },

  extractPlainText(type: PostContentType, content: Prisma.JsonValue): string {
    try {
      if (type === PostContentType.QUILL_DELTA) {
        const delta = content as unknown as QuillDelta;
        if (!delta.ops || !Array.isArray(delta.ops)) return '';

        return delta.ops
          .map((op) => (typeof op.insert === 'string' ? op.insert : ' '))
          .join('')
          .trim();
      }

      const str =
        typeof content === 'string' ? content : JSON.stringify(content);
      return str.substring(0, 1000);
    } catch {
      return '';
    }
  },
};
